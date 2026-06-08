import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description: "About buzzpay — free tools to help freelancers and small businesses get paid.",
  path: "/about",
});
export default function Page() {
  return (
    <div className="py-2 max-w-[680px]">
      <h1 className="font-display text-3xl font-semibold mb-4">About buzzpay</h1>
      <p className="text-ink2 mb-3">buzzpay is a small collection of free, no-signup tools that help freelancers and small businesses understand their money before it moves — what they keep after fees, what to charge, and how to invoice cleanly.</p>
      <p className="text-ink2">Every tool is free. Some links to third-party software are affiliate links, which is how the site supports itself at no extra cost to you.</p>
    </div>
  );
}
