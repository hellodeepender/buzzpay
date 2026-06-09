import type { MetadataRoute } from "next";
import { seoSitemapPaths } from "@/lib/seo-registry";
import { templates } from "@/lib/templates";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.buzzpay.app";
  const routes = ["", "/payment-fee-calculator/stripe", "/payment-fee-calculator/paypal", "/payment-fee-calculator/square", "/freelance-rate-calculator/designer", "/freelance-rate-calculator/writer", "/freelance-rate-calculator/developer", "/freelance-rate-calculator/consultant", "/freelance-rate-calculator/virtual-assistant", "/templates", ...Object.keys(templates).map((s) => `/templates/${s}`), ...seoSitemapPaths];
  return routes.map((r) => ({ url: base + r, lastModified: new Date(), changeFrequency: "weekly", priority: r === "" ? 1 : 0.8 }));
}
