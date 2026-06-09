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

type UiState = "idle" | "loading" | "success" | "rateLimited" | "dailyBudgetUnavailable" | "timeout" | "error";

export default function AIResultExplanation({
  calculatorSlug,
  calculatorName,
  snapshot,
}: {
  calculatorSlug: string;
  calculatorName: string;
  snapshot: ContractorReportSnapshot;
}) {
  const [state, setState] = useState<UiState>("idle");
  const [message, setMessage] = useState("");
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);

  async function explainResult() {
    setState("loading");
    setMessage("Generating your explanation...");
    setExplanation(null);
    track("ai_explanation_click", { calculatorSlug, calculatorName });

    try {
      const response = await fetch("/api/ai/explain-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultSnapshot: snapshot }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.ok) {
        const reason = typeof payload?.reason === "string" ? payload.reason : "";
        if (response.status === 429 || reason === "rate_limited" || reason === "per-ip-limit") {
          setState("rateLimited");
          setMessage("You’ve reached the request limit for now. Try again in a few minutes.");
          track("ai_explanation_error", { calculatorSlug, calculatorName, reason: "rate_limited" });
          return;
        }
        if (response.status === 503 && (reason === "daily_budget_exhausted" || reason === "daily-budget-exceeded")) {
          setState("dailyBudgetUnavailable");
          setMessage("AI explanations are temporarily unavailable today. Please try again later.");
          track("ai_explanation_error", { calculatorSlug, calculatorName, reason: "daily_budget_unavailable" });
          return;
        }
        if (response.status === 504 || reason === "timeout") {
          setState("timeout");
          setMessage("The explanation took too long to generate. Please try again.");
          track("ai_explanation_error", { calculatorSlug, calculatorName, reason: "timeout" });
          return;
        }
        throw new Error(payload?.error || "We could not explain the result right now.");
      }

      setExplanation(payload.explanation as ExplanationResponse);
      setState("success");
      setMessage("Your explanation is ready.");
      track("ai_explanation_success", { calculatorSlug, calculatorName });
    } catch (err) {
      setState("error");
      setMessage("We could not generate an explanation right now. Please try again.");
      track("ai_explanation_error", { calculatorSlug, calculatorName });
    }
  }

  return (
    <section className="w-full max-w-none min-w-0 overflow-visible border-2 border-ink rounded-xl2 bg-card p-5 sm:p-6 shadow-hard" aria-busy={state === "loading"}>
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
          disabled={state === "loading"}
          className="rounded-[8px] border-2 border-ink bg-honey px-3 py-2 text-[13px] font-bold text-ink shadow-hardsm disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {state === "loading" ? "Generating your explanation..." : "Explain my result with AI"}
        </button>
      </div>

      <div role="status" aria-live="polite" className="mt-4">
        {(state === "loading" || state === "rateLimited" || state === "dailyBudgetUnavailable" || state === "timeout" || state === "error" || state === "success") && (
          <p
            className={`rounded-[8px] px-3 py-2 text-[13px] font-medium ${
              state === "success"
                ? "border border-moss/30 bg-moss/10 text-moss"
                : state === "rateLimited" || state === "dailyBudgetUnavailable" || state === "timeout"
                  ? "border border-honeyDeep/25 bg-honey/20 text-ink"
                  : "border border-clay/40 bg-clay/10 text-clay"
            }`}
          >
            {message}
          </p>
        )}
      </div>

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
