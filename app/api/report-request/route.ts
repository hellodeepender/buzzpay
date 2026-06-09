import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getResendServerClient, isResendConfigured } from "@/lib/resend/server";
import {
  normalizeFirstName,
  type ReportSnapshot,
} from "@/lib/report-request-email";
import { deliverReportEmail } from "@/lib/report-email-delivery";
import { checkRateLimit } from "@/lib/rate-limit";
import { getTrustedClientIp } from "@/lib/request-ip";

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
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;

function sanitizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function sanitizeSnapshotValue(value: unknown, depth = 0): unknown {
  if (value === null) return null;
  if (typeof value === "string") return value.trim().slice(0, 160);
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    if (depth >= 2) return undefined;
    return value.slice(0, 10).map((item) => sanitizeSnapshotValue(item, depth + 1)).filter((item) => item !== undefined);
  }
  if (typeof value === "object") {
    if (depth >= 2) return undefined;
    const entries = Object.entries(value as Record<string, unknown>).slice(0, 20);
    const snapshot: Record<string, unknown> = {};
    for (const [key, entry] of entries) {
      const safeKey = key.trim().slice(0, 80);
      if (!safeKey) continue;
      const sanitized = sanitizeSnapshotValue(entry, depth + 1);
      if (sanitized !== undefined) {
        snapshot[safeKey] = sanitized;
      }
    }
    return Object.keys(snapshot).length ? snapshot : undefined;
  }
  return undefined;
}

function sanitizeSnapshot(value: unknown) {
  const sanitized = sanitizeSnapshotValue(value);
  if (!sanitized || typeof sanitized !== "object" || Array.isArray(sanitized)) return undefined;
  try {
    const serialized = JSON.stringify(sanitized);
    if (!serialized || serialized.length > 8000) return undefined;
  } catch {
    return undefined;
  }
  return sanitized as ReportSnapshot;
}

