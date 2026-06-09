import Link from "next/link";
import { Calculator } from "lucide-react";
import ContractorFinanceInteractive from "@/components/ContractorFinanceInteractive";
import IntentBlocks from "@/components/IntentBlocks";
import {
  FinancialDisclaimer,
  LastReviewed,
  Methodology,
  Sources,
} from "@/components/CalculatorTrust";
import {
  AffiliateDisclosure,
  ContractorBusinessStack,
} from "@/components/ContractorRecommendations";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import {
  contractorFinanceLinks,
  type ContractorPageContent,
} from "@/lib/contractor-finance";
import { guideArticleList } from "@/lib/contractor-finance-guides";
import { contractorRateProfessions } from "@/lib/contractor-rate-professions";
import { buildContractorRecommendationCategories } from "@/lib/contractor-recommendations";

const REVIEW_DATE = "2026-06-08";

export default function ContractorFinancePage({ content }: { content: ContractorPageContent }) {
  const related = contractorFinanceLinks.filter((item) => item.href !== content.path);
  const isHub = content.path === "/contractor-finance";
  const recommendationCategories = buildContractorRecommendationCategories();
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
    <div className="py-1">
      <FaqJsonLd items={content.faq} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="min-w-0">
        <section className="max-w-[760px] mb-6">
          {content.path !== "/contractor-finance" && (
            <Link href="/contractor-finance" className="text-[13px] text-muted hover:text-ink">
              &larr; Contractor Finance
            </Link>
          )}
          <h1 className="font-display font-semibold text-[clamp(30px,4.5vw,46px)] leading-[1.06] tracking-tight mt-2 mb-3">
            {content.title}
          </h1>
          <p className="text-ink2 text-lg">{content.intro}</p>
        </section>
        <LastReviewed date={REVIEW_DATE} />

        {isHub ? (
          <>
            <section aria-labelledby="tool-chooser-heading" className="max-w-[1120px]">
              <div className="flex items-start gap-4 mb-4">
                <span className="icon-tile shrink-0" aria-hidden="true"><Calculator size={25} /></span>
                <div>
                  <p className="text-xs uppercase font-bold text-honeyDeep mb-1">Choose what you need to calculate</p>
                  <h2 id="tool-chooser-heading" className="font-display text-2xl font-semibold text-ink">Pick the tool that matches the decision in front of you</h2>
                  <p className="text-[14.5px] text-ink2 mt-1">Start with the calculator that fits your situation, then use the longer guides below for context, assumptions, and follow-up review.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                {contractorFinanceLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex h-full flex-col justify-between rounded-xl2 border-2 border-ink bg-card p-4 text-ink no-underline shadow-hard transition hover:-translate-y-0.5 hover:bg-paper2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  >
                    <div>
                      <h3 className="font-display text-[18px] font-semibold leading-tight">{item.title}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink2">{item.description}</p>
                    </div>
                    <span className="mt-4 inline-flex items-center justify-center gap-2 self-start rounded-[8px] border-2 border-ink bg-honey px-3.5 py-2 text-[13px] font-bold text-ink transition group-hover:-translate-y-[1px]">
                      Open calculator
                    </span>
                  </Link>
                ))}
              </div>
            </section>
            <IntentBlocks kind="hub" path={content.path} title={content.title} />
            <AffiliateDisclosure />
            <ContractorBusinessStack categories={recommendationCategories} currentPath={content.path} />
            <section className="mt-12 max-w-[1120px]" aria-labelledby="rate-professions-heading">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase font-bold text-honeyDeep mb-1">Profession pilot</p>
                  <h2 id="rate-professions-heading" className="font-display text-2xl font-semibold text-ink">
                    Try a profession-specific rate starting point
                  </h2>
                  <p className="mt-1 max-w-[760px] text-[14.5px] text-ink2">
                    These pages are a small SEO pilot built from shared assumptions, not market-rate claims. They help you tune utilization and overhead before you make a pricing decision.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {contractorRateProfessions.map((profession) => (
                  <Link
                    key={profession.slug}
                    href={`/contractor-rate-calculator/${profession.slug}`}
                    className="block border-2 border-ink bg-card rounded-xl2 p-4 text-ink no-underline shadow-hard hover:bg-paper2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  >
                    <h3 className="font-display text-lg font-semibold">{profession.label}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink2">{profession.description}</p>
                    <span className="mt-4 inline-block text-[13px] font-semibold text-honeyDeep">Open profession page →</span>
                  </Link>
                ))}
              </div>
            </section>
            <section className="mt-12 max-w-[1120px]" aria-labelledby="contractor-articles-heading">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase font-bold text-honeyDeep mb-1">Supporting articles</p>
                  <h2 id="contractor-articles-heading" className="font-display text-2xl font-semibold text-ink">
                    Read the guides that explain the decisions behind the calculators
                  </h2>
                  <p className="mt-1 max-w-[760px] text-[14.5px] text-ink2">
                    These articles connect the calculators to the real planning questions: offer comparisons, rate setting, expense discipline, quarterly taxes, and entity choices.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {guideArticleList.map((item) => (
                  <Link key={item.href} href={item.href} className="block border-2 border-ink bg-card rounded-xl2 p-4 text-ink no-underline shadow-hard hover:bg-paper2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                    <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink2">{item.description}</p>
                    <span className="mt-4 inline-block text-[13px] font-semibold text-honeyDeep">Read article →</span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <ContractorFinanceInteractive path={content.path} />
            <IntentBlocks kind="calculator" path={content.path} title={content.title} />
            {content.path === "/contractor-rate-calculator" && (
              <section className="mt-10 max-w-[1120px]" aria-labelledby="rate-professions-heading">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs uppercase font-bold text-honeyDeep mb-1">Profession pilot</p>
                    <h2 id="rate-professions-heading" className="font-display text-2xl font-semibold text-ink">
                      Compare profession-specific rate starting points
                    </h2>
                    <p className="mt-1 max-w-[760px] text-[14.5px] text-ink2">
                      The pilot pages explain the assumptions behind five common contractor roles and link back to the shared calculator and W2 comparison tool.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {contractorRateProfessions.map((profession) => (
                    <Link
                      key={profession.slug}
                      href={`/contractor-rate-calculator/${profession.slug}`}
                      className="block border-2 border-ink bg-card rounded-xl2 p-4 text-ink no-underline shadow-hard hover:bg-paper2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    >
                      <h3 className="font-display text-lg font-semibold">{profession.label}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink2">{profession.description}</p>
                      <span className="mt-4 inline-block text-[13px] font-semibold text-honeyDeep">Open profession page →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <AffiliateDisclosure />
            <ContractorBusinessStack categories={recommendationCategories} currentPath={content.path} />
          </>
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
              <Link key={item.href} href={item.href} className="block border-2 border-ink bg-card rounded-[8px] p-4 text-ink no-underline hover:bg-paper2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="text-[13.5px] text-ink2 mt-1">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
