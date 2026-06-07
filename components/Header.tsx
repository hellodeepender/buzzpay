import Link from "next/link";

const tabs = [
  { href: "/payment-fee-calculator", label: "Fee Calculator" },
  { href: "/invoice-generator", label: "Invoice Generator" },
  { href: "/freelance-rate-calculator", label: "Rate Calculator" },
];

export default function Header() {
  return (
    <header className="pt-7 pb-2">
      <div className="flex items-center justify-between flex-wrap gap-3.5">
        <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-[30px] tracking-tight text-ink no-underline">
          <span className="inline-grid place-items-center w-9 h-9 bg-honey border-2 border-ink rounded-[11px] shadow-hardsm font-black text-[20px] leading-none">b</span>
          buzzpay
        </Link>
        <div className="text-sm text-ink2 font-medium">
          Free tools to <b className="text-ink">get paid</b> — for freelancers &amp; small businesses
        </div>
      </div>
      <nav className="flex gap-1 mt-6 mb-7 border-2 border-ink rounded-full bg-card p-[5px] shadow-hardsm">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href}
            className="flex-1 text-center font-semibold text-[15px] text-ink2 py-[11px] px-2.5 rounded-full hover:text-ink transition whitespace-nowrap">
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
