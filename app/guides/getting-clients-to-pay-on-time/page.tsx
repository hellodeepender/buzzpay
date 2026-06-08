import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How to Get Clients to Pay Invoices on Time (Freelancer's Guide)",
  description: "A freelancer's guide to getting paid on time — set terms that prevent late payment, send invoices that get paid faster, and use a polite follow-up cadence that actually works.",
  alternates: { canonical: "/guides/getting-clients-to-pay-on-time" },
};

const faq = [
  { q: "How do I get a client to pay an overdue invoice?", a: "Send a short, polite reminder that restates the invoice number, amount, and original due date, and gives one clear next step — a payment link or your details. Keep the tone matter-of-fact, not apologetic. If it's well overdue and you set late-fee terms, reference them. Most late payments are oversight, not refusal, so a calm nudge usually works." },
  { q: "What payment terms get invoices paid fastest?", a: "Short, specific ones. \"Due within 14 days\" with an actual calendar date beats \"Net 30,\" and a deposit up front plus the balance on delivery beats billing everything at the end. The clearer and sooner the terms, the faster you tend to get paid." },
  { q: "Should I charge a late fee?", a: "A late fee only works if it's agreed up front — in your contract or on the invoice — not sprung after the fact. A common approach is a small percentage per month overdue. Its real value is as a deterrent and a reason to follow up, more than as income." },
  { q: "How soon should I send an invoice?", a: "As soon as the work or milestone is done. Invoicing speed is the single biggest lever you control: an invoice sent the day you finish gets paid sooner than one sent two weeks later, simply because the due-date clock starts earlier." },
];

export default function Page() {
  return (
    <div className="py-2">
      <FaqJsonLd items={faq} />
      <section className="max-w-[680px] mb-[22px]">
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2">
          How to get clients to <em className="italic text-honeyDeep">pay on time</em>
        </h1>
        <p className="text-ink2 text-base">Late payment feels like a chasing problem, but most of it is preventable — and the fixes happen before you ever send the invoice.</p>
      </section>

      <article className="max-w-[720px] text-[15px] text-ink2 leading-relaxed">
        <h2 className="font-display text-2xl font-semibold mb-3 text-ink">Most late payments are set up before you hit send</h2>
        <p className="mb-3">It feels like a chasing problem, but it usually starts earlier — with vague terms and a slow, unclear invoice. Fix the setup and you&apos;ll spend far less time chasing.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Agree the terms before you start the work</h2>
        <p className="mb-3">Put payment terms in your proposal or contract, not just on the invoice: when payment is due, in what currency, by what method, and what happens if it&apos;s late. For new or large clients, take a deposit up front — a 30–50% deposit both improves your cash flow and filters out clients who were never going to pay. By the time you invoice, nothing about payment should be a surprise.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Send an invoice that&apos;s easy to pay — fast</h2>
        <p className="mb-3">Speed first: send the invoice the moment the work or milestone is done, because the due-date clock only starts once it&apos;s sent. Then make it unambiguous — a unique invoice number, itemized work, your payment details, and a real due date (&quot;Due July 14,&quot; not just &quot;Net 30&quot;). A clean, professional invoice gets taken more seriously than a number typed into an email. You can build one in a minute with the <Link href="/invoice-generator" className="text-honeyDeep font-semibold">invoice generator</Link>, or start from a <Link href="/templates" className="text-honeyDeep font-semibold">template</Link>.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Make paying you effortless</h2>
        <p className="mb-3">The fewer steps between &quot;I should pay this&quot; and &quot;done,&quot; the faster you&apos;re paid. Offer the methods your clients actually use, and put the details or a payment link right on the invoice. If you accept cards or online payments, know what each method nets you — run it through the <Link href="/payment-fee-calculator" className="text-honeyDeep font-semibold">fee calculator</Link> so the convenience doesn&apos;t quietly eat your margin.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Use carrots and clearly-stated sticks</h2>
        <p className="mb-3">Two levers, both only effective if set up in advance: a small early-payment discount (say, 2% off if paid within 7 days) rewards fast payers, and a late fee stated in your terms gives slow payers a reason not to drift — and gives you a clean reason to follow up. Spring neither one after the fact.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Follow up on a schedule, not on your mood</h2>
        <p className="mb-3">Decide a cadence and stick to it: a friendly heads-up a few days before the due date, a polite reminder on the day, and a firmer — still professional — note a few days after. Keep each one short and factual: invoice number, amount, due date, how to pay. This is exactly the busywork that invoicing software automates — tools that send recurring invoices and automatic payment reminders mean you stop tracking it by hand.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Know who owes you what — and when to escalate</h2>
        <p className="mb-3">Keep a simple list of what&apos;s outstanding and how overdue it is. For a one-off slip, a reminder is enough. For chronic late payers, change the terms: require a deposit, bill more often, or pause work until you&apos;re caught up. Protecting your cash flow is part of the job, not a confrontation to avoid.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Frequently asked questions</h2>
        {faq.map((f, i) => (
          <div key={i} className="border-b border-paper2 py-3">
            <p className="font-semibold text-ink">{f.q}</p>
            <p className="mt-1">{f.a}</p>
          </div>
        ))}
      </article>
    </div>
  );
}
