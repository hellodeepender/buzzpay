import { ogImage, ogSize } from "@/lib/og-image";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "buzzpay Payment Fee Calculator";
export default function Image() {
  return ogImage("Payment Fee Calculator", "See exactly what you keep after Stripe, PayPal & Square fees.");
}