async function updateReportRequestStatus({
  id,
  status,
  errorMessage,
  resendEmailId,
}: {
  id: string;
  status: DeliveryStatus;
  errorMessage?: string | null;
  resendEmailId?: string | null;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const patch: Record<string, unknown> = { email_delivery_status: status };
  if (status === "sent") {
    patch.email_sent_at = new Date().toISOString();
    patch.resend_email_id = resendEmailId ?? null;
    patch.email_error = null;
  } else if (status === "skipped") {
    patch.resend_email_id = null;
    patch.email_error = errorMessage ?? "Resend not configured";
  } else if (status === "failed") {
    patch.resend_email_id = null;
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

export async function POST(request: Request) {
  let payload: ReportRequestPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const email = sanitizeString(payload.email, 254).toLowerCase();
  const firstName = normalizeFirstName(payload.firstName);
  const calculatorSlug = sanitizeString(payload.calculatorSlug, 80);
  const calculatorName = sanitizeString(payload.calculatorName, 120);
  const pagePath = sanitizeString(payload.pagePath, 160);
  const resultSnapshot = sanitizeSnapshot(payload.resultSnapshot);
  const honeypot = sanitizeString(payload.honeypot, 120);
  const clientIp = getTrustedClientIp(request);

  if (process.env.NODE_ENV === "development") {
    console.info("[report-request] received", {
      calculatorSlug,
      calculatorName,
      hasSnapshot: Boolean(resultSnapshot),
      snapshotKeys: resultSnapshot ? Object.keys(resultSnapshot) : [],
      snapshotInputKeys: resultSnapshot?.keyInputs ? Object.keys(resultSnapshot.keyInputs) : [],
      snapshotResultKeys: resultSnapshot?.keyResults ? Object.keys(resultSnapshot.keyResults) : [],
    });
  }

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

  const [emailLimit, ipLimit] = await Promise.all([
    checkRateLimit({
      key: `report:email:${email}`,
      max: RATE_LIMIT_MAX,
      windowSeconds: RATE_LIMIT_WINDOW_SECONDS,
    }),
    checkRateLimit({
      key: `report:ip:${clientIp}`,
      max: RATE_LIMIT_MAX,
      windowSeconds: RATE_LIMIT_WINDOW_SECONDS,
    }),
  ]);

  if (emailLimit.limited || ipLimit.limited) {
    if (process.env.NODE_ENV === "development") {
      console.info("[report-request] rate limited", {
        email,
        calculatorSlug,
        clientIp,
        emailLimitUnavailable: Boolean(emailLimit.unavailable),
        ipLimitUnavailable: Boolean(ipLimit.unavailable),
      });
    }
    return NextResponse.json({ ok: true, emailDeliveryStatus: "skipped" as DeliveryStatus });
  }

  if (process.env.NODE_ENV === "development" && (emailLimit.unavailable || ipLimit.unavailable)) {
    console.info("[report-request] durable rate limiter unavailable; continuing", {
      email,
      calculatorSlug,
      clientIp,
    });
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
          email_error: isResendConfigured() ? null : "Resend not configured",
          resend_email_id: null,
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

  if (insertedId) {
    console.info("Report request stored", {
      calculatorSlug: reportRequest.calculatorSlug,
      emailDeliveryStatus: isResendConfigured() ? "pending" : "skipped",
    });
  }

  let emailDeliveryStatus: DeliveryStatus = "skipped";
  if (!isResendConfigured()) {
    console.info("Resend send skipped: missing env", {
      calculatorSlug: reportRequest.calculatorSlug,
      hasInsertedRecord: Boolean(insertedId),
    });
    if (insertedId) {
      await updateReportRequestStatus({
        id: insertedId,
        status: "skipped",
        errorMessage: "Resend not configured",
      });
    }
  } else {
    try {
      console.info("Resend send attempted", {
        calculatorSlug: reportRequest.calculatorSlug,
        hasInsertedRecord: Boolean(insertedId),
      });

      const resend = getResendServerClient();
      const from = process.env.REPORT_FROM_EMAIL!;
      const replyTo = process.env.REPORT_REPLY_TO_EMAIL?.trim() || undefined;
      const delivery = await deliverReportEmail({
        resendClient: resend,
        from,
        replyTo,
        to: reportRequest.email,
        firstName: reportRequest.firstName,
        calculatorName: reportRequest.calculatorName,
        pagePath: reportRequest.pagePath,
        resultSnapshot: reportRequest.resultSnapshot,
      });

      if (delivery.status === "sent") {
        console.info("Resend send succeeded", {
          calculatorSlug: reportRequest.calculatorSlug,
          resendEmailId: delivery.resendEmailId,
        });
        emailDeliveryStatus = "sent";
        if (insertedId) {
          await updateReportRequestStatus({
            id: insertedId,
            status: "sent",
            resendEmailId: delivery.resendEmailId,
          });
        }
      } else if (delivery.status === "skipped") {
        console.info("Resend send skipped: missing env", {
          calculatorSlug: reportRequest.calculatorSlug,
          hasInsertedRecord: Boolean(insertedId),
        });
        emailDeliveryStatus = "skipped";
        if (insertedId) {
          await updateReportRequestStatus({
            id: insertedId,
            status: "skipped",
            errorMessage: delivery.emailError,
          });
        }
      } else {
        console.error("Resend send failed", {
          calculatorSlug: reportRequest.calculatorSlug,
          hasInsertedRecord: Boolean(insertedId),
        });
        emailDeliveryStatus = "failed";
        if (insertedId) {
          await updateReportRequestStatus({
            id: insertedId,
            status: "failed",
            errorMessage: delivery.emailError,
          });
        }
      }
    } catch (error) {
      const safeMessage = "Email delivery failed.";
      console.error("Resend send failed", {
        errorType: error instanceof Error ? error.name : "unknown",
        calculatorSlug: reportRequest.calculatorSlug,
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
