import { NextResponse } from "next/server";
import "server-only";
import {
  buildExplainResultMessages,
  explainResultLimits,
  normalizeExplainResultResponse,
  validateExplainResultPayload,
} from "@/lib/ai-explain-result";

type RateBucket = { count: number; resetAt: number };
const rateLimitStore = new Map<string, RateBucket>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 4;

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  rateLimitStore.set(key, bucket);
  return bucket.count > RATE_LIMIT_MAX;
}

function buildErrorResponse(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  if (isRateLimited(`${clientIp}:ai-explain-result`)) {
    return buildErrorResponse("Too many requests. Try again later.", 429);
  }

  const rawBody = await request.text();
  if (rawBody.length > explainResultLimits.maxRequestBodyChars) {
    return buildErrorResponse("Request body is too large.", 413);
  }

  const validated = validateExplainResultPayload(rawBody);
  if (!validated.ok) {
    return buildErrorResponse(validated.error, 400);
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return buildErrorResponse("AI explanations are not configured.", 503);
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
  const messages = buildExplainResultMessages(validated.snapshot);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: messages.system },
          { role: "user", content: messages.user },
        ],
      }),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("[ai-explain-result] OpenAI request failed", { status: response.status });
      }
      return buildErrorResponse("We could not generate an explanation right now.", 502);
    }

    const payload = (await response.json().catch(() => null)) as
      | {
          choices?: Array<{
            message?: {
              content?: string | null;
            };
          }>;
        }
      | null;

    const content = payload?.choices?.[0]?.message?.content;
    if (!content) {
      return buildErrorResponse("We could not generate an explanation right now.", 502);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.error("[ai-explain-result] Invalid JSON from model");
      }
      return buildErrorResponse("We could not generate an explanation right now.", 502);
    }

    const explanation = normalizeExplainResultResponse(parsed);
    if (!explanation) {
      return buildErrorResponse("We could not generate an explanation right now.", 502);
    }

    return NextResponse.json({
      ok: true,
      explanation,
      model,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ai-explain-result] request failed", {
        errorType: error instanceof Error ? error.name : "unknown",
      });
    }
    return buildErrorResponse("We could not generate an explanation right now.", 502);
  }
}
