import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 mb-10 pt-6 border-t-2 border-ink text-[13px] text-ink2">
      <div><b className="font-display text-base">buzzpay</b> — free tools that help you get paid.</div>
      <nav className="flex flex-wrap gap-x-4 gap-y-2 mt-3 font-semibold" aria-label="Footer">
        <Link href="/contractor-finance">Contractor Finance</Link>
        <Link href="/templates">Invoice Templates</Link>
        <Link href="/about">About</Link>
        <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
        <Link href="/privacy">Privacy &amp; disclosure</Link>
      </nav>
      <p className="text-xs text-muted mt-2 max-w-[640px]">
        Calculators are estimates and not financial, tax, or legal advice; always verify current processor
        rates and tax rules for your situation. Some links are affiliate links — if you sign up through them
        we may earn a commission at no extra cost to you. See the affiliate disclosure for details.
      </p>
    </footer>
  );
}
