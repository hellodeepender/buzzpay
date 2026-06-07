import { ogImage, ogSize } from "@/lib/og-image";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "buzzpay Freelance Rate Calculator";
export default function Image() {
  return ogImage("Freelance Rate Calculator", "Find the hourly rate you actually need — after taxes, expenses, and unbillable time.");
}
