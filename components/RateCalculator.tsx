"use client";
import { useState } from "react";
import { money } from "@/lib/format";
import RecoCard from "./RecoCard";
import { Clock } from "lucide-react";

export default function RateCalculator() {
  const id = (suffix: string) => `rate-calculator-${suffix}`;
  const [take, setTake] = useState("70000");
  const [hrs, setHrs] = useState("25");
  const [weeks, setWeeks] = useState("48");
  const [exp, setExp] = useState("6000");
  const [tax, setTax] = useState("25");

  const t = parseFloat(take) || 0, h = parseFloat(hrs) || 0, w = parseFloat(weeks) || 0;
  const e = parseFloat(exp) || 0, taxR = (parseFloat(tax) || 0) / 100;
  const billable = h * w;
  const gross = taxR < 1 ? (t + e) / (1 - taxR) : 0;
  const rate = billable > 0 ? gross / billable : 0;
  const hourly = Math.ceil(rate);

  const PFX = ({ s }: { s: string }) => <span className="absolute left-[13px] top-1/2 -translate-y-1/2 font-bold text-muted font-mono">{s}</span>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px] items-start">
      <div className="bg-card border-2 border-ink rounded-xl2 shadow-hard p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold mb-1">Your numbers</h2>
        <p className="text-muted text-[13.5px] mb-[18px]">Annual figures. Be honest about billable hours.</p>

        <div className="mb-4"><label className="field-label" htmlFor={id("take-home")}>Take-home income you want (per year)</label>
          <div className="relative"><PFX s="$" /><input id={id("take-home")} type="number" value={take} onChange={(ev) => setTake(ev.target.value)} className="field-input pl-[30px]" /></div></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="mb-4"><label className="field-label" htmlFor={id("billable-hours")}>Billable hours / week</label>
            <input id={id("billable-hours")} type="number" value={hrs} onChange={(ev) => setHrs(ev.target.value)} className="field-input" /></div>
          <div className="mb-4"><label className="field-label" htmlFor={id("weeks-worked")}>Weeks worked / year</label>
            <input id={id("weeks-worked")} type="number" value={weeks} onChange={(ev) => setWeeks(ev.target.value)} className="field-input" /></div>
        </div>
        <div className="mb-4"><label className="field-label" htmlFor={id("business-expenses")}>Business expenses (per year)</label>
          <div className="relative"><PFX s="$" /><input id={id("business-expenses")} type="number" value={exp} onChange={(ev) => setExp(ev.target.value)} className="field-input pl-[30px]" /></div></div>
        <div className="mb-4"><label className="field-label" htmlFor={id("tax-rate")}>Estimated tax rate</label>
          <div className="relative"><PFX s="%" /><input id={id("tax-rate")} type="number" value={tax} onChange={(ev) => setTax(ev.target.value)} className="field-input pl-[30px]" /></div></div>
        <p className="text-xs text-muted mt-1">&quot;Billable hours&quot; should exclude admin, sales, and downtime — most full-timers bill far fewer hours than they work.</p>
      </div>

      <div>
        <div className="bg-ink text-paper rounded-xl2 p-5 sm:p-6 border-2 border-ink">
          <div className="text-[13px] uppercase tracking-wider text-honey font-bold mb-1.5">Charge at least</div>
          <div className="font-mono text-[clamp(34px,6vw,46px)] font-bold leading-none tracking-tight">{money(hourly)}/hr</div>
          <hr className="border-0 border-t border-paper/20 my-[18px]" />
          <div className="flex flex-col gap-[11px] text-[14.5px]">
            <Row label="Billable hours / year" value={billable.toLocaleString()} />
            <Row label="Revenue you must bill" value={money(gross)} />
            <Row label="Suggested day rate (8h)" value={money(hourly * 8)} tone="pos" />
            <Row label="Monthly billing target" value={money(gross / 12)} />
          </div>
        </div>
        <RecoCard icon={<Clock size={24} strokeWidth={2.1} />} headline="Stop leaving money on the table."
          body="Track billable hours and turn them into invoices automatically with FreshBooks."
          cta="See how" href="#" />
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "pos" }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#cabfac]">{label}</span>
      <span className={`font-mono font-bold ${tone === "pos" ? "text-[#7fe3ab]" : ""}`}>{value}</span>
    </div>
  );
}
