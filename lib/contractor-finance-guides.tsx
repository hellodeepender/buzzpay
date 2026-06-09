import Link from "next/link";
import type { ReactNode } from "react";
import type { SourceItem } from "@/components/CalculatorTrust";
import type { GuideArticle, GuideRelatedLink } from "@/components/GuideArticlePage";

const calculatorLinks: Record<string, GuideRelatedLink> = {
  w2VsC2c: {
    href: "/w2-vs-c2c",
    label: "W2 vs C2C calculator",
    description: "Compare a W2 offer with a contractor contract using the same planning assumptions.",
  },
  contractorRate: {
    href: "/contractor-rate-calculator",
    label: "Contractor rate calculator",
    description: "Turn compensation goals into a practical billing rate.",
  },
  sCorpSavings: {
    href: "/s-corp-savings-calculator",
    label: "S-Corp savings calculator",
    description: "Estimate whether payroll and compliance costs still leave meaningful savings.",
  },
  llcVsSCorp: {
    href: "/llc-vs-s-corp",
    label: "LLC vs S-Corp",
    description: "Separate legal entity choice from federal tax treatment.",
  },
  tax1099: {
    href: "/1099-tax-calculator",
    label: "1099 tax calculator",
    description: "Estimate self-employment tax and income tax planning needs.",
  },
  contractorFinance: {
    href: "/contractor-finance",
    label: "Contractor Finance hub",
    description: "Start from the main hub if you want the full decision path.",
  },
} satisfies Record<string, GuideRelatedLink>;

