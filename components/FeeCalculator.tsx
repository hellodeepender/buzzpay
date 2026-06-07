"use client";
import { useState } from "react";
import { money } from "@/lib/format";
import RecoCard from "./RecoCard";
import { Calculator } from "lucide-react";

const PRESETS = [
  { name: "Stripe", pct: 2.9, fix: 0.30 },
  { name: "PayPal", pct: 3.49, fix: 0.49 },
  { name: "Square", pct: 2.9, fix: 0.30 },
  { name: "Custom", pct: 0, fix: 0 },
];

export default function FeeCalculator() {
  const [mode, setMode] = useState<"forward" | "reverse">("forward");
  const [proc, setProc] = useState("Stripe");
  const [pct, setPct] = useState("2.9");
  const [fix, setFix] = useState("0.30");
  const [amt, setAmt] = useState("100");

  const p = parseFloat(pct) || 0, f = parseFloat(fix) || 0, a = parseFloat(amt) || 0;
  let gross: number, fee: number, net: number;
  if (mode === "forward") { gross = a; fee = gross * (p / 100) + f; net = gross - fee; }
  else { net = a; gross = (net + f) / (1 - p / 100); fee = gross - net; }
  const eff = gross > 0 ? (fee / gross) * 100 : 0;

  const pick = (name: string, pp: number, ff: number) => {
    setProc(name);
    if (name !== "Custom") { setPct(String(pp)); setFix(ff.toFixed(2)); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px] items-start">
      <div className="bg-card border-2 border-ink rounded-xl2 shadow-hard p-5 sm:p-6">
        <div className="flex border-2 border-ink rounded-[10px] overflow-hidden mb-[18px]">
          {(["forward", "reverse"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 font-semibold text-[13.5px] py-2.5 px-1.5 ${mode === m ? "bg-ink text-paper" : "bg-card text-ink2"}`}>
              {m === "forward" ? "I'm charging an amount" : "I want to receive an amount"}
            </button>
          ))}
        </div>

        <label className="field-label">Payment processor</label>
        <div className="flex gap-2 flex-wrap mb-4">
          {PRESETS.map((pr) => (
            <button key={pr.name} onClick={() => pick(pr.name, pr.pct, pr.fix)}
              className={`border-2 border-ink rounded-full text-[13px] font-semibold py-[7px] px-[13px] transition ${proc === pr.name ? "bg-honey shadow-hardsm" : "bg-card hover:bg-paper2"}`}>
              {pr.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="mb-4">
            <label className="field-label">Percentage fee</label>
            <div className="relative">
              <span className="absolute left-[13px] top-1/2 -translate-y-1/2 font-bold text-muted font-mono">%</span>
              <input type="number" step="0.01" value={pct} onChange={(e) => setPct(e.target.value)} className="field-input pl-[30px]" />
            </div>
          </div>
          <div className="mb-4">
            <label className="field-label">Fixed fee</label>
            <div className="relative">
              <span className="absolute left-[13px] top-1/2 -translate-y-1/2 font-bold text-muted font-mono">$</span>
              <input type="number" step="0.01" value={fix} onChange={(e) => setFix(e.target.value)} className="field-input pl-[30px]" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="field-label">{mode === "forward" ? "Amount you're charging" : "Amount you want to receive"}</label>
          <div className="relative">
            <span className="absolute left-[13px] top-1/2 -translate-y-1/2 font-bold text-muted font-mono">$</span>
            <input type="number" step="0.01" value={amt} onChange={(e) => setAmt(e.target.value)} className="field-input pl-[30px]" />
          </div>
        </div>
        <p className="text-xs text-muted mt-1">Default rates shown are common U.S. standard rates — edit them to match your region, card type, or negotiated pricing.</p>
      </div>

      <div>
        <div className="bg-ink text-paper rounded-xl2 p-5 sm:p-6 border-2 border-ink">
          <span className="inline-block bg-honey text-ink font-bold text-xs py-[3px] px-[9px] rounded-full mb-3.5">
            {proc} · {p}% + ${f.toFixed(2)}
          </span>
          <div className="text-[13px] uppercase tracking-wider text-honey font-bold mb-1.5">
            {mode === "forward" ? "You'll receive" : "Charge this much"}
          </div>
          <div className="font-mono text-[clamp(34px,6vw,46px)] font-bold leading-none tracking-tight">
            {money(mode === "forward" ? net : gross)}
          </div>
          <hr className="border-0 border-t border-paper/20 my-[18px]" />
          <div className="flex flex-col gap-[11px]">
            <Row label={mode === "forward" ? "You charge" : "Customer pays"} value={money(gross)} />
            <Row label="Processing fee" value={"−" + money(fee)} tone="neg" />
            <Row label={mode === "forward" ? "You keep" : "You receive"} value={money(net)} tone="pos" />
            <Row label="Effective rate" value={eff.toFixed(2) + "%"} />
          </div>
        </div>
        <RecoCard icon={<Calculator size={24} strokeWidth={2.1} />} headline="Tired of guessing your fees?"
          body="Quaderno tracks Stripe & PayPal fees and taxes automatically across every sale."
          cta="Check it out" href="#" />
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "pos" | "neg" }) {
  const color = tone === "pos" ? "text-[#7fe3ab]" : tone === "neg" ? "text-[#ffb38f]" : "";
  return (
    <div className="flex justify-between items-center text-[14.5px]">
      <span className="text-[#cabfac]">{label}</span>
      <span className={`font-mono font-bold ${color}`}>{value}</span>
    </div>
  );
}
