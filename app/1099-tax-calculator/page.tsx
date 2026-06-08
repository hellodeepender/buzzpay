import ContractorFinancePage from "@/components/ContractorFinancePage";
import type { ContractorPageContent } from "@/lib/contractor-finance";
import { createMetadata } from "@/lib/seo";

const content: ContractorPageContent = {
  path: "/1099-tax-calculator",
  title: "1099 Tax Calculator: Plan for Self-Employment and Income Tax",
  metaTitle: "1099 Tax Calculator for Independent Contractors",
  description: "Plan 1099 contractor taxes using revenue, business expenses, self-employment tax, income tax, deductions, credits, and estimated payments.",
  intro: "A useful 1099 tax estimate starts with net business profit, calculates self-employment tax separately from income tax, and shows why filing status, other income, deductions, credits, and state rules matter.",
  toolTitle: "1099 contractor tax planning model",
  toolDescription: "The interactive calculator is planned. It will separate business profit, self-employment tax, federal income tax, state assumptions, and payments already made.",
  toolInputs: [
    "Gross self-employment revenue and expected business expenses",
    "Filing status, other household income, and qualifying deductions",
    "Social Security wage-base interaction with any W2 wages",
    "Additional Medicare Tax thresholds where applicable",
    "Federal and state estimated payments or withholding",
    "Tax year and current-law limits",
  ],
  toolOutput: "an estimated annual liability range, quarterly planning amount, effective rate, and transparent breakdown by tax category.",
  sections: [
    {
      heading: "A Form 1099 is information, not a separate tax system",
      paragraphs: [
        "Independent contractors may receive Form 1099-NEC, Form 1099-K, or another information return, but tax obligations arise from the underlying business activity and income—not from whether a form arrives. Business income generally must be reported even when a payer does not issue a 1099. The form is evidence of payments, while the tax return determines net profit and the taxes associated with the taxpayer's full situation.",
        "The phrase '1099 tax' often combines several different items: federal income tax, self-employment tax, state and local income tax, and possibly other obligations. Combining them into one flat percentage can be useful as a rough savings habit but is not a calculation. A responsible estimator shows each layer and identifies which facts it cannot know.",
      ],
    },
    {
      heading: "Begin with net business profit",
      paragraphs: [
        "Start with gross receipts from services and other business income. Then subtract ordinary and necessary expenses that are properly documented and allowed under current law. Common contractor categories may include software, professional insurance, advertising, accounting, business-use equipment, qualified travel, and certain home-office or vehicle costs. Eligibility and substantiation rules differ by expense, so the estimator should not automatically treat every cash outflow as deductible.",
        "Net profit is not the same as cash left in the bank. Loan proceeds, owner transfers, equipment purchases, depreciation, unpaid invoices, and tax payments can create differences between books, taxable income, and cash flow. Maintain records by category and reconcile payment-platform forms to actual gross receipts so fees, refunds, and duplicate reporting are handled correctly. A calculator is only as reliable as the revenue and expense inputs supplied to it.",
      ],
      bullets: [
        "Report business income whether or not a payer sends an information return.",
        "Keep receipts, invoices, mileage records, and business-purpose documentation.",
        "Do not confuse a deduction with reimbursement of the full cost.",
        "Separate personal spending from business records and bank activity.",
      ],
    },
    {
      heading: "Calculate self-employment tax as its own layer",
      paragraphs: [
        "Self-employment tax generally funds Social Security and Medicare for people working for themselves. The commonly stated rate is 15.3 percent, consisting of Social Security and Medicare components, but the calculation is not simply 15.3 percent of gross 1099 receipts. It generally applies to net earnings from self-employment after the statutory adjustment, and the Social Security portion is limited by an annual wage base that also considers covered W2 wages.",
        "Higher-income taxpayers may also face Additional Medicare Tax when combined wages, compensation, and self-employment income exceed the threshold for their filing status. The employer-equivalent portion of self-employment tax may produce an adjustment when calculating income tax, but it does not reduce the self-employment tax itself. These interactions are why the estimator needs tax-year and W2-income inputs rather than one permanent percentage.",
      ],
    },
    {
      heading: "Estimate federal income tax using the whole return",
      paragraphs: [
        "Federal income tax is progressive and depends on taxable income, not just contractor profit. Filing status, a spouse's income, W2 wages, investment income, deductions, retirement contributions, health-insurance treatment, and tax credits can all change the marginal and effective rate. A contractor with the same business profit as another contractor may owe a different amount because the surrounding household return is different.",
        "A useful calculator should add business profit to other projected income, apply relevant adjustments and deductions, estimate tax under current-year brackets, and then subtract credits and payments where the model supports them. It should label exclusions and avoid implying tax-preparation accuracy when information is missing. For a quick reserve, use a conservative range and update it as actual year-to-date results become available.",
      ],
    },
    {
      heading: "Estimated payments are a payment method",
      paragraphs: [
        "The federal tax system generally requires tax to be paid as income is earned, either through withholding or estimated payments. Self-employed individuals often use Form 1040-ES to estimate and pay income and self-employment taxes during the year. Quarterly is common shorthand, but the payment periods are not four identical calendar quarters. Current due dates and weekend or holiday adjustments should be checked directly with the IRS.",
        "Estimated payments do not create additional tax; they prepay expected annual liability. A contractor with a W2 spouse or a part-time W2 job may choose to increase withholding instead, subject to proper planning. Underpayment penalties can apply when payments are insufficient or late, even if the taxpayer ultimately receives a refund. Prior-year safe-harbor rules, income timing, and annualized-income methods can affect the required schedule.",
      ],
    },
    {
      heading: "State and local taxes require separate assumptions",
      paragraphs: [
        "This P1 page does not generate state-specific estimates. States differ in income-tax rates, deductions, estimated-payment rules, entity taxes, local taxes, and treatment of federal adjustments. Contractors working across state lines may have filing obligations in more than one jurisdiction, and remote work does not automatically eliminate the client's state from consideration. A federal estimate should therefore leave state and local tax as explicit inputs or a separate reserve.",
        "Business registrations, sales tax, gross-receipts taxes, and franchise fees are also distinct from personal income tax. Whether they apply depends on services, customers, location, and entity. A calculator labeled '1099 tax' cannot safely infer those obligations from revenue alone. State pages should only be added after verified, versioned state data and review processes exist.",
      ],
    },
    {
      heading: "Turn the annual estimate into a cash system",
      paragraphs: [
        "Separate tax cash from operating cash as revenue arrives. A percentage transfer can be a practical habit, but reconcile it against a year-to-date projection at least quarterly. Update revenue, deductible expenses, other household income, withholding, credits, and payments. If income is seasonal, a flat monthly transfer may overfund early periods or leave later payments short, so maintain both a reserve balance and an annual forecast.",
        "Keep the estimate connected to bookkeeping. Revenue should reconcile to invoices, bank deposits, and payment processors. Expenses should be categorized with documentation. Estimated payments should be recorded by tax year and jurisdiction. The goal is not merely to predict a refund or balance due; it is to avoid spending money that belongs to tax authorities while preserving enough working capital to run the business.",
      ],
    },
  ],
  examples: [
    {
      title: "Contractor with only self-employment income",
      body: "A contractor projects $140,000 of receipts and $25,000 of supported business expenses. The estimate begins with net profit, calculates self-employment tax using current-year rules, then estimates income tax using filing status, deductions, and credits. State tax is entered separately. Payments already made reduce the projected balance due but do not change the underlying annual tax estimate.",
    },
    {
      title: "Side business alongside a W2 job",
      body: "A worker earns W2 wages and also has consulting profit. The wage-base interaction matters for the Social Security component, while total household income affects marginal income-tax rates and possibly Additional Medicare Tax. The worker compares estimated payments with increased W2 withholding and updates the forecast as side-business revenue changes.",
    },
  ],
  faq: [
    { q: "How much should a 1099 contractor save for taxes?", a: "There is no universal percentage. The reserve depends on net profit, other income, filing status, deductions, credits, state taxes, and payments. Use a conservative initial range, then calculate from current-year facts." },
    { q: "Is self-employment tax 15.3 percent of gross revenue?", a: "Generally no. It is based on net earnings from self-employment under Schedule SE rules, with a Social Security wage limit and possible interaction with W2 wages. Medicare components have different limits." },
    { q: "Do I report income if I do not receive a 1099?", a: "Generally, taxable business income must be reported even if no information return is issued. Forms 1099 help report payments but do not define all taxable receipts." },
    { q: "Are quarterly estimated payments required?", a: "They may be required when withholding and other payments will not cover enough tax. Exceptions, safe harbors, and special rules apply. Use current Form 1040-ES and IRS guidance." },
    { q: "Can I deduct all contractor expenses?", a: "Only expenses allowed under current tax law and supported by the required records. Personal costs are not deductible merely because the contractor paid them from a business account." },
    { q: "Does this estimate include state tax?", a: "Not automatically. State and local obligations vary, so this phase treats them as separate assumptions and does not create state-specific pages." },
  ],
  methodology: [
    "The planned estimator will calculate projected net business profit, self-employment tax under the selected tax year, federal income tax in the context of other household income, and payments already made. State and local amounts will remain explicit user inputs until a reviewed state-data system exists.",
    "It will separate liability from payment timing, show assumptions, and provide a range when credits or deductions cannot be modeled reliably. It will not prepare a return, determine deductibility, or guarantee penalty protection.",
  ],
  sources: [
    { name: "IRS: Self-employed individuals tax center", href: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center", note: "Federal filing, self-employment tax, and estimated payments" },
    { name: "IRS: Self-employment tax", href: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes", note: "Social Security and Medicare tax rules" },
    { name: "IRS: Estimated taxes", href: "https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes", note: "Payment requirements and calculation overview" },
    { name: "IRS Publication 505", href: "https://www.irs.gov/publications/p505", note: "Withholding and estimated-tax guidance" },
  ],
};

export const metadata = createMetadata({ title: content.metaTitle, description: content.description, path: content.path });

export default function Page() {
  return <ContractorFinancePage content={content} />;
}
