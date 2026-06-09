import Link from "next/link";
import type { ReactNode } from "react";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { FinancialDisclaimer, LastReviewed } from "@/components/CalculatorTrust";
import RateCalculator from "@/components/RateCalculator";
import { contractorRateProfessions, type ContractorRateProfession } from "@/lib/contractor-rate-professions";

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink/15 bg-paper px-3 py-1 text-[12px] font-semibold text-ink2">
      {children}
    </span>
  );
}

export default function ContractorRateProfessionPage({
  profession,
}: {
  profession: ContractorRateProfession;
}) {
  return (
    <div className="py-1">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contractor Finance", path: "/contractor-finance" },
          { name: "Contractor Rate Calculator", path: "/contractor-rate-calculator" },
          { name: profession.label, path: `/contractor-rate-calculator/${profession.slug}` },
        ]}
      />
      <FaqJsonLd items={profession.faq} />

      <section className="max-w-[760px] mb-6">
        <Link href="/contractor-rate-calculator" className="text-[13px] text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[4px]">
          &larr; Contractor rate calculator
        </Link>
        <h1 className="font-display font-semibold text-[clamp(30px,4.5vw,46px)] leading-[1.06] tracking-tight mt-2 mb-3">
          {profession.title}
        </h1>
        <p className="text-ink2 text-lg">{profession.intro}</p>
        <LastReviewed date={profession.reviewDate} />
      </section>

      <FinancialDisclaimer>
        This profession page is educational only. It does not provide tax, legal, accounting, or employment advice. It helps you think through rate-setting assumptions for a specific profession and compare them with the broader contractor finance tools.
      </FinancialDisclaimer>

      <section className="mt-8 max-w-[1120px]">
        <div className="flex items-start gap-4 mb-4">
          <div>
            <p className="text-xs uppercase font-bold text-honeyDeep mb-1">Use the calculator first</p>
            <h2 className="font-display text-2xl font-semibold text-ink">Then tune the assumptions for {profession.label.toLowerCase()}</h2>
            <p className="text-[14.5px] text-ink2 mt-1">
              The page is built to help you think through profession-specific inputs, then move into the shared rate calculator and the W2 versus contractor comparison where appropriate.
            </p>
          </div>
        </div>
        <RateCalculator />
      </section>

      <section className="mt-10 max-w-[760px] text-[15.5px] text-ink2 leading-[1.75]">
        <h2 className="font-display text-[26px] font-semibold mb-3 text-ink">What changes a rate for {profession.label.toLowerCase()}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <Pill>Utilization</Pill>
          <Pill>Seniority</Pill>
          <Pill>Unpaid work</Pill>
          <Pill>Business overhead</Pill>
          <Pill>W2 comparison</Pill>
        </div>
        <div className="space-y-5">
          <section>
            <h3 className="font-display text-xl font-semibold text-ink mb-2">Typical contractor rate factors</h3>
            <ul className="list-disc pl-5 space-y-2">
              {profession.factors.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="font-display text-xl font-semibold text-ink mb-2">Utilization assumptions</h3>
            <ul className="list-disc pl-5 space-y-2">
              {profession.utilization.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="font-display text-xl font-semibold text-ink mb-2">Skill and seniority factors</h3>
            <ul className="list-disc pl-5 space-y-2">
              {profession.skillFactors.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="font-display text-xl font-semibold text-ink mb-2">Expense considerations</h3>
            <ul className="list-disc pl-5 space-y-2">
              {profession.expenses.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="font-display text-xl font-semibold text-ink mb-2">W2 vs contractor-rate conversion notes</h3>
            <ul className="list-disc pl-5 space-y-2">
              {profession.conversionNotes.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="mt-3">
              If you are comparing a W2 package directly, use the <Link href="/w2-vs-c2c" className="text-honeyDeep font-semibold">W2 vs C2C calculator</Link> before you finalize the contractor rate. The two tools answer different questions and work best together.
            </p>
          </section>
        </div>
      </section>

      <section className="mt-10 max-w-[760px]">
        <h2 className="font-display text-[26px] font-semibold mb-4 text-ink">Frequently asked questions</h2>
        <div className="space-y-5 text-[15px] text-ink2 leading-[1.75]">
          {profession.faq.map((item) => (
            <div key={item.q} className="border-b border-ink/15 pb-5">
              <h3 className="font-semibold text-ink">{item.q}</h3>
              <p className="mt-1.5">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 max-w-[960px]">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs uppercase font-bold text-honeyDeep mb-1">Related tools</p>
            <h2 className="font-display text-2xl font-semibold text-ink">Keep the decision connected</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/contractor-rate-calculator" className="block border-2 border-ink bg-card rounded-[8px] p-4 text-ink no-underline hover:bg-paper2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
            <h3 className="font-display text-lg font-semibold">Contractor rate calculator</h3>
            <p className="text-[13.5px] text-ink2 mt-1">Use the shared floor calculator to test the assumptions from this profession page.</p>
          </Link>
          <Link href="/contractor-finance" className="block border-2 border-ink bg-card rounded-[8px] p-4 text-ink no-underline hover:bg-paper2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
            <h3 className="font-display text-lg font-semibold">Contractor Finance hub</h3>
            <p className="text-[13.5px] text-ink2 mt-1">Return to the main hub for the full contractor planning flow.</p>
          </Link>
          <Link href="/w2-vs-c2c" className="block border-2 border-ink bg-card rounded-[8px] p-4 text-ink no-underline hover:bg-paper2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
            <h3 className="font-display text-lg font-semibold">W2 vs C2C calculator</h3>
            <p className="text-[13.5px] text-ink2 mt-1">Compare employee compensation with the contractor alternative when the offer is still changing.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
