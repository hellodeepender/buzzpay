import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

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
};

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

  const reportRequest = {
    email,
    firstName: firstName || undefined,
    calculatorSlug,
    calculatorName: expectedCalculatorName,
    pagePath: pagePath || expectedPagePath,
    resultSnapshot,
    requestedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase!.from("report_requests").insert({
        email: reportRequest.email,
        first_name: reportRequest.firstName ?? null,
        calculator_slug: reportRequest.calculatorSlug,
        calculator_name: reportRequest.calculatorName,
        page_path: reportRequest.pagePath,
        result_snapshot: reportRequest.resultSnapshot ?? null,
      });

      if (error) {
        console.error("[report-request] Supabase insert failed", {
          code: error.code,
          calculatorSlug,
        });
        return NextResponse.json(
          { ok: false, error: "We could not save your request. Please try again." },
          { status: 503 },
        );
      }
    } catch (error) {
      console.error("[report-request] Supabase request failed", {
        calculatorSlug,
        errorType: error instanceof Error ? error.name : "unknown",
      });
      return NextResponse.json(
        { ok: false, error: "We could not save your request. Please try again." },
        { status: 503 },
      );
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info("[report-request] Supabase not configured", {
      ...reportRequest,
      resultSnapshot: undefined,
      resultSnapshotFields: resultSnapshot ? Object.keys(resultSnapshot) : [],
    });
  }

  // TODO: Deliver the requested report email after a provider and template are configured.
  // TODO: Sync opted-in leads to the selected newsletter provider.
  // TODO: Add unsubscribe handling before sending recurring marketing email.
  // TODO: Store explicit consent text, timestamp, and policy version.

  return NextResponse.json({ ok: true });
}
