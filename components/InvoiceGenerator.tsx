"use client";
import { useState, useEffect } from "react";
import { money } from "@/lib/format";
import RecoCard from "./RecoCard";
import { Repeat } from "lucide-react";

type Item = { d: string; q: number; p: number };

export default function InvoiceGenerator() {
  const [from, setFrom] = useState("Your Business");
  const [fromEmail, setFromEmail] = useState("you@email.com");
  const [to, setTo] = useState("Client Name");
  const [toEmail, setToEmail] = useState("client@email.com");
  const [no, setNo] = useState("INV-001");
  const [cur, setCur] = useState("$");
  const [date, setDate] = useState("");
  const [due, setDue] = useState("");
  const [tax, setTax] = useState("0");
  const [notes, setNotes] = useState("Payment due within 14 days. Thank you!");
  const [items, setItems] = useState<Item[]>([
    { d: "Design work — homepage", q: 1, p: 1200 },
    { d: "Revisions (hourly)", q: 4, p: 90 },
  ]);

  useEffect(() => {
    const t = new Date(), d = new Date(); d.setDate(d.getDate() + 14);
    setDate(t.toISOString().slice(0, 10));
    setDue(d.toISOString().slice(0, 10));
  }, []);

  const setItem = (i: number, k: keyof Item, v: string) =>
    setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, [k]: k === "d" ? v : (parseFloat(v) || 0) } : it));
  const addItem = () => setItems((a) => [...a, { d: "", q: 1, p: 0 }]);
  const delItem = (i: number) => setItems((a) => (a.length > 1 ? a.filter((_, idx) => idx !== i) : a));

  const sub = items.reduce((s, it) => s + it.q * it.p, 0);
  const taxRate = parseFloat(tax) || 0;
  const taxAmt = sub * (taxRate / 100);
  const total = sub + taxAmt;
  const fmtDate = (v: string) => v ? new Date(v + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px] items-start">
      <div className="bg-card border-2 border-ink rounded-xl2 shadow-hard p-6">
        <h2 className="font-display text-xl font-semibold mb-1">Invoice details</h2>
        <p className="text-muted text-[13.5px] mb-[18px]">Everything updates the preview instantly.</p>

        <div className="grid grid-cols-2 gap-3">
          <Fld label="Your name / business" v={from} set={setFrom} />
          <Fld label="Your email" v={fromEmail} set={setFromEmail} />
          <Fld label="Bill to (client)" v={to} set={setTo} />
          <Fld label="Client email" v={toEmail} set={setToEmail} />
          <Fld label="Invoice #" v={no} set={setNo} />
          <div className="mb-4">
            <label className="field-label">Currency</label>
            <select value={cur} onChange={(e) => setCur(e.target.value)} className="field-input">
              <option value="$">$ USD</option><option value="£">£ GBP</option>
              <option value="€">€ EUR</option><option value="C$">C$ CAD</option><option value="A$">A$ AUD</option>
            </select>
          </div>
          <div className="mb-4"><label className="field-label">Issue date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field-input" /></div>
          <div className="mb-4"><label className="field-label">Due date</label>
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="field-input" /></div>
        </div>

        <label className="field-label">Line items</label>
        <div className="grid grid-cols-[1fr_64px_96px_30px] gap-2 text-[11px] font-bold text-muted uppercase tracking-wide mb-1.5">
          <span>Description</span><span className="text-right">Qty</span><span className="text-right">Price</span><span />
        </div>
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[1fr_64px_96px_30px] gap-2 mb-2 items-center">
            <input className="field-input" value={it.d} onChange={(e) => setItem(i, "d", e.target.value)} />
            <input className="field-input" type="number" value={it.q} onChange={(e) => setItem(i, "q", e.target.value)} />
            <input className="field-input" type="number" value={it.p} onChange={(e) => setItem(i, "p", e.target.value)} />
            <button onClick={() => delItem(i)} className="text-clay text-lg font-bold leading-none">×</button>
          </div>
        ))}
        <button onClick={addItem} className="border-2 border-dashed border-ink rounded-[10px] w-full py-2.5 font-semibold text-[13.5px] hover:bg-paper2 transition mt-1">+ Add line item</button>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="mb-4"><label className="field-label">Tax rate</label>
            <div className="relative"><span className="absolute left-[13px] top-1/2 -translate-y-1/2 font-bold text-muted font-mono">%</span>
              <input type="number" step="0.1" value={tax} onChange={(e) => setTax(e.target.value)} className="field-input pl-[30px]" /></div></div>
        </div>
        <div className="mb-4"><label className="field-label">Notes / payment terms</label>
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="field-input" /></div>

        <button onClick={() => window.print()}
          className="w-full bg-honey border-2 border-ink shadow-hardsm rounded-[10px] font-bold text-[15px] py-3.5 mt-2 hover:-translate-x-px hover:-translate-y-px transition">
          ↓ Save as PDF
        </button>
      </div>

      <div>
        <div id="invoice-preview" className="bg-white border-2 border-ink rounded-xl2 shadow-hard p-[30px]">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div><b className="font-display text-xl">{from || "Your Business"}</b><p className="text-[13px] text-ink2">{fromEmail}</p></div>
            <div className="text-right text-[13px]">
              <div className="font-display text-[26px] font-semibold tracking-tight">Invoice</div>
              <div className="mt-1 text-ink2"><b className="text-ink">{no}</b></div>
              <div className="mt-1 text-ink2">Issued {fmtDate(date)}</div>
              <div className="mt-1 text-ink2">Due {fmtDate(due)}</div>
            </div>
          </div>
          <div className="mb-5 text-sm">
            <div className="text-[11px] uppercase tracking-wide text-muted font-bold mb-[3px]">Bill to</div>
            <b>{to || "Client"}</b><br />{toEmail}
          </div>
          <table className="w-full border-collapse text-sm mb-2">
            <thead><tr className="text-[11px] uppercase tracking-wide text-muted">
              <th className="text-left border-b-2 border-ink pb-2">Description</th>
              <th className="text-right border-b-2 border-ink pb-2">Qty</th>
              <th className="text-right border-b-2 border-ink pb-2">Price</th>
              <th className="text-right border-b-2 border-ink pb-2">Amount</th>
            </tr></thead>
            <tbody>{items.map((it, i) => (
              <tr key={i}>
                <td className="py-2.5 border-b border-paper2">{it.d || "—"}</td>
                <td className="py-2.5 border-b border-paper2 text-right font-mono font-bold">{it.q}</td>
                <td className="py-2.5 border-b border-paper2 text-right font-mono font-bold">{money(it.p, cur)}</td>
                <td className="py-2.5 border-b border-paper2 text-right font-mono font-bold">{money(it.q * it.p, cur)}</td>
              </tr>
            ))}</tbody>
          </table>
          <div className="ml-auto w-[240px] mt-3.5">
            <div className="flex justify-between text-sm py-[5px]"><span>Subtotal</span><span className="font-mono font-bold">{money(sub, cur)}</span></div>
            {taxRate > 0 && <div className="flex justify-between text-sm py-[5px]"><span>Tax ({taxRate}%)</span><span className="font-mono font-bold">{money(taxAmt, cur)}</span></div>}
            <div className="flex justify-between border-t-2 border-ink mt-1.5 pt-2.5 text-lg font-bold"><span>Total</span><span className="font-mono text-honeyDeep">{money(total, cur)}</span></div>
          </div>
          {notes && <div className="mt-6 text-[13px] text-ink2 border-t border-paper2 pt-3.5 whitespace-pre-wrap">{notes}</div>}
          <div className="mt-[22px] text-center text-[11px] text-muted">Made with <b className="text-honeyDeep">buzzpay.app</b></div>
        </div>
        <RecoCard icon={<Repeat size={24} strokeWidth={2.1} />} headline="Sending invoices every month?"
          body="FreshBooks automates recurring invoices, reminders, and tracks who's paid."
          cta="Try FreshBooks" href="#" />
      </div>
    </div>
  );
}

function Fld({ label, v, set }: { label: string; v: string; set: (s: string) => void }) {
  return (
    <div className="mb-4">
      <label className="field-label">{label}</label>
      <input className="field-input" value={v} onChange={(e) => set(e.target.value)} />
    </div>
  );
}
