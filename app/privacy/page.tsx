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
        BuzzPay calculators run in your browser. Some features, like emailed report requests and AI explanations, send information to BuzzPay so the site can generate a response.
      </p>
      <div className="space-y-4 text-ink2 leading-7">
        <p>
          <b className="text-ink">Email report requests.</b> If you request a report, BuzzPay stores the email address, optional first name, calculator name, calculator slug, page path, result snapshot, and consent details in Supabase. If email delivery is available, BuzzPay uses Resend to send the report.
        </p>
        <p>
          <b className="text-ink">Calculator snapshots.</b> Report snapshots contain the current calculator inputs, outputs, assumptions, and timestamps needed to produce the emailed report. BuzzPay keeps the snapshot small and avoids storing unrelated sensitive details.
        </p>
        <p>
          <b className="text-ink">AI explanations.</b> If you click to explain a result, BuzzPay sends the calculator snapshot to OpenAI so it can generate a short educational explanation. The AI feature only runs when you click the button.
        </p>
        <p>
          <b className="text-ink">Analytics.</b> BuzzPay uses Vercel Analytics events for product usage and debugging, such as report requests, AI explanation clicks, recommendation card clicks, and related navigation.
        </p>
        <p>
          <b className="text-ink">Affiliate disclosure.</b> Some recommendation cards and outbound links may be affiliate links. If you use them, BuzzPay may earn a commission at no extra cost to you. Recommendations are educational and should be evaluated based on your own needs. See the <Link href="/affiliate-disclosure" className="font-semibold text-honeyDeep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honeyDeep focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-[4px]">affiliate disclosure</Link> for details.
        </p>
        <p>
          <b className="text-ink">Opt out and privacy.</b> You can ask to stop future contractor finance emails by replying with unsubscribe. Calculators and articles are educational only and are not tax, legal, or financial advice.
        </p>
      </div>
    </div>
  );
}
