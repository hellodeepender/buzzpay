import type { ReactNode } from "react";

export function FinancialDisclaimer({ children }: { children?: ReactNode }) {
  return (
    <aside className="mt-8 border-l-4 border-honeyDeep bg-card px-4 py-3 text-[13.5px] text-ink2">
      <b className="text-ink">Estimate only.</b>{" "}
      {children ??
        "This calculator provides general educational estimates, not financial, tax, accounting, or legal advice. Verify the inputs and consult a qualified professional for decisions specific to your situation."}
    </aside>
  );
}

export function LastReviewed({ date }: { date: string }) {
  const parsedDate = new Date(`${date}T00:00:00`);
  const label = parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <p className="mt-3 text-xs font-medium text-muted">
      Last reviewed: <time dateTime={date}>{label}</time>
    </p>
  );
}

export function Methodology({ children }: { children: ReactNode }) {
  return (
    <section className="mt-9 max-w-[720px] text-[15px] text-ink2 leading-relaxed">
      <h2 className="font-display text-2xl font-semibold mb-3 text-ink">Methodology</h2>
      {children}
    </section>
  );
}

export type SourceItem = {
  name: string;
  href: string;
  note?: string;
};

export function Sources({ items }: { items: SourceItem[] }) {
  return (
    <section className="mt-9 max-w-[720px] text-[14px] text-ink2 leading-relaxed">
      <h2 className="font-display text-xl font-semibold mb-3 text-ink">Sources</h2>
      <ul className="list-disc pl-5 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-honeyDeep underline"
            >
              {item.name}
            </a>
            {item.note ? ` — ${item.note}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
