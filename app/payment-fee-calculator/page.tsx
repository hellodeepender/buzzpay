import Link from "next/link";
import FeeCalculator from "@/components/FeeCalculator";
import { BreadcrumbJsonLd, WebAppJsonLd, FaqJsonLd } from "@/components/JsonLd";
import {
  FinancialDisclaimer,
  LastReviewed,
  Methodology,
  Sources,
} from "@/components/CalculatorTrust";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Payment Fee Calculator — Stripe, PayPal & Square",
  description: "Free calculator to see exactly how much you receive after Stripe, PayPal, or Square fees. Or reverse it: find what to charge to receive a target amount.",
  path: "/payment-fee-calculator",
  image: "/payment-fee-calculator/opengraph-image",
});

const faq = [
  { q: "How much does Stripe charge in fees?", a: "Stripe's common U.S. standard online rate is 2.9% plus $0.30 per transaction. Rates vary by country, card type, and negotiated pricing, so this calculator lets you edit them." },
  { q: "How are PayPal's fees different from Stripe's?", a: "PayPal's common U.S. goods-and-services rate is 3.49% plus $0.49 — higher than the 2.9% + $0.30 that Stripe and Square typically charge. Switch the preset to compare, and the effective-rate line shows which costs you more at your usual transaction size." },
  { q: "How do I calculate what to charge to receive a specific amount?", a: "Use the 'I want to receive an amount' mode. The calculator grosses up your target using charge = (target + fixed fee) / (1 − percentage rate) so your payout lands on the exact figure you need." },
  { q: "Why do small payments feel so expensive?", a: "Because of the fixed fee. A $0.30 fee on a $5 charge is 6% before the percentage even applies, so very small transactions carry a high effective rate. Receiving fewer, larger payments reduces how often you pay it." },
  { q: "Do international cards cost more?", a: "Usually yes. Processors typically add roughly 1% for internationally issued cards, plus possible currency-conversion fees, so a cross-border payment costs more than the domestic preset. Edit the percentage to model your case." },
  { q: "Do I get the fee back if I refund a customer?", a: "Usually not — processors generally keep their per-transaction fee on refunds, so a refunded sale can still cost you money. Worth factoring into thin-margin pricing." },
  { q: "Is this fee calculator free?", a: "Yes. All buzzpay calculators are free with no signup." },
];

export default function Page() {
  return (
    <div className="py-2">
      <WebAppJsonLd name="Payment Fee Calculator" url="https://www.buzzpay.app/payment-fee-calculator"
        description="Calculate net payout after Stripe, PayPal, and Square fees." />
      <FaqJsonLd items={faq} />
      <BreadcrumbJsonLd items={[
        { name: "Home", path: "/" },
        { name: "Payment Fee Calculator", path: "/payment-fee-calculator" },
      ]} />
      <section className="max-w-[680px] mb-[22px]">
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2">
          How much will you <em className="italic text-honeyDeep">actually keep?</em>
        </h1>
        <p className="text-ink2 text-base">See your real payout after Stripe, PayPal, or Square fees — or work backwards to find what to charge so you receive the exact amount you need.</p>
      </section>
      <FeeCalculator />
      <FinancialDisclaimer>
        Processor pricing varies by payment method, country, card type, and account agreement. Confirm the current rate with your processor before making pricing decisions.
      </FinancialDisclaimer>
      <LastReviewed date="2026-06-08" />
      <Methodology>
        <p>
          Forward mode calculates the fee as the transaction amount multiplied by the percentage rate, plus the fixed fee. Reverse mode solves for the gross charge required to leave the requested net amount after both fee components are deducted.
        </p>
      </Methodology>
      <Sources items={[
        { name: "Stripe pricing", href: "https://stripe.com/us/pricing", note: "Official U.S. card pricing" },
        { name: "PayPal merchant fees", href: "https://www.paypal.com/us/webapps/mpp/merchant-fees", note: "Official U.S. commercial transaction fees" },
        { name: "Square pricing", href: "https://squareup.com/us/en/pricing", note: "Official U.S. payment processing pricing" },
      ]} />
      <div className="mt-4 text-[13.5px] text-ink2">Calculate fees for a specific processor:{" "}
        <Link href="/payment-fee-calculator/stripe" className="text-honeyDeep font-semibold">Stripe</Link> ·{" "}
        <Link href="/payment-fee-calculator/paypal" className="text-honeyDeep font-semibold">PayPal</Link> ·{" "}
        <Link href="/payment-fee-calculator/square" className="text-honeyDeep font-semibold">Square</Link>
      </div>
      <Explainer faq={faq}>
        <h2 className="font-display text-2xl font-semibold mb-3">How payment processing fees work</h2>
        <p className="mb-3">Most processors charge two parts on every transaction: a percentage of the amount plus a small fixed fee. On a $100 charge at 2.9% + $0.30 you pay $3.20 in fees and keep $96.80. The fixed fee hurts most on small transactions — on a $5 charge that same pricing takes nearly 9%.</p>
        <p>If you need to receive an exact amount (say a $100 deposit), don&apos;t just add the percentage back — that undershoots. Grossing up correctly means dividing by one minus the rate, which this calculator does for you in reverse mode.</p>
        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Stripe vs PayPal vs Square: which keeps more?</h2>
        <p className="mb-3">Stripe and Square both commonly charge 2.9% + $0.30 on online card payments, while PayPal&apos;s goods-and-services rate is usually higher at 3.49% + $0.49. Which one actually costs you more depends on your transaction size: the fixed fee dominates small charges, while the percentage dominates large ones. Switch the presets above and watch the effective rate to see the real difference for the amounts you take.</p>
        <p>Two costs people forget: refunds and international cards. Refunding a sale usually doesn&apos;t return the processor&apos;s fee, and cards issued abroad often add around 1% plus currency conversion. If your margins are thin, build both into your prices rather than discovering them later. For more, see our guide to <Link href="/guides/getting-paid-by-international-clients" className="text-honeyDeep font-semibold">getting paid by international clients</Link>.</p>
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
