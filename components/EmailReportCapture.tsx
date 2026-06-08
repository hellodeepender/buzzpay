"use client";

import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";

type SubmitState = "idle" | "submitting" | "success" | "error";
type ReportSnapshot = Record<string, string | number | boolean | null>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailReportCapture({
  calculatorSlug,
  calculatorName,
  instanceId,
  resultSnapshot,
}: {
  calculatorSlug: string;
  calculatorName: string;
  instanceId: string;
  resultSnapshot?: ReportSnapshot;
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = firstName.trim();

    if (!emailPattern.test(normalizedEmail)) {
      setState("error");
      setError("Enter a valid email address.");
      track("report_capture_error", { calculatorSlug, reason: "invalid_email_client" });
      return;
    }

    setState("submitting");
    setError("");
    track("report_capture_submit", { calculatorSlug, calculatorName });

    try {
      const response = await fetch("/api/report-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          firstName: trimmedName || undefined,
          calculatorSlug,
          calculatorName,
          resultSnapshot,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Something went wrong.");
      }

      setState("success");
      setEmail("");
      setFirstName("");
      track("report_capture_success", { calculatorSlug, calculatorName });
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "We could not save your request. Try again.");
      track("report_capture_error", { calculatorSlug, reason: "request_failed" });
    }
  }

  if (state === "success") {
    return (
      <div className="border-2 border-dashed border-ink rounded-[8px] bg-paper2 p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Free Report</h2>
        <p className="mt-2 text-[13.5px] text-moss font-semibold">You are on the list.</p>
        <p className="mt-1 text-[12.5px] text-ink2">We will send the report when this feature opens up.</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-3 text-[12.5px] font-semibold text-honeyDeep underline"
        >
          Use another email
        </button>
      </div>
    );
  }

  return (
    <section className="border-2 border-dashed border-ink rounded-[8px] bg-paper2 p-4">
      <h2 className="font-display text-lg font-semibold text-ink">Free Report</h2>
      <p className="text-[13.5px] text-ink2 mt-1">Email me my contractor pay breakdown</p>
      <form onSubmit={onSubmit} className="mt-3 space-y-2.5" noValidate>
        <input type="hidden" name="calculatorSlug" value={calculatorSlug} />
        <input type="hidden" name="calculatorName" value={calculatorName} />
        <div>
          <label className="sr-only" htmlFor={`report-email-${calculatorSlug}-${instanceId}`}>Email address</label>
          <input
            id={`report-email-${calculatorSlug}-${instanceId}`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={`field-input text-[13.5px] py-2.5 ${state === "error" && error ? "border-clay" : ""}`}
            aria-invalid={state === "error" && Boolean(error)}
            aria-describedby={`report-help-${calculatorSlug}-${instanceId}`}
            required
          />
        </div>
        <div>
          <label className="sr-only" htmlFor={`report-name-${calculatorSlug}-${instanceId}`}>First name</label>
          <input
            id={`report-name-${calculatorSlug}-${instanceId}`}
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name (optional)"
            autoComplete="given-name"
            maxLength={80}
            className="field-input text-[13.5px] py-2.5"
          />
        </div>
        <p id={`report-help-${calculatorSlug}-${instanceId}`} className="text-[11.5px] text-muted">
          We'll send your report and occasional contractor finance tools. No spam.
        </p>
        {state === "error" && error && <p className="text-[12px] font-semibold text-clay">{error}</p>}
        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full rounded-[8px] border-2 border-ink bg-honey px-3 py-2 text-[13.5px] font-bold text-ink shadow-hardsm disabled:cursor-wait disabled:opacity-70"
        >
          {state === "submitting" ? "Sending..." : "Request free report"}
        </button>
      </form>
    </section>
  );
}
