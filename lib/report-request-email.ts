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

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeFirstName(value: unknown) {
  if (typeof value !== "string") return "";
  const cleaned = compactWhitespace(value).slice(0, 40);
  if (!cleaned) return "";
  const withoutTags = cleaned.replace(/<[^>]*>/g, "");
  const withoutControls = withoutTags.replace(/[\u0000-\u001f`"]/g, "");
  return withoutControls.replace(/[^\p{L}\p{M}\p{Zs}'-]/gu, "").trim();
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateTime(value: unknown) {
  if (typeof value !== "string" || !value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function formatValue(key: string, value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return Number.isFinite(value) ? formatNumber(value) : "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value !== "string") return JSON.stringify(value);

  if (key.toLowerCase().includes("date") || key.toLowerCase().includes("generated") || key.toLowerCase().includes("timestamp")) {
    return formatDateTime(value);
  }

  return value;
}

function renderEntries(title: string, value?: Record<string, unknown>) {
  if (!value) return "";
  const entries = Object.entries(value).slice(0, 10);
  if (!entries.length) return "";
  return entries.map(([key, entry]) => `- ${key}: ${formatValue(key, entry)}`).join("\n");
}

function renderHtmlEntries(title: string, value?: Record<string, unknown>) {
  if (!value) return "";
  const entries = Object.entries(value).slice(0, 10);
  if (!entries.length) return "";
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-top: 12px;">
      <tr>
        <td style="font-size: 14px; font-weight: 700; color: #1c1813; padding: 0 0 8px 0;">${escapeHtml(title)}</td>
      </tr>
      ${entries
        .map(
          ([key, entry]) => `
            <tr>
              <td style="border-top: 1px solid #e6ded1; padding: 9px 0; font-size: 13px; color: #46362c;">
                <strong style="color: #1c1813;">${escapeHtml(key)}:</strong>
                <span style="margin-left: 6px;">${escapeHtml(String(formatValue(key, entry)))}</span>
              </td>
            </tr>
          `,
        )
        .join("")}
    </table>
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
  const normalizedFirstName = normalizeFirstName(firstName);
  const greeting = normalizedFirstName ? `Hi ${normalizedFirstName},` : "Hi there,";
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
    resultSnapshot?.generatedAt ? `Generated at: ${formatDateTime(resultSnapshot.generatedAt)}` : "",
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
      ? `<p><strong>Generated at:</strong> ${escapeHtml(formatDateTime(resultSnapshot.generatedAt))}</p>`
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
    <div style="background:#f8f4ec;padding:24px 0;font-family:Arial,sans-serif;color:#1c1813">
      <div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #e4d7c6;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(28,24,19,0.08)">
        <div style="background:#1c1813;padding:24px 28px;color:#fff">
          <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f3d36f">BuzzPay</div>
          <div style="font-size:28px;line-height:1.15;font-weight:700;margin-top:8px">Contractor finance report</div>
          <div style="font-size:14px;line-height:1.6;color:#e8dfd2;margin-top:8px">${escapeHtml(intro)}</div>
        </div>
        <div style="padding:28px">
          <p style="margin:0 0 14px 0;font-size:16px;line-height:1.6;color:#1c1813">${escapeHtml(greeting)}</p>
          <div style="border:1px solid #e4d7c6;border-radius:14px;padding:20px;background:#faf7f1">
            <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8a6b28">Calculator</div>
            <div style="font-size:22px;line-height:1.25;font-weight:700;margin-top:6px;color:#1c1813">${escapeHtml(calculatorName)}</div>
            <div style="margin-top:10px">
              <a href="${calculatorUrl}" style="display:inline-block;background:#f4c542;color:#1c1813;text-decoration:none;font-weight:700;padding:11px 16px;border-radius:10px;border:1px solid #1c1813">Open calculator</a>
            </div>
          </div>

          <div style="margin-top:20px;border:1px solid #e4d7c6;border-radius:14px;padding:20px;background:#fff">
            <div style="font-size:18px;font-weight:700;margin:0 0 10px 0;color:#1c1813">Report summary</div>
            <div style="font-size:14px;line-height:1.7;color:#46362c">${escapeHtml(resultSnapshot?.summary || "Educational estimate only.")}</div>
            ${resultSnapshot?.generatedAt ? `<div style="margin-top:12px;font-size:13px;color:#6d5b4a"><strong>Generated:</strong> ${escapeHtml(formatDateTime(resultSnapshot.generatedAt))}</div>` : ""}
            ${resultSnapshot?.assumptionsVersion ? `<div style="margin-top:4px;font-size:13px;color:#6d5b4a"><strong>Version:</strong> ${escapeHtml(resultSnapshot.assumptionsVersion)}</div>` : ""}
          </div>

          ${renderHtmlEntries("Key inputs", snapshotInputs(resultSnapshot))}
          ${renderHtmlEntries("Key results", snapshotResults(resultSnapshot))}

          ${assumptions.length ? `
            <div style="margin-top:20px;border:1px solid #e4d7c6;border-radius:14px;padding:20px;background:#fff">
              <div style="font-size:18px;font-weight:700;margin-bottom:10px;color:#1c1813">Assumptions</div>
              <ul style="margin:0;padding-left:18px;color:#46362c;line-height:1.7">
                ${assumptions.slice(0, 8).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </div>
          ` : ""}

          <div style="margin-top:20px;border:1px solid #e4d7c6;border-radius:14px;padding:18px;background:#fff">
            <div style="font-size:16px;font-weight:700;margin-bottom:6px;color:#1c1813">Disclaimer</div>
            <div style="font-size:13px;line-height:1.7;color:#5d4c40">This is an educational estimate only, not tax, legal, or financial advice.</div>
          </div>

          <div style="margin-top:20px;border:1px solid #e4d7c6;border-radius:14px;padding:20px;background:#fff">
            <div style="font-size:16px;font-weight:700;margin-bottom:10px;color:#1c1813">Related tools</div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              ${RELATED_TOOLS.map(([href, label]) => `
                <tr>
                  <td style="padding:6px 0;border-top:1px solid #eee1d3"><a href="https://www.buzzpay.app${href}" style="color:#8a6b28;text-decoration:none;font-weight:700">${escapeHtml(label)}</a></td>
                </tr>
              `).join("")}
            </table>
          </div>

          <div style="margin-top:22px;font-size:13px;line-height:1.7;color:#6d5b4a">
            Thanks for using BuzzPay.
          </div>
        </div>
      </div>
    </div>
  `;

  return { text, html };
}
