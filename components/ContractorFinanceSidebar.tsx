"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ArrowDownRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { contractorFinanceLinks } from "@/lib/contractor-finance";

const nextSteps = [
  { label: "Business banking", href: "/go/business-banking", sectionId: "business-banking" as const },
  { label: "Bookkeeping", href: "/go/bookkeeping", sectionId: "bookkeeping" as const },
  { label: "Payroll", href: "/go/payroll", sectionId: "payroll" as const },
  { label: "Talk to a CPA", href: "/go/cpa", sectionId: "cpa-tax-professional" as const },
];

function trackSidebarToolClick(label: string, href: string, currentPath: string) {
  track("contractor_sidebar_tool_click", { label, href, currentPath });
}

function trackNextStepClick(label: string, sectionId: string, currentPath: string) {
  track("contractor_next_step_click", { label, sectionId, currentPath });
}

function SidebarContent({
  currentPath,
}: {
  currentPath: string;
}) {
  const calculator = contractorFinanceLinks.find((item) => item.href === currentPath);
  const reportTarget = `#report-form-${currentPath.replace(/^\//, "")}`;

  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-[12px] uppercase tracking-wide font-bold text-muted mb-2">Contractor Tools</h2>
        <nav className="flex flex-col gap-1.5" aria-label="Contractor tools">
          {contractorFinanceLinks.map((item) => {
            const isCurrent = item.href === currentPath;
            return (
                <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => trackSidebarToolClick(item.sidebarTitle, item.href, currentPath)}
                className={`block rounded-[8px] border-2 px-3 py-2 text-[13.5px] font-semibold no-underline transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                  isCurrent
                    ? "border-ink bg-honey text-ink shadow-hardsm"
                    : "border-ink/20 bg-paper text-ink2 hover:border-ink hover:text-ink"
                }`}
              >
                {item.sidebarTitle}
              </Link>
            );
          })}
        </nav>
      </section>

      {calculator && (
        <section className="border-2 border-dashed border-ink rounded-[8px] bg-paper2 p-4">
          <h2 className="text-[12px] uppercase tracking-wide font-bold text-muted mb-2">Free Report</h2>
          <p className="text-[13.5px] text-ink2">Email me my contractor pay breakdown</p>
          <a
            href={reportTarget}
            onClick={() => track("contractor_report_cta_click", { currentPath })}
            aria-label="Open the free report form"
            className="mt-3 inline-flex items-center gap-2 rounded-[8px] border-2 border-ink bg-honey px-3 py-2 text-[13.5px] font-bold text-ink no-underline shadow-hardsm hover:translate-y-[-1px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Open report form
            <ArrowDownRight size={16} />
          </a>
        </section>
      )}

      <section>
        <h2 className="text-[12px] uppercase tracking-wide font-bold text-muted mb-2">Next Steps</h2>
        <div className="grid grid-cols-1 gap-1.5">
          {nextSteps.map((step) => (
            <Link
              key={step.label}
              href={step.href}
              onClick={() => trackNextStepClick(step.label, step.sectionId, currentPath)}
              className="text-left rounded-[8px] border border-ink/20 bg-card px-3 py-2 text-[13.5px] font-semibold text-ink2 hover:border-ink hover:text-ink transition no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              {step.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ContractorFinanceSidebar({
  currentPath,
  variant = "both",
}: {
  currentPath: string;
  variant?: "desktop" | "mobile" | "both";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {(variant === "desktop" || variant === "both") && (
        <aside className="hidden lg:block sticky top-5 self-start">
          <div className="bg-card border-2 border-ink rounded-xl2 shadow-hard p-4">
            <SidebarContent currentPath={currentPath} />
          </div>
        </aside>
      )}

      {(variant === "mobile" || variant === "both") && (
        <section className="lg:hidden mt-7 bg-card border-2 border-ink rounded-xl2 shadow-hardsm">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left font-display text-lg font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-t-xl2"
          >
            Related contractor tools
            <ChevronDown size={20} className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="border-t border-ink/20 p-4">
              <SidebarContent currentPath={currentPath} />
            </div>
          )}
        </section>
      )}
    </>
  );
}
