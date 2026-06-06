import type { Metadata } from "next";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import { WebAppJsonLd, FaqJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Free Invoice Generator — create & download a PDF invoice",
  description: "Create a professional invoice online for free and save it as a PDF. No signup. Built for freelancers and small businesses.",
  alternates: { canonical: "/invoice-generator" },
};

const faq = [
  { q: "Is this invoice generator really free?", a: "Yes. You can create and download invoices as PDFs with no signup and no watermark hassle." },
  { q: "How do I save the invoice as a PDF?", a: "Click 'Save as PDF' — it opens your browser's print dialog, where you choose 'Save as PDF' as the destination. The output shows only the invoice." },
  { q: "What should every invoice include?", a: "Your business name and contact, the client's details, a unique invoice number, issue and due dates, itemized line items with quantities and prices, any tax, the total, and payment terms." },
];

export default function Page() {
  return (
    <div className="py-2">
      <WebAppJsonLd name="Invoice Generator" url="https://buzzpay.app/invoice-generator"
        description="Create and download professional PDF invoices for free." />
      <FaqJsonLd items={faq} />
      <section className="max-w-[680px] mb-[22px]">
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2">
          Send a <em className="italic text-honeyDeep">clean invoice</em> in 60 seconds.
        </h1>
        <p className="text-ink2 text-base">Fill it in, watch it build live, then save as PDF. No signup, no watermark hassle.</p>
      </section>
      <InvoiceGenerator />
      <section className="mt-12 max-w-[720px] text-[15px] text-ink2 leading-relaxed">
        <h2 className="font-display text-2xl font-semibold mb-3 text-ink">What to put on a freelance invoice</h2>
        <p className="mb-3">A professional invoice removes friction from getting paid. Include a clear invoice number for your records, the issue and due dates, and itemized work so the client can see exactly what they&apos;re paying for. Spell out payment terms — &quot;due within 14 days&quot; is standard — and add accepted payment methods in the notes.</p>
        <p>Keep numbers consistent (INV-001, INV-002) and send the invoice promptly; invoices sent the day work finishes get paid noticeably faster than ones that lag.</p>
        <h2 className="font-display text-2xl font-semibold mt-9 mb-4 text-ink">Frequently asked</h2>
        <div className="flex flex-col gap-4">{faq.map((f, i) => (<div key={i}><b className="text-ink">{f.q}</b><p className="mt-1">{f.a}</p></div>))}</div>
      </section>
    </div>
  );
}