const sources1099: SourceItem[] = [
  { name: "IRS: Self-employed individuals tax center", href: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center", note: "Federal filing and payment overview" },
  { name: "IRS Publication 334", href: "https://www.irs.gov/publications/p334", note: "Tax guide for small business" },
  { name: "IRS Publication 535", href: "https://www.irs.gov/publications/p535", note: "Business expenses guidance" },
];

const sourcesClassification: SourceItem[] = [
  { name: "IRS: Independent contractor defined", href: "https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-defined", note: "Worker status factors" },
  { name: "IRS Publication 15-A", href: "https://www.irs.gov/publications/p15a", note: "Employer's supplemental tax guide" },
  { name: "IRS Publication 1779", href: "https://www.irs.gov/forms-pubs/about-publication-1779", note: "Independent contractor or employee" },
];

const sourcesSCorp: SourceItem[] = [
  { name: "IRS: S corporation compensation issues", href: "https://www.irs.gov/businesses/small-businesses-self-employed/s-corporation-compensation-and-medical-insurance-issues", note: "Reasonable compensation guidance" },
  { name: "IRS Publication 542", href: "https://www.irs.gov/publications/p542", note: "Corporation tax basics" },
  { name: "IRS Publication 5891-A", href: "https://www.irs.gov/pub/irs-pdf/p5891a.pdf", note: "S corporation checklist" },
];

const sourcesLLC: SourceItem[] = [
  { name: "IRS Publication 3402", href: "https://www.irs.gov/publications/p3402", note: "Taxation of LLCs" },
  { name: "IRS: Business structures", href: "https://www.irs.gov/businesses/small-businesses-self-employed/business-structures", note: "Entity overview" },
  { name: "IRS: S corporations", href: "https://www.irs.gov/businesses/small-businesses-self-employed/s-corporations", note: "Election and filing overview" },
];

const sourcesExpenses: SourceItem[] = [
  { name: "IRS Publication 535", href: "https://www.irs.gov/publications/p535", note: "Business expense categories" },
  { name: "IRS Publication 463", href: "https://www.irs.gov/publications/p463", note: "Travel, gift, and vehicle records" },
  { name: "IRS: Deducting business expenses", href: "https://www.irs.gov/businesses/small-businesses-self-employed/deducting-business-expenses", note: "Deduction basics" },
];

function p(strings: TemplateStringsArray, ...values: ReactNode[]) {
  const out: ReactNode[] = [strings[0]];
  values.forEach((value, index) => {
    out.push(value, strings[index + 1]);
  });
  return <p>{out}</p>;
}

export type GuideArticleCard = {
  href: string;
  title: string;
  description: string;
};

export const guideArticleList = [
  { href: "/guides/w2-vs-c2c-which-pays-more", title: "W2 vs C2C: Which pays more?", description: "Compare compensation, benefits, tax reserves, and unpaid time before accepting an offer." },
  { href: "/guides/how-much-should-an-it-contractor-charge", title: "How much should an IT contractor charge?", description: "Build a practical rate from billable hours, benefits, overhead, and margin." },
  { href: "/guides/c2c-vs-1099-vs-w2", title: "C2C vs 1099 vs W2", description: "Understand the difference between worker status, tax form, and contract structure." },
  { href: "/guides/s-corp-tax-savings-for-contractors", title: "S-Corp tax savings for contractors", description: "See where S-Corp savings come from and when costs can overwhelm them." },
  { href: "/guides/contractor-business-expenses-checklist", title: "Contractor business expenses checklist", description: "Organize ordinary and necessary expenses before tax season catches up." },
  { href: "/guides/quarterly-taxes-for-1099-contractors", title: "Quarterly taxes for 1099 contractors", description: "Plan estimated payments and avoid surprise cash-flow problems." },
  { href: "/guides/llc-vs-s-corp-for-consultants", title: "LLC vs S-Corp for consultants", description: "Separate legal structure from federal tax treatment and compliance cost." },
  { href: "/guides/how-to-calculate-a-contractor-hourly-rate", title: "How to calculate a contractor hourly rate", description: "Turn target income into a usable billing rate with realistic utilization." },
  { href: "/guides/what-is-a-reasonable-s-corp-salary", title: "What is a reasonable S-Corp salary?", description: "Use market pay and role facts to support an owner wage assumption." },
  { href: "/guides/how-to-switch-from-w2-to-c2c", title: "How to switch from W2 to C2C", description: "Plan the move from employee compensation to a contractor engagement." },
] satisfies GuideArticleCard[];

const articles: Record<string, GuideArticle> = {
  "w2-vs-c2c-which-pays-more": {
    slug: "w2-vs-c2c-which-pays-more",
    path: "/guides/w2-vs-c2c-which-pays-more",
    title: "W2 vs C2C: Which pays more?",
    description: "A practical comparison of W2 compensation and C2C contracting, including benefits, downtime, taxes, and the tradeoff between higher rates and higher responsibility.",
    intro: "A C2C offer can look larger on paper because the client is paying the business rate instead of employee compensation. That does not automatically mean the contractor keeps more money. The real comparison is between the full W2 package and the contractor's net after taxes, unpaid time, benefits, and business costs.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "The comparison is not just salary versus hourly rate",
        paragraphs: [
          p`A W2 package usually includes salary plus some mix of benefits, paid time off, training time, employer payroll taxes, and sometimes retirement matching or health insurance support. A C2C offer shifts many of those responsibilities to the business owner, so the quoted rate should be high enough to cover the missing pieces. If you compare only salary against hourly billings, you ignore a big part of the package.`,
          p`That is why the right question is not "which label is higher?" It is "which arrangement leaves me better off after benefits, downtime, taxes, and business overhead?" The <Link href="/w2-vs-c2c" className="text-honeyDeep font-semibold">W2 vs C2C calculator</Link> helps you test that tradeoff with a consistent set of assumptions instead of guessing from a recruiter's headline number.`,
        ],
      },
      {
        heading: "Benefits and unpaid time change the math quickly",
        paragraphs: [
          p`A W2 job may include paid holidays, sick time, vacation, learning time, and benefits that you would otherwise pay for directly. A contractor often invoices only the days that are actually billable, while still spending time on proposals, admin, collections, travel, onboarding, and project transitions. That means the hourly rate has to absorb a lot of unpaid hours.`,
          p`The practical result is that a contractor with a much higher nominal rate can still land close to the employee package once those missing benefits are priced in. If a W2 offer comes with excellent health coverage and retirement support, the contractor rate needs to be even stronger to make the move worthwhile.`,
        ],
      },
      {
        heading: "Tax treatment matters, but it is not the whole story",
        paragraphs: [
          p`A contractor usually has to reserve money for self-employment tax, income tax, and business expenses. The tax rules can make the top line look attractive while the available cash is smaller than expected. That is why BuzzPay's calculators separate gross revenue from net planning amounts, instead of pretending the headline rate is take-home pay.`,
          p`Use the <Link href="/1099-tax-calculator" className="text-honeyDeep font-semibold">1099 tax calculator</Link> to estimate what part of contractor revenue must be set aside for taxes, then compare that reserve against the full W2 package. If the contractor side still wins after tax reserves and benefit replacement, the offer is probably genuinely stronger rather than just louder.`,
        ],
      },
      {
        heading: "What to watch before you say yes",
        paragraphs: [
          p`The biggest mistakes are pretending every hour is billable, undercounting benefits, and forgetting setup costs such as insurance, software, professional fees, or bookkeeping. A second mistake is treating the contract title as proof of classification. The facts of the working relationship matter more than the label on the agreement.`,
          p`When the details are messy, write down the offer in a side-by-side table. Put the W2 salary, benefits, commute, and stability next to the C2C rate, billable hours, expected downtime, and business costs. Then check the numbers again using the calculator so the decision is anchored in a consistent framework.`,
        ],
      },
      {
        heading: "A simple decision rule",
        paragraphs: [
          p`If the contractor rate barely beats the employee package after conservative assumptions, the offer is probably not enough unless you value flexibility or client exposure for other reasons. If the contractor rate leaves a healthy margin after taxes, downtime, and business expenses, then the move can make sense financially.`,
          p`Use the calculator first, then review the result in the context of your career plan. If the W2 job offers a better long-term fit, don't force a contractor label into the wrong role. If the C2C offer clearly wins, move on to the rate calculator and tax planner to tighten the rest of the plan.`,
        ],
      },
    ],
    faq: [
      { q: "Does a higher C2C rate always mean more money?", a: "No. You have to subtract unpaid time, taxes, benefits you must replace, and business overhead before you can compare take-home value fairly." },
      { q: "Should I convert a W2 salary to an hourly rate?", a: "Only as a starting point. A salary divided by 2,080 is usually too low for contractor pricing because it ignores downtime and nonbillable work." },
      { q: "Can the calculator tell me if I am an employee or contractor?", a: "No. It compares planning assumptions; worker classification depends on the real facts of the relationship and should be reviewed separately." },
      { q: "What should I do after I compare the offers?", a: "If the contractor offer still looks stronger, use the rate calculator and tax calculator to check whether the revenue level supports the move." },
    ],
    methodology: [
      <p key="m1">This guide compares a W2 package against a C2C engagement by combining compensation, benefits replacement, unpaid time, and tax reserve planning. The goal is not to define worker status; it is to compare the economics of two arrangements with visible assumptions.</p>,
      <p key="m2">If your facts change, the result changes. Re-run the calculator if the salary, contract rate, benefits, or billable hours move in a meaningful way.</p>,
    ],
    sources: sourcesClassification,
    relatedLinks: [calculatorLinks.w2VsC2c, calculatorLinks.contractorRate, calculatorLinks.tax1099, calculatorLinks.contractorFinance],
  },
  "how-much-should-an-it-contractor-charge": {
    slug: "how-much-should-an-it-contractor-charge",
    path: "/guides/how-much-should-an-it-contractor-charge",
    title: "How much should an IT contractor charge?",
    description: "A practical way to turn salary, benefits, overhead, nonbillable work, and margin into a defensible contractor rate for IT and software work.",
    intro: "The right contractor rate is not a guess and it is not salary divided by 2,080. It starts with the income the business needs, adds the cost of replacing employee benefits, and then divides by realistic billable capacity after admin, sales, and downtime are accounted for.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "Start with the annual revenue you need to support",
        paragraphs: [
          p`Before quoting a rate, decide what the business must produce in a year. That usually includes your target income, benefit replacement, software, insurance, professional services, equipment, and a cushion for slow months. The number should be business revenue, not the amount you want left after the tax return.`,
          p`If you only start with your old salary, you underprice the work. A former employee has had employer-paid payroll tax, training time, and benefits handled elsewhere. A contractor has to price those items directly, which is why the hourly rate can look much higher than a salary conversion.`,
        ],
      },
      {
        heading: "Billable hours matter more than total working hours",
        paragraphs: [
          p`An IT contractor may work forty or fifty hours a week but still invoice far fewer billable hours. Time goes to estimates, calls, onboarding, security setup, documentation, bug triage, follow-up, and the work that happens between client projects. The rate must be built on a realistic utilization assumption, not a perfect calendar.`,
          p`A healthy model usually separates billable hours from total labor. The <Link href="/contractor-rate-calculator" className="text-honeyDeep font-semibold">contractor rate calculator</Link> lets you set target take-home income, weekly billable hours, weeks worked, expenses, and tax assumptions so you can see how the rate moves when utilization drops.`,
        ],
      },
      {
        heading: "Benefits and overhead are not optional",
        paragraphs: [
          p`Health insurance, retirement savings, paid leave, continuing education, accounting, software subscriptions, and a reserve for equipment all belong in the rate. If you leave them out, the business can look profitable on a proposal but underperform in cash once the year is underway.`,
          p`IT contractors often need extra margin for cloud tools, security products, testing devices, and travel to client sites. Those are ordinary business costs, and they should be built into the rate before you decide whether a project is worthwhile.`,
        ],
      },
      {
        heading: "The market rate still matters",
        paragraphs: [
          p`A formula can tell you the lowest rate that works for your business. It cannot tell you whether a client will accept it. That is why market research matters. Compare your target against similar roles, seniority, industry, and whether the role is specialized, urgent, or on-site.`,
          p`If your number is far above market, you may need to reduce expenses, raise utilization, or narrow the scope of the work you are willing to take. If your number is far below market, you may be underpricing expertise that the market already values more highly.`,
        ],
      },
      {
        heading: "Use the result as a floor, not a sticker price",
        paragraphs: [
          p`The calculator should give you a floor: the rate you cannot afford to go below if you want the business to work. From there, client urgency, niche experience, contract complexity, and delivery risk may justify a higher number. The point is to start from economics, not vibes.`,
          p`When the rate is ready, compare it with the W2 vs C2C calculator and the tax estimator so you can tell whether a role should be treated as a contractor opportunity at all. If the offer only works by assuming perfect utilization, it is too thin to rely on.`,
        ],
      },
    ],
    faq: [
      { q: "Why not just divide my salary by 2,080?", a: "Because contractors do not invoice every working hour and they pay business costs directly. A 2,080 conversion misses downtime and expenses." },
      { q: "What billable hours should I use?", a: "Use a conservative estimate based on real client work, not the total hours you are willing to work. Nonbillable tasks still consume time." },
      { q: "Should I include benefits in the rate?", a: "Yes. If the business must replace employee benefits, those costs need to be part of the annual revenue target." },
      { q: "Can the calculator tell me what the market will pay?", a: "No. It tells you the minimum sustainable rate. Market acceptance still depends on niche, experience, urgency, and location." },
    ],
    methodology: [
      <p key="m1">The rate estimate is built from target annual revenue divided by billable capacity, with explicit additions for expenses and tax reserves. That keeps the output tied to business reality instead of a rough salary conversion.</p>,
      <p key="m2">If utilization or expense assumptions change, the rate changes. Revisit the calculation whenever client mix, benefits, or overhead materially shift.</p>,
    ],
    sources: sourcesExpenses,
    relatedLinks: [calculatorLinks.contractorRate, calculatorLinks.w2VsC2c, calculatorLinks.tax1099, calculatorLinks.contractorFinance],
  },
  "c2c-vs-1099-vs-w2": {
    slug: "c2c-vs-1099-vs-w2",
    path: "/guides/c2c-vs-1099-vs-w2",
    title: "C2C vs 1099 vs W2",
    description: "Understand the difference between worker classification, tax forms, and contract structure before you compare offers or entity choices.",
    intro: "These three labels are often used as if they mean the same thing, but they do not. W2 describes employee compensation, 1099 is an information-reporting form, and C2C describes a business-to-business contract structure. Confusing them creates bad comparisons.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "Each term answers a different question",
        paragraphs: [
          p`W2 tells you the worker is treated as an employee for payroll purposes. 1099 tells you that income may have been reported to the IRS as nonemployee compensation or another reportable payment. C2C tells you the work is being purchased from a business rather than directly from a person as an employee. The labels overlap in casual conversation, but they are not interchangeable.`,
          p`A contractor can receive a 1099 and still work through an LLC or corporation. A worker can do business with a client under a C2C contract and still need to think about tax forms, business records, and estimated payments. A W2 employee can have no 1099 at all and still need to understand how much of their compensation is truly comparable to a contract rate.`,
        ],
      },
      {
        heading: "Why the distinction matters financially",
        paragraphs: [
          p`An employee package may include payroll withholding, benefits, and paid time off. A 1099 contractor has to manage taxes and business expenses directly. A C2C arrangement shifts even more responsibility to the business side, which can make the headline rate higher while also pushing compliance and admin onto the contractor.`,
          p`When you compare offers, do not use the tax form as a proxy for quality. Use the total economics: pay, downtime, benefits, equipment, business expense burden, and the likelihood that the arrangement is truly independent. The <Link href="/w2-vs-c2c" className="text-honeyDeep font-semibold">W2 vs C2C calculator</Link> and the <Link href="/1099-tax-calculator" className="text-honeyDeep font-semibold">1099 tax calculator</Link> are meant to be used together, not separately.`,
        ],
      },
      {
        heading: "The contract label does not control worker status",
        paragraphs: [
          p`The words on the agreement matter less than the facts of the relationship. Control, independence, financial risk, and the nature of the work are the real issues. A contract can say C2C and still describe a relationship that looks like employment if the client controls the work too tightly.`,
          p`That is why BuzzPay treats classification questions as planning questions, not legal conclusions. If the facts are uncertain, use the calculator to understand the economics of the offer, then ask a qualified professional whether the structure matches the real relationship.`,
        ],
      },
      {
        heading: "Practical ways to compare the options",
        paragraphs: [
          p`Write down the offer in three columns: W2, 1099, and C2C. Include compensation, benefits, downtime, taxes, and business overhead. That simple table makes it obvious when a contract is actually weaker than the employee package or when the contractor rate is comfortably higher.`,
          p`If the work is clearly independent and the rate survives taxes and overhead, use the contractor-rate calculator to see whether the business can support the required revenue. If the work is mostly controlled by the client, a contractor label may not be the right fit even if the pay sounds attractive.`,
        ],
      },
      {
        heading: "Keep the concepts separate when you plan",
        paragraphs: [
          p`W2, 1099, and C2C are not a ladder of quality. They are different tools for different working relationships. The right decision depends on your control, your business setup, the client's expectations, and the economics of the engagement.`,
          p`If you remember only one thing, remember this: the tax form is not the business model. Start with the relationship, then the contract, then the tax planning. That order keeps you from making a classification decision before you have the right facts.`,
        ],
      },
    ],
    faq: [
      { q: "Is 1099 the same as C2C?", a: "No. 1099 is a tax reporting form; C2C describes a business-to-business contract. They can overlap, but they are not the same thing." },
      { q: "Does C2C guarantee I am an independent contractor?", a: "No. Classification depends on the actual facts and degree of control, not just the label in the contract." },
      { q: "Can an LLC still receive a 1099?", a: "Yes. The tax form and the legal entity are different concepts, and businesses can receive 1099s in many situations." },
      { q: "Which calculator should I use first?", a: "Start with W2 vs C2C if you are comparing an offer, then use the 1099 tax calculator and contractor-rate calculator to refine the numbers." },
    ],
    methodology: [
      <p key="m1">This guide treats the label, the tax form, and the working relationship as separate variables. That reduces the chance of confusing tax reporting with worker classification or contract structure.</p>,
      <p key="m2">The calculator links let you move from concept to estimate without skipping the legal and financial distinctions that matter in practice.</p>,
    ],
    sources: sourcesClassification,
    relatedLinks: [calculatorLinks.w2VsC2c, calculatorLinks.tax1099, calculatorLinks.contractorRate, calculatorLinks.contractorFinance],
  },
  "s-corp-tax-savings-for-contractors": {
    slug: "s-corp-tax-savings-for-contractors",
    path: "/guides/s-corp-tax-savings-for-contractors",
    title: "S-Corp tax savings for contractors",
    description: "How S-Corp savings are created, why the savings can shrink after payroll and compliance costs, and when the election is worth studying.",
    intro: "S-Corp planning is often sold as a tax trick, but the real decision is more boring and more useful. You are comparing extra compliance and payroll costs against a possible reduction in employment tax on part of the business profit. The gap only matters if it survives all the added cost.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "Where the savings actually come from",
        paragraphs: [
          p`The basic idea is that an owner who actively works in the business pays themselves reasonable compensation through payroll and may take remaining profit as distributions. That can change the mix of income subject to employment taxes. The savings are not automatic and they are not the same for every business because the owner wage has to be supportable.`,
          p`The <Link href="/s-corp-savings-calculator" className="text-honeyDeep font-semibold">S-Corp savings calculator</Link> is built to show the moving parts separately: owner salary, payroll costs, business profit, compliance costs, and the result after those items are included. If the gross tax advantage disappears once costs are added, the election is probably not attractive yet.`,
        ],
      },
      {
        heading: "Reasonable compensation is the guardrail",
        paragraphs: [
          p`There is no universal salary threshold that works for every contractor. Reasonable compensation depends on the owner's role, the work performed, experience, hours, local market pay, and how much of the revenue is generated by the owner rather than a broader team. The point is not to pick the smallest possible wage; it is to support a defensible wage that matches the facts.`,
          p`If the salary assumption is too low, the savings estimate is usually too optimistic. A useful planning exercise should look at multiple salary scenarios and ask whether the business still has a real advantage after payroll taxes, bookkeeping, separate returns, and state costs.`,
        ],
      },
      {
        heading: "Costs that can erase the headline benefit",
        paragraphs: [
          p`Payroll software, payroll filings, tax deposits, bookkeeping, annual return prep, entity maintenance, and state-level costs all belong in the analysis. Some owners also need help with health insurance administration, accountable plans, retirement design, or workers' compensation review. Those items do not always show up in quick online comparisons, but they matter in real life.`,
          p`The election is easiest to justify when profit is stable, the business is already organized, and the owner has enough margin that the added admin still leaves a comfortable net benefit. If the profit is sporadic or small, the overhead can absorb the tax savings before you ever see them.`,
        ],
      },
      {
        heading: "When the savings story is strongest",
        paragraphs: [
          p`The best fit is usually an established business with consistent service income, meaningful profit, and an owner who can support a reasonable salary without stretching the facts. Contractors in that situation often benefit from seeing the election as a net after-cost comparison rather than a tax-rate comparison.`,
          p`Use the calculator to identify the break-even point. If the savings are still strong after conservative estimates for payroll and compliance, the election may deserve a professional review. If the margin is thin, the tax status may be more effort than benefit at this stage.`,
        ],
      },
      {
        heading: "Treat the calculator as a screening tool",
        paragraphs: [
          p`A screening tool is useful because it keeps weak ideas from taking up your time. If the output says the savings are small or fragile, that is information. It does not mean the election is impossible; it means the next step is to verify facts before you spend money on setup.`,
          p`If the result looks strong, that is still not the end of the process. Review the assumptions with a CPA or tax professional and make sure the salary, state rules, and compliance costs are all real. The tool is designed to sharpen the question, not answer it for you.`,
        ],
      },
    ],
    faq: [
      { q: "Do S-Corp elections always save tax?", a: "No. Once payroll, compliance, and other costs are included, the net benefit can be small or disappear entirely." },
      { q: "What salary should I use?", a: "Use a salary that is supportable by the owner's role and market pay. Do not choose the lowest number just to maximize distributions." },
      { q: "Should a new contractor elect S-Corp status immediately?", a: "Usually not without a review. Stable profit and a defensible salary matter more than a quick tax win." },
      { q: "What should I do after the calculator?", a: "Use the result as a screening step, then review the facts with a qualified tax professional before making the election." },
    ],
    methodology: [
      <p key="m1">The savings estimate compares gross tax savings against payroll, compliance, and filing costs so the result reflects the net effect of the election rather than a theoretical tax-rate advantage.</p>,
      <p key="m2">The model is intentionally conservative. If assumptions move, especially salary support or business profit, the savings can shift quickly.</p>,
    ],
    sources: sourcesSCorp,
    relatedLinks: [calculatorLinks.sCorpSavings, calculatorLinks.contractorRate, calculatorLinks.llcVsSCorp, calculatorLinks.contractorFinance],
  },
  "contractor-business-expenses-checklist": {
    slug: "contractor-business-expenses-checklist",
    path: "/guides/contractor-business-expenses-checklist",
    title: "Contractor business expenses checklist",
    description: "A practical expense checklist for contractors who want cleaner books, better tax estimates, and fewer surprises at year end.",
    intro: "A good contractor expense system is less about tax hacks and more about consistency. You want to separate business and personal spending, document ordinary costs, and make quarterly tax estimates from numbers you can defend later.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "Start with the expense categories you can actually track",
        paragraphs: [
          p`Most contractor businesses have a core set of recurring costs: software, professional services, internet or phone, office supplies, equipment, travel, insurance, education, banking fees, and contractor-specific tools. The point of a checklist is to make sure those items get recorded the same way every month instead of being guessed at in April.`,
          p`The IRS cares about ordinary and necessary expenses, but your own books need to be more specific than that. If you know where the money goes, you can produce a better tax estimate, a better rate, and a more realistic profit view. That is why the <Link href="/1099-tax-calculator" className="text-honeyDeep font-semibold">1099 tax calculator</Link> is so much more useful when the expense side is already organized.`,
        ],
      },
      {
        heading: "Keep business and personal activity separate",
        paragraphs: [
          p`Use a business bank account and, if possible, a business card for recurring expenses. That makes it easier to spot deductible purchases and easier to explain why a payment exists if you ever need to review the records. Mixing everything into one account makes the year-end clean-up unnecessarily expensive.`,
          p`If you reimburse yourself or move money between accounts, label the transfer clearly. The goal is not perfect bookkeeping jargon; it is a paper trail that lets you see what was a business cost, what was an owner draw, and what was tax reserve cash you moved out of the way on purpose.`,
        ],
      },
      {
        heading: "Document the costs that are easy to forget",
        paragraphs: [
          p`Small recurring costs add up: cloud tools, mobile apps, domain names, payment processing, printer supplies, mileage, parking, coworking space, shipping, and the occasional contractor-specific professional membership. Those purchases are easy to miss because each one feels minor. Together, they can materially change the rate you need to charge.`,
          p`Insurance and professional help also belong in the checklist. If the business needs liability coverage, accounting help, or legal review, those are not optional extras to be remembered after tax season. They are part of the real cost of operating the business.`,
        ],
      },
      {
        heading: "Use the checklist to improve estimates, not to stretch deductions",
        paragraphs: [
          p`A careful expense checklist improves planning because it reduces the gap between estimated profit and actual profit. That matters for estimated taxes, S-Corp analysis, and pricing. It should not be used to claim a business deduction for every cash outflow just because money left the account.`,
          p`A reliable rule of thumb is to only include costs you can explain and support with records. When an expense is partly personal and partly business, document the business share and keep the reason clear. The cleaner the categorization, the easier it is to compare different contractor scenarios later.`,
        ],
      },
      {
        heading: "Connect the checklist back to pricing and taxes",
        paragraphs: [
          p`A contractor rate is only as good as the assumptions behind the expense line. If software, insurance, travel, or professional help are omitted, the rate is too low. If every small spending category is inflated, the rate becomes hard to sell. The checklist is there to keep that balance honest.`,
          p`Once the expense categories are stable, run the contractor-rate calculator again and then use the quarterly tax planner to see how much cash should be reserved from revenue. That sequence keeps the bookkeeping work connected to the actual money decisions.`,
        ],
      },
    ],
    faq: [
      { q: "What expenses should every contractor track?", a: "Business software, phone or internet, professional services, insurance, equipment, travel, supplies, and payment fees are common starting points." },
      { q: "Should I deduct every business-related purchase?", a: "Only if it is an ordinary and necessary business expense you can support with records and a reasonable business purpose." },
      { q: "Why does expense tracking matter for rate setting?", a: "Because every recurring expense reduces the amount left to pay the owner, taxes, and profit." },
      { q: "Can this checklist replace bookkeeping software?", a: "No. It helps you organize the categories, but software or a bookkeeper is still useful for keeping the records current." },
    ],
    methodology: [
      <p key="m1">The checklist focuses on recurring, supportable business categories that affect profit, estimated taxes, and pricing decisions. It is designed to improve recordkeeping discipline rather than maximize deductions.</p>,
      <p key="m2">Use the checklist monthly. Waiting until year-end makes it harder to separate ordinary business costs from personal spending.</p>,
    ],
    sources: sourcesExpenses,
    relatedLinks: [calculatorLinks.tax1099, calculatorLinks.contractorRate, calculatorLinks.sCorpSavings, calculatorLinks.contractorFinance],
  },
  "quarterly-taxes-for-1099-contractors": {
    slug: "quarterly-taxes-for-1099-contractors",
    path: "/guides/quarterly-taxes-for-1099-contractors",
    title: "Quarterly taxes for 1099 contractors",
    description: "How contractors can estimate quarterly taxes, reserve cash, and avoid the common cash-flow mistakes that show up at year end.",
    intro: "Quarterly taxes are not a penalty for being self-employed. They are a cash-management problem. If you earn income without enough withholding, you need a habit for moving money into a tax reserve before you spend it on operations or personal expenses.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "Start with net profit, not gross deposits",
        paragraphs: [
          p`A contractor's bank account can be full while the tax reserve is empty. Gross deposits are not the same as taxable profit, and payment-platform transfers can include fees, refunds, or amounts that do not belong in the final income number. Start with the books, not the balance.`,
          p`The <Link href="/1099-tax-calculator" className="text-honeyDeep font-semibold">1099 tax calculator</Link> helps estimate the federal side of the obligation from net business profit and household assumptions. That gives you a better planning number than pulling a percentage out of thin air based on revenue alone.`,
        ],
      },
      {
        heading: "Build a reserve habit instead of a quarterly panic",
        paragraphs: [
          p`The easiest system is simple: when income arrives, move a fixed share into a separate tax reserve account. The percentage depends on your income, deductions, filing status, and whether you also owe self-employment tax or state tax, but the habit matters more than the exact transfer date.`,
          p`If you wait until the estimated payment deadline to see whether you can afford the bill, the reserve has already failed. A weekly or monthly transfer is easier to manage because it spreads the burden out and makes the tax money feel unavailable for spending.`,
        ],
      },
      {
        heading: "Remember that taxes are a cash timing issue",
        paragraphs: [
          p`Quarterly payments do not make the tax smaller. They just spread the payment across the year. That is helpful because the business does not have to invent a giant lump sum later, but it also means owners must think about cash flow every time revenue is collected.`,
          p`The right reserve number is one that protects the business and still allows operations to continue. If you reserve too little, you create a year-end gap. If you reserve too much without checking the actual estimate, you can starve the business of working capital.`,
        ],
      },
      {
        heading: "Use the estimate as a planning tool, not a filing shortcut",
        paragraphs: [
          p`The calculator does not replace tax filing software or professional review. It gives you a planning estimate so you can transfer money early, avoid surprises, and stay consistent. The exact payment amount still depends on the full tax picture and the most current rules.`,
          p`If you are also comparing contractor structures or considering an S-Corp election, re-run the estimate after those assumptions change. A different business structure can change payroll, profit, and the amount that needs to be held back for taxes.`,
        ],
      },
      {
        heading: "Quarterly planning is part of a larger operating system",
        paragraphs: [
          p`A reliable contractor business has monthly bookkeeping, a tax reserve, and a rate that supports the actual cost of doing business. Quarterly tax planning is one part of that system, not a separate chore. It connects directly to pricing, entity choice, and cash discipline.`,
          p`If you want the full picture, pair the tax estimate with the contractor-rate calculator and the contractor business expenses checklist. Those tools help you see whether the business is really producing enough profit to support the tax reserve without surprise borrowing.`,
        ],
      },
    ],
    faq: [
      { q: "Do I pay quarterly taxes on gross revenue?", a: "Usually not. The estimate is based on net profit and household tax facts, not on every dollar that hits the bank account." },
      { q: "How should I set aside tax money?", a: "Move a fixed share into a separate reserve account as revenue arrives so the money is not spent accidentally." },
      { q: "Are quarterly payments optional?", a: "They can be required if withholding is not enough. The calculator is for planning, not for deciding legal filing requirements." },
      { q: "What should I do if my income changes mid-year?", a: "Re-run the estimate. A rate or profit change can move the reserve amount significantly." },
    ],
    methodology: [
      <p key="m1">The guide treats quarterly tax planning as a cash reserve problem built on estimated net profit and not as a filing trick. That makes it easier to connect taxes to the rest of the contractor business.</p>,
      <p key="m2">The estimate should be refreshed whenever profit, deductions, or withholding change enough to move the reserve materially.</p>,
    ],
    sources: sources1099,
    relatedLinks: [calculatorLinks.tax1099, calculatorLinks.contractorRate, calculatorLinks.contractorFinance, calculatorLinks.sCorpSavings],
  },
  "llc-vs-s-corp-for-consultants": {
    slug: "llc-vs-s-corp-for-consultants",
    path: "/guides/llc-vs-s-corp-for-consultants",
    title: "LLC vs S-Corp for consultants",
    description: "A consultant-focused explanation of how legal entity choice, federal tax status, compliance cost, and owner compensation fit together.",
    intro: "Consultants often ask whether they should 'switch from an LLC to an S-Corp' when the more precise question is whether the business should keep its legal entity and elect S-Corp tax treatment. Those are related decisions, but they are not the same one.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "LLC and S-Corp answer different questions",
        paragraphs: [
          p`An LLC is a legal entity under state law. S-Corp is a federal tax status that may be available to an eligible entity. A consultant can be an LLC taxed as a sole proprietorship, an LLC taxed as a partnership, or an LLC that has elected S treatment. That distinction is easy to miss when people use the terms casually.`,
          p`For planning purposes, BuzzPay treats the question as a stack: what legal structure fits the business, what tax status fits the profit level, and what compliance burden can the owner actually maintain? The <Link href="/llc-vs-s-corp" className="text-honeyDeep font-semibold">LLC vs S-Corp calculator</Link> helps you compare the tax side without pretending the legal side vanished.`,
        ],
      },
      {
        heading: "Consultants should weigh the admin load carefully",
        paragraphs: [
          p`A consultant business can be lean and simple or it can be fairly complex. If the work is high-margin but inconsistent, the extra admin of payroll and a separate tax return may be harder to justify. If the business has steady profit and the owner is already organized, the added structure may be manageable.`,
          p`The best comparison is not whether one structure is more "professional." It is whether the structure improves net after cost and gives the owner enough discipline to keep records, payroll, and distributions straight. A cheap election can become expensive if it forces cleanup later.`,
        ],
      },
      {
        heading: "The election makes more sense when profit is stable",
        paragraphs: [
          p`S-Corp planning usually becomes more interesting once the business has recurring profit that can support a reasonable salary and still leave enough left over to absorb payroll and compliance costs. For consultants who have one or two large clients but very uneven revenue, stability matters as much as total profit.`,
          p`If the consultant is still building a book of business, the LLC default is often easier to manage. Once the business has enough profit and operational maturity, the calculator can show whether the election meaningfully improves the after-cost result.`,
        ],
      },
      {
        heading: "Don't use entity choice to fix a pricing problem",
        paragraphs: [
          p`An underpriced consulting business does not become healthy because it elected S-Corp taxation. If the rate is too low, the owner still has to find enough cash for taxes, payroll, software, insurance, and future growth. Entity choice can improve the split of profit; it cannot create missing revenue.`,
          p`That is why the consulting rate calculator is a useful companion tool. It tells you whether the business is producing enough revenue to support the entity decision in the first place. If the rate is weak, solve pricing first and entity choice second.`,
        ],
      },
      {
        heading: "Use the result as a review agenda",
        paragraphs: [
          p`The calculator output should tell you whether the gap between LLC treatment and S-Corp treatment is large enough to care about after payroll and compliance costs. If it is, review the facts with a tax professional and verify that your salary assumption is supportable.`,
          p`If the gap is small, keep the business simple until the economics change. Sometimes the right answer is to stay an LLC for now and revisit the election later when profit and processes are more mature.`,
        ],
      },
    ],
    faq: [
      { q: "Is an LLC the same thing as an S-Corp?", a: "No. An LLC is a legal structure; S-Corp is a federal tax status that may be elected if the business is eligible." },
      { q: "Should every consultant elect S-Corp status?", a: "No. Payroll, filing, bookkeeping, and state costs can eat into the tax benefit if profit is not high or stable enough." },
      { q: "Can I keep my LLC and still elect S-Corp taxation?", a: "Often yes, if the business is eligible. The legal entity and tax election are separate concepts." },
      { q: "What should I compare first?", a: "Compare LLC treatment against S-Corp treatment after you have enough stable profit and a supportable salary assumption." },
    ],
    methodology: [
      <p key="m1">The guide separates legal entity choice from federal tax treatment so the comparison remains accurate and practical for consultants. That avoids the common mistake of treating the election as a replacement for business planning.</p>,
      <p key="m2">Use the calculator after you have a stable profit estimate and a salary assumption that matches the role the owner actually performs.</p>,
    ],
    sources: sourcesLLC,
    relatedLinks: [calculatorLinks.llcVsSCorp, calculatorLinks.sCorpSavings, calculatorLinks.contractorRate, calculatorLinks.contractorFinance],
  },
  "how-to-calculate-a-contractor-hourly-rate": {
    slug: "how-to-calculate-a-contractor-hourly-rate",
    path: "/guides/how-to-calculate-a-contractor-hourly-rate",
    title: "How to calculate a contractor hourly rate",
    description: "A step-by-step explanation of how to turn income goals, expenses, and billable hours into a contractor hourly rate that can actually support the business.",
    intro: "Hourly pricing sounds simple until you realize that not every working hour can be billed. A contractor rate has to cover the time spent working, the time spent waiting, and the time the business spends on everything except the client invoice.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "Define the annual business target first",
        paragraphs: [
          p`Start with the amount the business needs to support the owner and the operating costs for a year. Add target take-home pay, benefits replacement, software, insurance, professional services, equipment, and a reserve for slow periods. That creates the annual business target the rate must support.`,
          p`Then divide that target by realistic billable capacity instead of by total calendar hours. A contractor who works forty hours a week still might only invoice twenty-five to thirty hours once admin and nonbillable time are included. That difference is the reason the rate has to be higher than a salary conversion.`,
        ],
      },
      {
        heading: "Track the difference between working time and billed time",
        paragraphs: [
          p`The biggest rate-setting mistake is assuming every hour in the week can be sold. In reality, contractors spend time on client calls, estimates, bookkeeping, sales, follow-up, travel, setup, learning, and project churn. Those hours are real labor, but they do not all show up on an invoice.`,
          p`The <Link href="/contractor-rate-calculator" className="text-honeyDeep font-semibold">contractor rate calculator</Link> is designed to make that gap visible. Set your target income, weekly billable hours, weeks worked, and expenses, and the tool shows how the hourly rate rises when utilization falls or overhead increases.`,
        ],
      },
      {
        heading: "Add business costs before you set the number",
        paragraphs: [
          p`Recurring software, insurance, phone, travel, professional help, equipment replacement, and banking fees all belong in the rate. If the business uses specialized software or tooling, that cost should be recovered in the pricing model instead of being absorbed as an afterthought.`,
          p`A rate that looks good on a napkin can fail as soon as one or two expenses are added back into the equation. That is why contractors need both an expense checklist and a rate calculator: one tells you what the business costs, the other tells you what the market has to support.`,
        ],
      },
      {
        heading: "Check the rate against the market",
        paragraphs: [
          p`Once you have a floor, compare it to what similar contractors charge. Market data helps you decide whether your plan is realistic or whether you need to adjust the scope, niche, or utilization assumption. A rate that is far above the market can still work if your niche is rare or urgent, but it should be a deliberate choice.`,
          p`If the market is lower than your calculated floor, you may need to find higher-value work, increase utilization, or reduce expenses. The calculator is not there to make the market obey your model; it is there to show whether your model is workable.`,
        ],
      },
      {
        heading: "Use the hourly rate as a decision tool",
        paragraphs: [
          p`The result is most useful when you treat it as a decision threshold. If a client is far below the floor, the work is probably not a fit unless it offers exceptional strategic value. If the work is comfortably above the floor, you can spend less time second-guessing the quote.`,
          p`For offer comparisons, combine this guide with the W2 vs C2C calculator and the tax calculator. That lets you see whether a job is underpriced, borderline, or clearly workable after taxes and business overhead are included.`,
        ],
      },
    ],
    faq: [
      { q: "Why is my hourly rate much higher than my old salary divided by 2,080?", a: "Because only a fraction of your time is billable and the business has to pay for taxes, benefits, and overhead directly." },
      { q: "What if I do not know my billable hours yet?", a: "Use a conservative estimate and test a few scenarios. Understating nonbillable time usually makes the rate too low." },
      { q: "Should I include profit in the rate?", a: "Yes. A contractor business needs more than break-even cash if it is going to stay healthy." },
      { q: "What calculator should I use with this guide?", a: "Use the contractor-rate calculator first, then pair it with the 1099 tax calculator and W2 vs C2C calculator." },
    ],
    methodology: [
      <p key="m1">The rate formula begins with annual business need, then divides by billable capacity, so the result reflects the real economics of a contractor business instead of a converted salary.</p>,
      <p key="m2">Recalculate whenever billable hours, expenses, or annual revenue needs change materially.</p>,
    ],
    sources: sourcesExpenses,
    relatedLinks: [calculatorLinks.contractorRate, calculatorLinks.tax1099, calculatorLinks.w2VsC2c, calculatorLinks.contractorFinance],
  },
  "what-is-a-reasonable-s-corp-salary": {
    slug: "what-is-a-reasonable-s-corp-salary",
    path: "/guides/what-is-a-reasonable-s-corp-salary",
    title: "What is a reasonable S-Corp salary?",
    description: "A practical guide to supportable owner wages, why the number matters, and how to think about reasonable compensation before electing S-Corp status.",
    intro: "Reasonable compensation is the core guardrail in S-Corp planning. If the salary assumption is too low, the savings estimate becomes unrealistic; if it is too high, the tax benefit shrinks. The point is to support a wage that fits the owner's role and the business facts.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "Reasonable salary is fact-based, not arbitrary",
        paragraphs: [
          p`There is no universal table that says every S-Corp owner should pay themselves the same salary. The analysis depends on what the owner actually does, how much time is spent performing services, what similar work pays in the market, and how much revenue the owner generates directly. A supportable salary reflects those facts.`,
          p`The <Link href="/s-corp-savings-calculator" className="text-honeyDeep font-semibold">S-Corp savings calculator</Link> lets you test multiple salary assumptions so you can see how sensitive the net savings are. That is more useful than choosing the smallest number that makes the tax benefit look dramatic.`,
        ],
      },
      {
        heading: "Use the owner's role, not the owner's preference",
        paragraphs: [
          p`An owner may want distributions, but the salary has to match the services the owner actually performs. If the owner is doing most of the client delivery, sales, project management, and business operations, the wage should reflect that labor. The salary is not a reward for choosing the election; it is a compensation estimate for work already being done.`,
          p`Comparable pay matters. The salary should be in the range that another business would pay for similar services, responsibilities, and experience. If the assumed salary feels implausibly low relative to the role, the estimate probably needs to be revisited before any election is made.`,
        ],
      },
      {
        heading: "The salary affects both savings and risk",
        paragraphs: [
          p`A lower salary can increase the distribution portion of profit, but it also increases the risk that the election is not supported. A higher salary reduces that risk but can shrink the tax advantage. That is why the right number is a balance rather than an optimization exercise.`,
          p`When the profit is modest, the salary question becomes even more important because there may not be enough remaining profit to justify the extra payroll and filing costs. The calculator helps you see where the savings disappear as the salary assumption changes.`,
        ],
      },
      {
        heading: "Use market evidence and documentation",
        paragraphs: [
          p`A practical salary review should include comparable wages, a written explanation of duties, time spent on the business, and why the chosen amount is a reasonable estimate. Good documentation matters because the number should be explainable later, not just convenient today.`,
          p`If you are not sure where to land, start with a range instead of a single number. Test a conservative, middle, and strong salary assumption so you can see how robust the S-Corp case really is. That approach is more honest than locking in one optimistic assumption.`,
        ],
      },
      {
        heading: "The salary question belongs in a broader review",
        paragraphs: [
          p`The right salary estimate is only one piece of the S-Corp decision. You still need to compare payroll cost, bookkeeping, filing cost, state obligations, and the owner's actual profit level. A reasonable salary that destroys the savings is still not a good election.`,
          p`If the business is still growing, the best answer may be to wait and revisit the issue later. The guide exists to help you support the number, not to force an election before the business is ready.`,
        ],
      },
    ],
    faq: [
      { q: "Is there a universal reasonable salary?", a: "No. It depends on the owner's role, market pay, time spent on services, and business facts." },
      { q: "Can I pick a low salary to maximize savings?", a: "Not responsibly. The salary has to be supportable, not optimized to the point of ignoring the actual work performed." },
      { q: "What should I document?", a: "Document duties, market comparisons, time spent, and why the chosen amount is a reasonable estimate." },
      { q: "Which calculator should I use?", a: "Use the S-Corp savings calculator after you have a defensible salary range to test." },
    ],
    methodology: [
      <p key="m1">The salary guidance is framed as a supportability problem rather than a tax trick. That keeps the estimate tied to the work the owner actually performs.</p>,
      <p key="m2">If the role or workload changes, the salary assumption should be reviewed again before relying on the savings estimate.</p>,
    ],
    sources: sourcesSCorp,
    relatedLinks: [calculatorLinks.sCorpSavings, calculatorLinks.contractorRate, calculatorLinks.llcVsSCorp, calculatorLinks.contractorFinance],
  },
  "how-to-switch-from-w2-to-c2c": {
    slug: "how-to-switch-from-w2-to-c2c",
    path: "/guides/how-to-switch-from-w2-to-c2c",
    title: "How to switch from W2 to C2C",
    description: "A practical transition plan for moving from employee compensation to contractor work without skipping the rate, tax, and business setup steps.",
    intro: "Switching from W2 to C2C is more than changing who sends the paycheck. The move affects classification, pricing, tax reserves, contracts, insurance, billing habits, and the amount of time you spend running the business instead of simply doing the work.",
    datePublished: "2026-06-09",
    lastReviewed: "2026-06-09",
    sections: [
      {
        heading: "Start with the offer, not the entity",
        paragraphs: [
          p`When a client asks you to switch to C2C, the first question is whether the work really looks independent and whether the rate supports the added responsibilities. Do not begin by filing paperwork. Begin by comparing the full package against the W2 alternative and make sure the business side is actually better.`,
          p`Use the <Link href="/w2-vs-c2c" className="text-honeyDeep font-semibold">W2 vs C2C calculator</Link> to compare the package before you change anything else. If the C2C rate does not comfortably beat the employee package after taxes and benefits replacement, the move may not be worth the disruption.`,
        ],
      },
      {
        heading: "Decide how the business will operate",
        paragraphs: [
          p`A contractor needs a business bank account, a way to invoice, a way to track expenses, and a plan for tax reserves. If the work requires insurance, a professional email address, a contract, or a specific legal entity, that should all be set up before the first invoice goes out.`,
          p`The business should also know what kind of records it will keep. Even a simple solo operation needs enough organization to track revenue, expenses, and any payments that belong in a quarterly tax reserve. Good setup makes the transition feel routine rather than chaotic.`,
        ],
      },
      {
        heading: "Set a rate that reflects contractor reality",
        paragraphs: [
          p`The old salary is a reference point, not the answer. The contractor rate has to cover nonbillable time, taxes, benefits replacement, and business costs. Use the rate calculator to see what it takes for the business to stay healthy, then compare that number to what the client is actually offering.`,
          p`If the rate is too low, ask for a better number before making the switch. The cleanest transition is the one where the business already knows how it will stay profitable after the change, not the one where the owner hopes to figure it out later.`,
        ],
      },
      {
        heading: "Prepare the tax and admin side in advance",
        paragraphs: [
          p`Before the first payment arrives, decide how much of each invoice should be transferred to a tax reserve, how expenses will be recorded, and whether estimated taxes will need to be paid quarterly. That reserve discipline is what keeps the transition from becoming a cash-flow problem.`,
          p`If the arrangement may eventually support an S-Corp election, do not rush there on day one. First make sure the revenue is stable enough, the books are clean enough, and the contract structure is actually sustainable as a business. The transition to C2C is the first step, not the final tax optimization step.`,
        ],
      },
      {
        heading: "Use the first few months as a review period",
        paragraphs: [
          p`A transition is a good time to review whether the rate is holding up, whether the workload is truly billable, and whether the tax reserve assumption was conservative enough. The first few months tell you whether the move was priced correctly or whether the business needs another adjustment.`,
          p`If the arrangement turns out to be a strong fit, the next step is to tighten bookkeeping, compare LLC and S-Corp treatment, and review the work relationship periodically. If it turns out to be thin or operationally messy, it is better to know that early than after a year of underpriced invoices.`,
        ],
      },
    ],
    faq: [
      { q: "Should I form an LLC before switching to C2C?", a: "Not always. First make sure the work truly fits a contractor model and that the economics justify the move." },
      { q: "Do I need a higher rate than my old salary?", a: "Usually yes, once taxes, benefits, nonbillable time, and business costs are included." },
      { q: "What should I set up first?", a: "A rate, a tax reserve plan, business banking, and a simple invoicing workflow are the basic starting points." },
      { q: "When should I consider S-Corp treatment?", a: "After the contract is stable, the profit is consistent, and the business can support reasonable compensation and added compliance cost." },
    ],
    methodology: [
      <p key="m1">The transition plan starts with classification and economics, then moves to business setup, tax reserves, and optional tax optimization later. That sequence reduces the chance of acting on the tax label before the rate is proven.</p>,
      <p key="m2">Use the linked calculators to re-check the plan after the first few invoices arrive. Real data is better than the launch assumption.</p>,
    ],
    sources: sourcesClassification,
    relatedLinks: [calculatorLinks.w2VsC2c, calculatorLinks.contractorRate, calculatorLinks.tax1099, calculatorLinks.contractorFinance],
  },
};

export function getGuideArticle(slug: string) {
  return articles[slug];
}

export type GuideArticleSlug = keyof typeof articles;
