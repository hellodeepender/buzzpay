import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getResendServerClient, isResendConfigured } from "@/lib/resend/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const calculators = {
  "w2-vs-c2c": "W2 vs C2C Calculator",
  "contractor-rate-calculator": "Contractor Rate Calculator",
  "s-corp-savings-calculator": "S-Corp Savings Calculator",
  "llc-vs-s-corp": "LLC vs S-Corp",
  "1099-tax-calculator": "1099 Tax Calculator",
} as const;

type ReportRequestPayload = {
  email?: unknown;
  firstName?: unknown;
  calculatorSlug?: unknown;
  calculatorName?: unknown;
  pagePath?: unknown;
  resultSnapshot?: unknown;
  honeypot?: unknown;
};

type DeliveryStatus = "sent" | "skipped" | "failed";

type RateBucket = { count: number; resetAt: number };
const rateLimitStore = new Map<string, RateBucket>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_SUFFIX = "_report_request";

function sanitizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function sanitizeSnapshot(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const source = value as Record<string, unknown>;
  const snapshot: Record<string, string | number | boolean | null> = {};

  for (const [key, entry] of Object.entries(source).slice(0, 20)) {
    if (!/^[a-zA-Z0-9_-]{1,40}$/.test(key)) continue;
    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean" ||
      entry === null
    ) {
      snapshot[key] = typeof entry === "string" ? entry.slice(0, 120) : entry;
    }
  }

  return Object.keys(snapshot).length ? snapshot : undefined;
}

function getClientIp(request: Request) {
  const requestHeaders = request.headers;
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip")?.trim() ||
    requestHeaders.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  rateLimitStore.set(key, bucket);
  return bucket.count > RATE_LIMIT_MAX;
}

async function updateReportRequestStatus({
  id,
  status,
  errorMessage,
}: {
  id: string;
  status: DeliveryStatus;
  errorMessage?: string | null;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const patch: Record<string, unknown> = { email_delivery_status: status };
  if (status === "sent") {
    patch.email_sent_at = new Date().toISOString();
    patch.email_error = null;
  } else if (status === "failed") {
    patch.email_error = errorMessage ?? "Email delivery failed.";
  }

  const { error } = await supabase
    .from("report_requests")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error("[report-request] Supabase status update failed", {
      code: error.code,
      status,
    });
  }
}

