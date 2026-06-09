import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cookie policy",
  description: "Cookie and analytics policy for BuzzPay.",
  path: "/cookie-policy",
});

export default function Page() {
  return (
    <div className="py-2 max-w-[760px]">
      <h1 className="font-display text-3xl font-semibold mb-4">Cookie policy</h1>
      <p className="text-ink2 mb-3">
        BuzzPay currently does not use a cookie banner because it does not appear to rely on non-essential advertising or tracking cookies. The site still uses a few services that may process data in other ways, and this page explains them in plain language.
      </p>

      <div className="space-y-5 text-ink2 leading-7">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Essential cookies and similar technologies</h2>
          <p>
            BuzzPay is built to work without advertising cookies. Any strictly necessary browser storage or technical identifiers would be limited to the platform or service needed to keep the site running. At the moment, BuzzPay does not intentionally set essential cookies for marketing or ad tracking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Analytics</h2>
          <p>
            BuzzPay uses privacy-friendly analytics where applicable, such as Vercel Analytics, to understand page usage and improve the site. The current setup is intended to avoid ad-tech style tracking. BuzzPay does not currently use Google Analytics, Google Tag Manager, Meta Pixel, TikTok Pixel, Hotjar, Microsoft Clarity, or similar advertising trackers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Affiliate redirects</h2>
          <p>
            Some recommendation links use internal <Link href="/go/payroll" className="font-semibold text-honeyDeep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[4px]">redirect routes</Link> before sending you to a third-party site. These redirects are used for link management and may support affiliate tracking at the destination or through the affiliate provider. BuzzPay does not use them as a reason to add a cookie banner by default.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Future marketing cookies</h2>
          <p>
            If BuzzPay later adds advertising or other non-essential tracking tools that use cookies or similar technologies, BuzzPay may request consent where required. This policy will be updated if that changes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Related privacy pages</h2>
          <p>
            See the <Link href="/privacy" className="font-semibold text-honeyDeep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[4px]">Privacy &amp; affiliate disclosure page</Link> for details on report requests, calculator snapshots, AI explanations, Supabase storage, Resend email delivery, and affiliate links.
          </p>
        </section>
      </div>
    </div>
  );
}
