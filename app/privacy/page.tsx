import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy & disclosure", description: "Privacy and affiliate disclosure for buzzpay." };
export default function Page() {
  return (
    <div className="py-2 max-w-[680px]">
      <h1 className="font-display text-3xl font-semibold mb-4">Privacy &amp; affiliate disclosure</h1>
      <p className="text-ink2 mb-3">The calculators run entirely in your browser. The invoice details you enter are not sent to or stored on any server.</p>
      <p className="text-ink2 mb-3"><b className="text-ink">Affiliate disclosure:</b> some outbound links to third-party software (such as invoicing and accounting tools) are affiliate links. If you sign up through them, buzzpay may earn a commission at no additional cost to you. Recommendations are made on relevance, not commission.</p>
      <p className="text-ink2">Calculators provide estimates only and are not financial, tax, or legal advice.</p>
    </div>
  );
}
