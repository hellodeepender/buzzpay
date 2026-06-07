import { ogImage, ogSize } from "@/lib/og-image";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "buzzpay Invoice Generator";
export default function Image() {
  return ogImage("Free Invoice Generator", "Create a clean, professional invoice and download it as a PDF — no signup.");
}
