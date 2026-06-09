import Link from "next/link";

type IntentKind = "hub" | "calculator" | "guide" | "profession";

type IntentLink = {
  href: string;
  label: string;
  description: string;
};

function getIntentCopy(kind: IntentKind, path: string, title: string) {
  if (kind === "hub") {
    return {
      who: "Contractors who need to decide which money question comes first: offers, rates, taxes, or entity structure.",
      when: "Use this hub when you want the decision path before changing a rate, choosing a structure, or asking for a different offer.",
      links: [
        { href: "/w2-vs-c2c", label: "W2 vs C2C", description: "Compare the full offer before you decide to contract." },
        { href: "/contractor-rate-calculator", label: "Contractor rate calculator", description: "Turn compensation goals into a sustainable floor." },
        { href: "/1099-tax-calculator", label: "1099 tax calculator", description: "Estimate tax reserves before you spend revenue." },
      ],
    };
  }

  if (kind === "calculator" && path === "/contractor-rate-calculator") {
    return {
      who: "Contractors who are pricing a new rate, checking whether a salary conversion is too low, or testing a billable-hours assumption.",
      when: "Use it when you need a rate floor before quoting a client, comparing a W2 offer, or sanity-checking a project fee.",
      links: [
        { href: "/w2-vs-c2c", label: "W2 vs C2C", description: "Compare the full package before you price the contract." },
        { href: "/contractor-rate-calculator/it-consultant", label: "IT consultant rate", description: "See how a common profession-specific pilot is framed." },
        { href: "/contractor-finance", label: "Contractor Finance hub", description: "Return to the full planning path." },
      ],
    };
  }

  if (kind === "calculator" && path === "/w2-vs-c2c") {
    return {
      who: "People comparing a W2 package with a contractor offer and wanting the numbers to include benefits, downtime, and tax reserves.",
      when: "Use it when a recruiter or client gives you two different structures and you need to know which one is actually stronger.",
      links: [
        { href: "/contractor-rate-calculator", label: "Contractor rate calculator", description: "Translate the contractor side into an annual floor." },
        { href: "/1099-tax-calculator", label: "1099 tax calculator", description: "Check the tax reserve side of the comparison." },
        { href: "/contractor-finance", label: "Contractor Finance hub", description: "See the wider planning path." },
      ],
    };
  }

  if (kind === "calculator" && path === "/s-corp-savings-calculator") {
    return {
      who: "Profitable contractors who are checking whether payroll and compliance costs leave enough net S-Corp savings to matter.",
      when: "Use it when profit is stable enough to compare reasonable compensation against the added filing and payroll burden.",
      links: [
        { href: "/llc-vs-s-corp", label: "LLC vs S-Corp", description: "Separate entity choice from tax treatment first." },
        { href: "/1099-tax-calculator", label: "1099 tax calculator", description: "Check the cash reserve side as well." },
        { href: "/contractor-finance", label: "Contractor Finance hub", description: "Return to the overall planning stack." },
      ],
    };
  }

  if (kind === "calculator" && path === "/llc-vs-s-corp") {
    return {
      who: "Consultants and solo business owners who need to separate legal structure from federal tax treatment before making a filing decision.",
      when: "Use it when you are evaluating whether S-Corp treatment is worth the payroll and compliance cost on top of the legal entity you already have.",
      links: [
        { href: "/s-corp-savings-calculator", label: "S-Corp savings calculator", description: "Estimate the net after compliance costs." },
        { href: "/1099-tax-calculator", label: "1099 tax calculator", description: "Keep the tax reserve plan aligned." },
        { href: "/contractor-finance", label: "Contractor Finance hub", description: "Go back to the wider planning flow." },
      ],
    };
  }

  if (kind === "calculator" && path === "/1099-tax-calculator") {
    return {
      who: "1099 contractors, consultants, and owners who need a clear reserve number before quarterly taxes or year-end surprises hit.",
      when: "Use it when revenue has arrived and you need to decide how much cash should be moved into a tax reserve.",
      links: [
        { href: "/contractor-rate-calculator", label: "Contractor rate calculator", description: "Make sure the rate supports the reserve." },
        { href: "/s-corp-savings-calculator", label: "S-Corp savings calculator", description: "Check whether entity changes alter the reserve." },
        { href: "/contractor-finance", label: "Contractor Finance hub", description: "Return to the decision tree." },
      ],
    };
  }

  if (kind === "profession") {
    return {
      who: `${title} contractors who want a rate starting point that reflects specialization, utilization, and the hidden work around the billable hours.`,
      when: "Use this page when you know the profession and need to tune the assumptions before you quote a client or compare the role to W2 employment.",
      links: [
        { href: "/contractor-rate-calculator", label: "Contractor rate calculator", description: "Use the shared floor calculator first." },
        { href: "/w2-vs-c2c", label: "W2 vs C2C", description: "Compare the full offer when employment is still an option." },
        { href: "/contractor-finance", label: "Contractor Finance hub", description: "Go back to the full planning hub." },
      ],
    };
  }

  if (kind === "guide") {
    if (path === "/guides/how-much-should-an-it-contractor-charge" || path === "/guides/how-to-calculate-a-contractor-hourly-rate") {
      return {
        who: "Contractors who need to turn income goals, benefits, and billable hours into a rate they can defend.",
        when: "Use this guide when you are about to quote IT consulting, software, project management, or analyst work and want the floor before the market conversation.",
        links: [
          { href: "/contractor-rate-calculator", label: "Contractor rate calculator", description: "Work out the shared rate floor first." },
          { href: "/contractor-rate-calculator/it-consultant", label: "IT consultant", description: "See the profession-specific pilot for IT work." },
          { href: "/w2-vs-c2c", label: "W2 vs C2C", description: "Compare the full offer if employment is still an option." },
        ],
      };
    }

    if (path === "/guides/w2-vs-c2c-which-pays-more") {
      return {
        who: "People comparing a W2 offer with a contractor offer and needing the economics to be visible early.",
        when: "Use this guide when an employer or client wants you to choose between salary and a contract structure.",
        links: [
          { href: "/w2-vs-c2c", label: "W2 vs C2C calculator", description: "Compare the full offer with numbers." },
          { href: "/contractor-rate-calculator/software-engineer", label: "Software engineer", description: "See a profession-specific contractor rate pilot." },
          { href: "/contractor-finance", label: "Contractor Finance hub", description: "Go back to the full planning path." },
        ],
      };
    }

    if (path === "/guides/s-corp-tax-savings-for-contractors" || path === "/guides/what-is-a-reasonable-s-corp-salary") {
      return {
        who: "Profitable contractors who are trying to decide whether an S-Corp review is actually worth the added filing and payroll burden.",
        when: "Use this guide when profit is stable enough to compare reasonable compensation, payroll cost, and compliance cost side by side.",
        links: [
          { href: "/s-corp-savings-calculator", label: "S-Corp savings calculator", description: "Check whether the net savings survive the costs." },
          { href: "/llc-vs-s-corp", label: "LLC vs S-Corp", description: "Separate entity choice from tax treatment." },
          { href: "/1099-tax-calculator", label: "1099 tax calculator", description: "Keep the reserve plan aligned." },
        ],
      };
    }

    return {
      who: "Readers looking for a planning estimate with clear assumptions and a visible breakdown.",
      when: "Use this page when you want to test a scenario before making a pricing, tax, or structure decision.",
      links: [
        { href: "/contractor-finance", label: "Contractor Finance hub", description: "Start from the planning hub." },
        { href: "/contractor-rate-calculator", label: "Contractor rate calculator", description: "Move to the rate floor next." },
        { href: "/w2-vs-c2c", label: "W2 vs C2C", description: "Check the offer comparison if needed." },
      ],
    };
  }

  return {
    who: "Readers looking for a planning estimate with clear assumptions and a visible breakdown.",
    when: "Use this page when you want to test a scenario before making a pricing, tax, or structure decision.",
    links: [
      { href: "/contractor-finance", label: "Contractor Finance hub", description: "Start from the planning hub." },
      { href: "/contractor-rate-calculator", label: "Contractor rate calculator", description: "Move to the rate floor next." },
      { href: "/w2-vs-c2c", label: "W2 vs C2C", description: "Check the offer comparison if needed." },
    ],
  };
}

