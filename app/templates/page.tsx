import Link from "next/link";
import { templateList } from "@/lib/templates";
import { createMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = createMetadata({
  title: "Free Invoice Templates — no signup, download as PDF",
  description: "Free invoice templates for freelancers, consultants, contractors, designers, and developers. Fill in your browser, add a logo, and download a PDF — no signup.",
  path: "/templates",
});

export default function Page() {
  return (
    <div className="py-2">
      <BreadcrumbJsonLd items={[
        { name: "Home", path: "/" },
        { name: "Invoice Templates", path: "/templates" },
      ]} />
      <section className="max-w-[680px] mb-7">
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2">
          Free <em className="italic text-honeyDeep">invoice templates</em>
        </h1>
        <p className="text-ink2 text-base">Pick a starting point, and it opens in our invoice generator pre-filled — edit the details, add your logo, and download a PDF. No signup, nothing stored.</p>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {templateList.map((t) => (
          <Link key={t.slug} href={`/templates/${t.slug}`}
            className="group block bg-card border-2 border-ink rounded-xl2 shadow-hard p-5 no-underline text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition">
            <h2 className="font-display text-lg font-bold mb-1">{t.name} invoice template</h2>
            <p className="text-[13.5px] text-ink2">{t.intro}</p>
            <div className="mt-3 font-semibold text-[13px] text-honeyDeep">View template →</div>
          </Link>
        ))}
      </div>
      <section className="mt-12 max-w-[720px] text-[15px] text-ink2 leading-relaxed">
        <h2 className="font-display text-2xl font-semibold mb-3 text-ink">Why use a template?</h2>
        <p className="mb-3">A template saves you from staring at a blank page and, more importantly, makes sure you don&apos;t leave off the things that get invoices paid: a clear invoice number, itemized work, a due date, and payment terms. Each template here is a sensible starting layout for a type of work — open it, replace the sample lines with your own, and you&apos;re done.</p>
        <p>Every template is completely free, needs no account, and runs in your browser — your numbers and client details never leave your device.</p>
      </section>
    </div>
  );
}
