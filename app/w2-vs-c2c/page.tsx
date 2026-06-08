import ContractorFinancePage from "@/components/ContractorFinancePage";
import type { ContractorPageContent } from "@/lib/contractor-finance";
import { createMetadata } from "@/lib/seo";

const content: ContractorPageContent = {
  path: "/w2-vs-c2c",
  title: "W2 vs C2C: Compare Compensation, Taxes, and Risk",
  metaTitle: "W2 vs C2C Calculator and Comparison Guide",
  description: "Compare a W2 job with a C2C contract using salary, benefits, taxes, business costs, unpaid time, and contract risk. Includes examples and methodology.",
  intro: "A C2C rate is not directly comparable with a W2 wage. Build the comparison from total economic value, then account for business costs, unpaid time, tax administration, and contract risk.",
  toolTitle: "W2 vs C2C comparison worksheet",
  toolDescription: "The full calculator is planned. This worksheet shows the inputs a responsible comparison must include instead of multiplying salary by a single shortcut.",
  toolInputs: [
    "W2 salary, bonus, and employer retirement contribution",
    "Employer-paid health coverage and other benefits",
    "C2C hourly rate, expected billable hours, and contract length",
    "Business insurance, accounting, payroll, equipment, and unpaid leave",
    "Expected downtime and a reserve for contract risk",
    "Entity and tax treatment actually used by the contractor",
  ],
  toolOutput: "an annualized side-by-side cash-flow comparison with assumptions shown separately from tax estimates.",
  sections: [
    {
      heading: "W2 and C2C describe different economic arrangements",
      paragraphs: [
        "A W2 offer usually describes employment. The employer reports wages on Form W-2, withholds payroll and income taxes, controls payroll timing, and may provide benefits such as health insurance, paid leave, retirement contributions, training, equipment, and unemployment coverage. The salary number is only one part of the arrangement. Some benefits have a clear dollar cost, while others are valuable because they transfer risk from the worker to the employer.",
        "C2C, short for corporation-to-corporation, usually describes a commercial agreement between a client or staffing firm and a contractor's business entity. The contractor's company invoices for services and manages its own expenses, insurance, tax administration, and owner compensation. C2C is not itself a federal tax classification, and using an LLC or corporation does not automatically make a worker independent. The actual facts, including behavioral control, financial control, and the parties' relationship, still matter.",
      ],
    },
    {
      heading: "Start with the full value of the W2 package",
      paragraphs: [
        "A useful comparison begins with salary and predictable cash compensation, then adds benefits the employer pays on the worker's behalf. Include employer retirement contributions, the employer share of health premiums, health savings account funding, paid disability or life insurance, and recurring bonuses that are genuinely expected. Do not inflate the result with benefits you would not purchase or cannot use, but do not treat valuable coverage as free merely because it is not deposited into your checking account.",
        "Paid time off also changes the comparison. A salaried employee may receive pay during holidays, vacation, sick days, training, internal meetings, and periods between assignments. A C2C contractor is commonly paid only for approved hours or deliverables. If the contractor plans to take four weeks away from client work, those weeks must either be funded by a higher rate or accepted as lower annual revenue. The same applies to business development, bookkeeping, proposals, and collections.",
      ],
      bullets: [
        "Separate guaranteed salary from discretionary bonuses and equity whose value is uncertain.",
        "Use the employer's actual annual benefit statement when available instead of a generic percentage.",
        "Value paid leave using the compensation that continues during nonworking days.",
        "Record vesting schedules and eligibility waiting periods rather than assuming every benefit begins immediately.",
      ],
    },
    {
      heading: "Translate the C2C rate into realistic annual revenue",
      paragraphs: [
        "The headline C2C rate becomes meaningful only after estimating billable hours. Forty hours multiplied by fifty-two weeks is usually too optimistic because it assumes no holidays, vacation, illness, onboarding delay, contract gap, administrative work, or rejected time. Build a calendar from the expected contract term, remove known nonbillable days, and apply a collection assumption if invoices can be delayed or disputed. A rate that looks high can produce ordinary annual revenue when utilization is uneven.",
        "Next subtract costs that exist because the contractor is operating a business. Common categories include professional liability coverage, general liability coverage, bookkeeping, tax preparation, payroll service, state registration fees, laptops, software, security requirements, continuing education, and legal review. Some costs may be deductible for income-tax purposes, but a deduction does not make the purchase free. It reduces taxable income; the business still spends the cash.",
      ],
    },
    {
      heading: "Taxes should be modeled after business economics",
      paragraphs: [
        "W2 employees and independent business owners can face different payment mechanics and employment-tax responsibilities, but a clean comparison should not apply a flat tax percentage to gross billings and call the difference solved. Start with business revenue, subtract ordinary and necessary business expenses, identify how the entity compensates the owner, and then estimate federal, state, local, and employment taxes under that structure. Filing status, other household income, deductions, credits, and retirement contributions can materially change the result.",
        "A sole proprietor or qualifying single-member LLC generally reports business activity on the owner's return and may owe self-employment tax on net earnings. An eligible entity that elects S-corporation treatment introduces payroll, reasonable compensation, separate filings, and distributions. Those rules affect timing and administration as well as tax. Compare structures only after the contract economics work; entity selection cannot rescue an inadequate rate.",
      ],
    },
    {
      heading: "Risk and control belong in the comparison",
      paragraphs: [
        "A W2 employee can still be laid off, but employment often includes a more stable payroll cadence, internal reassignment opportunities, unemployment coverage, and employer responsibility for collections. A contractor may have a defined end date, termination-on-notice language, invoice approval conditions, liability obligations, and periods without revenue. A risk reserve is not a tax. It is additional compensation for taking uncertainty that the client would otherwise carry.",
        "Contract terms can matter as much as rate. Review payment timing, overtime rules, expense reimbursement, intellectual-property ownership, indemnification, insurance limits, non-solicitation provisions, and the right to work for other clients. Also examine who controls methods, schedule, tools, and integration with the client's workforce. Calling an arrangement C2C does not override worker-classification law when the practical relationship looks like employment.",
      ],
    },
    {
      heading: "How to decide between two offers",
      paragraphs: [
        "Build three views: expected, conservative, and best case. The expected case uses the contract hours and expenses you reasonably anticipate. The conservative case reduces utilization, adds a contract gap, and includes all compliance costs. The best case assumes strong utilization without pretending every week is billable. Compare annual cash retained, benefit value, retirement capacity, time flexibility, business-development burden, and the size of the emergency reserve each arrangement requires.",
        "The result is rarely a universal winner. W2 may be stronger for a worker who values predictable benefits, paid leave, mentorship, and lower administrative load. C2C may be attractive when the rate pays for lost benefits and risk, the contractor has multiple-client capacity, and the arrangement supports genuine business independence. The correct rate is the one that leaves the contractor adequately compensated after costs and realistic downtime, not the smallest premium that makes monthly gross revenue look larger.",
      ],
    },
  ],
  examples: [
    {
      title: "Stable W2 package versus a short C2C engagement",
      body: "A worker compares a $120,000 salary with health coverage, a retirement match, paid leave, and a $90-per-hour six-month C2C project. Multiplying $90 by 2,080 hours would be misleading because the contract covers only part of the year. The worker instead estimates approved hours during the actual term, subtracts business costs, and reserves cash for the next project search. The W2 package may remain economically stronger despite the higher hourly headline.",
    },
    {
      title: "Long contract with limited benefits",
      body: "Another worker has a modest W2 benefit package and receives a twelve-month C2C offer with a strong rate, clear payment terms, and flexibility to serve additional clients. After removing holidays, vacation, administration, insurance, and accounting costs, the contract still produces a meaningful premium. The comparison supports C2C, but only because the rate covers the full business burden rather than merely exceeding the employee's hourly salary equivalent.",
    },
  ],
  faq: [
    { q: "What does C2C mean?", a: "C2C generally means one business contracts with another business for services. It describes the contracting relationship, not a complete legal or tax conclusion. The contractor may operate through an LLC or corporation, and the actual relationship must still support independent-contractor treatment." },
    { q: "How much higher should a C2C rate be than a W2 rate?", a: "There is no reliable universal percentage. The required premium depends on benefits, paid leave, billable utilization, contract length, business expenses, tax structure, and risk. Convert both arrangements to annual economic value using explicit assumptions." },
    { q: "Is C2C always better for taxes?", a: "No. C2C creates business revenue and potential deductions, but it also creates expenses, administration, and tax-payment obligations. An S-corporation election may help some eligible businesses, but reasonable salary, payroll, and compliance costs must be included." },
    { q: "Can a company require me to work C2C?", a: "A client can choose which vendors it contracts with, but labels do not decide worker status. If the business controls how the work is performed and the overall relationship resembles employment, classification concerns may remain." },
    { q: "Should benefits be valued at the employer's cost?", a: "Employer cost is a useful starting point, but personal value may differ. Use actual employer contributions and premiums, then adjust cautiously for benefits you would not replace or could purchase more cheaply." },
    { q: "What is the biggest mistake in a W2 versus C2C comparison?", a: "Using 2,080 billable hours and ignoring benefits, nonbillable time, business expenses, payment delays, and contract gaps. That turns a business forecast into a headline-rate comparison." },
  ],
  methodology: [
    "This comparison framework treats W2 employment and C2C contracting as two cash-flow systems. It annualizes expected cash compensation, adds usable employer-paid benefits, models paid and unpaid time, and subtracts incremental business costs from contract revenue. Taxes are a separate layer because household facts and entity treatment vary.",
    "The framework does not determine worker classification or recommend an entity. It follows the IRS emphasis on behavioral control, financial control, and the relationship of the parties, and it treats contract labels as evidence rather than a final answer.",
  ],
  sources: [
    { name: "IRS: Independent contractor defined", href: "https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-defined", note: "Control, reporting, and self-employment overview" },
    { name: "IRS Topic 762: Independent contractor vs. employee", href: "https://www.irs.gov/taxtopics/tc762", note: "Behavioral control, financial control, and relationship factors" },
    { name: "IRS: Self-employed individuals tax center", href: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center", note: "Federal filing and estimated-tax responsibilities" },
  ],
};

export const metadata = createMetadata({
  title: content.metaTitle,
  description: content.description,
  path: content.path,
});

export default function Page() {
  return <ContractorFinancePage content={content} />;
}
