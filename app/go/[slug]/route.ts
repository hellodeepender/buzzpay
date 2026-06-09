import { NextResponse } from "next/server";
import { track } from "@vercel/analytics/server";
import { getAffiliateRedirectConfig } from "@/lib/affiliate-redirects";

function safeRedirect(target: string, request: Request) {
  return NextResponse.redirect(new URL(target, request.url), 307);
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const config = getAffiliateRedirectConfig(params.slug);
  const destination = config ? process.env[config.envVarName]?.trim() : undefined;
  const hasDestination = Boolean(destination);
  const fallbackTarget = "/contractor-finance#recommended-next-steps";

  try {
    await track(
      "affiliate_redirect",
      {
        slug: config?.slug ?? params.slug,
        hasDestination,
        destinationType: hasDestination ? "affiliate" : "fallback",
      },
      {
        request: {
          headers: Object.fromEntries(request.headers.entries()),
        },
      },
    );
  } catch {
    // Analytics should never block redirects.
  }

  try {
    if (hasDestination) {
      return safeRedirect(destination as string, request);
    }
  } catch {
    // Fall through to safe fallback.
  }

  return safeRedirect(fallbackTarget, request);
}
