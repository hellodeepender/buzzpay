import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.buzzpay.app";
  const routes = ["", "/payment-fee-calculator", "/invoice-generator", "/freelance-rate-calculator", "/freelance-rate-calculator/designer", "/freelance-rate-calculator/writer", "/freelance-rate-calculator/developer", "/freelance-rate-calculator/consultant", "/freelance-rate-calculator/virtual-assistant", "/about", "/privacy"];
  return routes.map((r) => ({ url: base + r, lastModified: new Date(), changeFrequency: "weekly", priority: r === "" ? 1 : 0.8 }));
}
