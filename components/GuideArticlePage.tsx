import Link from "next/link";
import type { ReactNode } from "react";
import { BreadcrumbJsonLd, FaqJsonLd, JsonLd } from "@/components/JsonLd";
import {
  FinancialDisclaimer,
  LastReviewed,
  Methodology,
  Sources,
} from "@/components/CalculatorTrust";
import IntentBlocks from "@/components/IntentBlocks";
import { articleJsonLd } from "@/lib/seo";
import type { SourceItem } from "@/components/CalculatorTrust";

export type GuideSection = {
  heading: string;
  paragraphs: ReactNode[];
  bullets?: ReactNode[];
};

export type GuideFaqItem = {
  q: string;
  a: string;
};

export type GuideRelatedLink = {
  href: string;
  label: string;
  description: string;
};

export type GuideArticle = {
  slug: string;
  path: string;
  title: string;
  description: string;
  intro: ReactNode;
  datePublished: string;
  lastReviewed: string;
  sections: GuideSection[];
  faq: GuideFaqItem[];
  methodology: ReactNode[];
  sources: SourceItem[];
  relatedLinks: GuideRelatedLink[];
};

export default function GuideArticlePage({ article }: { article: GuideArticle }) {
  return (
    <div className="py-1">
      <JsonLd data={articleJsonLd({
        headline: article.title,
        description: article.description,
        path: article.path,
        datePublished: article.datePublished,
        dateModified: article.lastReviewed,
      })} />
      <FaqJsonLd items={article.faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contractor Finance", path: "/contractor-finance" },
          { name: article.title, path: article.path },
        ]}
      />

      <section className="max-w-[760px] mb-6">
        <Link href="/contractor-finance" className="text-[13px] text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[4px]">
          &larr; Contractor Finance
        </Link>
        <h1 className="font-display font-semibold text-[clamp(30px,4.5vw,46px)] leading-[1.06] tracking-tight mt-2 mb-3">
          {article.title}
        </h1>
        <p className="text-ink2 text-lg">{article.intro}</p>
        <LastReviewed date={article.lastReviewed} />
      </section>

      <FinancialDisclaimer>
        This article is educational and does not provide tax, legal, accounting, or financial advice. Use the linked calculator pages to test assumptions, then review the result with a qualified professional when the decision has material consequences.
      </FinancialDisclaimer>

      <IntentBlocks kind="guide" path={article.path} title={article.title} />

      <article className="mt-10 max-w-[760px] text-[15.5px] text-ink2 leading-[1.75]">
        {article.sections.map((section) => (
          <section key={section.heading} className="mt-10 first:mt-0">
            <h2 className="font-display text-[26px] font-semibold mb-3 text-ink">{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <div key={index} className="mb-4">{paragraph}</div>
            ))}
            {section.bullets && (
              <ul className="list-disc pl-5 space-y-2 mb-4">
                {section.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
              </ul>
            )}
          </section>
        ))}

        <section className="mt-10">
          <h2 className="font-display text-[26px] font-semibold mb-4 text-ink">Calculator shortcuts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {article.relatedLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border-2 border-ink bg-card rounded-[8px] p-4 text-ink no-underline hover:bg-paper2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <h3 className="font-display text-lg font-semibold">{item.label}</h3>
                <p className="text-[13.5px] text-ink2 mt-1">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-[26px] font-semibold mb-4 text-ink">Frequently asked questions</h2>
          <div className="space-y-5">
            {article.faq.map((item) => (
              <div key={item.q} className="border-b border-ink/15 pb-5">
                <h3 className="font-semibold text-ink">{item.q}</h3>
                <p className="mt-1.5">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      <Methodology>
        {article.methodology.map((paragraph, index) => <div key={index} className="mb-3">{paragraph}</div>)}
      </Methodology>
      <Sources items={article.sources} />
    </div>
  );
}
