export type ContractorRateProfession = {
  slug: string;
  label: string;
  title: string;
  description: string;
  intro: string;
  reviewDate: string;
  factors: string[];
  utilization: string[];
  skillFactors: string[];
  expenses: string[];
  conversionNotes: string[];
  faq: { q: string; a: string }[];
};

export const contractorRateProfessions: ContractorRateProfession[] = [
  {
    slug: "it-consultant",
    label: "IT consultant",
    title: "IT Consultant Contractor Rate Calculator",
    description: "Estimate a sustainable contractor rate for IT consulting by testing utilization, seniority, support burden, and the extra work that sits outside the billable clock.",
    intro: "IT consulting rates usually rise or fall with specialization, client urgency, security requirements, and the amount of unpaid work hidden around the edges of the project. Use this page to convert those realities into a rate floor rather than guessing from a salary conversion.",
    reviewDate: "2026-06-09",
    factors: [
      "Security, access, and compliance requirements can add setup time before any client-facing work begins.",
      "Technical complexity matters more than title alone; architecture, integrations, and troubleshooting often command more pricing power than simple support work.",
      "Project shape changes the rate: short troubleshooting work, embedded support, and recurring advisory retainers all behave differently.",
    ],
    utilization: [
      "Assume that not every working hour becomes invoiceable client work.",
      "Reserve time for sales, discovery, documentation, environments, and handoff tasks.",
      "Treat client onboarding and context switching as part of the workload, not as free time.",
    ],
    skillFactors: [
      "Years of experience are less important than the kind of systems you can own independently.",
      "Specialized cloud, security, or legacy-system work often supports a higher floor than generalist support.",
      "Proof of delivery, not job title, should drive the assumed premium.",
    ],
    expenses: [
      "Laptops, test devices, cloud subscriptions, security tooling, and software licenses are common recurring costs.",
      "Insurance, bookkeeping, and tax support are part of the business cost, not optional extras.",
      "If you need paid training or certifications to stay current, those belong in the annual overhead model.",
    ],
    conversionNotes: [
      "If a W2 salary is your reference point, compare the full package: benefits, paid leave, and retirement support.",
      "Use W2 vs C2C when the real decision is an offer comparison; use this page when you already know you are pricing contractor work.",
      "A contractor rate that barely beats a W2 package after tax and benefits replacement is too thin to rely on.",
    ],
    faq: [
      { q: "What drives IT consultant rates the most?", a: "Specialization, urgency, security requirements, and the amount of nonbillable work around the project are usually bigger drivers than the job title itself." },
      { q: "Should support work be priced like architecture work?", a: "No. Support, implementation, and advisory work have different pricing power and utilization patterns, so the rate floor should reflect the actual work mix." },
      { q: "What if my salary conversion looks low?", a: "That usually means the salary comparison is missing unpaid time, benefits, or business overhead. Rebuild the comparison from annual business economics." },
    ],
  },
  {
    slug: "software-engineer",
    label: "Software engineer",
    title: "Software Engineer Contractor Rate Calculator",
    description: "Set a software engineering contractor rate from billable capacity, seniority, architecture responsibility, and the maintenance work that never fits neatly into a sprint.",
    intro: "Software engineering contracts often pay for expertise, speed, and responsibility rather than time alone. That makes utilization, specialty, and project risk just as important as the headline hourly rate.",
    reviewDate: "2026-06-09",
    factors: [
      "Ownership of architecture, deployment, and production support can justify a stronger floor than feature work alone.",
      "The more the client expects you to be available for urgent fixes or incident response, the more the rate should reflect interruption risk.",
      "Team size and process maturity affect how much of the week stays billable versus absorbed by coordination and context switching.",
    ],
    utilization: [
      "Plan for discovery, debugging, code review, release prep, and follow-up work that clients may not see as separate line items.",
      "Expect less billable capacity on work that requires constant meetings or heavy cross-team coordination.",
      "If the engagement is short, include the time spent ramping up on codebase and business context.",
    ],
    skillFactors: [
      "Senior engineers often sell reduced risk, better judgment, and faster delivery as much as raw coding hours.",
      "Specialized stacks, platform ownership, and security-sensitive work usually push the floor higher.",
      "The rate should reflect the cost of being the person who gets called when the hard part breaks.",
    ],
    expenses: [
      "Hardware, peripherals, local test environments, cloud accounts, and development tools can add meaningful annual cost.",
      "If the work requires certifications, continuing education, or specialized software licenses, include them in overhead.",
      "Bookkeeping and tax planning matter because software contracts often produce uneven revenue timing.",
    ],
    conversionNotes: [
      "Use W2 vs C2C when you are deciding whether to leave employment for a contract role.",
      "If the contract looks like a W2 job with a different label, the rate question is secondary to the classification question.",
      "Re-run the rate calculator if the client changes scope, on-call expectations, or availability requirements.",
    ],
    faq: [
      { q: "Should software engineers price by hour or project?", a: "Either can work, but the hourly floor should come first so you know whether any project fee still clears the business's minimum." },
      { q: "How much nonbillable time should I expect?", a: "It depends on the client, but meetings, debugging, release prep, and admin usually take enough time to move the rate materially." },
      { q: "Does seniority automatically mean a higher rate?", a: "No. Seniority matters because it often signals judgment, ownership, and risk reduction, but the actual rate should still reflect the real work and market context." },
    ],
  },
  {
    slug: "project-manager",
    label: "Project manager",
    title: "Project Manager Contractor Rate Calculator",
    description: "Model a project manager contractor rate around coordination load, client visibility, decision responsibility, and the nonbillable work that surrounds delivery.",
    intro: "Project management work is often billable only in part because so much of the value lives in communication, planning, issue tracking, and coordination. A useful rate model has to count those invisible hours.",
    reviewDate: "2026-06-09",
    factors: [
      "Delivery accountability can justify a higher floor when the contractor is expected to keep teams aligned and projects moving.",
      "Stakeholder management, client reporting, and escalations create hidden labor that should show up in the rate.",
      "The rate often changes with whether the role is advisory, embedded, or fully responsible for delivery outcomes.",
    ],
    utilization: [
      "Assume that meetings, status reporting, planning, and follow-up reduce the number of truly billable hours.",
      "Embedded roles can create steadier utilization but also more calendar fragmentation.",
      "Short engagements often have extra ramp-up time and higher coordination overhead per billed hour.",
    ],
    skillFactors: [
      "Experience with complex projects, stakeholder management, and cross-functional coordination can justify a stronger floor.",
      "If the client expects you to solve ambiguity, not just track tasks, the pricing should reflect that responsibility.",
      "Certification or methodology knowledge matters less than the ability to keep the work on track under pressure.",
    ],
    expenses: [
      "Travel, scheduling tools, note-taking systems, and collaboration software can all add to the annual overhead.",
      "Professional insurance and bookkeeping are part of the operating cost of the business.",
      "If the role requires regular client travel or off-hours availability, the expense and utilization assumptions should both move.",
    ],
    conversionNotes: [
      "A W2 project-management salary comparison should include paid time off and benefits, not just base pay.",
      "Use W2 vs C2C when the client is offering a direct employment alternative.",
      "If the client wants you to do everything an employee would do without employee benefits, the rate floor should rise accordingly.",
    ],
    faq: [
      { q: "Why is project management harder to price than delivery work?", a: "Because so much of the value is coordination and accountability, which can be easy to miss if you only count visible task hours." },
      { q: "Should I bill meetings?", a: "Often yes if they are part of the contracted work. At minimum, they should reduce the billable-hours assumption used to calculate the rate." },
      { q: "How do I know if the rate is high enough?", a: "The rate should cover labor, downtime, overhead, and risk without requiring perfect utilization to stay profitable." },
    ],
  },
  {
    slug: "data-engineer",
    label: "Data engineer",
    title: "Data Engineer Contractor Rate Calculator",
    description: "Estimate a contractor rate for data engineering work by factoring in pipeline ownership, specialized tooling, data quality risk, and unpaid setup effort.",
    intro: "Data engineering work often combines architecture, implementation, maintenance, and emergency support. That mixture can justify a higher rate floor if the project depends on reliability, scale, or high-stakes data flows.",
    reviewDate: "2026-06-09",
    factors: [
      "Pipeline ownership and production support can add risk that goes beyond ordinary feature delivery.",
      "Complex data integrations, governance work, and migration projects often justify a higher floor than general analysis tasks.",
      "A contract that includes incident response or data-quality triage should be priced for that operational burden.",
    ],
    utilization: [
      "Expect ramp-up time for schema discovery, data lineage, access approvals, and environment setup.",
      "Consider how much of the work is reactive versus build-oriented when estimating billable hours.",
      "If the role spans multiple systems, add time for coordination and debugging across owners.",
    ],
    skillFactors: [
      "Specialized cloud, warehouse, orchestration, or reliability expertise often matters more than generic SQL familiarity.",
      "The ability to prevent costly errors or clean up bad data is a business asset, so the rate should reflect the consequence of failure avoided.",
      "Seniority should show up as scope ownership and judgment, not just years in the field.",
    ],
    expenses: [
      "Cloud labs, test environments, certificates, storage tools, and monitoring software can all belong in overhead.",
      "If your work requires additional security tooling or compliance-related subscriptions, include them.",
      "Business bookkeeping and tax planning still matter because high-rate contracts can hide uneven invoice timing.",
    ],
    conversionNotes: [
      "If you are comparing a W2 data role to a contract role, include benefits, paid leave, and employer retirement support.",
      "Use W2 vs C2C to compare the full package before you get stuck on the label alone.",
      "A rate that depends on perfect utilization is too fragile for work that often includes production support or migration risk.",
    ],
    faq: [
      { q: "What makes data engineering rates different?", a: "Ownership of pipelines, reliability, and data quality can raise the floor because the contractor is responsible for more business-critical risk." },
      { q: "Should migration work be priced differently?", a: "Often yes. Migrations and integrations can include higher uncertainty, more setup work, and more rework risk." },
      { q: "Do I need a higher rate if I am on call?", a: "Usually yes. On-call or incident-response expectations reduce usable billable time and add risk that should be priced in." },
    ],
  },
  {
    slug: "business-analyst",
    label: "Business analyst",
    title: "Business Analyst Contractor Rate Calculator",
    description: "Estimate a contractor rate for business analysis work by considering stakeholder coordination, documentation, discovery, and the unbillable work behind the visible deliverable.",
    intro: "Business analysis often looks simple from the outside because the final output may be a document, model, or recommendation. The actual work includes discovery, interviews, synthesis, validation, revisions, and coordination, all of which need to be priced.",
    reviewDate: "2026-06-09",
    factors: [
      "Discovery and requirements work can be highly valuable even when the deliverable is not long or technical.",
      "The more stakeholders, the more time is usually spent aligning expectations and resolving ambiguity.",
      "If the role includes process design or change support, the rate should reflect that broader responsibility.",
    ],
    utilization: [
      "Assume nonbillable time for interviews, meetings, review cycles, and follow-up notes.",
      "Treat short analysis tasks carefully because they often have a lot of prep and review time relative to the finished artifact.",
      "If the client expects quick turnaround, the effective rate can improve but the schedule pressure also rises.",
    ],
    skillFactors: [
      "Domain expertise can matter as much as analysis technique because it reduces misunderstanding and rework.",
      "Stakeholder management, facilitation, and decision framing are pricing factors, not just soft skills.",
      "The ability to turn ambiguity into a usable decision package is part of the value the client is buying.",
    ],
    expenses: [
      "Communication, diagramming, documentation, and meeting tools should be counted in business overhead.",
      "Travel or workshops can add meaningful cost when the analyst is expected to be on-site.",
      "Professional services and tax reserves still belong in the model even if the role feels lighter than technical consulting.",
    ],
    conversionNotes: [
      "If you are moving from W2 to contract analysis work, compare the full employee package against the contractor rate floor.",
      "Use W2 vs C2C when deciding whether the role is really a contractor arrangement or just a different label on employment.",
      "A business analyst rate should be based on the time it takes to clarify and validate decisions, not just the final deck or document.",
    ],
    faq: [
      { q: "Why is business analysis hard to price?", a: "Because so much of the value is in discovery and coordination, which clients may not notice if they only see the final deliverable." },
      { q: "Should I bill workshops and interviews?", a: "Usually yes if they are part of the contracted work, and they should definitely reduce the assumed billable hours if they are not billed separately." },
      { q: "Can I use the same rate for every analyst project?", a: "Only if the work mix and risk are similar. Stakeholder count, urgency, and ambiguity can change the rate materially." },
    ],
  },
];

export const contractorRateProfessionMap = Object.fromEntries(
  contractorRateProfessions.map((profession) => [profession.slug, profession] as const),
) as Record<string, ContractorRateProfession>;
