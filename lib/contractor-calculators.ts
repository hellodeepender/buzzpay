export const TAX_YEAR = 2026;
export const SOCIAL_SECURITY_WAGE_BASE = 184500;
export const SELF_EMPLOYMENT_ADJUSTMENT = 0.9235;
export const SOCIAL_SECURITY_RATE = 0.124;
export const MEDICARE_RATE = 0.029;
export const ADDITIONAL_MEDICARE_RATE = 0.009;

export type FilingStatus = "single" | "married" | "head";

const ADDITIONAL_MEDICARE_THRESHOLDS: Record<FilingStatus, number> = {
  single: 200000,
  married: 250000,
  head: 200000,
};

export function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function pct(value: number) {
  return clamp(value, 0, 100) / 100;
}

export function calculateSelfEmploymentTax({
  netProfit,
  w2Wages = 0,
  filingStatus = "single",
}: {
  netProfit: number;
  w2Wages?: number;
  filingStatus?: FilingStatus;
}) {
  const adjustedNetEarnings = Math.max(0, netProfit) * SELF_EMPLOYMENT_ADJUSTMENT;
  const remainingSocialSecurityBase = Math.max(0, SOCIAL_SECURITY_WAGE_BASE - Math.max(0, w2Wages));
  const socialSecurityTaxable = Math.min(adjustedNetEarnings, remainingSocialSecurityBase);
  const socialSecurityTax = socialSecurityTaxable * SOCIAL_SECURITY_RATE;
  const medicareTax = adjustedNetEarnings * MEDICARE_RATE;
  const additionalMedicareTaxable = Math.max(
    0,
    adjustedNetEarnings - Math.max(0, ADDITIONAL_MEDICARE_THRESHOLDS[filingStatus] - Math.max(0, w2Wages)),
  );
  const additionalMedicareTax = additionalMedicareTaxable * ADDITIONAL_MEDICARE_RATE;
  const total = socialSecurityTax + medicareTax + additionalMedicareTax;

  return {
    taxYear: TAX_YEAR,
    adjustedNetEarnings,
    socialSecurityTaxable,
    socialSecurityTax,
    medicareTax,
    additionalMedicareTax,
    employerEquivalentDeduction: (socialSecurityTax + medicareTax) / 2,
    total,
  };
}

export function calculatePayrollTax({
  wages,
  otherW2Wages = 0,
  filingStatus = "single",
}: {
  wages: number;
  otherW2Wages?: number;
  filingStatus?: FilingStatus;
}) {
  const salary = Math.max(0, wages);
  const otherWages = Math.max(0, otherW2Wages);
  const remainingSocialSecurityBase = Math.max(0, SOCIAL_SECURITY_WAGE_BASE - otherWages);
  const socialSecurityTaxable = Math.min(salary, remainingSocialSecurityBase);
  const combinedEmployeeEmployerSocialSecurityTax = socialSecurityTaxable * SOCIAL_SECURITY_RATE;
  const combinedEmployeeEmployerMedicareTax = salary * MEDICARE_RATE;
  const additionalMedicareTaxable = Math.max(
    0,
    salary - Math.max(0, ADDITIONAL_MEDICARE_THRESHOLDS[filingStatus] - otherWages),
  );
  const additionalMedicareTax = additionalMedicareTaxable * ADDITIONAL_MEDICARE_RATE;
  const total =
    combinedEmployeeEmployerSocialSecurityTax +
    combinedEmployeeEmployerMedicareTax +
    additionalMedicareTax;

  return {
    socialSecurityTaxable,
    combinedEmployeeEmployerSocialSecurityTax,
    combinedEmployeeEmployerMedicareTax,
    additionalMedicareTax,
    total,
  };
}

export function calculateW2VsC2C(input: {
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
}) {
  const w2Cash = Math.max(0, input.w2Salary) + Math.max(0, input.w2Bonus);
  const w2EstimatedTax = w2Cash * pct(input.w2TaxRate);
  const w2EstimatedValue = w2Cash - w2EstimatedTax + Math.max(0, input.w2Benefits);
  const c2cGross = Math.max(0, input.c2cRate) * Math.max(0, input.c2cHoursPerWeek) * Math.max(0, input.c2cWeeks);
  const riskReserve = c2cGross * pct(input.riskReserveRate);
  const c2cProfitBeforeTax = Math.max(0, c2cGross - Math.max(0, input.c2cExpenses) - riskReserve);
  const c2cEstimatedTax = c2cProfitBeforeTax * pct(input.c2cTaxRate);
  const c2cEstimatedValue = c2cProfitBeforeTax - c2cEstimatedTax;

  return {
    w2Cash,
    w2EstimatedTax,
    w2EstimatedValue,
    c2cGross,
    riskReserve,
    c2cProfitBeforeTax,
    c2cEstimatedTax,
    c2cEstimatedValue,
    difference: c2cEstimatedValue - w2EstimatedValue,
  };
}

