import type { Metadata } from "next";
import FeeCalculator from "@/components/FeeCalculator";
import { WebAppJsonLd, FaqJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Payment Fee Calculator — Stripe, PayPal & Square",
  description: "Free calculator to see exactly how much you receive after Stripe, PayPal, or Square fees. Or reverse it: find what to charge to receive a target amount.",
  alternates: { canonical: "/payment-fee-calculator" },
};

const faq = [
  { q: "How much does Stripe charge in fees?", a: "Stripe's common U.S. standard online rate is 2.9% plus $0.30 per transaction. Rates vary by country, card type, and negotiated pricing, so this calculator lets you edit them." },
  { q: "How do I calculate what to charge to receive a specific amount?", a: "Use the 'I want to receive an amount' mode. The calculator grosses up your target using the formula charge = (target + fixed fee) / (1 − percentage rate) so your payout lands on the exact figure you need." },
  { q: "Is this fee calculator free?", a: "Yes. All buzzpay calculators are free with no signup." },
];

export default function Page() {
  return (
    <div className="py-2">
      <WebAppJsonLd name="Payment Fee Calculator" url="https://www.buzzpay.app/payment-fee-calculator"
        description="Calculate net payout after Stripe, PayPal, and Square fees." />
      <FaqJsonLd items={faq} />
      <section className="max-w-[680px] mb-[22px]">
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2">
          How much will you <em className="italic text-honeyDeep">actually keep?</em>
        </h1>
        <p className="text-ink2 text-base">See your real payout after Stripe, PayPal, or Square fees — or work backwards to find what to charge so you receive the exact amount you need.</p>
      </section>
      <FeeCalculator />
      <Explainer faq={faq}>
        <h2 className="font-display text-2xl font-semibold mb-3">How payment processing fees work</h2>
        <p className="mb-3">Most processors charge two parts on every transaction: a percentage of the amount plus a small fixed fee. On a $100 charge at 2.9% + $0.30 you pay $3.20 in fees and keep $96.80. The fixed fee hurts most on small transactions — on a $5 charge that same pricing takes nearly 9%.</p>
        <p>If you need to receive an exact amount (say a $100 deposit), don&apos;t just add the percentage back — that undershoots. Grossing up correctly means dividing by one minus the rate, which this calculator does for you in reverse mode.</p>
      </Explainer>
    </div>
  );
}

function Explainer({ children, faq }: { children: React.ReactNode; faq: { q: string; a: string }[] }) {
  return (
    <section className="mt-12 max-w-[720px] text-[15px] text-ink2 leading-relaxed">
      {children}
      <h2 className="font-display text-2xl font-semibold mt-9 mb-4 text-ink">Frequently asked</h2>
      <div className="flex flex-col gap-4">
        {faq.map((f, i) => (
          <div key={i}><b className="text-ink">{f.q}</b><p className="mt-1">{f.a}</p></div>
        ))}
      </div>
    </section>
  );
}
