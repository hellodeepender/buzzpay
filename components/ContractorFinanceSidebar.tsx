"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";
import EmailReportCapture from "@/components/EmailReportCapture";
import { contractorFinanceLinks } from "@/lib/contractor-finance";

const nextSteps = ["Business banking", "Bookkeeping", "Payroll", "Talk to a CPA"];

function trackSidebarToolClick(label: string, href: string, currentPath: string) {
  track("contractor_sidebar_tool_click", { label, href, currentPath });
}

function trackNextStepClick(label: string, currentPath: string) {
  track("contractor_next_step_click", { label, currentPath });
}

function SidebarContent({
  currentPath,
  instanceId,
}: {
  currentPath: string;
  instanceId: string;
}) {
  const calculator = contractorFinanceLinks.find((item) => item.href === currentPath);

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
                className={`block rounded-[8px] border-2 px-3 py-2 text-[13.5px] font-semibold no-underline transition ${
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
        <EmailReportCapture
          calculatorSlug={currentPath.replace(/^\//, "")}
          calculatorName={calculator.sidebarTitle}
          instanceId={instanceId}
        />
      )}

      <section>
        <h2 className="text-[12px] uppercase tracking-wide font-bold text-muted mb-2">Next Steps</h2>
        <div className="grid grid-cols-1 gap-1.5">
          {nextSteps.map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => trackNextStepClick(step, currentPath)}
              className="text-left rounded-[8px] border border-ink/20 bg-card px-3 py-2 text-[13.5px] font-semibold text-ink2 hover:border-ink hover:text-ink transition"
            >
              {step}
            </button>
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
            <SidebarContent currentPath={currentPath} instanceId="desktop" />
          </div>
        </aside>
      )}

      {(variant === "mobile" || variant === "both") && (
        <section className="lg:hidden mt-7 bg-card border-2 border-ink rounded-xl2 shadow-hardsm">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left font-display text-lg font-semibold text-ink"
          >
            Related contractor tools
            <ChevronDown size={20} className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="border-t border-ink/20 p-4">
              <SidebarContent currentPath={currentPath} instanceId="mobile" />
            </div>
          )}
        </section>
      )}
    </>
  );
}
