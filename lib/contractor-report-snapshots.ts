import { money } from "@/lib/format";
import { TAX_YEAR } from "@/lib/contractor-calculators";

export type ReportPrimitive = string | number | boolean | null;
export type ReportSection = Record<string, ReportPrimitive>;

export type ContractorReportSnapshot = {
  calculatorSlug: string;
  calculatorName: string;
  pagePath?: string;
  timestamp: string;
  assumptionsVersion?: string;
  summary?: string;
  inputs?: ReportSection;
  results?: ReportSection;
};

const SNAPSHOT_VERSION = "2026-06-08";

function baseSnapshot(
  calculatorSlug: string,
  calculatorName: string,
  pagePath: string,
  summary: string,
  inputs: ReportSection,
  results: ReportSection,
): ContractorReportSnapshot {
  return {
    calculatorSlug,
    calculatorName,
    pagePath,
    timestamp: new Date().toISOString(),
    assumptionsVersion: SNAPSHOT_VERSION,
    summary,
    inputs,
    results,
  };
}

function signedMoney(value: number) {
  return `${value < 0 ? "-" : ""}${money(Math.abs(value))}`;
}

export function buildW2VsC2CSnapshot(input: {
  calculatorSlug: string;
  calculatorName: string;
  pagePath: string;
  w2Salary: number;
  w2Bonus: number;
  w2Benefits: number;
  w2TaxRate: number;
  c2cRate: number;
  c2cHoursPerWeek: number;
  c2cWeeks: number;
  c2cExpenses: number;
  c2cTaxRate: number;
  riskReserveRate: number;
  result: {
    w2Cash: number;
    w2EstimatedTax: number;
    w2EstimatedValue: number;
    c2cGross: number;
    riskReserve: number;
    c2cProfitBeforeTax: number;
    c2cEstimatedTax: number;
    c2cEstimatedValue: number;
    difference: number;
  };
}): ContractorReportSnapshot {
  const betterPath = input.result.difference >= 0 ? "C2C" : "W2";
  const summary = `${betterPath} appears ahead by ${money(Math.abs(input.result.difference))} after taxes, expenses, and contract risk.`;
  return baseSnapshot(
    input.calculatorSlug,
    input.calculatorName,
    input.pagePath,
    summary,
    {
      "W2 salary": money(input.w2Salary),
      "W2 bonus": money(input.w2Bonus),
      "Employer-paid benefits": money(input.w2Benefits),
      "W2 tax rate": `${input.w2TaxRate.toFixed(1)}%`,
      "C2C hourly rate": `${money(input.c2cRate)}/hr`,
      "Billable hours per week": Number(input.c2cHoursPerWeek.toFixed(1)),
      "Billable weeks per year": Number(input.c2cWeeks.toFixed(1)),
      "Annual business expenses": money(input.c2cExpenses),
      "C2C tax rate": `${input.c2cTaxRate.toFixed(1)}%`,
      "Contract risk reserve": `${input.riskReserveRate.toFixed(1)}%`,
    },
    {
      "W2 cash compensation": money(input.result.w2Cash),
      "W2 estimated tax": signedMoney(-input.result.w2EstimatedTax),
      "W2 retained value + benefits": money(input.result.w2EstimatedValue),
      "C2C gross billings": money(input.result.c2cGross),
      "Risk reserve": signedMoney(-input.result.riskReserve),
      "C2C estimated tax": signedMoney(-input.result.c2cEstimatedTax),
      "C2C retained value": money(input.result.c2cEstimatedValue),
      "Estimated difference": money(input.result.difference),
    },
  );
}