export function calculateContractorRate(input: {
  takeHomeTarget: number;
  benefits: number;
  expenses: number;
  profitReserve: number;
  taxRate: number;
  billableHoursPerWeek: number;
  workingWeeks: number;
}) {
  const billableHours = Math.max(1, input.billableHoursPerWeek) * Math.max(1, input.workingWeeks);
  const taxableCashNeed = Math.max(0, input.takeHomeTarget) + Math.max(0, input.profitReserve);
  const operatingCosts = Math.max(0, input.benefits) + Math.max(0, input.expenses);
  const tax = pct(input.taxRate);
  const grossedUpCashNeed = tax < 1 ? taxableCashNeed / (1 - tax) : taxableCashNeed;
  const requiredRevenue = grossedUpCashNeed + operatingCosts;
  const hourlyRate = requiredRevenue / billableHours;

  return {
    billableHours,
    afterTaxNeed: taxableCashNeed + operatingCosts,
    taxableCashNeed,
    operatingCosts,
    requiredRevenue,
    estimatedTaxReserve: grossedUpCashNeed - taxableCashNeed,
    hourlyRate,
    roundedHourlyRate: Math.ceil(hourlyRate),
    dayRate: Math.ceil(hourlyRate) * 8,
    monthlyRevenueTarget: requiredRevenue / 12,
  };
}

export function calculateSCorpSavings(input: {
  businessProfitBeforeSalary: number;
  reasonableSalary: number;
  currentW2Wages: number;
  payrollAndComplianceCosts: number;
  stateEntityCosts: number;
  filingStatus: FilingStatus;
}) {
  const profit = Math.max(0, input.businessProfitBeforeSalary);
  const salary = Math.min(Math.max(0, input.reasonableSalary), profit);
  const baselineSeTax = calculateSelfEmploymentTax({
    netProfit: profit,
    w2Wages: input.currentW2Wages,
    filingStatus: input.filingStatus,
  });
  const salaryPayrollTax = calculatePayrollTax({
    wages: salary,
    otherW2Wages: input.currentW2Wages,
    filingStatus: input.filingStatus,
  });
  const nonWageProfit = Math.max(0, profit - salary);
  const addedCosts = Math.max(0, input.payrollAndComplianceCosts) + Math.max(0, input.stateEntityCosts);
  const grossEmploymentTaxDifference = baselineSeTax.total - salaryPayrollTax.total;
  const netEstimatedBenefit = grossEmploymentTaxDifference - addedCosts;

  return {
    profit,
    salary,
    nonWageProfit,
    baselineSeTax: baselineSeTax.total,
    salaryPayrollTax: salaryPayrollTax.total,
    grossEmploymentTaxDifference,
    addedCosts,
    netEstimatedBenefit,
    breakEvenStatus: netEstimatedBenefit >= 0 ? "above" : "below",
  };
}

export function calculateLLCVsSCorp(input: {
  annualProfit: number;
  reasonableSalary: number;
  llcAdminCosts: number;
  sCorpAdminCosts: number;
  stateEntityCosts: number;
  currentW2Wages: number;
  filingStatus: FilingStatus;
}) {
  const llcSeTax = calculateSelfEmploymentTax({
    netProfit: input.annualProfit,
    w2Wages: input.currentW2Wages,
    filingStatus: input.filingStatus,
  }).total;
  const sCorp = calculateSCorpSavings({
    businessProfitBeforeSalary: input.annualProfit,
    reasonableSalary: input.reasonableSalary,
    currentW2Wages: input.currentW2Wages,
    payrollAndComplianceCosts: input.sCorpAdminCosts,
    stateEntityCosts: input.stateEntityCosts,
    filingStatus: input.filingStatus,
  });
  const defaultLLCEstimatedCost = llcSeTax + Math.max(0, input.llcAdminCosts);
  const sCorpEstimatedCost = sCorp.salaryPayrollTax + sCorp.addedCosts;

  return {
    defaultLLCEstimatedCost,
    sCorpEstimatedCost,
    estimatedDifference: defaultLLCEstimatedCost - sCorpEstimatedCost,
    llcSeTax,
    sCorpSalaryPayrollTax: sCorp.salaryPayrollTax,
    nonWageProfit: sCorp.nonWageProfit,
  };
}

export function calculate1099Tax(input: {
  grossRevenue: number;
  businessExpenses: number;
  w2Wages: number;
  filingStatus: FilingStatus;
  federalIncomeTaxRate: number;
  stateTaxRate: number;
  paymentsMade: number;
}) {
  const netProfit = Math.max(0, input.grossRevenue - input.businessExpenses);
  const seTax = calculateSelfEmploymentTax({
    netProfit,
    w2Wages: input.w2Wages,
    filingStatus: input.filingStatus,
  });
  const estimatedFederalIncomeTax = Math.max(0, netProfit - seTax.employerEquivalentDeduction) * pct(input.federalIncomeTaxRate);
  const estimatedStateTax = netProfit * pct(input.stateTaxRate);
  const totalEstimatedTax = seTax.total + estimatedFederalIncomeTax + estimatedStateTax;
  const remainingBalance = totalEstimatedTax - Math.max(0, input.paymentsMade);

  return {
    netProfit,
    selfEmploymentTax: seTax.total,
    seTax,
    estimatedFederalIncomeTax,
    estimatedStateTax,
    totalEstimatedTax,
    paymentsMade: Math.max(0, input.paymentsMade),
    remainingBalance,
    suggestedQuarterlySetAside: Math.max(0, totalEstimatedTax / 4),
    effectiveTaxRate: netProfit > 0 ? totalEstimatedTax / netProfit : 0,
  };
}
