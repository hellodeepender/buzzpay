import "server-only";

export type ExplainResultSnapshot = {
  calculatorSlug?: string;
  calculatorName?: string;
  pagePath?: string;
  generatedAt?: string;
  assumptionsVersion?: string;
  summary?: string;
  assumptions?: string[];
  keyInputs?: Record<string, unknown>;
  keyResults?: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  results?: Record<string, unknown>;
};

export type ExplainResultRequest = {
  resultSnapshot?: unknown;
};

export type ExplainResultExplanation = {
  summary: string;
  keyTakeaways: string[];
  risksAndAssumptions: string[];
  nextSteps: string[];
  negotiationTips: string[];
  disclaimer: string;
};

const MAX_REQUEST_BODY_CHARS = 12000;
const MAX_SNAPSHOT_CHARS = 8000;
const MAX_ARRAY_ITEMS = 8;
const MAX_TEXT_LENGTH = 220;

const CALCULATOR_NAMES: Record<string, string> = {
  "w2-vs-c2c": "W2 vs C2C Calculator",
  "contractor-rate-calculator": "Contractor Rate Calculator",
  "s-corp-savings-calculator": "S-Corp Savings Calculator",
  "llc-vs-s-corp": "LLC vs S-Corp",
  "1099-tax-calculator": "1099 Tax Calculator",
};

function trimText(value: unknown, maxLength = MAX_TEXT_LENGTH) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeEntry(value: unknown, depth = 0): unknown {
  if (value === null) return null;
  if (typeof value === "string") return trimText(value, 180);
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    if (depth >= 2) return undefined;
    return value.slice(0, MAX_ARRAY_ITEMS).map((item) => sanitizeEntry(item, depth + 1)).filter((item) => item !== undefined);
  }
  if (typeof value === "object") {
    if (depth >= 2) return undefined;
    const snapshot: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>).slice(0, MAX_ARRAY_ITEMS * 2)) {
      const safeKey = trimText(key, 60);
      if (!safeKey) continue;
      const sanitized = sanitizeEntry(entry, depth + 1);
      if (sanitized !== undefined) snapshot[safeKey] = sanitized;
    }
    return Object.keys(snapshot).length ? snapshot : undefined;
  }
  return undefined;
}

function sanitizeSnapshot(raw: unknown): ExplainResultSnapshot | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const candidate = raw as ExplainResultSnapshot;
  const calculatorSlug = trimText(candidate.calculatorSlug, 80);
  const calculatorName = trimText(candidate.calculatorName, 120);
  if (!calculatorSlug || !CALCULATOR_NAMES[calculatorSlug]) return null;
  if (!calculatorName || calculatorName !== CALCULATOR_NAMES[calculatorSlug]) return null;

  const normalized = {
    calculatorSlug,
    calculatorName,
    pagePath: trimText(candidate.pagePath, 160),
    generatedAt: trimText(candidate.generatedAt, 80),
    assumptionsVersion: trimText(candidate.assumptionsVersion, 40),
    summary: trimText(candidate.summary, 280),
    assumptions: Array.isArray(candidate.assumptions)
      ? candidate.assumptions.map((item) => trimText(item, 180)).filter(Boolean).slice(0, MAX_ARRAY_ITEMS)
      : [],
    keyInputs: sanitizeEntry(candidate.keyInputs ?? candidate.inputs) as Record<string, unknown> | undefined,
    keyResults: sanitizeEntry(candidate.keyResults ?? candidate.results) as Record<string, unknown> | undefined,
  } satisfies ExplainResultSnapshot;

  if (!normalized.keyInputs || !normalized.keyResults) return null;

  try {
    if (JSON.stringify(normalized).length > MAX_SNAPSHOT_CHARS) return null;
  } catch {
    return null;
  }

  return normalized;
}

function snapshotEntries(value?: Record<string, unknown>) {
  if (!value) return [];
  return Object.entries(value).slice(0, 10).map(([key, entry]) => ({ key, value: entry }));
}

function formatPromptValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export function validateExplainResultPayload(rawBody: string) {
  if (!rawBody || rawBody.length > MAX_REQUEST_BODY_CHARS) {
    return { ok: false as const, error: "Request body is too large." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return { ok: false as const, error: "Invalid request body." };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false as const, error: "Invalid request body." };
  }

  const payload = parsed as ExplainResultRequest;
  const snapshot = sanitizeSnapshot(payload.resultSnapshot);
  if (!snapshot) {
    return { ok: false as const, error: "A valid calculator result snapshot is required." };
  }

  return { ok: true as const, snapshot };
}

