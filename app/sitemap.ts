import type { MetadataRoute } from "next";
import { templates } from "@/lib/templates";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.buzzpay.app";
  const routes = ["", "/contractor-finance", "/w2-vs-c2c", "/contractor-rate-calculator", "/s-corp-savings-calculator", "/llc-vs-s-corp", "/1099-tax-calculator", "/payment-fee-calculator", "/payment-fee-calculator/stripe", "/payment-fee-calculator/paypal", "/payment-fee-calculator/square", "/invoice-generator", "/freelance-rate-calculator", "/freelance-rate-calculator/designer", "/freelance-rate-calculator/writer", "/freelance-rate-calculator/developer", "/freelance-rate-calculator/consultant", "/freelance-rate-calculator/virtual-assistant", "/templates", ...Object.keys(templates).map((s) => `/templates/${s}`), "/guides/getting-paid-by-international-clients", "/guides/getting-clients-to-pay-on-time", "/about", "/cookie-policy", "/affiliate-disclosure", "/privacy"];
  return routes.map((r) => ({ url: base + r, lastModified: new Date(), changeFrequency: "weekly", priority: r === "" ? 1 : 0.8 }));
}
