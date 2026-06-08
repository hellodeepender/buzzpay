import type { SourceItem } from "@/components/CalculatorTrust";

export type ContractorSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ContractorExample = {
  title: string;
  body: string;
};

export type ContractorFaq = {
  q: string;
  a: string;
};

export type ContractorPageContent = {
  path: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  toolTitle: string;
  toolDescription: string;
  toolInputs: string[];
  toolOutput: string;
  sections: ContractorSection[];
  examples: ContractorExample[];
  faq: ContractorFaq[];
  methodology: string[];
  sources: SourceItem[];
};

export const contractorFinanceLinks = [
  {
    href: "/w2-vs-c2c",
    title: "W2 vs C2C",
    sidebarTitle: "W2 vs C2C Calculator",
    description: "Compare employee compensation with a business-to-business contract offer.",
  },
  {
    href: "/contractor-rate-calculator",
    title: "Contractor Rate Calculator",
    sidebarTitle: "Contractor Rate Calculator",
    description: "Translate salary and benefits into a sustainable hourly contract rate.",
  },
  {
    href: "/s-corp-savings-calculator",
    title: "S-Corp Savings Calculator",
    sidebarTitle: "S-Corp Savings Calculator",
    description: "Understand the inputs behind a responsible S-corporation election estimate.",
  },
  {
    href: "/llc-vs-s-corp",
    title: "LLC vs S-Corp",
    sidebarTitle: "LLC vs S-Corp",
    description: "Separate legal entity choice from federal tax classification.",
  },
  {
    href: "/1099-tax-calculator",
    title: "1099 Tax Calculator",
    sidebarTitle: "1099 Tax Calculator",
    description: "Plan for income tax, self-employment tax, expenses, and estimated payments.",
  },
] as const;
