import "server-only";
import { ipAddress } from "@vercel/functions";

function normalizeHeaderIp(value: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  const ip = trimmed.split(",")[0]?.trim();
  return ip ?? "";
}

export function getTrustedClientIp(request: Request) {
  const primary = normalizeHeaderIp(ipAddress(request) ?? "");
  if (primary) return primary;

  const headers = request.headers;
  const hasTrustedVercelHeaders = Boolean(headers.get("x-vercel-id"));
  if (!hasTrustedVercelHeaders) return "unknown";

  const trustedFallbacks = [
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for"),
  ];

  for (const fallback of trustedFallbacks) {
    const ip = normalizeHeaderIp(fallback);
    if (ip) return ip;
  }

  return "unknown";
}
