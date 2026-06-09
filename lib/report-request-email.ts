export type ReportSnapshot = {
  calculatorSlug?: string;
  calculatorName?: string;
  pagePath?: string;
  generatedAt?: string;
  assumptionsVersion?: string;
  summary?: string;
  assumptions?: string[];
  keyInputs?: Record<string, unknown>;
  keyResults?: Record<string, unknown>;
  // Backward compatibility for older snapshots already persisted or in flight.
  inputs?: Record<string, unknown>;
  results?: Record<string, unknown>;
};

const RELATED_TOOLS = [
  ["/w2-vs-c2c", "W2 vs C2C"],
  ["/contractor-rate-calculator", "Contractor Rate Calculator"],
  ["/s-corp-savings-calculator", "S-Corp Savings Calculator"],
  ["/llc-vs-s-corp", "LLC vs S-Corp"],
  ["/1099-tax-calculator", "1099 Tax Calculator"],
] as const;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function renderEntries(title: string, value?: Record<string, unknown>) {
  if (!value) return "";
  const entries = Object.entries(value).slice(0, 10);
  if (!entries.length) return "";
  return [
    title,
    ...entries.map(([key, entry]) => `- ${key}: ${formatValue(entry)}`),
  ].join("\n");
}

function renderHtmlEntries(title: string, value?: Record<string, unknown>) {
  if (!value) return "";
  const entries = Object.entries(value).slice(0, 10);
  if (!entries.length) return "";
  return `
    <p><strong>${escapeHtml(title)}</strong></p>
    <ul>
      ${entries.map(([key, entry]) => `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(formatValue(entry))}</li>`).join("")}
    </ul>
  `;
}

function snapshotIntro(snapshot?: ReportSnapshot) {
  return snapshot ? "Here is your BuzzPay contractor finance report." : "Your BuzzPay contractor finance report request is on file.";
}

function snapshotInputs(snapshot?: ReportSnapshot) {
  return snapshot?.keyInputs ?? snapshot?.inputs;
}

function snapshotResults(snapshot?: ReportSnapshot) {
  return snapshot?.keyResults ?? snapshot?.results;
}

export function renderReportEmail({
  firstName,
  calculatorName,
  pagePath,
  resultSnapshot,
}: {
  firstName?: string;
  calculatorName: string;
  pagePath: string;
  resultSnapshot?: ReportSnapshot;
}) {
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  const calculatorUrl = `https://www.buzzpay.app${pagePath}`;
  const intro = snapshotIntro(resultSnapshot);
  const summary = resultSnapshot?.summary ? `Summary: ${resultSnapshot.summary}` : "";
  const assumptions = Array.isArray(resultSnapshot?.assumptions)
    ? resultSnapshot.assumptions.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
  const assumptionsText = assumptions.length ? `Assumptions:\n- ${assumptions.join("\n- ")}` : "";
  const inputsText = renderEntries("Key inputs", snapshotInputs(resultSnapshot));
  const resultsText = renderEntries("Key results", snapshotResults(resultSnapshot));
  const detailsText = [
    resultSnapshot?.assumptionsVersion ? `Snapshot version: ${resultSnapshot.assumptionsVersion}` : "",
    resultSnapshot?.generatedAt ? `Generated at: ${resultSnapshot.generatedAt}` : "",
    summary,
    assumptionsText,
    inputsText,
    resultsText,
  ].filter(Boolean).join("\n\n");
  const detailsHtml = [
    resultSnapshot?.assumptionsVersion
      ? `<p><strong>Snapshot version:</strong> ${escapeHtml(resultSnapshot.assumptionsVersion)}</p>`
      : "",
    resultSnapshot?.generatedAt
      ? `<p><strong>Generated at:</strong> ${escapeHtml(resultSnapshot.generatedAt)}</p>`
      : "",
    resultSnapshot?.summary
      ? `<p><strong>Plain-English interpretation:</strong> ${escapeHtml(resultSnapshot.summary)}</p>`
      : "",
    assumptions.length
      ? `<p><strong>Assumptions</strong></p><ul>${assumptions.slice(0, 8).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "",
    renderHtmlEntries("Key inputs", snapshotInputs(resultSnapshot)),
    renderHtmlEntries("Key results", snapshotResults(resultSnapshot)),
  ].join("");
  const reportSections = resultSnapshot
    ? [
        "Key inputs:",
        inputsText,
        "",
        "Key results:",
        resultsText,
        "",
        "Plain-English interpretation:",
        resultSnapshot.summary || "Educational estimate only.",
        "",
        assumptionsText,
      ].filter(Boolean).join("\n")
    : "This is an educational estimate for planning and comparison only.";

  const text = [
    greeting,
    "",
    intro,
    `Calculator: ${calculatorName}`,
    `Link: ${calculatorUrl}`,
    "",
    reportSections,
    "",
    "It is not tax, legal, or financial advice.",
    "",
    "Related tools:",
    ...RELATED_TOOLS.map(([href, label]) => `- ${label}: https://www.buzzpay.app${href}`),
    "",
    "Thanks for using BuzzPay.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1c1813">
      <p>${escapeHtml(greeting)}</p>
      <p>${escapeHtml(intro)}</p>
      <p><strong>Calculator:</strong> ${escapeHtml(calculatorName)}<br />
      <strong>Link:</strong> <a href="${calculatorUrl}">${calculatorUrl}</a></p>
      ${detailsHtml}
      <p><strong>Disclaimer:</strong> This is an educational estimate only, not tax, legal, or financial advice.</p>
      <p><strong>Related tools</strong></p>
      <ul>
        ${RELATED_TOOLS.map(([href, label]) => `<li><a href="https://www.buzzpay.app${href}">${label}</a></li>`).join("")}
      </ul>
      <p>Thanks for using BuzzPay.</p>
    </div>
  `;

  return { text, html };
}
