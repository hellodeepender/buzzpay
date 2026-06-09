"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ContractorReportSnapshot } from "@/lib/contractor-report-snapshots";

type SubmitState = "idle" | "submitting" | "success" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailReportCapture({
  calculatorSlug,
  calculatorName,
  instanceId,
  pagePath,
  resultSnapshot,
}: {
  calculatorSlug: string;
  calculatorName: string;
  instanceId: string;
  pagePath?: string;
  resultSnapshot?: ContractorReportSnapshot;
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const consentText = "By requesting this report, you agree to receive your calculator report by email and occasional BuzzPay contractor finance tools. You can opt out later. We do not sell your information. See our Privacy Policy.";
  const emailHasError = state === "error" && error.toLowerCase().includes("email");
  const consentHasError = state === "error" && error.toLowerCase().includes("consent");
  const consentNoticeId = `report-consent-note-${calculatorSlug}-${instanceId}`;
  const feedbackId = `report-feedback-${calculatorSlug}-${instanceId}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = firstName.trim();

    if (!emailPattern.test(normalizedEmail)) {
      setState("error");
      setError("Enter a valid email address.");
      setStatusMessage("Enter a valid email address.");
      track("report_capture_error", { calculatorSlug, reason: "invalid_email_client" });
      return;
    }

    if (!consentGiven) {
      setState("error");
      setError("Please check the consent box to request your report.");
      setStatusMessage("Please check the consent box to request your report.");
      track("report_capture_error", { calculatorSlug, reason: "consent_required" });
      return;
    }

    setState("submitting");
    setError("");
    setStatusMessage("Sending your request...");
    track("report_capture_submit", { calculatorSlug, calculatorName });
    if (process.env.NODE_ENV === "development") {
      console.info("[report-capture] submit", {
        calculatorSlug,
        calculatorName,
        hasSnapshot: Boolean(resultSnapshot),
        inputKeys: resultSnapshot?.keyInputs ? Object.keys(resultSnapshot.keyInputs) : [],
        resultKeys: resultSnapshot?.keyResults ? Object.keys(resultSnapshot.keyResults) : [],
      });
    }

    try {
      const response = await fetch("/api/report-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          firstName: trimmedName || undefined,
          calculatorSlug,
          calculatorName,
          pagePath,
          resultSnapshot,
          honeypot,
          consentGiven,
          consentText,
          consentedAt: new Date().toISOString(),
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Something went wrong.");
      }

      const deliveryStatus = payload?.emailDeliveryStatus as string | undefined;
      if (deliveryStatus === "sent") {
        track("report_email_send_attempt", { calculatorSlug, calculatorName });
        track("report_email_send_success", { calculatorSlug, calculatorName });
      } else if (deliveryStatus === "failed") {
        track("report_email_send_attempt", { calculatorSlug, calculatorName });
        track("report_email_send_error", { calculatorSlug, calculatorName });
      }

      setState("success");
      setEmail("");
      setFirstName("");
      setConsentGiven(false);
      setStatusMessage("Your request is saved. We’ll email your report when delivery is available.");
      track("report_capture_success", { calculatorSlug, calculatorName });
    } catch (err) {
      setState("error");
      const reason = err instanceof Error ? err.message : "";
      const friendly =
        reason === "Enter a valid email address."
          ? reason
          : reason === "Please check the consent box to request your report."
            ? reason
            : "We could not save your request. Please try again.";
      setError(friendly);
      setStatusMessage(friendly);
      track("report_capture_error", { calculatorSlug, reason: "request_failed" });
    }
  }

  if (state === "success") {
    return (
      <div className="border-2 border-dashed border-ink rounded-[8px] bg-paper2 p-4" role="status" aria-live="polite">
        <h2 className="font-display text-lg font-semibold text-ink">Free Report</h2>
        <p className="mt-2 text-[13.5px] text-moss font-semibold">Your request is saved.</p>
        <p className="mt-1 text-[12.5px] text-ink2">We will email the report when delivery is available.</p>
        <button
          type="button"
          onClick={() => {
            setState("idle");
            setStatusMessage("");
            setError("");
          }}
          className="mt-3 text-[12.5px] font-semibold text-honeyDeep underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[4px]"
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
      <p className="mt-2 text-[12.5px] leading-6 text-ink2">
        {consentText}{" "}
        <Link href="/privacy" className="font-semibold text-honeyDeep underline underline-offset-2">
          Privacy Policy
        </Link>
        {" "}and{" "}
        <Link href="/affiliate-disclosure" className="font-semibold text-honeyDeep underline underline-offset-2">
          Affiliate Disclosure
        </Link>
        .
      </p>
      <form onSubmit={onSubmit} className="mt-3 space-y-2.5" noValidate>
        <input type="hidden" name="calculatorSlug" value={calculatorSlug} />
        <input type="hidden" name="calculatorName" value={calculatorName} />
        <input type="hidden" name="consentText" value={consentText} />
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden opacity-0"
        />
        <div>
          <label className="field-label" htmlFor={`report-email-${calculatorSlug}-${instanceId}`}>
            Email address <span className="text-clay font-normal">(required)</span>
          </label>
          <input
            id={`report-email-${calculatorSlug}-${instanceId}`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={`field-input text-[13.5px] py-2.5 ${emailHasError ? "border-clay" : ""}`}
            aria-invalid={emailHasError}
            aria-required="true"
            aria-describedby={`${feedbackId} ${consentNoticeId}`}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor={`report-name-${calculatorSlug}-${instanceId}`}>First name <span className="text-muted font-normal">(optional)</span></label>
          <input
            id={`report-name-${calculatorSlug}-${instanceId}`}
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            autoComplete="given-name"
            maxLength={80}
            aria-describedby={feedbackId}
            className="field-input text-[13.5px] py-2.5"
          />
        </div>
        <div className="rounded-[8px] border border-ink/15 bg-paper px-3 py-3 text-[12.5px] leading-6 text-ink2">
          <label className="flex gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(event) => setConsentGiven(event.target.checked)}
              required
              className={`mt-1 h-4 w-4 shrink-0 rounded text-honeyDeep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${consentHasError ? "border-clay" : "border-ink"}`}
              aria-describedby={consentNoticeId}
              aria-invalid={consentHasError}
              aria-required="true"
            />
            <span className="font-semibold text-ink">
              I agree to receive this report and occasional contractor finance emails from BuzzPay. <span className="text-clay font-normal">(required)</span>
            </span>
          </label>
          <p id={consentNoticeId} className="mt-2 text-[11.5px] text-muted">
            You can opt out later. See our{" "}
            <Link href="/privacy" className="font-semibold text-honeyDeep underline underline-offset-2">
              Privacy Policy
            </Link>
            {" "}and{" "}
            <Link href="/affiliate-disclosure" className="font-semibold text-honeyDeep underline underline-offset-2">
              Affiliate Disclosure
            </Link>
            .
          </p>
        </div>
        <p className="text-[11.5px] text-muted">
          We'll send your report and occasional contractor finance tools. No spam. To stop future contractor finance emails, reply with unsubscribe.
        </p>
        <p id={feedbackId} role="status" aria-live="polite" className={`text-[12px] font-semibold ${state === "error" ? "text-clay" : "text-muted"}`}>
          {statusMessage || error}
        </p>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full rounded-[8px] border-2 border-ink bg-honey px-3 py-2 text-[13.5px] font-bold text-ink shadow-hardsm disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {state === "submitting" ? "Sending..." : "Request free report"}
        </button>
      </form>
    </section>
  );
}
