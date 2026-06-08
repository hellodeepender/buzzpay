import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { writeFileSync } from "node:fs";

const source = readFileSync(new URL("../lib/contractor-calculators.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2020,
    strict: true,
  },
});
const outFile = join(tmpdir(), `buzzpay-calculators-${Date.now()}.mjs`);
writeFileSync(outFile, compiled.outputText);
const calculators = await import(pathToFileURL(outFile));

const {
  SOCIAL_SECURITY_WAGE_BASE,
  calculate1099Tax,
  calculateContractorRate,
  calculateLLCVsSCorp,
  calculatePayrollTax,
  calculateSCorpSavings,
  calculateSelfEmploymentTax,
  calculateW2VsC2C,
} = calculators;

const near = (actual, expected, tolerance = 0.01) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${actual} to be near ${expected}`);
};

const se = calculateSelfEmploymentTax({ netProfit: 100000, filingStatus: "single" });
near(se.adjustedNetEarnings, 92350);
near(se.socialSecurityTax, 11451.4);
near(se.medicareTax, 2678.15);
near(se.total, 14129.55);

const cappedSe = calculateSelfEmploymentTax({ netProfit: 300000, w2Wages: SOCIAL_SECURITY_WAGE_BASE, filingStatus: "single" });
near(cappedSe.socialSecurityTax, 0);
assert.ok(cappedSe.medicareTax > 0);
assert.ok(cappedSe.additionalMedicareTax > 0);

const payroll = calculatePayrollTax({ wages: 100000, filingStatus: "single" });
near(payroll.combinedEmployeeEmployerSocialSecurityTax, 12400);
near(payroll.combinedEmployeeEmployerMedicareTax, 2900);
near(payroll.total, 15300);

const rate = calculateContractorRate({
  takeHomeTarget: 90000,
  benefits: 12000,
  expenses: 10000,
  profitReserve: 8000,
  taxRate: 25,
  billableHoursPerWeek: 25,
  workingWeeks: 48,
});
near(rate.billableHours, 1200);
near(rate.requiredRevenue, 152666.66666666666);
near(rate.hourlyRate, 127.22222222222221);

const compare = calculateW2VsC2C({
  w2Salary: 120000,
  w2Bonus: 10000,
  w2Benefits: 18000,
  w2TaxRate: 28,
  c2cRate: 110,
  c2cHoursPerWeek: 35,
  c2cWeeks: 46,
  c2cExpenses: 15000,
  c2cTaxRate: 32,
  riskReserveRate: 8,
});
assert.ok(compare.c2cGross > compare.w2Cash);
assert.ok(Number.isFinite(compare.difference));

const sCorp = calculateSCorpSavings({
  businessProfitBeforeSalary: 180000,
  reasonableSalary: 110000,
  currentW2Wages: 0,
  payrollAndComplianceCosts: 4500,
  stateEntityCosts: 1000,
  filingStatus: "single",
});
assert.ok(sCorp.nonWageProfit === 70000);
assert.ok(Number.isFinite(sCorp.netEstimatedBenefit));

const entity = calculateLLCVsSCorp({
  annualProfit: 180000,
  reasonableSalary: 110000,
  llcAdminCosts: 1200,
  sCorpAdminCosts: 4500,
  stateEntityCosts: 1000,
  currentW2Wages: 0,
  filingStatus: "single",
});
assert.ok(entity.defaultLLCEstimatedCost > 0);
assert.ok(entity.sCorpEstimatedCost > 0);

const tax1099 = calculate1099Tax({
  grossRevenue: 150000,
  businessExpenses: 30000,
  w2Wages: 0,
  filingStatus: "single",
  federalIncomeTaxRate: 18,
  stateTaxRate: 5,
  paymentsMade: 10000,
});
assert.equal(tax1099.netProfit, 120000);
assert.ok(tax1099.selfEmploymentTax > 0);
assert.ok(tax1099.remainingBalance > 0);

console.log("calculator tests passed");
