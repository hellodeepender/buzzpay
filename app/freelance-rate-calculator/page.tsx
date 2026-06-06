import type { Metadata } from "next";
import RateCalculator from "@/components/RateCalculator";
import { WebAppJsonLd, FaqJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator — what should you charge per hour?",
  description: "Free calculator that works backwards from your desired take-home income, taxes, and expenses to the hourly rate you actually need to charge.",
  alternates: { canonical: "/freelance-rate-calculator" },
};

const faq = [
  { q: "How do I calculate my freelance hourly rate?", a: "Add the take-home income you want plus your business expenses, divide by one minus your tax rate to get the revenue you must bill, then divide by your realistic billable hours per year." },
  { q: "Why is my rate higher than a salaried hourly wage?", a: "As a freelancer you cover your own taxes, expenses, unpaid admin time, time off, and benefits. Your billable hours are also far fewer than the hours you work, so each billable hour has to carry more." },
  { q: "How many hours can I realistically bill?", a: "Most full-time freelancers bill 20–30 hours a week once admin, sales, and downtime are removed — not 40. Be conservative here or you'll underprice." },
];

export default function Page() {
  return (
    <div className="py-2">
      <WebAppJsonLd name="Freelance Rate Calculator" url="https://buzzpay.app/freelance-rate-calculator"
        description="Calculate the hourly rate you need from your take-home income goal." />
      <FaqJsonLd items={faq} />
      <section className="max-w-[680px] mb-[22px]">
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2">
          What should you <em className="italic text-honeyDeep">charge per hour?</em>
        </h1>
        <p className="text-ink2 text-base">Work backwards from the income you actually want to take home — after taxes, expenses, and the hours you can&apos;t bill.</p>
      </section>
      <RateCalculator />
      <section className="mt-12 max-w-[720px] text-[15px] text-ink2 leading-relaxed">
        <h2 className="font-display text-2xl font-semibold mb-3 text-ink">Pricing from the income you want, not the market average</h2>
        <p className="mb-3">Most freelancers pick a rate by copying peers, then wonder why they&apos;re always short. The reliable method is to start from the take-home you need, gross it up for the taxes you&apos;ll owe, add your annual business costs, and divide across the hours you can realistically bill — which is far fewer than the hours you work.</p>
        <p>Once you know that floor, you can price above it with confidence. Charging below it just means working harder to fall behind.</p>
        <h2 className="font-display text-2xl font-semibold mt-9 mb-4 text-ink">Frequently asked</h2>
        <div className="flex flex-col gap-4">{faq.map((f, i) => (<div key={i}><b className="text-ink">{f.q}</b><p className="mt-1">{f.a}</p></div>))}</div>
      </section>
    </div>
  );
}
