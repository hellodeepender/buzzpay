import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://buzzpay.app";
  const routes = ["", "/payment-fee-calculator", "/invoice-generator", "/freelance-rate-calculator", "/about", "/privacy"];
  return routes.map((r) => ({ url: base + r, lastModified: new Date(), changeFrequency: "weekly", priority: r === "" ? 1 : 0.8 }));
}