export default function IntentBlocks({
  kind,
  path,
  title,
}: {
  kind: IntentKind;
  path: string;
  title: string;
}) {
  const copy = getIntentCopy(kind, path, title);

  return (
    <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-[960px]">
      <div className="rounded-xl2 border-2 border-ink bg-card p-4">
        <p className="text-[12px] uppercase font-bold tracking-wide text-honeyDeep">Who this is for</p>
        <p className="mt-2 text-[14.5px] leading-7 text-ink2">{copy.who}</p>
      </div>
      <div className="rounded-xl2 border-2 border-ink bg-card p-4">
        <p className="text-[12px] uppercase font-bold tracking-wide text-honeyDeep">When this tool helps</p>
        <p className="mt-2 text-[14.5px] leading-7 text-ink2">{copy.when}</p>
      </div>
      <div className="lg:col-span-2 rounded-xl2 border border-ink/15 bg-paper2 p-4">
        <p className="text-[12px] uppercase font-bold tracking-wide text-muted">Related links</p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {copy.links.map((item: IntentLink) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-[8px] border border-ink/20 bg-paper px-3 py-2 text-[13px] font-semibold text-ink no-underline hover:bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <div>{item.label}</div>
              <div className="mt-1 text-[12px] font-normal text-ink2">{item.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
