import Link from "next/link";
import { Calculator, Check, Clock3 } from "lucide-react";
import { CalculatorForPath } from "@/components/ContractorCalculators";
import {
  FinancialDisclaimer,
  LastReviewed,
  Methodology,
  Sources,
} from "@/components/CalculatorTrust";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import {
  contractorFinanceLinks,
  type ContractorPageContent,
} from "@/lib/contractor-finance";

const REVIEW_DATE = "2026-06-08";

export default function ContractorFinancePage({ content }: { content: ContractorPageContent }) {
  const related = contractorFinanceLinks.filter((item) => item.href !== content.path);
  const hasCalculator = content.path !== "/contractor-finance";
  const breadcrumbs = content.path === "/contractor-finance"
    ? [
        { name: "Home", path: "/" },
        { name: "Contractor Finance", path: "/contractor-finance" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Contractor Finance", path: "/contractor-finance" },
        { name: content.title, path: content.path },
      ];

  return (
    <div className="py-2">
      <FaqJsonLd items={content.faq} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <section className="max-w-[760px] mb-7">
        {content.path !== "/contractor-finance" && (
          <Link href="/contractor-finance" className="text-[13px] text-muted hover:text-ink">
            &larr; Contractor Finance
          </Link>
        )}
        <h1 className="font-display font-semibold text-[clamp(30px,4.5vw,46px)] leading-[1.06] tracking-tight mt-2 mb-3">
          {content.title}
        </h1>
        <p className="text-ink2 text-lg">{content.intro}</p>
        <LastReviewed date={REVIEW_DATE} />
      </section>

      {hasCalculator ? (
        <CalculatorForPath path={content.path} />
      ) : (
        <section aria-labelledby="tool-heading" className="max-w-[820px] bg-card border-2 border-ink rounded-xl2 shadow-hard p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="icon-tile shrink-0"><Calculator size={25} /></span>
            <div>
              <p className="text-xs uppercase font-bold text-honeyDeep mb-1">Contractor finance toolkit</p>
              <h2 id="tool-heading" className="font-display text-2xl font-semibold text-ink">{content.toolTitle}</h2>
              <p className="text-[14.5px] text-ink2 mt-1">{content.toolDescription}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            {content.toolInputs.map((input) => (
              <div key={input} className="flex items-center gap-2 border border-ink/20 bg-paper px-3 py-2.5 text-[13.5px] text-ink2 rounded-[8px]">
                <Check size={16} className="text-moss shrink-0" />{input}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-5 border-t border-paper2 pt-4 text-[13.5px] text-ink2">
            <Clock3 size={17} className="text-honeyDeep shrink-0" />
            <span><b className="text-ink">Toolkit output:</b> {content.toolOutput}</span>
          </div>
        </section>
      )}

      <FinancialDisclaimer>
        This page is for general U.S. planning and education. It does not determine worker classification, tax liability, reasonable compensation, entity eligibility, or the best structure for a specific person or business. Verify current rules and consult qualified tax and legal professionals.
      </FinancialDisclaimer>

      <article className="mt-12 max-w-[760px] text-[15.5px] text-ink2 leading-[1.75]">
        {content.sections.map((section) => (
          <section key={section.heading} className="mt-10 first:mt-0">
            <h2 className="font-display text-[26px] font-semibold mb-3 text-ink">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mb-4">{paragraph}</p>)}
            {section.bullets && (
              <ul className="list-disc pl-5 space-y-2 mb-4">
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
          </section>
        ))}

        <section className="mt-10">
          <h2 className="font-display text-[26px] font-semibold mb-4 text-ink">Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.examples.map((example) => (
              <div key={example.title} className="border-2 border-ink bg-card rounded-[8px] p-5">
                <h3 className="font-display text-lg font-semibold text-ink mb-2">{example.title}</h3>
                <p className="text-[14px] leading-relaxed">{example.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-[26px] font-semibold mb-4 text-ink">Frequently asked questions</h2>
          <div className="space-y-5">
            {content.faq.map((item) => (
              <div key={item.q} className="border-b border-ink/15 pb-5">
                <h3 className="font-semibold text-ink">{item.q}</h3>
                <p className="mt-1.5">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      <Methodology>
        {content.methodology.map((paragraph) => <p key={paragraph} className="mb-3">{paragraph}</p>)}
      </Methodology>
      <Sources items={content.sources} />

      <section className="mt-12" aria-labelledby="related-heading">
        <h2 id="related-heading" className="font-display text-2xl font-semibold mb-4">Related contractor-finance guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((item) => (
            <Link key={item.href} href={item.href} className="block border-2 border-ink bg-card rounded-[8px] p-4 text-ink no-underline hover:bg-paper2 transition">
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="text-[13.5px] text-ink2 mt-1">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
