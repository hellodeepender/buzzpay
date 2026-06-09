import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import {
  createMetadata,
  DEFAULT_DESCRIPTION,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";

const rootMetadata = createMetadata({
  title: "buzzpay — free tools to get paid",
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export const metadata: Metadata = {
  ...rootMetadata,
  metadataBase: new URL("https://www.buzzpay.app"),
  title: { default: "buzzpay — free tools to get paid", template: "%s · buzzpay" },
  description: DEFAULT_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta {...({ name: "impact-site-verification", value: "15bb071e-ba6a-40a2-9311-35e022df7ecb" } as React.MetaHTMLAttributes<HTMLMetaElement>)} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans leading-relaxed">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <div className="max-w-[1040px] mx-auto px-5">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
