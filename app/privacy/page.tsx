import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy & disclosure",
  description: "Privacy and affiliate disclosure for buzzpay.",
  path: "/privacy",
});
export default function Page() {
  return (
    <div className="py-2 max-w-[760px]">
      <h1 className="font-display text-3xl font-semibold mb-4">Privacy &amp; affiliate disclosure</h1>
      <p className="text-ink2 mb-3">
        BuzzPay calculators run in your browser. Some features, like emailed report requests and AI explanations, send information to BuzzPay so the site can generate a response. BuzzPay currently aims to use privacy-friendly analytics where applicable and does not run a cookie banner unless non-essential cookies or similar technologies are actually added.
      </p>
      <div className="space-y-5 text-ink2 leading-7">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Analytics</h2>
          <p>
            BuzzPay uses Vercel Analytics events for product usage and debugging, such as report requests, AI explanation clicks, recommendation card clicks, and related navigation. The current setup is intended to be privacy-friendly and not based on advertising cookies.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Cookies and similar technologies</h2>
          <p>
            BuzzPay does not currently use Google Analytics, Google Tag Manager, Meta Pixel, TikTok Pixel, Hotjar, Microsoft Clarity, or similar advertising trackers. See the <Link href="/cookie-policy" className="font-semibold text-honeyDeep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[4px]">cookie policy</Link> for the current approach to essential cookies, analytics, and affiliate redirects. If future advertising or tracking tools are added, BuzzPay may request consent where required.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Email report requests</h2>
          <p>
            If you request a report, BuzzPay stores the email address, optional first name, calculator name, calculator slug, page path, result snapshot, and consent details in Supabase. If email delivery is available, BuzzPay uses Resend to send the report.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Calculator snapshots</h2>
          <p>
            Report snapshots contain the current calculator inputs, outputs, assumptions, and timestamps needed to produce the emailed report. BuzzPay keeps the snapshot small and avoids storing unrelated sensitive details.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">AI explanations</h2>
          <p>
            If you click to explain a result, BuzzPay sends the calculator snapshot to OpenAI so it can generate a short educational explanation. The AI feature only runs when you click the button.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Resend email delivery</h2>
          <p>
            BuzzPay uses Resend to send emailed reports when configured. Delivery status is stored so the site can keep track of whether a message was sent, skipped, or failed without exposing internal service details.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Supabase storage</h2>
          <p>
            BuzzPay stores report requests and related delivery metadata in Supabase. This includes consent details for emailed reports and the minimum information needed to manage requests safely.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Affiliate disclosure</h2>
          <p>
            Some recommendation cards and outbound links may be affiliate links. If you use them, BuzzPay may earn a commission at no extra cost to you. Recommendations are educational and should be evaluated based on your own needs. See the <Link href="/affiliate-disclosure" className="font-semibold text-honeyDeep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[4px]">affiliate disclosure</Link> for details.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2">Opt out and privacy</h2>
          <p>
            You can ask to stop future contractor finance emails by replying with unsubscribe. Calculators and articles are educational only and are not tax, legal, or financial advice.
          </p>
        </section>
      </div>
    </div>
  );
}
