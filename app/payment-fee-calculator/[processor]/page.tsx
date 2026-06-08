import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FeeCalculator from "@/components/FeeCalculator";
import { BreadcrumbJsonLd, WebAppJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { createMetadata } from "@/lib/seo";

export const dynamicParams = false;

const processors = {
  stripe: {
    name: "Stripe",
    title: "Stripe Fee Calculator — what you keep after Stripe fees",
    description: "Free Stripe fee calculator. See your exact payout after Stripe's 2.9% + $0.30 fee, or reverse it to find what to charge to receive a target amount. No signup.",
    intro: "See exactly what you keep after Stripe's fees — or what to charge to land a target payout.",
    body: [
      "Stripe's standard U.S. online rate is 2.9% + $0.30 per successful card charge, with no monthly fee on the standard plan. The percentage applies to the whole amount and the $0.30 is flat, so small charges carry a much higher effective rate than large ones.",
      "Cards issued outside the U.S. typically add around 1%, and currency conversion can add more, so a cross-border payment costs more than the domestic preset. Edit the percentage above to model your exact case, or use reverse mode to gross up to a target payout.",
    ],
    faq: [
      { q: "How much does Stripe charge per transaction?", a: "Stripe's common U.S. standard online rate is 2.9% + $0.30 per successful charge. International cards and currency conversion usually add more, and negotiated or country-specific rates vary — so the calculator lets you edit them." },
      { q: "What do I charge so I receive an exact amount through Stripe?", a: "Switch to 'I want to receive an amount' mode and enter your target. The calculator grosses it up — charge = (target + 0.30) / (1 − 0.029) — so your payout lands exactly." },
      { q: "Does Stripe refund its fee if I refund a customer?", a: "Generally no — Stripe keeps its per-transaction fee on refunds, so a refunded sale can still cost you the fee. Worth pricing in on thin margins." },
    ],
  },
  paypal: {
    name: "PayPal",
    title: "PayPal Fee Calculator — what you keep after PayPal fees",
    description: "Free PayPal fee calculator. See your real payout after PayPal's 3.49% + $0.49 goods-and-services fee, or reverse it to find what to charge. No signup.",
    intro: "See what you actually keep after PayPal's fees — or what to charge to hit a target.",
    body: [
      "PayPal's standard U.S. rate for goods-and-services payments is 3.49% + $0.49 per transaction — higher than the 2.9% + $0.30 that Stripe and Square typically charge, especially on smaller payments where the larger fixed fee bites hardest.",
      "Rates differ for other payment types and for cross-border transactions, which add a percentage on top. Edit the fields above to match your situation, or use reverse mode to find what to charge so your payout hits an exact figure.",
    ],
    faq: [
      { q: "How much does PayPal charge in fees?", a: "PayPal's common U.S. goods-and-services rate is 3.49% + $0.49 per transaction. Other payment types, micropayments, and international transfers use different rates, so the calculator lets you edit them." },
      { q: "Why does PayPal cost more than Stripe or Square?", a: "PayPal's 3.49% + $0.49 is higher on both parts than the typical 2.9% + $0.30. The gap is widest on small payments, where the larger fixed fee dominates the effective rate." },
      { q: "How do I charge so I receive an exact amount on PayPal?", a: "Use 'I want to receive an amount' mode; the calculator grosses your target up by the percentage and fixed fee so the payout lands on the figure you need." },
    ],
  },
  square: {
    name: "Square",
    title: "Square Fee Calculator — what you keep after Square fees",
    description: "Free Square fee calculator. See your payout after Square's 2.9% + $0.30 online fee, or reverse it to find what to charge. No signup.",
    intro: "See what you keep after Square's fees — or what to charge to receive a target amount.",
    body: [
      "Square's online payment rate is commonly 2.9% + $0.30 per transaction. In-person rates differ — tapped or dipped cards are typically a bit lower, while manually keyed-in cards cost more — because card-present payments carry less fraud risk.",
      "The preset above uses the online rate; edit the percentage and fixed fee to match in-person or keyed-in pricing. Reverse mode finds what to charge so your payout reaches an exact target.",
    ],
    faq: [
      { q: "How much does Square charge per transaction?", a: "Square's common online rate is 2.9% + $0.30. In-person (tapped/dipped) and manually keyed rates differ, so the calculator lets you edit both parts." },
      { q: "Are Square's in-person fees different from online?", a: "Yes. Card-present payments (tapped or dipped) are usually lower than online, and manually keyed cards are higher. Edit the rate above to match the method you use." },
      { q: "How do I charge so I receive an exact amount with Square?", a: "Switch to 'I want to receive an amount' mode and enter the target; the calculator grosses it up by the rate and fixed fee." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(processors).map((processor) => ({ processor }));
}

export function generateMetadata({ params }: { params: { processor: string } }): Metadata {
  const p = processors[params.processor as keyof typeof processors];
  if (!p) return {};
  return createMetadata({
    title: p.title,
    description: p.description,
    path: `/payment-fee-calculator/${params.processor}`,
    image: "/payment-fee-calculator/opengraph-image",
  });
}

export default function Page({ params }: { params: { processor: string } }) {
  const p = processors[params.processor as keyof typeof processors];
  if (!p) notFound();
  const url = `https://www.buzzpay.app/payment-fee-calculator/${params.processor}`;
  return (
    <div className="py-2">
      <WebAppJsonLd name={`${p.name} Fee Calculator`} url={url} description={p.description} />
      <FaqJsonLd items={p.faq} />
      <BreadcrumbJsonLd items={[
        { name: "Home", path: "/" },
        { name: "Payment Fee Calculator", path: "/payment-fee-calculator" },
        { name: `${p.name} Fee Calculator`, path: `/payment-fee-calculator/${params.processor}` },
      ]} />
      <section className="max-w-[680px] mb-[22px]">
        <Link href="/payment-fee-calculator" className="text-[13px] text-muted hover:text-ink">← All payment fees</Link>
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2 mt-2">
          {p.name} <em className="italic text-honeyDeep">fee calculator</em>
        </h1>
        <p className="text-ink2 text-base">{p.intro}</p>
      </section>
      <FeeCalculator initial={p.name} />
      <section className="mt-12 max-w-[720px] text-[15px] text-ink2 leading-relaxed">
        <h2 className="font-display text-2xl font-semibold mb-3 text-ink">{p.name} fees, explained</h2>
        {p.body.map((para, i) => (<p key={i} className="mb-3">{para}</p>))}
        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Frequently asked questions</h2>
        {p.faq.map((f, i) => (
          <div key={i} className="border-b border-paper2 py-3">
            <p className="font-semibold text-ink">{f.q}</p>
            <p className="mt-1">{f.a}</p>
          </div>
        ))}
        <p className="mt-6 text-[13.5px]">Compare:{" "}
          <Link href="/payment-fee-calculator/stripe" className="text-honeyDeep font-semibold">Stripe</Link> ·{" "}
          <Link href="/payment-fee-calculator/paypal" className="text-honeyDeep font-semibold">PayPal</Link> ·{" "}
          <Link href="/payment-fee-calculator/square" className="text-honeyDeep font-semibold">Square</Link>
        </p>
      </section>
    </div>
  );
}
