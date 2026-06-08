import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How to Get Paid by International Clients (Fees & Best Methods)",
  description: "A freelancer's guide to getting paid by overseas clients — the real cost of payment fees and exchange-rate markups, your options compared, and how to keep more of every invoice.",
  alternates: { canonical: "/guides/getting-paid-by-international-clients" },
};

const faq = [
  { q: "What's the cheapest way to get paid by international clients?", a: "For regular payments, a multi-currency account (such as Wise or Payoneer) that gives you local account details and converts near the mid-market rate is usually cheapest. For one-off large sums, a bank wire can work despite higher fixed fees. Compare the all-in cost — fee plus exchange-rate markup — not just the headline fee." },
  { q: "Do I pay fees twice on an international payment?", a: "Often, effectively yes: the payment method's transaction fee, plus a currency-conversion markup. The conversion cost is the one people miss, because it's built into a worse exchange rate rather than shown as a line item. Always check the rate against the mid-market rate." },
  { q: "Should I invoice in my currency or the client's?", a: "Invoicing in your own currency pushes the conversion cost to the client's side but can make you harder to pay; invoicing in theirs is friendlier but means you absorb the conversion. A multi-currency account lets you accept their currency and convert on your own terms." },
  { q: "How do I know what I'll actually receive?", a: "Use a fee calculator to subtract the processing fee, then compare the offered exchange rate to the mid-market rate to estimate the conversion cost. Reverse mode tells you what to charge to land a specific net amount." },
];

export default function Page() {
  return (
    <div className="py-2">
      <FaqJsonLd items={faq} />
      <section className="max-w-[680px] mb-[22px]">
        <h1 className="font-display font-semibold text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-tight mb-2">
          How to get paid by <em className="italic text-honeyDeep">international clients</em>
        </h1>
        <p className="text-ink2 text-base">Overseas clients are great for your income — until you see how much disappears between their bank and yours. Here&apos;s where the money leaks, and how to keep more of it.</p>
      </section>

      <article className="max-w-[720px] text-[15px] text-ink2 leading-relaxed">
        <h2 className="font-display text-2xl font-semibold mb-3 text-ink">Where international payments quietly lose you money</h2>
        <p className="mb-3">Two places. First, the payment method&apos;s fee — a card processor or PayPal takes a percentage plus a fixed fee on every payment. Second, and usually bigger, the exchange rate. Many banks and payment services convert your money at a rate marked up well above the real &quot;mid-market&quot; rate you&apos;d see on a search engine, and they rarely show that markup as a fee. On a large invoice, the hidden exchange spread can cost you more than the visible transaction fee.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Your options for receiving money from abroad</h2>
        <p className="mb-3"><b className="text-ink">Bank wire (SWIFT).</b> Universal but slow — often a few days — with fixed fees on both ends and usually a poor exchange rate. Fine for the occasional large payment; painful for regular ones.</p>
        <p className="mb-3"><b className="text-ink">PayPal.</b> Easy and familiar to clients, but the goods-and-services fee is high (around 3.49% plus a fixed fee in the US, more cross-border), and its currency conversion adds a markup on top. Convenient, not cheap — you can see the bite with the <Link href="/payment-fee-calculator/paypal" className="text-honeyDeep font-semibold">PayPal fee calculator</Link>.</p>
        <p className="mb-3"><b className="text-ink">Cards via Stripe or Square.</b> A smooth checkout, but you pay the processing fee plus roughly 1% extra for internationally issued cards and any currency conversion. Model it with the <Link href="/payment-fee-calculator" className="text-honeyDeep font-semibold">fee calculator</Link>.</p>
        <p className="mb-3"><b className="text-ink">Multi-currency accounts (e.g. Wise, Payoneer).</b> You get local account details in several currencies, so an overseas client can pay you &quot;locally,&quot; and you convert at or near the mid-market rate when you choose. For freelancers paid regularly from abroad, this is usually the cheapest and most predictable option.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">The exchange-rate trap</h2>
        <p className="mb-3">Always compare against the mid-market rate — the one you&apos;d see on a search engine. If a service advertises a &quot;no-fee&quot; transfer but gives you a rate 2–3% worse than mid-market, that spread is the fee, just hidden. On a $3,000 invoice, 3% is $90 you&apos;ll never see itemized.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Practical ways to keep more of each payment</h2>
        <p className="mb-3">Agree the currency up front and put it on the invoice, so there&apos;s no surprise conversion. Decide who covers transfer fees and state it in your terms. Know your net before you quote — run the amount through the <Link href="/payment-fee-calculator" className="text-honeyDeep font-semibold">fee calculator</Link> so your rate actually nets what you need, using reverse mode to gross up to a target. Send invoices promptly with clear due dates using the <Link href="/invoice-generator" className="text-honeyDeep font-semibold">invoice generator</Link> — cross-border payments already take longer, so don&apos;t add delay on your end. And for repeat international clients, a multi-currency account means you&apos;re not re-paying conversion costs every single month.</p>

        <h2 className="font-display text-2xl font-semibold mt-9 mb-3 text-ink">Frequently asked questions</h2>
        {faq.map((f, i) => (
          <div key={i} className="border-b border-paper2 py-3">
            <p className="font-semibold text-ink">{f.q}</p>
            <p className="mt-1">{f.a}</p>
          </div>
        ))}
      </article>
    </div>
  );
}
