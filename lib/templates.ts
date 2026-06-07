export type TemplateItem = { d: string; q: number; p: number };
export type Template = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  body: string[];
  sample: { items: TemplateItem[]; notes: string; tax: string };
};

export const templates: Record<string, Template> = {
  freelance: {
    slug: "freelance",
    name: "Freelance",
    title: "Free Freelance Invoice Template — fill in & download PDF",
    description: "A free, no-signup freelance invoice template. Fill it in your browser, add your logo, and download a clean PDF in under a minute.",
    intro: "A clean, professional invoice template for freelancers — fill it in and download a PDF, no signup.",
    body: [
      "A good freelance invoice makes it effortless for a client to pay you: your name and contact, theirs, a unique invoice number, clear line items, and an unmistakable due date and payment terms. Vague invoices get paid late.",
      "This template pre-fills a typical freelance layout you can edit completely — swap the line items for your work, set your rate, add tax if you charge it, and drop your logo on top.",
    ],
    sample: { items: [{ d: "Project work — agreed scope", q: 1, p: 1500 }, { d: "Additional revisions (hourly)", q: 3, p: 85 }], notes: "Payment due within 14 days. Thank you for your business!", tax: "0" },
  },
  hourly: {
    slug: "hourly",
    name: "Hourly",
    title: "Free Hourly Invoice Template — bill by the hour",
    description: "A free hourly invoice template. List your hours and rate, auto-total, and download a PDF — no signup, no account.",
    intro: "Bill by the hour cleanly — list your hours and rate, and the totals calculate themselves.",
    body: [
      "Hourly invoices live or die on clarity: each line should show what you did, how many hours, and your rate, so the client sees exactly what they're paying for. Group by task or project rather than one lump 'consulting — 40 hrs' line, which invites questions and delays.",
      "This template sets up hourly line items you can edit. Adjust the hours and your rate, and the amounts and total update instantly.",
    ],
    sample: { items: [{ d: "Discovery & planning (hrs)", q: 4, p: 90 }, { d: "Implementation (hrs)", q: 12, p: 90 }, { d: "Revisions (hrs)", q: 3, p: 90 }], notes: "Hours logged for the period. Payment due within 14 days.", tax: "0" },
  },
  consulting: {
    slug: "consulting",
    name: "Consulting",
    title: "Free Consulting Invoice Template — retainers & day rates",
    description: "A free consulting invoice template for advisory work, day rates, and retainers. Fill in, add your logo, and download a PDF — no signup.",
    intro: "Invoice advisory work, day rates, or retainers — professional and ready in a minute.",
    body: [
      "Consulting invoices often bill days, milestones, or a monthly retainer rather than raw hours. Spell out the engagement clearly — 'Strategy retainer — March' or 'Advisory day rate × 2' — and reference any agreement or SOW number in the notes so finance teams approve it quickly.",
      "This template pre-fills a consulting layout with a retainer and a day-rate line you can edit to match your engagement.",
    ],
    sample: { items: [{ d: "Monthly advisory retainer", q: 1, p: 2500 }, { d: "Strategy workshop (day rate)", q: 1, p: 1200 }], notes: "Per engagement agreement. Net 30. Bank details on request.", tax: "0" },
  },
  contractor: {
    slug: "contractor",
    name: "Contractor",
    title: "Free Contractor Invoice Template — labor & materials",
    description: "A free contractor invoice template for trades and project work — labor, materials, and tax. Fill in and download a PDF, no signup.",
    intro: "Invoice labor and materials together — clean, itemized, and ready to download.",
    body: [
      "Contractor invoices usually separate labor from materials so the client can see where the money goes, and often carry tax. Itemize each clearly, include the job or project reference, and state your payment terms — deposits and progress payments are common, so note what's already been paid if relevant.",
      "This template pre-fills labor and materials lines plus a tax rate you can adjust to your region.",
    ],
    sample: { items: [{ d: "Labor — installation (hrs)", q: 16, p: 65 }, { d: "Materials & supplies", q: 1, p: 780 }], notes: "Balance due on completion. Any deposit already paid is deducted.", tax: "8.5" },
  },
  "graphic-design": {
    slug: "graphic-design",
    name: "Graphic Design",
    title: "Free Graphic Design Invoice Template",
    description: "A free graphic design invoice template — design work, revision rounds, and licensing. Fill in, add your logo, and download a PDF. No signup.",
    intro: "Invoice design work, revision rounds, and licensing — as polished as your work.",
    body: [
      "Design invoices should reflect how design is actually scoped: the core deliverable, defined revision rounds, and any usage or licensing fee if the client is buying rights. Listing revisions as their own line protects you when scope creeps — extra rounds become a clear, billable line rather than an awkward conversation.",
      "This template pre-fills a design layout with a deliverable, revisions, and a licensing line you can keep or remove.",
    ],
    sample: { items: [{ d: "Brand identity — logo & guidelines", q: 1, p: 1800 }, { d: "Revision rounds (beyond 2 included)", q: 1, p: 250 }, { d: "Usage / licensing", q: 1, p: 300 }], notes: "Final files released on payment. Net 14.", tax: "0" },
  },
  "web-development": {
    slug: "web-development",
    name: "Web Development",
    title: "Free Web Developer Invoice Template",
    description: "A free web developer invoice template — project milestones or hourly dev work plus hosting. Fill in and download a PDF, no signup.",
    intro: "Invoice dev work by milestone or hour, with hosting or retainer lines built in.",
    body: [
      "Developer invoices work best when they map to how you agreed to bill — fixed milestones, hourly, or a monthly retainer — plus any pass-through costs like hosting or third-party licenses. Reference the project or sprint so the client connects the invoice to delivered work, and bill milestones promptly on completion to keep cash flowing.",
      "This template pre-fills a milestone-style dev invoice with a hosting line you can edit.",
    ],
    sample: { items: [{ d: "Milestone 1 — build & launch", q: 1, p: 3200 }, { d: "Managed hosting (monthly)", q: 1, p: 45 }], notes: "Milestone invoiced on delivery. Net 14.", tax: "0" },
  },
};

export const templateList = Object.values(templates);
