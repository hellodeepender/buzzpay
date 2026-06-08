import { NextResponse } from "next/server";

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

  const reportRequest = {
    email,
    firstName: firstName || undefined,
    calculatorSlug,
    calculatorName: expectedCalculatorName,
    resultSnapshot,
    requestedAt: new Date().toISOString(),
  };

  // TODO: Store report leads in Supabase once lead storage is configured.
  // TODO: Send report emails through Resend once email templates and API keys are configured.
  // TODO: Sync consenting subscribers to ConvertKit or Beehiiv once newsletter routing is chosen.
  if (
    process.env.NODE_ENV === "development" &&
    !process.env.SUPABASE_URL &&
    !process.env.RESEND_API_KEY &&
    !process.env.CONVERTKIT_API_KEY &&
    !process.env.BEEHIIV_API_KEY
  ) {
    console.info("[report-request]", {
      ...reportRequest,
      resultSnapshot: undefined,
      resultSnapshotFields: resultSnapshot ? Object.keys(resultSnapshot) : [],
    });
  }

  return NextResponse.json({ ok: true });
}
