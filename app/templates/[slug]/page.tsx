import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { templates } from "@/lib/templates";
import { money } from "@/lib/format";
import { WebAppJsonLd } from "@/components/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(templates).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = templates[params.slug];
  if (!t) return {};
  return { title: t.title, description: t.description, alternates: { canonical: `/templates/${params.slug}` } };
}

export default function Page({ params }: { params: { slug: string } }) {
  const t = templates[params.slug];
  if (!t) notFound();
  const sub = t.sample.items.reduce((s, it) => s + it.q * it.p, 0);
  const taxRate = parseFloat(t.sample.tax) || 0;
  const taxAmt = sub * (taxRate / 100);
  const total = sub + taxAmt;
  const url = `https://www.buzzpay.app/templates/${t.slug}`;

  return (
    <div className="py-2">
      <WebAppJsonLd name={`${t.name} Invoice Template`} url={url} description={t.description} />
      <section className="max-w-[680px] mb-[22px]">
        <Link href="/templates" className="text-[13px] text-muted hover:text-ink">← All templates</Link>
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2 mt-2">
          {t.name} <em className="italic text-honeyDeep">invoice template</em>
        </h1>
        <p className="text-ink2 text-base">{t.intro}</p>
        <Link href={`/invoice-generator?template=${t.slug}`} className="btn-honey mt-5">Use this template →</Link>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px] items-start">
        <div className="bg-white border-2 border-ink rounded-xl2 shadow-hard p-5 sm:p-[30px]">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div><b className="font-display text-xl">Your Business</b><p className="text-[13px] text-ink2">you@email.com</p></div>
            <div className="text-right text-[13px]">
              <div className="font-display text-[26px] font-semibold tracking-tight">Invoice</div>
              <div className="mt-1 text-ink2"><b className="text-ink">INV-001</b></div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm mb-2">
              <thead><tr className="text-[11px] uppercase tracking-wide text-muted">
                <th className="text-left border-b-2 border-ink pb-2">Description</th>
                <th className="text-right border-b-2 border-ink pb-2">Qty</th>
                <th className="text-right border-b-2 border-ink pb-2">Price</th>
                <th className="text-right border-b-2 border-ink pb-2">Amount</th>
              </tr></thead>
              <tbody>{t.sample.items.map((it, i) => (
                <tr key={i}>
                  <td className="py-2.5 border-b border-paper2">{it.d}</td>
                  <td className="py-2.5 border-b border-paper2 text-right font-mono font-bold">{it.q}</td>
                  <td className="py-2.5 border-b border-paper2 text-right font-mono font-bold">{money(it.p)}</td>
                  <td className="py-2.5 border-b border-paper2 text-right font-mono font-bold">{money(it.q * it.p)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="ml-auto w-[240px] mt-3.5">
            <div className="flex justify-between text-sm py-[5px]"><span>Subtotal</span><span className="font-mono font-bold">{money(sub)}</span></div>
            {taxRate > 0 && <div className="flex justify-between text-sm py-[5px]"><span>Tax ({taxRate}%)</span><span className="font-mono font-bold">{money(taxAmt)}</span></div>}
            <div className="flex justify-between border-t-2 border-ink mt-1.5 pt-2.5 text-lg font-bold"><span>Total</span><span className="font-mono text-honeyDeep">{money(total)}</span></div>
          </div>
        </div>

        <div className="text-[15px] text-ink2 leading-relaxed">
          <h2 className="font-display text-2xl font-semibold mb-3 text-ink">About this template</h2>
          {t.body.map((para, i) => (<p key={i} className="mb-3">{para}</p>))}
          <Link href={`/invoice-generator?template=${t.slug}`} className="btn-honey mt-2">Use this template →</Link>
          <p className="mt-4 text-[13.5px]">Prefer to start blank? Open the <Link href="/invoice-generator" className="text-honeyDeep font-semibold">invoice generator</Link>.</p>
        </div>
      </div>
    </div>
  );
}
