"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import type { ContractorReportSnapshot } from "@/lib/contractor-report-snapshots";

type ExplanationResponse = {
  summary: string;
  keyTakeaways: string[];
  risksAndAssumptions: string[];
  nextSteps: string[];
  negotiationTips: string[];
  disclaimer: string;
};

export default function AIResultExplanation({
  calculatorSlug,
  calculatorName,
  snapshot,
}: {
  calculatorSlug: string;
  calculatorName: string;
  snapshot: ContractorReportSnapshot;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);

  async function explainResult() {
    setLoading(true);
    setError("");
    track("ai_explanation_click", { calculatorSlug, calculatorName });

    try {
      const response = await fetch("/api/ai/explain-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultSnapshot: snapshot }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "We could not explain the result right now.");
      }

      setExplanation(payload.explanation as ExplanationResponse);
      track("ai_explanation_success", { calculatorSlug, calculatorName });
    } catch (err) {
      const message = err instanceof Error ? err.message : "We could not explain the result right now.";
      setError(message);
      track("ai_explanation_error", { calculatorSlug, calculatorName });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-none min-w-0 overflow-visible border-2 border-ink rounded-xl2 bg-card p-5 sm:p-6 shadow-hard">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold text-ink">AI explanation</h2>
          <p className="text-[13px] text-ink2 mt-1">
            A short educational explanation based only on the calculator result snapshot.
          </p>
        </div>
        <button
          type="button"
          onClick={explainResult}
          disabled={loading}
          className="rounded-[8px] border-2 border-ink bg-honey px-3 py-2 text-[13px] font-bold text-ink shadow-hardsm disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? "Explaining..." : "Explain my result with AI"}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-[8px] border border-clay/40 bg-clay/10 px-3 py-2 text-[13px] font-medium text-clay">
          {error}
        </p>
      )}

      {explanation && (
        <div className="mt-5 space-y-4">
          <div className="w-full rounded-xl2 border border-ink/15 bg-paper2 p-4 sm:p-5">
            <p className="text-[12px] uppercase font-bold tracking-wide text-muted">Summary</p>
            <p className="mt-1 text-[14px] leading-7 text-ink2 whitespace-pre-wrap break-words">
              {explanation.summary}
            </p>
          </div>

          <DetailList title="Key takeaways" items={explanation.keyTakeaways} />
          <DetailList title="Risks and assumptions" items={explanation.risksAndAssumptions} />
          <DetailList title="Next steps" items={explanation.nextSteps} />
          {explanation.negotiationTips.length > 0 && (
            <DetailList title="Negotiation tips" items={explanation.negotiationTips} />
          )}

          <div className="w-full rounded-xl2 border border-ink/15 bg-paper2 p-4 sm:p-5">
            <p className="text-[12px] uppercase font-bold tracking-wide text-muted">Disclaimer</p>
            <p className="mt-1 text-[13px] leading-6 text-ink2 whitespace-pre-wrap break-words">{explanation.disclaimer}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="w-full rounded-xl2 border border-ink/15 bg-paper2 p-4 sm:p-5">
      <p className="text-[12px] uppercase font-bold tracking-wide text-muted">{title}</p>
      <ul className="mt-2 space-y-2 text-[13px] leading-6 text-ink2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 min-w-0 items-start">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-honeyDeep" />
            <span className="min-w-0 break-words whitespace-pre-wrap">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