export function buildContractorRateSnapshot(input: {
  calculatorSlug: string;
  calculatorName: string;
  pagePath: string;
  takeHomeTarget: number;
  benefits: number;
  expenses: number;
  profitReserve: number;
  taxRate: number;
  billableHoursPerWeek: number;
  workingWeeks: number;
  result: {
    billableHours: number;
    taxableCashNeed: number;
    operatingCosts: number;
    requiredRevenue: number;
    estimatedTaxReserve: number;
    hourlyRate: number;
    roundedHourlyRate: number;
    dayRate: number;
    monthlyRevenueTarget: number;
  };
}): ContractorReportSnapshot {
  const summary = `You need about ${money(input.result.roundedHourlyRate)}/hr to cover annual cash needs at the entered billable capacity.`;
  return baseSnapshot(
    input.calculatorSlug,
    input.calculatorName,
    input.pagePath,
    summary,
    {
      "Target take-home cash": money(input.takeHomeTarget),
      "Replacement benefits": money(input.benefits),
      "Annual business expenses": money(input.expenses),
      "Profit reserve": money(input.profitReserve),
      "Tax reserve": `${input.taxRate.toFixed(1)}%`,
      "Billable hours per week": Number(input.billableHoursPerWeek.toFixed(1)),
      "Working weeks per year": Number(input.workingWeeks.toFixed(1)),
    },
    {
      "Annual billable hours": Number(input.result.billableHours.toFixed(1)),
      "Taxable owner cash need": money(input.result.taxableCashNeed),
      "Benefits + business costs": money(input.result.operatingCosts),
      "Estimated tax reserve": money(input.result.estimatedTaxReserve),
      "Required annual revenue": money(input.result.requiredRevenue),
      "Minimum planning rate": `${money(input.result.roundedHourlyRate)}/hr`,
      "Suggested day rate": money(input.result.dayRate),
      "Monthly revenue target": money(input.result.monthlyRevenueTarget),
    },
  );
}

export function buildSCorpSavingsSnapshot(input: {
  calculatorSlug: string;
  calculatorName: string;
  pagePath: string;
  profit: number;
  salary: number;
  currentW2Wages: number;
  payrollAndComplianceCosts: number;
  stateEntityCosts: number;
  filingStatus: string;
  result: {
    profit: number;
    salary: number;
    nonWageProfit: number;
    baselineSeTax: number;
    salaryPayrollTax: number;
    grossEmploymentTaxDifference: number;
    addedCosts: number;
    netEstimatedBenefit: number;
    breakEvenStatus: string;
  };
}): ContractorReportSnapshot {
  const summary =
    input.result.netEstimatedBenefit >= 0
      ? `The modeled S-corp scenario shows an estimated benefit of ${money(input.result.netEstimatedBenefit)} after payroll and compliance costs.`
      : `The modeled S-corp scenario shows an estimated added cost of ${money(Math.abs(input.result.netEstimatedBenefit))} after payroll and compliance costs.`;
  return baseSnapshot(
    input.calculatorSlug,
    input.calculatorName,
    input.pagePath,
    summary,
    {
      "Business profit before salary": money(input.profit),
      "Owner salary": money(input.salary),
      "Other W2 wages": money(input.currentW2Wages),
      "Payroll + compliance costs": money(input.payrollAndComplianceCosts),
      "State entity costs": money(input.stateEntityCosts),
      "Filing status": input.filingStatus,
    },
    {
      "Baseline SE tax": money(input.result.baselineSeTax),
      "Salary payroll tax": money(input.result.salaryPayrollTax),
      "Gross employment-tax difference": money(input.result.grossEmploymentTaxDifference),
      "Added annual costs": money(input.result.addedCosts),
      "Potential non-wage profit": money(input.result.nonWageProfit),
      "Net estimated benefit": money(input.result.netEstimatedBenefit),
      "Break-even status": input.result.breakEvenStatus,
    },
  );
}

