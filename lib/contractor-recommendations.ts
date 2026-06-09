export const contractorRecommendationSections = [
  { id: "business-banking", label: "Business banking", summary: "Keep operating cash, tax reserves, and owner draw separate." },
  { id: "bookkeeping", label: "Bookkeeping", summary: "Track revenue, expenses, and tax reserves without mixing personal spending." },
  { id: "payroll", label: "Payroll", summary: "Handle wages, filings, and withholding when the structure calls for payroll." },
  { id: "cpa-tax-professional", label: "CPA / tax professional", summary: "Review eligibility, filing decisions, and tax consequences with a pro." },
  { id: "llc-s-corp-formation", label: "LLC / S-Corp formation", summary: "Compare formation services before filing when you need a legal entity." },
  { id: "contractor-insurance", label: "Contractor insurance", summary: "Protect the business against liability, errors, and contract risk." },
] as const;

export type ContractorRecommendationSectionId = (typeof contractorRecommendationSections)[number]["id"];

export type ContractorRecommendationItem = {
  name: string;
  category: ContractorRecommendationSectionId;
  description: string;
  bestFor: string;
  ctaLabel: string;
  href: string;
  isAffiliate: boolean;
  envVarName?: string;
  enabled: boolean;
};

export type ContractorRecommendationCategory = {
  id: ContractorRecommendationSectionId;
  label: string;
  summary: string;
  items: ContractorRecommendationItem[];
};

type RecommendationSource = {
  name: string;
  category: ContractorRecommendationSectionId;
  description: string;
  bestFor: string;
  ctaLabel: string;
  envVarName: string;
  fallbackHref: string;
};

const sources: RecommendationSource[] = [
  {
    name: "Business banking",
    category: "business-banking",
    description: "Separate client receipts, tax reserves, and operating cash with a business checking account and simple cash-management setup.",
    bestFor: "Contractors who want cleaner bookkeeping and a clearer tax-reserve habit.",
    ctaLabel: "Learn what to compare",
    envVarName: "AFFILIATE_BUSINESS_BANKING_URL",
    fallbackHref: "#business-banking",
  },
  {
    name: "Bookkeeping",
    category: "bookkeeping",
    description: "Track income, expenses, mileage, and estimated-tax reserves without turning a bank feed into a tax return.",
    bestFor: "Contractors who need a repeatable month-end close and clearer profit numbers.",
    ctaLabel: "Learn what to compare",
    envVarName: "AFFILIATE_BOOKKEEPING_URL",
    fallbackHref: "#bookkeeping",
  },
  {
    name: "Payroll",
    category: "payroll",
    description: "Handle payroll runs, wage reporting, and tax deposits when wages are part of the structure.",
    bestFor: "Owners who are ready to pay themselves or a team through a formal payroll system.",
    ctaLabel: "Learn what to compare",
    envVarName: "AFFILIATE_PAYROLL_URL",
    fallbackHref: "#payroll",
  },
  {
    name: "CPA / tax professional",
    category: "cpa-tax-professional",
    description: "Get a tax professional involved when reasonable compensation, filings, or entity choices need judgment.",
    bestFor: "People who want a second set of eyes on elections, filings, or year-end planning.",
    ctaLabel: "Learn what to compare",
    envVarName: "AFFILIATE_CPA_URL",
    fallbackHref: "#cpa-tax-professional",
  },
  {
    name: "LLC / S-Corp formation",
    category: "llc-s-corp-formation",
    description: "Compare formation services and filing help if you need a new legal entity or a federal tax election.",
    bestFor: "People who are still deciding whether to form, elect, or restructure.",
    ctaLabel: "Learn what to compare",
    envVarName: "AFFILIATE_FORMATION_URL",
    fallbackHref: "#llc-s-corp-formation",
  },
  {
    name: "Contractor insurance",
    category: "contractor-insurance",
    description: "Review liability, professional, and business-owner coverage before a contract or client demands it.",
    bestFor: "Contractors who need to manage liability and contract requirements more deliberately.",
    ctaLabel: "Learn what to compare",
    envVarName: "AFFILIATE_INSURANCE_URL",
    fallbackHref: "#contractor-insurance",
  },
];

export function buildContractorRecommendationCategories(): ContractorRecommendationCategory[] {
  return contractorRecommendationSections.map((section) => {
    const items = sources
      .filter((item) => item.category === section.id)
      .map((item) => {
        const resolvedHref = process.env[item.envVarName]?.trim() || item.fallbackHref;
        return {
          name: item.name,
          category: item.category,
          description: item.description,
          bestFor: item.bestFor,
          ctaLabel: item.ctaLabel,
          href: resolvedHref,
          isAffiliate: true,
          envVarName: item.envVarName,
          enabled: Boolean(process.env[item.envVarName]?.trim()),
        } satisfies ContractorRecommendationItem;
      });

    return {
      id: section.id,
      label: section.label,
      summary: section.summary,
      items,
    } satisfies ContractorRecommendationCategory;
  });
}

