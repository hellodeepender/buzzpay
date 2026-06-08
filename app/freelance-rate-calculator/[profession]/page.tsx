import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import RateCalculator from "@/components/RateCalculator";
import { BreadcrumbJsonLd, WebAppJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { createMetadata } from "@/lib/seo";

export const dynamicParams = false;

type Prof = { name: string; title: string; description: string; intro: string; body: string[]; faq: { q: string; a: string }[] };

const shared = [
  { q: "How many hours can I realistically bill?", a: "Most full-time freelancers bill 20–30 hours a week once admin, sales, and downtime are removed — not 40. Be conservative here or you'll underprice." },
  { q: "What is the average freelance hourly rate?", a: "Commonly cited figures put the U.S. average around $48 an hour, but it varies hugely by field, experience, and location. Treat it as a sanity check, not a target." },
];

const professions: Record<string, Prof> = {
  designer: {
    name: "Designer",
    title: "Freelance Designer Rate Calculator — what to charge",
    description: "Work out the hourly rate a freelance graphic or web designer needs to charge, based on your take-home goal, software costs, taxes, and billable hours.",
    intro: "Set a design rate that covers your software, your unbillable hours, and the income you actually want to take home.",
    body: [
      "Designers carry costs other freelancers forget — Adobe or Figma subscriptions, fonts, stock assets, and a steady stream of revisions. Fold those into your annual expenses below, and be honest about revision rounds: scope creep is where design projects quietly lose money.",
      "Many designers shift from hourly to project or value-based pricing as they gain experience, but you still need an hourly floor to know whether a flat project fee is actually worth your time.",
    ],
    faq: [
      { q: "Should designers charge hourly or per project?", a: "Hourly protects you on open-ended work and revisions; flat project pricing rewards speed and is easier for clients to approve. Either way, calculate your hourly floor first so you can check a project fee divides into enough per hour." },
      ...shared,
    ],
  },
  writer: {
    name: "Writer",
    title: "Freelance Writer Rate Calculator — per hour or per word",
    description: "Calculate the hourly rate a freelance writer needs, then convert it to a per-word or per-project price — based on your take-home goal, taxes, and billable hours.",
    intro: "Find your hourly floor first, then turn it into a per-word or per-project price that actually pays.",
    body: [
      "Writers are often quoted per word or per article, but those only make sense once you know your hourly floor. A '$0.10 per word' rate sounds fine until a 1,000-word piece eats a day of research and edits.",
      "Track how long pieces really take — research, interviews, and revisions included — and back into a per-word or per-project price from the hourly rate below. Don't forget expenses like research tools, a portfolio site, and subscriptions.",
    ],
    faq: [
      { q: "How do I convert an hourly rate to a per-word rate?", a: "Estimate how many finished words you produce per hour for a given type of piece (including research and edits), then divide your hourly floor by that number. Familiar topics justify a lower per-word rate; heavy-research pieces need a higher one." },
      ...shared,
    ],
  },
  developer: {
    name: "Developer",
    title: "Freelance Developer Rate Calculator — what to charge",
    description: "Work out the hourly, day, or retainer rate a freelance developer needs, accounting for unbillable time, tools, taxes, and gaps between contracts.",
    intro: "Price dev work from your real take-home target — and from how few hours you can truly bill.",
    body: [
      "Developers tend to command higher rates, but also face long unbillable stretches: project setup, learning new stacks, hard-to-bill debugging, and gaps between contracts. Be conservative with billable hours and generous with expenses — hardware, hosting, tools, and licenses add up.",
      "For longer engagements, weekly or monthly retainers smooth out income better than pure hourly. Whichever model you use, divide the total by realistic hours to confirm it clears the floor this calculator gives you.",
    ],
    faq: [
      { q: "Hourly, retainer, or fixed-bid for development work?", a: "Hourly suits unclear scope; retainers stabilize income for ongoing clients; fixed-bid rewards efficiency but punishes underestimation. Whichever you pick, divide the total by realistic hours to confirm it clears your floor." },
      ...shared,
    ],
  },
  consultant: {
    name: "Consultant",
    title: "Freelance Consultant Rate Calculator — set your day rate",
    description: "Calculate the hourly and day rate a freelance consultant needs, factoring in heavy unbillable sales time, expenses, taxes, and the value you deliver.",
    intro: "Find the minimum a day of your time is worth — then price the value on top.",
    body: [
      "Consultants are usually paid for outcomes and expertise rather than hours, so day rates and value-based pricing are common. Even so, an hourly floor tells you the least a day of your time can be worth.",
      "Consultants also carry heavy unbillable time in sales, proposals, and relationship-building, so bill fewer hours than you'd expect. Price the value you deliver, not just the clock — but never below the floor.",
    ],
    faq: [
      { q: "How do I set a consulting day rate?", a: "Take the hourly floor from this calculator and multiply by the hours you'd actually bill in a day (often 6–8, not a full work day), then add a premium for the expertise and outcomes you bring. Day rates also make pricing simpler for clients than itemized hours." },
      ...shared,
    ],
  },
  "virtual-assistant": {
    name: "Virtual Assistant",
    title: "Virtual Assistant Rate Calculator — what to charge",
    description: "Work out the hourly rate or monthly package a virtual assistant needs, based on your take-home goal, tools, onboarding time, taxes, and billable hours.",
    intro: "Get the rate right when margins are tight — VAs bill more hours but at lower headline rates.",
    body: [
      "VAs often have higher billable utilization than other freelancers — more of the day is directly client-facing — but lower headline rates, so accuracy matters more, not less. Account for the tools and subscriptions you provide, time spent onboarding new clients, and admin you can't bill.",
      "Packaging hours into monthly retainers stabilizes income and reduces the unbillable gaps between one-off tasks. Price any package by dividing it across the hours it includes and checking it clears your hourly floor.",
    ],
    faq: [
      { q: "Should a virtual assistant charge hourly or in monthly packages?", a: "Monthly retainer packages give you predictable income and clients predictable cost; hourly suits ad-hoc tasks. Price any package by dividing it across the hours it includes and confirming it clears your hourly floor." },
      ...shared,
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(professions).map((profession) => ({ profession }));
}

export function generateMetadata({ params }: { params: { profession: string } }): Metadata {
  const p = professions[params.profession];
  if (!p) return {};
  return createMetadata({
    title: p.title,
    description: p.description,
    path: `/freelance-rate-calculator/${params.profession}`,
    image: "/freelance-rate-calculator/opengraph-image",
  });
}

export default function Page({ params }: { params: { profession: string } }) {
  const p = professions[params.profession];
  if (!p) notFound();
  const url = `https://www.buzzpay.app/freelance-rate-calculator/${params.profession}`;
  return (
    <div className="py-2">
      <WebAppJsonLd name={`Freelance ${p.name} Rate Calculator`} url={url} description={p.description} />
      <FaqJsonLd items={p.faq} />
      <BreadcrumbJsonLd items={[
        { name: "Home", path: "/" },
        { name: "Freelance Rate Calculator", path: "/freelance-rate-calculator" },
        { name: `${p.name} Rate Calculator`, path: `/freelance-rate-calculator/${params.profession}` },
      ]} />
      <section className="max-w-[680px] mb-[22px]">
        <Link href="/freelance-rate-calculator" className="text-[13px] text-muted hover:text-ink">← Freelance rate calculator</Link>
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2 mt-2">
          Freelance <em className="italic text-honeyDeep">{p.name.toLowerCase()}</em> rate calculator
        </h1>
        <p className="text-ink2 text-base">{p.intro}</p>
      </section>
      <RateCalculator />
      <section className="mt-12 max-w-[720px] text-[15px] text-ink2 leading-relaxed">
        <h2 className="font-display text-2xl font-semibold mb-3 text-ink">What {p.name.toLowerCase()}s should factor in</h2>
        {p.body.map((para, i) => (<p key={i} className="mb-3">{para}</p>))}
        <h2 className="font-display text-2xl font-semibold mt-9 mb-4 text-ink">Frequently asked</h2>
        <div className="flex flex-col gap-4">{p.faq.map((f, i) => (<div key={i}><b className="text-ink">{f.q}</b><p className="mt-1">{f.a}</p></div>))}</div>
      </section>
    </div>
  );
}
