import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 mb-10 pt-6 border-t-2 border-ink text-[13px] text-ink2">
      <div><b className="font-display text-base">buzzpay</b> — free tools that help you get paid.</div>
      <nav className="flex flex-wrap gap-x-4 gap-y-2 mt-3 font-semibold" aria-label="Footer">
        <Link href="/contractor-finance" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[6px]">Contractor Finance</Link>
        <Link href="/templates" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[6px]">Invoice Templates</Link>
        <Link href="/about" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[6px]">About</Link>
        <Link href="/affiliate-disclosure" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[6px]">Affiliate Disclosure</Link>
        <Link href="/privacy" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[6px]">Privacy &amp; disclosure</Link>
      </nav>
      <p className="text-xs text-muted mt-2 max-w-[640px]">
        Calculators are estimates and not financial, tax, or legal advice; always verify current processor
        rates and tax rules for your situation. Some features send limited data when you request emailed
        reports or AI explanations. Some links are affiliate links — if you sign up through them we may earn
        a commission at no extra cost to you. See the privacy and affiliate disclosure pages for details.
      </p>
    </footer>
  );
}
