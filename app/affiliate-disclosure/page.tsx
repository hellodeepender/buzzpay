import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Affiliate Disclosure",
  description: "BuzzPay affiliate disclosure and recommendation policy.",
  path: "/affiliate-disclosure",
});

export default function Page() {
  return (
    <div className="py-2 max-w-[720px]">
      <h1 className="font-display text-3xl font-semibold mb-4">Affiliate disclosure</h1>
      <p className="text-ink2 mb-3">
        BuzzPay may earn commissions from some recommended services. When a recommendation has an affiliate
        relationship, that commission does not change the cost you pay.
      </p>
      <p className="text-ink2 mb-3">
        Calculators and articles on BuzzPay are educational only. They are built to help you compare options,
        understand assumptions, and organize questions before making a decision.
      </p>
      <p className="text-ink2 mb-3">
        BuzzPay does not provide tax, legal, or financial advice. When a decision affects your filing status,
        business structure, contracts, or taxes, review the facts with a qualified professional.
      </p>
      <p className="text-ink2 mb-4">
        For more information about how we handle privacy and disclosures, see the{" "}
        <Link href="/privacy" className="font-semibold text-honeyDeep underline">
          privacy and disclosure page
        </Link>
        .
      </p>
    </div>
  );
}
