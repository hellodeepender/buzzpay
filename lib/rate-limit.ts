import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type RateLimitRpcClient = {
  rpc(
    name: string,
    params: {
      p_key: string;
      p_max: number;
      p_window_seconds: number;
    },
  ): Promise<{
    data: unknown;
    error: { message: string; code?: string | null } | null;
  }>;
};

export type RateLimitCheckResult = {
  limited: boolean;
  currentCount?: number;
  unavailable?: boolean;
};

export type AiRateLimitResult =
  | { ok: true }
  | {
      ok: false;
      statusCode: 429 | 503;
      errorMessage: string;
      reason: "per-ip-limit" | "global-limit" | "unavailable";
    };

function parseRateLimitRow(data: unknown) {
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  if (data && typeof data === "object") {
    return data as Record<string, unknown>;
  }
  return null;
}

export async function checkRateLimit({
  key,
  max,
  windowSeconds,
  client,
}: {
  key: string;
  max: number;
  windowSeconds: number;
  client?: RateLimitRpcClient | null;
}): Promise<RateLimitCheckResult> {
  const supabase = (client ?? getSupabaseServerClient()) as RateLimitRpcClient | null;
  if (!supabase) {
    return { limited: false, unavailable: true };
  }

  try {
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key.slice(0, 255),
      p_max: max,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      return { limited: false, unavailable: true };
    }

    const row = parseRateLimitRow(data);
    if (!row) {
      return { limited: false, unavailable: true };
    }

    return {
      limited: Boolean(row.limited),
      currentCount:
        typeof row.current_count === "number"
          ? row.current_count
          : Number(row.current_count ?? 0),
    };
  } catch {
    return { limited: false, unavailable: true };
  }
}

export async function evaluateAiRequestRateLimits({
  client,
  clientIp,
  perIpMax,
  perIpWindowSeconds,
  dailyLimit,
  dailyWindowSeconds,
  dailyKey,
}: {
  client?: RateLimitRpcClient | null;
  clientIp: string;
  perIpMax: number;
  perIpWindowSeconds: number;
  dailyLimit: number;
  dailyWindowSeconds: number;
  dailyKey: string;
}): Promise<AiRateLimitResult> {
  const perIp = await checkRateLimit({
    key: `ai:ip:${clientIp}`,
    max: perIpMax,
    windowSeconds: perIpWindowSeconds,
    client,
  });

  if (perIp.unavailable) {
    return {
      ok: false,
      statusCode: 503,
      errorMessage: "AI explanations are temporarily unavailable.",
      reason: "unavailable",
    };
  }

  if (perIp.limited) {
    return {
      ok: false,
      statusCode: 429,
      errorMessage: "Too many requests. Try again later.",
      reason: "per-ip-limit",
    };
  }

  const daily = await checkRateLimit({
    key: `ai:daily:${dailyKey}`,
    max: dailyLimit,
    windowSeconds: dailyWindowSeconds,
    client,
  });

  if (daily.unavailable) {
    return {
      ok: false,
      statusCode: 503,
      errorMessage: "AI explanations are temporarily unavailable.",
      reason: "unavailable",
    };
  }

  if (daily.limited) {
    return {
      ok: false,
      statusCode: 503,
      errorMessage: "AI explanations are temporarily unavailable.",
      reason: "global-limit",
    };
  }

  return { ok: true };
}
