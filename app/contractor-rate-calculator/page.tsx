import ContractorFinancePage from "@/components/ContractorFinancePage";
import type { ContractorPageContent } from "@/lib/contractor-finance";
import { createMetadata } from "@/lib/seo";

const content: ContractorPageContent = {
  path: "/contractor-rate-calculator",
  title: "Contractor Rate Calculator: Build a Sustainable Hourly Rate",
  metaTitle: "Contractor Rate Calculator: Salary to Hourly Rate",
  description: "Estimate a sustainable contractor hourly rate from salary goals, benefits, expenses, taxes, billable hours, unpaid time, and contract risk.",
  intro: "A sustainable contractor rate must fund compensation, benefits, overhead, nonbillable work, taxes, and gaps between contracts. Start with annual business economics, not a salary divided by 2,080.",
  toolTitle: "Contractor rate planning model",
  toolDescription: "Calculate a planning rate from annual cash needs, replacement benefits, expenses, tax reserve, and realistic billable capacity.",
  toolInputs: [
    "Target owner compensation and household cash goal",
    "Health coverage, retirement, insurance, and paid-time-off replacement",
    "Annual business overhead and one-time setup costs",
    "Realistic billable hours after administration and leave",
    "Tax reserve and entity-specific payroll costs",
    "Profit and contract-risk reserve",
  ],
  toolOutput: "a minimum hourly floor, target rate, day rate, and monthly revenue target with every assumption visible.",
  sections: [
    {
      heading: "Why salary divided by 2,080 is not a contractor rate",
      paragraphs: [
        "Dividing an annual salary by 2,080 estimates the hourly value of forty paid hours for fifty-two weeks. It does not estimate a business rate. Employees are commonly paid during holidays, vacation, internal meetings, training, and administrative time. Contractors often invoice only for approved client work, while still spending time on proposals, bookkeeping, collections, security, learning, and project transitions. The denominator must be realistic billable hours, not total calendar work hours.",
        "The numerator is also broader than salary. A contractor rate must finance the benefits and operating infrastructure that an employer once supplied. Health coverage, retirement savings, liability insurance, software, equipment, accounting, legal support, and unpaid leave all require revenue. A rate that replaces only gross salary can leave the contractor with less cash, fewer benefits, and more risk even when every scheduled hour is billed.",
      ],
    },
    {
      heading: "Define the annual revenue requirement",
      paragraphs: [
        "Begin with the compensation the business needs to support. This may be a target salary, owner draw, or household cash-flow goal depending on the entity and tax treatment, but keep personal compensation separate from business revenue. Add the annual cost of benefits you intend to replace, recurring business overhead, professional services, and a reserve for equipment or irregular expenses. Then add desired business profit rather than assuming the owner's labor is the only thing the rate should cover.",
        "Tax should be modeled carefully. Income tax depends on filing status, household income, deductions, credits, and jurisdiction. Employment-tax treatment depends on business structure and owner compensation. A planning model can include a tax reserve, but that reserve should be labeled as an estimate rather than presented as a universal tax rate. For pricing, the key question is how much revenue the business must collect before owner taxes while still paying its legitimate operating costs.",
      ],
      bullets: [
        "Target compensation for the owner's labor",
        "Replacement benefits and retirement funding",
        "Fixed and variable business expenses",
        "Professional fees, registrations, insurance, and payroll administration",
        "Profit for reinvestment and a reserve for volatility",
      ],
    },
    {
      heading: "Estimate billable capacity honestly",
      paragraphs: [
        "Billable capacity is the number of hours clients are expected to approve and pay for, not the number of hours the owner is willing to work. Start with working weeks, remove vacation and holidays, then estimate client hours per week after internal administration. Project-based contractors should convert expected project fees and delivery hours into an effective rate, including discovery, revisions, communication, and support that may not appear in the proposal.",
        "Utilization changes with the business model. A long embedded engagement may support more billable hours but create concentration risk. A consultant serving several clients may bill fewer hours because sales and context switching take more time, but may command a higher rate and reduce dependence on one buyer. A conservative model should also account for onboarding delays, procurement holds, and a gap between contracts rather than assuming immediate replacement work.",
      ],
    },
    {
      heading: "Use a floor, target, and premium rate",
      paragraphs: [
        "One number cannot describe every engagement. The minimum floor is the lowest rate that covers required revenue at expected utilization. It is useful for rejecting work that would operate at a loss, but it leaves little room for estimation error. The target rate adds a healthy operating margin and a realistic risk reserve. A premium rate applies when work is urgent, unusually specialized, short in duration, operationally disruptive, or carries material liability.",
        "Rate structure also matters. Hourly pricing protects against uncertain scope but can penalize efficiency. A day rate simplifies scheduling but should specify how many hours and what availability the day includes. Weekly and monthly retainers can stabilize revenue when scope and access are clearly defined. Fixed project pricing can reward expertise, but only when the estimated effective hourly rate remains above the business's target after revisions and project management are included.",
      ],
    },
    {
      heading: "Adjust for contract terms and collection risk",
      paragraphs: [
        "Two contracts with the same rate can produce different economics. Net-60 payment terms require the contractor to finance operations longer than net-15 terms. A cap on weekly hours limits revenue even if the contractor remains available. Unpaid onboarding, mandatory meetings, travel, background checks, or client-specific equipment reduce the effective rate. Termination rights and guaranteed minimum hours affect how confidently the contractor can plan.",
        "Review reimbursable expenses, overtime, travel time, currency, payment fees, late-payment remedies, and who bears the cost of rework. If an intermediary takes a margin, focus on the rate paid to the contractor's business and the obligations attached to it. Pricing should respond to the burden actually accepted, not to the client's internal bill rate or a generalized market average.",
      ],
    },
    {
      heading: "Validate the rate against cash flow and the market",
      paragraphs: [
        "A cost-based calculation establishes viability, but clients purchase outcomes and scarce capability rather than reimbursement of contractor expenses. After establishing the floor, compare the target with relevant market evidence: comparable roles, specialized experience, project complexity, industry, geography, security requirements, and the value of the result. If the market will not support the calculated floor, the answer may be a different service model, lower overhead, better utilization, or a different client segment—not quietly working below cost.",
        "Recalculate at least annually and whenever benefits, tax treatment, expenses, or utilization change. Track actual billed hours, write-offs, collection time, and project overruns. The best rate model becomes more accurate as the business replaces assumptions with operating data. Historical effective rate by client and project type is often more useful than a broad survey because it reveals where the business truly earns or loses money.",
      ],
    },
  ],
  examples: [
    {
      title: "Salary replacement with realistic utilization",
      body: "A professional wants to replace a $110,000 salary and meaningful employer benefits. Instead of dividing by 2,080, the professional adds benefit replacement, $12,000 of annual overhead, and a reserve, then divides by 1,300 expected billable hours. The resulting floor is materially higher than the employee hourly equivalent. A target rate above that floor provides room for a contract gap and imperfect collections.",
    },
    {
      title: "Fixed project converted to an effective rate",
      body: "A contractor quotes $18,000 for a project expected to require 160 delivery hours. Discovery, project management, revisions, and handoff add another 55 hours. The effective rate is therefore based on 215 hours, not 160. Comparing that figure with the target hourly rate shows whether the fixed fee rewards efficiency or merely hides unpaid work.",
    },
  ],
  faq: [
    { q: "How do I convert salary to a contractor hourly rate?", a: "Add the annual compensation, replacement benefits, business expenses, profit, and risk reserve the business needs, then divide by realistic annual billable hours. Do not divide salary alone by 2,080." },
    { q: "How many billable hours should a contractor assume?", a: "It depends on contract length and business model. Remove leave, holidays, administration, sales, training, and expected gaps. Use a conservative scenario as well as an expected scenario." },
    { q: "Should taxes be added directly to the hourly rate?", a: "Taxes affect the cash the owner retains, but the estimate depends on household and entity facts. Price first from required business revenue and costs, then model a clearly labeled tax reserve rather than applying an unexplained universal markup." },
    { q: "What is the difference between a minimum and target rate?", a: "The minimum floor covers modeled costs at expected utilization. The target includes operating margin and risk capacity. Work priced at the floor leaves little protection against delays or overruns." },
    { q: "Should short contracts have a higher rate?", a: "Often yes. Short work can create more sales, onboarding, and transition time per billed hour and may provide less revenue certainty. The premium should reflect those specific burdens." },
    { q: "Can business expenses lower the rate I need?", a: "No. Deductibility may reduce taxable income, but the business still pays the expense. Necessary expenses increase the revenue the business must earn unless they also improve utilization or pricing enough to offset their cost." },
  ],
  methodology: [
    "The calculator uses a revenue-requirement model: target take-home cash plus replacement benefits, operating expenses, and a profit or risk reserve. It grosses that amount up using the entered blended tax-reserve rate, then divides by realistic annual billable hours to produce an hourly planning floor.",
    "Examples intentionally avoid claiming a universal salary multiplier. The framework is designed to expose assumptions and support scenario testing rather than suggest that every contractor should charge the same premium.",
  ],
  sources: [
    { name: "IRS: Independent contractor defined", href: "https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-defined", note: "Independent-contractor status and tax overview" },
    { name: "IRS: Self-employed individuals tax center", href: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center", note: "Filing and estimated-tax responsibilities" },
    { name: "IRS Publication 535 archive and business expense guidance", href: "https://www.irs.gov/forms-pubs/about-publication-535", note: "Federal business-expense reference" },
  ],
};

export const metadata = createMetadata({ title: content.metaTitle, description: content.description, path: content.path });

export default function Page() {
  return <ContractorFinancePage content={content} />;
}
