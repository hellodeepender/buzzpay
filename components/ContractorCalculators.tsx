"use client";

import { Children, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Calculator } from "lucide-react";
import EmailReportCapture from "@/components/EmailReportCapture";
import AIResultExplanation from "@/components/AIResultExplanation";
import { money } from "@/lib/format";
import {
  TAX_YEAR,
  SOCIAL_SECURITY_WAGE_BASE,
  calculate1099Tax,
  calculateContractorRate,
  calculateLLCVsSCorp,
  calculateSCorpSavings,
  calculateW2VsC2C,
  clamp,
  type FilingStatus,
} from "@/lib/contractor-calculators";
import type { ContractorReportSnapshot } from "@/lib/contractor-report-snapshots";
import {
  build1099TaxSnapshot,
  buildContractorRateSnapshot,
  buildLLCVsSCorpSnapshot,
  buildSCorpSavingsSnapshot,
  buildW2VsC2CSnapshot,
} from "@/lib/contractor-report-snapshots";

type FieldProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
};

function NumberField({ label, value, setValue, min, max, step = 1, prefix, suffix }: FieldProps) {
  const parsed = Number(value);
  const invalid = value !== "" && (!Number.isFinite(parsed) || parsed < min || parsed > max);
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-mono">{prefix}</span>}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => value !== "" && setValue(String(clamp(parsed, min, max)))}
          className={`field-input ${prefix ? "pl-8" : ""} ${suffix ? "pr-10" : ""} ${invalid ? "border-clay" : ""}`}
          aria-invalid={invalid}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted font-mono">{suffix}</span>}
      </div>
      <p className={`mt-1 text-[11px] ${invalid ? "text-clay" : "text-muted"}`}>
        {invalid ? `Enter ${min.toLocaleString()} to ${max.toLocaleString()}.` : `Range: ${min.toLocaleString()}–${max.toLocaleString()}`}
      </p>
    </div>
  );
}

function FilingStatusField({ value, setValue }: { value: FilingStatus; setValue: (value: FilingStatus) => void }) {
  return (
    <div>
      <label className="field-label">Filing status</label>
      <select value={value} onChange={(event) => setValue(event.target.value as FilingStatus)} className="field-input">
        <option value="single">Single</option>
        <option value="married">Married filing jointly</option>
        <option value="head">Head of household</option>
      </select>
    </div>
  );
}

function ToolShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const parts = Children.toArray(children);
  const results = parts.pop();
  return (
    <section aria-labelledby="tool-heading" className="max-w-[900px]">
      <div className="flex items-start gap-4 mb-5">
        <span className="icon-tile shrink-0"><Calculator size={25} /></span>
        <div>
          <p className="text-xs uppercase font-bold text-honeyDeep mb-1">Interactive educational estimate</p>
          <h2 id="tool-heading" className="font-display text-2xl font-semibold text-ink">{title}</h2>
          <p className="text-[14.5px] text-ink2 mt-1">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-[22px] items-start">
        <div className="bg-card border-2 border-ink rounded-xl2 shadow-hard p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{parts}</div>
        </div>
        <div>
          {results}
        </div>
      </div>
    </section>
  );
}

