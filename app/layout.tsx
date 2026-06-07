import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://buzzpay.app"),
  title: { default: "buzzpay — free tools to get paid", template: "%s · buzzpay" },
  description: "Free calculators for freelancers and small businesses: payment fee calculator, invoice generator, and freelance rate calculator.",
  openGraph: { type: "website", siteName: "buzzpay", url: "https://buzzpay.app" },
  twitter: { card: "summary_large_image", title: "buzzpay — free tools to get paid", description: "Free calculators for freelancers and small businesses." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans leading-relaxed">
        <div className="max-w-[1040px] mx-auto px-5">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