function renderReportEmail({
  firstName,
  calculatorName,
  calculatorSlug,
  pagePath,
}: {
  firstName?: string;
  calculatorName: string;
  calculatorSlug: string;
  pagePath: string;
}) {
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  const calculatorUrl = `https://www.buzzpay.app${pagePath}`;
  const related = [
    ["/w2-vs-c2c", "W2 vs C2C"],
    ["/contractor-rate-calculator", "Contractor Rate Calculator"],
    ["/s-corp-savings-calculator", "S-Corp Savings Calculator"],
    ["/llc-vs-s-corp", "LLC vs S-Corp"],
    ["/1099-tax-calculator", "1099 Tax Calculator"],
  ];

  const text = [
    `${greeting}`,
    "",
    `Your BuzzPay contractor finance report request for ${calculatorName} is on file.`,
    `Calculator: ${calculatorName}`,
    `Link: ${calculatorUrl}`,
    "",
    "This is an educational estimate for planning and comparison only.",
    "It is not tax, legal, or financial advice.",
    "",
    "Related tools:",
    ...related.map(([href, label]) => `- ${label}: https://www.buzzpay.app${href}`),
    "",
    "Thanks for using BuzzPay.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1c1813">
      <p>${greeting}</p>
      <p>Your BuzzPay contractor finance report request for <strong>${calculatorName}</strong> is on file.</p>
      <p><strong>Calculator:</strong> ${calculatorName}<br />
      <strong>Link:</strong> <a href="${calculatorUrl}">${calculatorUrl}</a></p>
      <p>This is an educational estimate for planning and comparison only.<br />
      It is not tax, legal, or financial advice.</p>
      <p><strong>Related tools</strong></p>
      <ul>
        ${related.map(([href, label]) => `<li><a href="https://www.buzzpay.app${href}">${label}</a></li>`).join("")}
      </ul>
      <p>Thanks for using BuzzPay.</p>
    </div>
  `;

  return { text, html };
}

export async function POST(request: Request) {
  let payload: ReportRequestPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const email = sanitizeString(payload.email, 254).toLowerCase();
  const firstName = sanitizeString(payload.firstName, 80);
  const calculatorSlug = sanitizeString(payload.calculatorSlug, 80);
  const calculatorName = sanitizeString(payload.calculatorName, 120);
  const pagePath = sanitizeString(payload.pagePath, 160);
  const resultSnapshot = sanitizeSnapshot(payload.resultSnapshot);
  const honeypot = sanitizeString(payload.honeypot, 120);
  const clientIp = getClientIp(request);

  if (!emailPattern.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  if (!(calculatorSlug in calculators)) {
    return NextResponse.json({ ok: false, error: "Unknown calculator page." }, { status: 400 });
  }

  const expectedCalculatorName = calculators[calculatorSlug as keyof typeof calculators];
  if (!calculatorName || calculatorName !== expectedCalculatorName) {
    return NextResponse.json({ ok: false, error: "Calculator details are invalid." }, { status: 400 });
  }

  const expectedPagePath = `/${calculatorSlug}`;
  if (pagePath && pagePath !== expectedPagePath) {
    return NextResponse.json({ ok: false, error: "Page details are invalid." }, { status: 400 });
  }

  const rateLimitKey = `${email}${RATE_LIMIT_SUFFIX}`;
  const shouldRateLimit = isRateLimited(rateLimitKey) || isRateLimited(`${clientIp}${RATE_LIMIT_SUFFIX}`);
  const honeypotFilled = Boolean(honeypot);

  const reportRequest = {
    email,
    firstName: firstName || undefined,
    calculatorSlug,
    calculatorName: expectedCalculatorName,
    pagePath: pagePath || expectedPagePath,
    resultSnapshot,
    requestedAt: new Date().toISOString(),
  };

  if (honeypotFilled) {
    if (process.env.NODE_ENV === "development") {
      console.info("[report-request] honeypot triggered", {
        email,
        calculatorSlug,
        clientIp,
      });
    }
    return NextResponse.json({ ok: true, emailDeliveryStatus: "skipped" as DeliveryStatus });
  }

  if (shouldRateLimit) {
    if (process.env.NODE_ENV === "development") {
      console.info("[report-request] rate limited", {
        email,
        calculatorSlug,
        clientIp,
      });
    }
    return NextResponse.json({ ok: true, emailDeliveryStatus: "skipped" as DeliveryStatus });
  }

  let insertedId: string | undefined;
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase!
        .from("report_requests")
        .insert({
          email: reportRequest.email,
          first_name: reportRequest.firstName ?? null,
          calculator_slug: reportRequest.calculatorSlug,
          calculator_name: reportRequest.calculatorName,
          page_path: reportRequest.pagePath,
          result_snapshot: reportRequest.resultSnapshot ?? null,
          email_delivery_status: isResendConfigured() ? "pending" : "skipped",
        })
        .select("id")
        .single();

      if (error) {
        console.error("[report-request] Supabase insert failed", {
          code: error.code,
        });
      } else {
        insertedId = data?.id as string | undefined;
      }
    } catch (error) {
      console.error("[report-request] Supabase request failed", {
        errorType: error instanceof Error ? error.name : "unknown",
      });
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info("[report-request] Supabase not configured", {
      ...reportRequest,
      resultSnapshot: undefined,
      resultSnapshotFields: resultSnapshot ? Object.keys(resultSnapshot) : [],
    });
  }

  let emailDeliveryStatus: DeliveryStatus = "skipped";
  if (isResendConfigured()) {
    emailDeliveryStatus = "failed";
    try {
      const resend = getResendServerClient();
      const from = process.env.REPORT_FROM_EMAIL!;
      const replyTo = process.env.REPORT_REPLY_TO_EMAIL?.trim() || undefined;
      const { text, html } = renderReportEmail({
        firstName: reportRequest.firstName,
        calculatorName: reportRequest.calculatorName,
        calculatorSlug: reportRequest.calculatorSlug,
        pagePath: reportRequest.pagePath,
      });
      const sent = await resend!.emails.send({
        from,
        to: [reportRequest.email],
        subject: "Your BuzzPay contractor finance report",
        text,
        html,
        ...(replyTo ? { replyTo } : {}),
      });

      if (sent.error) {
        throw new Error("Resend request failed.");
      }

      emailDeliveryStatus = "sent";
      if (insertedId) {
        await updateReportRequestStatus({ id: insertedId, status: "sent" });
      }
    } catch (error) {
      const safeMessage = "Email delivery failed.";
      console.error("[report-request] Resend send failed", {
        errorType: error instanceof Error ? error.name : "unknown",
      });
      if (insertedId) {
        await updateReportRequestStatus({
          id: insertedId,
          status: "failed",
          errorMessage: safeMessage,
        });
      }
      emailDeliveryStatus = "failed";
    }
  }

  // TODO: Deliver recurring follow-ups after email templates and consent flows are configured.
  // TODO: Sync opted-in leads to the selected newsletter provider.
  // TODO: Add unsubscribe handling before sending recurring marketing email.
  // TODO: Store explicit consent text, timestamp, and policy version.

  return NextResponse.json({ ok: true, emailDeliveryStatus });
}