export function buildLLCVsSCorpSnapshot(input: {
  calculatorSlug: string;
  calculatorName: string;
  pagePath: string;
  annualProfit: number;
  reasonableSalary: number;
  llcAdminCosts: number;
  sCorpAdminCosts: number;
  stateEntityCosts: number;
  currentW2Wages: number;
  filingStatus: string;
  result: {
    defaultLLCEstimatedCost: number;
    sCorpEstimatedCost: number;
    estimatedDifference: number;
    llcSeTax: number;
    sCorpSalaryPayrollTax: number;
    nonWageProfit: number;
  };
}): ContractorReportSnapshot {
  const summary =
    input.result.estimatedDifference >= 0
      ? `The S-corp scenario is lower by ${money(input.result.estimatedDifference)} under the entered assumptions.`
      : `The default LLC scenario is lower by ${money(Math.abs(input.result.estimatedDifference))} under the entered assumptions.`;
  return baseSnapshot(
    input.calculatorSlug,
    input.calculatorName,
    input.pagePath,
    summary,
    {
      "Annual business profit": money(input.annualProfit),
      "Supportable S-corp salary": money(input.reasonableSalary),
      "Default LLC admin costs": money(input.llcAdminCosts),
      "S-corp payroll + admin costs": money(input.sCorpAdminCosts),
      "Additional state entity costs": money(input.stateEntityCosts),
      "Other W2 wages": money(input.currentW2Wages),
      "Filing status": input.filingStatus,
    },
    {
      "Default LLC SE tax": money(input.result.llcSeTax),
      "Default LLC estimated cost": money(input.result.defaultLLCEstimatedCost),
      "S-corp salary payroll tax": money(input.result.sCorpSalaryPayrollTax),
      "S-corp estimated cost": money(input.result.sCorpEstimatedCost),
      "Potential non-wage profit": money(input.result.nonWageProfit),
      "Estimated difference": money(input.result.estimatedDifference),
    },
  );
}

export function build1099TaxSnapshot(input: {
  calculatorSlug: string;
  calculatorName: string;
  pagePath: string;
  grossRevenue: number;
  businessExpenses: number;
  w2Wages: number;
  filingStatus: string;
  federalIncomeTaxRate: number;
  stateTaxRate: number;
  paymentsMade: number;
  result: {
    netProfit: number;
    selfEmploymentTax: number;
    estimatedFederalIncomeTax: number;
    estimatedStateTax: number;
    totalEstimatedTax: number;
    paymentsMade: number;
    remainingBalance: number;
    suggestedQuarterlySetAside: number;
    effectiveTaxRate: number;
  };
}): ContractorReportSnapshot {
  const summary =
    input.result.remainingBalance >= 0
      ? `You may want to reserve about ${money(input.result.remainingBalance)} after payments already made.`
      : `Payments already made are about ${money(Math.abs(input.result.remainingBalance))} above this model.`;
  return baseSnapshot(
    input.calculatorSlug,
    input.calculatorName,
    input.pagePath,
    summary,
    {
      "Gross 1099 revenue": money(input.grossRevenue),
      "Business expenses": money(input.businessExpenses),
      "Other W2 wages": money(input.w2Wages),
      "Filing status": input.filingStatus,
      "Federal income-tax rate": `${input.federalIncomeTaxRate.toFixed(1)}%`,
      "State/local tax rate": `${input.stateTaxRate.toFixed(1)}%`,
      "Payments already made": money(input.paymentsMade),
    },
    {
      "Net business profit": money(input.result.netProfit),
      "Self-employment tax": money(input.result.selfEmploymentTax),
      "Estimated federal income tax": money(input.result.estimatedFederalIncomeTax),
      "Estimated state/local tax": money(input.result.estimatedStateTax),
      "Total estimated tax": money(input.result.totalEstimatedTax),
      "Quarterly set-aside": money(input.result.suggestedQuarterlySetAside),
      "Remaining balance": money(input.result.remainingBalance),
      "Effective tax rate": `${(input.result.effectiveTaxRate * 100).toFixed(1)}%`,
    },
  );
}

export const contractorReportSnapshotVersion = SNAPSHOT_VERSION;