function AssumptionsPanel({ assumptions }: { assumptions: string[] }) {
  return (
    <section className="w-full max-w-[900px] mt-6 bg-paper2 border border-ink/20 rounded-[8px] p-4 sm:p-5">
      <h3 className="text-[13px] font-bold text-ink mb-2">Assumptions</h3>
      <ul className="text-[12.5px] text-ink2 space-y-1.5 list-disc pl-4">
        {assumptions.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function ResultCard({ label, value, children, tone = "honey" }: {
  label: string;
  value: string;
  children: React.ReactNode;
  tone?: "honey" | "green" | "red";
}) {
  const valueColor = tone === "green" ? "text-[#7fe3ab]" : tone === "red" ? "text-[#ffb38f]" : "text-honey";
  return (
    <div className="bg-ink text-paper rounded-xl2 border-2 border-ink p-5 sm:p-6">
      <p className="text-[12px] uppercase font-bold tracking-wide text-[#cabfac]">{label}</p>
      <p className={`font-mono text-[clamp(30px,5vw,42px)] font-bold leading-none mt-2 ${valueColor}`}>{value}</p>
      <div className="border-t border-paper/20 mt-5 pt-4 space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-[13.5px]">
      <span className="text-[#cabfac]">{label}</span>
      <span className={`font-mono text-right ${strong ? "font-bold text-paper" : "font-semibold"}`}>{value}</span>
    </div>
  );
}

const n = (value: string, min: number, max: number) => clamp(Number(value), min, max);

type SnapshotChangeHandler = (snapshot: ContractorReportSnapshot) => void;

export function W2VsC2CCalculator({ onSnapshotChange }: { onSnapshotChange?: SnapshotChangeHandler }) {
  const [w2Salary, setW2Salary] = useState("120000");
  const [w2Bonus, setW2Bonus] = useState("10000");
  const [w2Benefits, setW2Benefits] = useState("18000");
  const [w2TaxRate, setW2TaxRate] = useState("28");
  const [c2cRate, setC2cRate] = useState("110");
  const [hours, setHours] = useState("35");
  const [weeks, setWeeks] = useState("46");
  const [expenses, setExpenses] = useState("15000");
  const [c2cTaxRate, setC2cTaxRate] = useState("32");
  const [riskRate, setRiskRate] = useState("8");
  const result = calculateW2VsC2C({
    w2Salary: n(w2Salary, 0, 1000000), w2Bonus: n(w2Bonus, 0, 500000),
    w2Benefits: n(w2Benefits, 0, 250000), w2TaxRate: n(w2TaxRate, 0, 60),
    c2cRate: n(c2cRate, 1, 1000), c2cHoursPerWeek: n(hours, 1, 80),
    c2cWeeks: n(weeks, 1, 52), c2cExpenses: n(expenses, 0, 500000),
    c2cTaxRate: n(c2cTaxRate, 0, 60), riskReserveRate: n(riskRate, 0, 40),
  });
  const c2cAhead = result.difference >= 0;
  const snapshot = useMemo(() => buildW2VsC2CSnapshot({
    calculatorSlug: "w2-vs-c2c",
    calculatorName: "W2 vs C2C Calculator",
    pagePath: "/w2-vs-c2c",
    w2Salary: n(w2Salary, 0, 1000000),
    w2Bonus: n(w2Bonus, 0, 500000),
    w2Benefits: n(w2Benefits, 0, 250000),
    w2TaxRate: n(w2TaxRate, 0, 60),
    c2cRate: n(c2cRate, 1, 1000),
    c2cHoursPerWeek: n(hours, 1, 80),
    c2cWeeks: n(weeks, 1, 52),
    c2cExpenses: n(expenses, 0, 500000),
    c2cTaxRate: n(c2cTaxRate, 0, 60),
    riskReserveRate: n(riskRate, 0, 40),
    result,
  }), [
    w2Salary,
    w2Bonus,
    w2Benefits,
    w2TaxRate,
    c2cRate,
    hours,
    weeks,
    expenses,
    c2cTaxRate,
    riskRate,
    result.w2Cash,
    result.w2EstimatedTax,
    result.w2EstimatedValue,
    result.c2cGross,
    result.riskReserve,
    result.c2cProfitBeforeTax,
    result.c2cEstimatedTax,
    result.c2cEstimatedValue,
    result.difference,
  ]);

  useEffect(() => {
    onSnapshotChange?.(snapshot);
  }, [onSnapshotChange, snapshot]);

  const assumptions = ["Benefits are added to W2 retained cash at the value you enter.", "Tax rates are user-provided blended estimates, not calculated liabilities.", "The C2C risk reserve is retained cash, not a tax or expense.", "Worker classification and entity eligibility are outside this calculation."];

  return (
    <>
      <ToolShell title="W2 vs C2C comparison calculator" description="Compare estimated retained economic value using your benefits, utilization, costs, tax-rate assumptions, and risk reserve.">
        <NumberField label="W2 salary" value={w2Salary} setValue={setW2Salary} min={0} max={1000000} prefix="$" />
        <NumberField label="Expected W2 bonus" value={w2Bonus} setValue={setW2Bonus} min={0} max={500000} prefix="$" />
        <NumberField label="Employer-paid benefits" value={w2Benefits} setValue={setW2Benefits} min={0} max={250000} prefix="$" />
        <NumberField label="Estimated W2 tax rate" value={w2TaxRate} setValue={setW2TaxRate} min={0} max={60} suffix="%" step={0.5} />
        <NumberField label="C2C hourly rate" value={c2cRate} setValue={setC2cRate} min={1} max={1000} prefix="$" />
        <NumberField label="Billable hours / week" value={hours} setValue={setHours} min={1} max={80} />
        <NumberField label="Billable weeks / year" value={weeks} setValue={setWeeks} min={1} max={52} />
        <NumberField label="Annual business expenses" value={expenses} setValue={setExpenses} min={0} max={500000} prefix="$" />
        <NumberField label="Estimated C2C tax rate" value={c2cTaxRate} setValue={setC2cTaxRate} min={0} max={60} suffix="%" step={0.5} />
        <NumberField label="Contract risk reserve" value={riskRate} setValue={setRiskRate} min={0} max={40} suffix="%" step={0.5} />
        <div className="space-y-3">
          <ResultCard label={c2cAhead ? "Estimated C2C advantage" : "Estimated W2 advantage"} value={money(Math.abs(result.difference))} tone={c2cAhead ? "green" : "red"}>
            <Row label="W2 cash compensation" value={money(result.w2Cash)} />
            <Row label="W2 estimated tax" value={`-${money(result.w2EstimatedTax)}`} />
            <Row label="W2 retained value + benefits" value={money(result.w2EstimatedValue)} strong />
            <Row label="C2C gross billings" value={money(result.c2cGross)} />
            <Row label="Expenses + risk reserve" value={`-${money(n(expenses, 0, 500000) + result.riskReserve)}`} />
            <Row label="C2C estimated tax" value={`-${money(result.c2cEstimatedTax)}`} />
            <Row label="C2C retained value" value={money(result.c2cEstimatedValue)} strong />
          </ResultCard>
          <section id="report-form-w2-vs-c2c" className="scroll-mt-24">
            <EmailReportCapture
              calculatorSlug="w2-vs-c2c"
              calculatorName="W2 vs C2C Calculator"
              instanceId="inline"
              pagePath="/w2-vs-c2c"
              resultSnapshot={snapshot}
            />
          </section>
        </div>
      </ToolShell>
      <AIResultExplanation
        calculatorSlug="w2-vs-c2c"
        calculatorName="W2 vs C2C Calculator"
        snapshot={snapshot}
      />
      <AssumptionsPanel assumptions={assumptions} />
    </>
  );
}

export function ContractorRateCalculator({ onSnapshotChange }: { onSnapshotChange?: SnapshotChangeHandler }) {
  const [takeHome, setTakeHome] = useState("90000");
  const [benefits, setBenefits] = useState("12000");
  const [expenses, setExpenses] = useState("10000");
  const [reserve, setReserve] = useState("8000");
  const [taxRate, setTaxRate] = useState("25");
  const [hours, setHours] = useState("25");
  const [weeks, setWeeks] = useState("48");
  const result = calculateContractorRate({
    takeHomeTarget: n(takeHome, 0, 1000000), benefits: n(benefits, 0, 250000),
    expenses: n(expenses, 0, 500000), profitReserve: n(reserve, 0, 500000),
    taxRate: n(taxRate, 0, 60), billableHoursPerWeek: n(hours, 1, 80), workingWeeks: n(weeks, 1, 52),
  });
  const snapshot = useMemo(() => buildContractorRateSnapshot({
    calculatorSlug: "contractor-rate-calculator",
    calculatorName: "Contractor Rate Calculator",
    pagePath: "/contractor-rate-calculator",
    takeHomeTarget: n(takeHome, 0, 1000000),
    benefits: n(benefits, 0, 250000),
    expenses: n(expenses, 0, 500000),
    profitReserve: n(reserve, 0, 500000),
    taxRate: n(taxRate, 0, 60),
    billableHoursPerWeek: n(hours, 1, 80),
    workingWeeks: n(weeks, 1, 52),
    result,
  }), [
    takeHome,
    benefits,
    expenses,
    reserve,
    taxRate,
    hours,
    weeks,
    result.billableHours,
    result.taxableCashNeed,
    result.operatingCosts,
    result.requiredRevenue,
    result.estimatedTaxReserve,
    result.hourlyRate,
    result.roundedHourlyRate,
    result.dayRate,
    result.monthlyRevenueTarget,
  ]);

  useEffect(() => {
    onSnapshotChange?.(snapshot);
  }, [onSnapshotChange, snapshot]);

  const assumptions = ["The entered tax rate is a blended planning reserve.", "Benefits and expenses are treated as annual cash requirements.", "The rate assumes every entered billable hour is invoiced and collected.", "The rounded rate is a floor, not a market recommendation."];

  return (
    <>
      <ToolShell title="Contractor rate calculator" description="Work backward from annual cash needs and realistic billable capacity to a minimum planning rate.">
        <NumberField label="Target take-home cash" value={takeHome} setValue={setTakeHome} min={0} max={1000000} prefix="$" />
        <NumberField label="Replacement benefits" value={benefits} setValue={setBenefits} min={0} max={250000} prefix="$" />
        <NumberField label="Annual business expenses" value={expenses} setValue={setExpenses} min={0} max={500000} prefix="$" />
        <NumberField label="Profit / risk reserve" value={reserve} setValue={setReserve} min={0} max={500000} prefix="$" />
        <NumberField label="Estimated tax reserve" value={taxRate} setValue={setTaxRate} min={0} max={60} suffix="%" step={0.5} />
        <NumberField label="Billable hours / week" value={hours} setValue={setHours} min={1} max={80} />
        <NumberField label="Working weeks / year" value={weeks} setValue={setWeeks} min={1} max={52} />
        <div className="space-y-3">
          <ResultCard label="Minimum rounded planning rate" value={`${money(result.roundedHourlyRate)}/hr`}>
            <Row label="Annual billable hours" value={result.billableHours.toLocaleString()} />
            <Row label="Taxable owner cash need" value={money(result.taxableCashNeed)} />
            <Row label="Benefits + business costs" value={money(result.operatingCosts)} />
            <Row label="Estimated tax reserve" value={money(result.estimatedTaxReserve)} />
            <Row label="Required annual revenue" value={money(result.requiredRevenue)} strong />
            <Row label="Suggested 8-hour day rate" value={money(result.dayRate)} />
            <Row label="Monthly revenue target" value={money(result.monthlyRevenueTarget)} />
          </ResultCard>
          <section id="report-form-contractor-rate-calculator" className="scroll-mt-24">
            <EmailReportCapture
              calculatorSlug="contractor-rate-calculator"
              calculatorName="Contractor Rate Calculator"
              instanceId="inline"
              pagePath="/contractor-rate-calculator"
              resultSnapshot={snapshot}
            />
          </section>
        </div>
      </ToolShell>
      <AIResultExplanation
        calculatorSlug="contractor-rate-calculator"
        calculatorName="Contractor Rate Calculator"
        snapshot={snapshot}
      />
      <AssumptionsPanel assumptions={assumptions} />
    </>
  );
}

export function SCorpSavingsCalculator({ onSnapshotChange }: { onSnapshotChange?: SnapshotChangeHandler }) {
  const [profit, setProfit] = useState("180000");
  const [salary, setSalary] = useState("110000");
  const [w2Wages, setW2Wages] = useState("0");
  const [compliance, setCompliance] = useState("4500");
  const [stateCosts, setStateCosts] = useState("1000");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const result = calculateSCorpSavings({
    businessProfitBeforeSalary: n(profit, 0, 2000000), reasonableSalary: n(salary, 0, 1000000),
    currentW2Wages: n(w2Wages, 0, 1000000), payrollAndComplianceCosts: n(compliance, 0, 100000),
    stateEntityCosts: n(stateCosts, 0, 100000), filingStatus,
  });
  const positive = result.netEstimatedBenefit >= 0;
  const snapshot = useMemo(() => buildSCorpSavingsSnapshot({
    calculatorSlug: "s-corp-savings-calculator",
    calculatorName: "S-Corp Savings Calculator",
    pagePath: "/s-corp-savings-calculator",
    profit: n(profit, 0, 2000000),
    salary: n(salary, 0, 1000000),
    currentW2Wages: n(w2Wages, 0, 1000000),
    payrollAndComplianceCosts: n(compliance, 0, 100000),
    stateEntityCosts: n(stateCosts, 0, 100000),
    filingStatus,
    result,
  }), [
    profit,
    salary,
    w2Wages,
    compliance,
    stateCosts,
    filingStatus,
    result.profit,
    result.salary,
    result.nonWageProfit,
    result.baselineSeTax,
    result.salaryPayrollTax,
    result.grossEmploymentTaxDifference,
    result.addedCosts,
    result.netEstimatedBenefit,
    result.breakEvenStatus,
  ]);

  useEffect(() => {
    onSnapshotChange?.(snapshot);
  }, [onSnapshotChange, snapshot]);

  const assumptions = [`Uses the ${TAX_YEAR} Social Security wage base of ${money(SOCIAL_SECURITY_WAGE_BASE)}.`, "Income tax on pass-through profit is not removed or modeled as savings.", "The salary is supplied by you; the calculator does not determine reasonable compensation.", "State taxes and professional costs are limited to the amounts entered."];

  return (
    <>
      <ToolShell title="S-corporation savings calculator" description={`Compare a simplified baseline self-employment-tax estimate with payroll taxes on entered salary using ${TAX_YEAR} Social Security limits.`}>
        <NumberField label="Profit before owner salary" value={profit} setValue={setProfit} min={0} max={2000000} prefix="$" />
        <NumberField label="Supportable owner salary" value={salary} setValue={setSalary} min={0} max={1000000} prefix="$" />
        <NumberField label="Other W2 wages" value={w2Wages} setValue={setW2Wages} min={0} max={1000000} prefix="$" />
        <NumberField label="Payroll + professional costs" value={compliance} setValue={setCompliance} min={0} max={100000} prefix="$" />
        <NumberField label="State entity costs" value={stateCosts} setValue={setStateCosts} min={0} max={100000} prefix="$" />
        <FilingStatusField value={filingStatus} setValue={setFilingStatus} />
        {n(salary, 0, 1000000) > n(profit, 0, 2000000) && <p className="sm:col-span-2 text-clay text-xs flex gap-2"><AlertTriangle size={16} /> Salary is capped at entered business profit for this estimate.</p>}
        <div className="space-y-3">
          <ResultCard label={positive ? "Estimated net planning benefit" : "Estimated added annual cost"} value={money(Math.abs(result.netEstimatedBenefit))} tone={positive ? "green" : "red"}>
            <Row label="Baseline estimated SE tax" value={money(result.baselineSeTax)} />
            <Row label="Estimated tax on salary" value={`-${money(result.salaryPayrollTax)}`} />
            <Row label="Gross employment-tax difference" value={money(result.grossEmploymentTaxDifference)} />
            <Row label="Payroll, professional + state costs" value={`-${money(result.addedCosts)}`} />
            <Row label="Potential non-wage profit" value={money(result.nonWageProfit)} strong />
          </ResultCard>
          <section id="report-form-s-corp-savings-calculator" className="scroll-mt-24">
            <EmailReportCapture
              calculatorSlug="s-corp-savings-calculator"
              calculatorName="S-Corp Savings Calculator"
              instanceId="inline"
              pagePath="/s-corp-savings-calculator"
              resultSnapshot={snapshot}
            />
          </section>
        </div>
      </ToolShell>
      <AIResultExplanation
        calculatorSlug="s-corp-savings-calculator"
        calculatorName="S-Corp Savings Calculator"
        snapshot={snapshot}
      />
      <AssumptionsPanel assumptions={assumptions} />
    </>
  );
}

export function LLCVsSCorpCalculator({ onSnapshotChange }: { onSnapshotChange?: SnapshotChangeHandler }) {
  const [profit, setProfit] = useState("180000");
  const [salary, setSalary] = useState("110000");
  const [llcCosts, setLlcCosts] = useState("1200");
  const [sCorpCosts, setSCorpCosts] = useState("4500");
  const [stateCosts, setStateCosts] = useState("1000");
  const [w2Wages, setW2Wages] = useState("0");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const result = calculateLLCVsSCorp({
    annualProfit: n(profit, 0, 2000000), reasonableSalary: n(salary, 0, 1000000),
    llcAdminCosts: n(llcCosts, 0, 100000), sCorpAdminCosts: n(sCorpCosts, 0, 100000),
    stateEntityCosts: n(stateCosts, 0, 100000), currentW2Wages: n(w2Wages, 0, 1000000), filingStatus,
  });
  const sCorpLower = result.estimatedDifference >= 0;
  const snapshot = useMemo(() => buildLLCVsSCorpSnapshot({
    calculatorSlug: "llc-vs-s-corp",
    calculatorName: "LLC vs S-Corp",
    pagePath: "/llc-vs-s-corp",
    annualProfit: n(profit, 0, 2000000),
    reasonableSalary: n(salary, 0, 1000000),
    llcAdminCosts: n(llcCosts, 0, 100000),
    sCorpAdminCosts: n(sCorpCosts, 0, 100000),
    stateEntityCosts: n(stateCosts, 0, 100000),
    currentW2Wages: n(w2Wages, 0, 1000000),
    filingStatus,
    result,
  }), [
    profit,
    salary,
    llcCosts,
    sCorpCosts,
    stateCosts,
    w2Wages,
    filingStatus,
    result.defaultLLCEstimatedCost,
    result.sCorpEstimatedCost,
    result.estimatedDifference,
    result.llcSeTax,
    result.sCorpSalaryPayrollTax,
    result.nonWageProfit,
  ]);

  useEffect(() => {
    onSnapshotChange?.(snapshot);
  }, [onSnapshotChange, snapshot]);

  const assumptions = [`Uses ${TAX_YEAR} federal Social Security limits.`, "Default LLC means a sole-owner self-employment-tax scenario for this estimate.", "Income tax is excluded because pass-through profit generally remains relevant under both scenarios.", "Legal protection, ownership restrictions, benefits, basis, and state-specific rules are not scored."];

  return (
    <>
      <ToolShell title="LLC default tax vs S-corporation cost comparison" description="Compare a simplified federal employment-tax and administration-cost scenario. This does not decide legal form, eligibility, or reasonable salary.">
        <NumberField label="Annual business profit" value={profit} setValue={setProfit} min={0} max={2000000} prefix="$" />
        <NumberField label="Supportable S-corp salary" value={salary} setValue={setSalary} min={0} max={1000000} prefix="$" />
        <NumberField label="Default LLC admin costs" value={llcCosts} setValue={setLlcCosts} min={0} max={100000} prefix="$" />
        <NumberField label="S-corp payroll + admin costs" value={sCorpCosts} setValue={setSCorpCosts} min={0} max={100000} prefix="$" />
        <NumberField label="Additional state entity costs" value={stateCosts} setValue={setStateCosts} min={0} max={100000} prefix="$" />
        <NumberField label="Other W2 wages" value={w2Wages} setValue={setW2Wages} min={0} max={1000000} prefix="$" />
        <FilingStatusField value={filingStatus} setValue={setFilingStatus} />
        <div className="space-y-3">
          <ResultCard label={sCorpLower ? "S-corp scenario lower by" : "Default LLC scenario lower by"} value={money(Math.abs(result.estimatedDifference))} tone={sCorpLower ? "green" : "red"}>
            <Row label="Default LLC estimated SE tax" value={money(result.llcSeTax)} />
            <Row label="Default LLC tax + admin" value={money(result.defaultLLCEstimatedCost)} strong />
            <Row label="S-corp salary payroll tax" value={money(result.sCorpSalaryPayrollTax)} />
            <Row label="S-corp payroll + entered costs" value={money(result.sCorpEstimatedCost)} strong />
            <Row label="Potential non-wage profit" value={money(result.nonWageProfit)} />
          </ResultCard>
          <section id="report-form-llc-vs-s-corp" className="scroll-mt-24">
            <EmailReportCapture
              calculatorSlug="llc-vs-s-corp"
              calculatorName="LLC vs S-Corp"
              instanceId="inline"
              pagePath="/llc-vs-s-corp"
              resultSnapshot={snapshot}
            />
          </section>
        </div>
      </ToolShell>
      <AIResultExplanation
        calculatorSlug="llc-vs-s-corp"
        calculatorName="LLC vs S-Corp"
        snapshot={snapshot}
      />
      <AssumptionsPanel assumptions={assumptions} />
    </>
  );
}

export function Tax1099Calculator({ onSnapshotChange }: { onSnapshotChange?: SnapshotChangeHandler }) {
  const [revenue, setRevenue] = useState("150000");
  const [expenses, setExpenses] = useState("30000");
  const [w2Wages, setW2Wages] = useState("0");
  const [federalRate, setFederalRate] = useState("18");
  const [stateRate, setStateRate] = useState("5");
  const [payments, setPayments] = useState("10000");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const result = calculate1099Tax({
    grossRevenue: n(revenue, 0, 5000000), businessExpenses: n(expenses, 0, 5000000),
    w2Wages: n(w2Wages, 0, 1000000), filingStatus,
    federalIncomeTaxRate: n(federalRate, 0, 50), stateTaxRate: n(stateRate, 0, 20),
    paymentsMade: n(payments, 0, 2000000),
  });
  const due = result.remainingBalance >= 0;
  const snapshot = useMemo(() => build1099TaxSnapshot({
    calculatorSlug: "1099-tax-calculator",
    calculatorName: "1099 Tax Calculator",
    pagePath: "/1099-tax-calculator",
    grossRevenue: n(revenue, 0, 5000000),
    businessExpenses: n(expenses, 0, 5000000),
    w2Wages: n(w2Wages, 0, 1000000),
    filingStatus,
    federalIncomeTaxRate: n(federalRate, 0, 50),
    stateTaxRate: n(stateRate, 0, 20),
    paymentsMade: n(payments, 0, 2000000),
    result,
  }), [
    revenue,
    expenses,
    w2Wages,
    filingStatus,
    federalRate,
    stateRate,
    payments,
    result.netProfit,
    result.selfEmploymentTax,
    result.estimatedFederalIncomeTax,
    result.estimatedStateTax,
    result.totalEstimatedTax,
    result.paymentsMade,
    result.remainingBalance,
    result.suggestedQuarterlySetAside,
    result.effectiveTaxRate,
  ]);

  useEffect(() => {
    onSnapshotChange?.(snapshot);
  }, [onSnapshotChange, snapshot]);

  const assumptions = [`Self-employment tax uses the ${TAX_YEAR} Social Security wage base of ${money(SOCIAL_SECURITY_WAGE_BASE)}.`, "Federal and state income-tax rates are user-provided blended estimates.", "The employer-equivalent SE tax deduction reduces the estimated federal income-tax base.", "Credits, QBI, itemized deductions, retirement contributions, local tax, and special situations are excluded."];

  return (
    <>
      <ToolShell title="1099 tax planning calculator" description={`Estimate self-employment tax with ${TAX_YEAR} limits, then add your own blended federal and state income-tax rates.`}>
        <NumberField label="Gross 1099 revenue" value={revenue} setValue={setRevenue} min={0} max={5000000} prefix="$" />
        <NumberField label="Business expenses" value={expenses} setValue={setExpenses} min={0} max={5000000} prefix="$" />
        <NumberField label="Other W2 wages" value={w2Wages} setValue={setW2Wages} min={0} max={1000000} prefix="$" />
        <FilingStatusField value={filingStatus} setValue={setFilingStatus} />
        <NumberField label="Estimated federal income-tax rate" value={federalRate} setValue={setFederalRate} min={0} max={50} suffix="%" step={0.5} />
        <NumberField label="Estimated state/local rate" value={stateRate} setValue={setStateRate} min={0} max={20} suffix="%" step={0.5} />
        <NumberField label="Payments / withholding already made" value={payments} setValue={setPayments} min={0} max={2000000} prefix="$" />
        <div className="space-y-3">
          <ResultCard label={due ? "Estimated remaining tax reserve" : "Estimated payments above model"} value={money(Math.abs(result.remainingBalance))} tone={due ? "honey" : "green"}>
            <Row label="Net business profit" value={money(result.netProfit)} strong />
            <Row label="Self-employment tax" value={money(result.selfEmploymentTax)} />
            <Row label="Estimated federal income tax" value={money(result.estimatedFederalIncomeTax)} />
            <Row label="Estimated state/local tax" value={money(result.estimatedStateTax)} />
            <Row label="Total estimated tax" value={money(result.totalEstimatedTax)} strong />
            <Row label="Payments already made" value={`-${money(result.paymentsMade)}`} />
            <Row label="Quarterly set-aside before payments" value={money(result.suggestedQuarterlySetAside)} />
            <Row label="Effective rate on net profit" value={`${(result.effectiveTaxRate * 100).toFixed(1)}%`} />
          </ResultCard>
          <section id="report-form-1099-tax-calculator" className="scroll-mt-24">
            <EmailReportCapture
              calculatorSlug="1099-tax-calculator"
              calculatorName="1099 Tax Calculator"
              instanceId="inline"
              pagePath="/1099-tax-calculator"
              resultSnapshot={snapshot}
            />
          </section>
        </div>
      </ToolShell>
      <AIResultExplanation
        calculatorSlug="1099-tax-calculator"
        calculatorName="1099 Tax Calculator"
        snapshot={snapshot}
      />
      <AssumptionsPanel assumptions={assumptions} />
    </>
  );
}

export function CalculatorForPath({
  path,
  onSnapshotChange,
}: {
  path: string;
  onSnapshotChange?: SnapshotChangeHandler;
}) {
  if (path === "/w2-vs-c2c") return <W2VsC2CCalculator onSnapshotChange={onSnapshotChange} />;
  if (path === "/contractor-rate-calculator") return <ContractorRateCalculator onSnapshotChange={onSnapshotChange} />;
  if (path === "/s-corp-savings-calculator") return <SCorpSavingsCalculator onSnapshotChange={onSnapshotChange} />;
  if (path === "/llc-vs-s-corp") return <LLCVsSCorpCalculator onSnapshotChange={onSnapshotChange} />;
  if (path === "/1099-tax-calculator") return <Tax1099Calculator onSnapshotChange={onSnapshotChange} />;
  return null;
}
