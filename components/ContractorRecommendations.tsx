"use client";

import Link from "next/link";
import { useEffect } from "react";
import { track } from "@vercel/analytics";
import type {
  ContractorRecommendationCategory,
  ContractorRecommendationItem,
  ContractorRecommendationSectionId,
} from "@/lib/contractor-recommendations";

type NextStepLink = {
  label: string;
  href: string;
  sectionId: ContractorRecommendationSectionId;
};

const defaultNextSteps: NextStepLink[] = [
  { label: "Business banking", href: "#business-banking", sectionId: "business-banking" },
  { label: "Bookkeeping", href: "#bookkeeping", sectionId: "bookkeeping" },
  { label: "Payroll", href: "#payroll", sectionId: "payroll" },
  { label: "Talk to a CPA", href: "#cpa-tax-professional", sectionId: "cpa-tax-professional" },
];

export function AffiliateDisclosure() {
  return (
    <aside className="mt-8 rounded-xl2 border border-ink/15 bg-paper2 px-4 py-3 text-[13.5px] text-ink2">
      <b className="text-ink">Affiliate disclosure.</b>{" "}
      BuzzPay may earn a commission if you use some recommended services. Recommendations are educational and should be evaluated based on your own needs.
    </aside>
  );
}

export function RecommendationCard({
  item,
  currentPath,
}: {
  item: ContractorRecommendationItem;
  currentPath: string;
}) {
  useEffect(() => {
    track("affiliate_card_view", {
      name: item.name,
      category: item.category,
      enabled: item.enabled,
      currentPath,
    });
  }, [currentPath, item.category, item.enabled, item.name]);

  const external = item.enabled && /^https?:\/\//i.test(item.href);
  const ctaLabel = item.enabled ? item.ctaLabel.replace(/^Learn what to compare$/i, "View recommendation") : item.ctaLabel;

  function handleClick() {
    track("affiliate_card_click", {
      name: item.name,
      category: item.category,
      enabled: item.enabled,
      currentPath,
    });
  }

  return (
    <div className="flex h-full flex-col rounded-xl2 border-2 border-ink bg-card p-4 shadow-hard">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase font-bold tracking-wide text-honeyDeep">{item.category.replace(/-/g, " ")}</p>
          <h3 className="mt-1 font-display text-[18px] font-semibold leading-tight text-ink">{item.name}</h3>
        </div>
        <span className="rounded-[8px] border border-ink/15 bg-paper px-2.5 py-1 text-[11px] font-bold text-muted">
          {item.enabled ? "Partner" : "Compare"}
        </span>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink2">{item.description}</p>
      <p className="mt-3 text-[13px] leading-relaxed text-ink2">
        <span className="font-semibold text-ink">Best for:</span> {item.bestFor}
      </p>
      <div className="mt-4">
        <a
          href={item.href}
          target={external ? "_blank" : undefined}
          rel={external ? "sponsored nofollow noopener noreferrer" : undefined}
          onClick={handleClick}
          className="inline-flex items-center justify-center rounded-[8px] border-2 border-ink bg-honey px-3.5 py-2 text-[13px] font-bold text-ink no-underline shadow-hardsm transition hover:-translate-y-[1px]"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}

export function RecommendedNextSteps({
  currentPath,
  links = defaultNextSteps,
  compact = false,
}: {
  currentPath: string;
  links?: NextStepLink[];
  compact?: boolean;
}) {
  return (
    <nav
      aria-label="Recommendation categories"
      className={`flex flex-wrap gap-2 ${compact ? "" : "mt-4"}`}
    >
      {links.map((item) => (
        <Link
          key={item.sectionId}
          href={item.href}
          onClick={() =>
            track("next_step_category_click", {
              label: item.label,
              sectionId: item.sectionId,
              currentPath,
            })
          }
          className="inline-flex items-center rounded-full border border-ink/20 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink2 no-underline transition hover:border-ink hover:text-ink"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function RecommendedToolCategory({
  category,
  currentPath,
}: {
  category: ContractorRecommendationCategory;
  currentPath: string;
}) {
  return (
    <section id={category.id} aria-labelledby={`${category.id}-heading`} className="scroll-mt-24">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase font-bold tracking-wide text-muted">{category.label}</p>
          <h3 id={`${category.id}-heading`} className="font-display text-2xl font-semibold text-ink">
            {category.label}
          </h3>
        </div>
      </div>
      <p className="max-w-[760px] text-[14px] leading-relaxed text-ink2">{category.summary}</p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {category.items.map((item) => (
          <RecommendationCard key={item.name} item={item} currentPath={currentPath} />
        ))}
      </div>
    </section>
  );
}

export function ContractorBusinessStack({
  categories,
  currentPath,
}: {
  categories: ContractorRecommendationCategory[];
  currentPath: string;
}) {
  return (
    <section aria-labelledby="contractor-business-stack-heading" className="mt-10 max-w-[1120px]">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs uppercase font-bold text-honeyDeep mb-1">Recommendation stack</p>
          <h2 id="contractor-business-stack-heading" className="font-display text-2xl font-semibold text-ink">
            Compare the services a contractor business usually needs
          </h2>
          <p className="mt-1 max-w-[760px] text-[14.5px] text-ink2">
            These are educational comparison cards, not purchase advice. Use them to compare features, pricing, and fit for your workflow.
          </p>
        </div>
        <RecommendedNextSteps currentPath={currentPath} />
      </div>
      <div className="mt-6 space-y-8">
        {categories.map((category) => (
          <RecommendedToolCategory key={category.id} category={category} currentPath={currentPath} />
        ))}
      </div>
    </section>
  );
}
