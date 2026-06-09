export type AffiliateRedirectSlug =
  | "payroll"
  | "bookkeeping"
  | "formation"
  | "business-banking"
  | "cpa"
  | "insurance";

export type AffiliateRedirectConfig = {
  slug: AffiliateRedirectSlug;
  envVarName: string;
  fallbackPath: string;
  label: string;
};

export const affiliateRedirects: Record<AffiliateRedirectSlug, AffiliateRedirectConfig> = {
  payroll: {
    slug: "payroll",
    envVarName: "AFFILIATE_PAYROLL_URL",
    fallbackPath: "/contractor-finance#recommended-next-steps",
    label: "payroll",
  },
  bookkeeping: {
    slug: "bookkeeping",
    envVarName: "AFFILIATE_BOOKKEEPING_URL",
    fallbackPath: "/contractor-finance#recommended-next-steps",
    label: "bookkeeping",
  },
  formation: {
    slug: "formation",
    envVarName: "AFFILIATE_FORMATION_URL",
    fallbackPath: "/contractor-finance#recommended-next-steps",
    label: "formation",
  },
  "business-banking": {
    slug: "business-banking",
    envVarName: "AFFILIATE_BUSINESS_BANKING_URL",
    fallbackPath: "/contractor-finance#recommended-next-steps",
    label: "business banking",
  },
  cpa: {
    slug: "cpa",
    envVarName: "AFFILIATE_CPA_URL",
    fallbackPath: "/contractor-finance#recommended-next-steps",
    label: "CPA",
  },
  insurance: {
    slug: "insurance",
    envVarName: "AFFILIATE_INSURANCE_URL",
    fallbackPath: "/contractor-finance#recommended-next-steps",
    label: "insurance",
  },
};

export function getAffiliateRedirectConfig(slug: string) {
  return (affiliateRedirects as Record<string, AffiliateRedirectConfig | undefined>)[slug];
}

