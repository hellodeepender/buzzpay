export type SeoPageEntry = {
  path: string;
  title: string;
  source: string;
};

export const seoPages: SeoPageEntry[] = [
  { path: "/", title: "buzzpay — free tools to get paid", source: "app/page.tsx" },
  { path: "/contractor-finance", title: "Contractor Finance: Rates, Taxes, and Business Structure", source: "app/contractor-finance/page.tsx" },
  { path: "/w2-vs-c2c", title: "W2 vs C2C: Compare Compensation, Taxes, and Risk", source: "app/w2-vs-c2c/page.tsx" },
  { path: "/contractor-rate-calculator", title: "Contractor Rate Calculator: Build a Sustainable Hourly Rate", source: "app/contractor-rate-calculator/page.tsx" },
  { path: "/s-corp-savings-calculator", title: "S-Corp Savings Calculator: Estimate the Net Benefit", source: "app/s-corp-savings-calculator/page.tsx" },
  { path: "/llc-vs-s-corp", title: "LLC vs S-Corp: Compare Entity and Tax Choices", source: "app/llc-vs-s-corp/page.tsx" },
  { path: "/1099-tax-calculator", title: "1099 Tax Calculator: Estimate Quarterly Tax and Savings Needs", source: "app/1099-tax-calculator/page.tsx" },
  { path: "/payment-fee-calculator", title: "Payment Fee Calculator", source: "app/payment-fee-calculator/page.tsx" },
  { path: "/invoice-generator", title: "Invoice Generator", source: "app/invoice-generator/page.tsx" },
  { path: "/freelance-rate-calculator", title: "Freelance Rate Calculator", source: "app/freelance-rate-calculator/page.tsx" },
  { path: "/about", title: "About", source: "app/about/page.tsx" },
  { path: "/cookie-policy", title: "Cookie policy", source: "app/cookie-policy/page.tsx" },
  { path: "/affiliate-disclosure", title: "Affiliate disclosure", source: "app/affiliate-disclosure/page.tsx" },
  { path: "/privacy", title: "Privacy & affiliate disclosure", source: "app/privacy/page.tsx" },
  { path: "/guides/getting-paid-by-international-clients", title: "How to get paid by international clients", source: "app/guides/getting-paid-by-international-clients/page.tsx" },
  { path: "/guides/getting-clients-to-pay-on-time", title: "How to get clients to pay on time", source: "app/guides/getting-clients-to-pay-on-time/page.tsx" },
  { path: "/guides/w2-vs-c2c-which-pays-more", title: "W2 vs C2C: Which pays more?", source: "app/guides/w2-vs-c2c-which-pays-more/page.tsx" },
  { path: "/guides/how-much-should-an-it-contractor-charge", title: "How much should an IT contractor charge?", source: "app/guides/how-much-should-an-it-contractor-charge/page.tsx" },
  { path: "/guides/c2c-vs-1099-vs-w2", title: "C2C vs 1099 vs W2", source: "app/guides/c2c-vs-1099-vs-w2/page.tsx" },
  { path: "/guides/s-corp-tax-savings-for-contractors", title: "S-Corp tax savings for contractors", source: "app/guides/s-corp-tax-savings-for-contractors/page.tsx" },
  { path: "/guides/contractor-business-expenses-checklist", title: "Contractor business expenses checklist", source: "app/guides/contractor-business-expenses-checklist/page.tsx" },
  { path: "/guides/quarterly-taxes-for-1099-contractors", title: "Quarterly taxes for 1099 contractors", source: "app/guides/quarterly-taxes-for-1099-contractors/page.tsx" },
  { path: "/guides/llc-vs-s-corp-for-consultants", title: "LLC vs S-Corp for consultants", source: "app/guides/llc-vs-s-corp-for-consultants/page.tsx" },
  { path: "/guides/how-to-calculate-a-contractor-hourly-rate", title: "How to calculate a contractor hourly rate", source: "app/guides/how-to-calculate-a-contractor-hourly-rate/page.tsx" },
  { path: "/guides/what-is-a-reasonable-s-corp-salary", title: "What is a reasonable S-Corp salary?", source: "app/guides/what-is-a-reasonable-s-corp-salary/page.tsx" },
  { path: "/guides/how-to-switch-from-w2-to-c2c", title: "How to switch from W2 to C2C", source: "app/guides/how-to-switch-from-w2-to-c2c/page.tsx" },
  { path: "/contractor-rate-calculator/it-consultant", title: "IT Consultant Contractor Rate Calculator", source: "app/contractor-rate-calculator/[profession]/page.tsx" },
  { path: "/contractor-rate-calculator/software-engineer", title: "Software Engineer Contractor Rate Calculator", source: "app/contractor-rate-calculator/[profession]/page.tsx" },
  { path: "/contractor-rate-calculator/project-manager", title: "Project Manager Contractor Rate Calculator", source: "app/contractor-rate-calculator/[profession]/page.tsx" },
  { path: "/contractor-rate-calculator/data-engineer", title: "Data Engineer Contractor Rate Calculator", source: "app/contractor-rate-calculator/[profession]/page.tsx" },
  { path: "/contractor-rate-calculator/business-analyst", title: "Business Analyst Contractor Rate Calculator", source: "app/contractor-rate-calculator/[profession]/page.tsx" },
];

export const seoSitemapPaths = Array.from(new Set(seoPages.map((page) => page.path)));

export function seoTitleMap() {
  return seoPages.map((page) => ({ path: page.path, title: page.title }));
}
