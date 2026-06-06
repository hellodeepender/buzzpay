import Link from "next/link";

const tools = [
  { href: "/payment-fee-calculator", icon: "📊", title: "Payment Fee Calculator", desc: "See what you keep after Stripe, PayPal, or Square fees — or work backwards to what you should charge." },
  { href: "/invoice-generator", icon: "🧾", title: "Invoice Generator", desc: "Build a clean, professional invoice in under a minute and save it as a PDF. No signup." },
  { href: "/freelance-rate-calculator", icon: "⏱️", title: "Freelance Rate Calculator", desc: "Find the hourly rate you need to hit your real take-home goal, after tax and expenses." },
];

export default function Home() {
  return (
    <div className="py-2">
      <section className="max-w-[680px] mb-9">
        <h1 className="font-display font-semibold text-[clamp(30px,5vw,48px)] leading-[1.05] tracking-tight mb-3">
          Free tools to help you <em className="italic text-honeyDeep">get paid.</em>
        </h1>
        <p className="text-ink2 text-lg">Simple, no-signup calculators for freelancers and small businesses. Know your numbers before the money moves.</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
        {tools.map((t) => (
          <Link key={t.href} href={t.href}
            className="block bg-card border-2 border-ink rounded-xl2 shadow-hard p-6 no-underline text-ink hover:-translate-x-px hover:-translate-y-px transition">
            <div className="text-3xl mb-3">{t.icon}</div>
            <h2 className="font-display text-xl font-semibold mb-1.5">{t.title}</h2>
            <p className="text-[14px] text-ink2">{t.desc}</p>
            <div className="mt-4 font-semibold text-[13.5px] text-honeyDeep">Open tool →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
