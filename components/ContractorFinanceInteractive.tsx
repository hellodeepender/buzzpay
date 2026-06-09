"use client";

import { useState } from "react";
import ContractorFinanceSidebar from "@/components/ContractorFinanceSidebar";
import { CalculatorForPath } from "@/components/ContractorCalculators";
import type { ContractorReportSnapshot } from "@/lib/contractor-report-snapshots";

export default function ContractorFinanceInteractive({ path }: { path: string }) {
  const [resultSnapshot, setResultSnapshot] = useState<ContractorReportSnapshot | undefined>();

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-6 items-start">
      <div className="min-w-0">
        <CalculatorForPath path={path} onSnapshotChange={setResultSnapshot} />
        <ContractorFinanceSidebar
          currentPath={path}
          variant="mobile"
          resultSnapshot={resultSnapshot}
        />
      </div>
      <ContractorFinanceSidebar
        currentPath={path}
        variant="desktop"
        resultSnapshot={resultSnapshot}
      />
    </div>
  );
}