export function buildExplainResultMessages(snapshot: ExplainResultSnapshot) {
  const inputs = snapshotEntries(snapshot.keyInputs);
  const results = snapshotEntries(snapshot.keyResults);
  const calculatorPage = snapshot.pagePath || `/${snapshot.calculatorSlug}`;
  const relevant = snapshot.calculatorSlug === "w2-vs-c2c" || snapshot.calculatorSlug === "contractor-rate-calculator";

  const userPrompt = [
    `Explain this contractor finance calculator result using only the provided snapshot.`,
    `Calculator: ${snapshot.calculatorName}`,
    `Page: ${calculatorPage}`,
    snapshot.generatedAt ? `Generated at: ${snapshot.generatedAt}` : "",
    snapshot.assumptionsVersion ? `Assumptions version: ${snapshot.assumptionsVersion}` : "",
    snapshot.summary ? `Snapshot summary: ${snapshot.summary}` : "",
    "Key inputs:",
    ...inputs.map(({ key, value }) => `- ${key}: ${formatPromptValue(value)}`),
    "Key results:",
    ...results.map(({ key, value }) => `- ${key}: ${formatPromptValue(value)}`),
    snapshot.assumptions?.length ? "Assumptions:" : "",
    ...(snapshot.assumptions?.map((item) => `- ${item}`) ?? []),
    "",
    "Return JSON only with these fields:",
    "{",
    '  "summary": string,',
    '  "keyTakeaways": string[],',
    '  "risksAndAssumptions": string[],',
    '  "nextSteps": string[],',
    `  "negotiationTips": ${relevant ? "string[]" : "[]" },`,
    '  "disclaimer": string',
    "}",
    "Rules:",
    "- Use only the provided snapshot.",
    "- Do not invent new numbers or claim certainty.",
    "- Do not say you are a CPA, attorney, or financial advisor.",
    "- Keep the explanation concise, practical, and educational.",
    "- Include a disclaimer that this is educational only and not tax, legal, or financial advice.",
    relevant
      ? "- Include negotiation tips that are relevant to rates, offers, or positioning."
      : "- Return an empty negotiationTips array if negotiation tips are not relevant.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    system:
      "You explain contractor finance calculator results. You are not a CPA, attorney, or financial advisor. You must be concise, factual, and educational. You only use the user-provided snapshot.",
    user: userPrompt,
    relevant,
  };
}

export function normalizeExplainResultResponse(raw: unknown): ExplainResultExplanation | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const candidate = raw as Partial<ExplainResultExplanation>;

  const summary = trimText(candidate.summary, 300);
  const keyTakeaways = Array.isArray(candidate.keyTakeaways)
    ? candidate.keyTakeaways.map((item) => trimText(item, 200)).filter(Boolean).slice(0, MAX_ARRAY_ITEMS)
    : [];
  const risksAndAssumptions = Array.isArray(candidate.risksAndAssumptions)
    ? candidate.risksAndAssumptions.map((item) => trimText(item, 200)).filter(Boolean).slice(0, MAX_ARRAY_ITEMS)
    : [];
  const nextSteps = Array.isArray(candidate.nextSteps)
    ? candidate.nextSteps.map((item) => trimText(item, 200)).filter(Boolean).slice(0, MAX_ARRAY_ITEMS)
    : [];
  const negotiationTips = Array.isArray(candidate.negotiationTips)
    ? candidate.negotiationTips.map((item) => trimText(item, 200)).filter(Boolean).slice(0, MAX_ARRAY_ITEMS)
    : [];
  const disclaimer = trimText(candidate.disclaimer, 260);

  if (!summary || !keyTakeaways.length || !risksAndAssumptions.length || !nextSteps.length || !disclaimer) {
    return null;
  }

  return {
    summary,
    keyTakeaways,
    risksAndAssumptions,
    nextSteps,
    negotiationTips,
    disclaimer,
  };
}

export const explainResultLimits = {
  maxRequestBodyChars: MAX_REQUEST_BODY_CHARS,
  maxSnapshotChars: MAX_SNAPSHOT_CHARS,
};
