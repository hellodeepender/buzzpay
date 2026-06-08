import Link from "next/link";
import { Percent, FileText, Timer } from "lucide-react";
import { createMetadata, DEFAULT_DESCRIPTION } from "@/lib/seo";

const homeMetadata = createMetadata({
  title: "buzzpay — free tools to get paid",
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export const metadata = {
  ...homeMetadata,
  title: { absolute: "buzzpay — free tools to get paid" },
};

const tools = [
  { href: "/payment-fee-calculator", Icon: Percent, title: "Payment Fee Calculator", desc: "See what you keep after Stripe, PayPal, or Square fees — or work backwards to what you should charge." },
  { href: "/invoice-generator", Icon: FileText, title: "Invoice Generator", desc: "Build a clean, professional invoice in under a minute and save it as a PDF. No signup." },
  { href: "/freelance-rate-calculator", Icon: Timer, title: "Freelance Rate Calculator", desc: "Find the hourly rate you need to hit your real take-home goal, after tax and expenses." },
];

export default function Home() {
  return (
    <div className="py-2">
      <section className="max-w-[700px] mb-9">
        <h1 className="font-display font-black text-[clamp(34px,5.5vw,56px)] leading-[1.02] tracking-tight mb-3">
          Free tools to help you <em className="italic text-honeyDeep">get paid.</em>
        </h1>
        <p className="text-ink2 text-lg">Simple, no-signup calculators for freelancers and small businesses. Know your numbers before the money moves.</p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/payment-fee-calculator" className="btn-honey">Calculate fees →</Link>
          <Link href="/invoice-generator" className="btn-ghost">Make an invoice</Link>
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
        {tools.map(({ href, Icon, title, desc }) => (
          <Link key={href} href={href}
            className="group block bg-card border-2 border-ink rounded-xl2 shadow-hard p-6 no-underline text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition">
            <span className="icon-tile mb-4"><Icon size={26} strokeWidth={2.1} /></span>
            <h2 className="font-display text-xl font-bold mb-1.5">{title}</h2>
            <p className="text-[14px] text-ink2">{desc}</p>
            <div className="mt-4 font-semibold text-[13.5px] text-honeyDeep">Open tool →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
