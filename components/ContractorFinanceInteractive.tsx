"use client";

import ContractorFinanceSidebar from "@/components/ContractorFinanceSidebar";
import { CalculatorForPath } from "@/components/ContractorCalculators";

export default function ContractorFinanceInteractive({ path }: { path: string }) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-6 items-start">
      <div className="min-w-0">
        <CalculatorForPath path={path} />
        <ContractorFinanceSidebar currentPath={path} variant="mobile" />
      </div>
      <ContractorFinanceSidebar currentPath={path} variant="desktop" />
    </div>
  );
}
