import { NextResponse } from "next/server";
import "server-only";
import {
  buildExplainResultMessages,
  explainResultLimits,
  normalizeExplainResultResponse,
  validateExplainResultPayload,
} from "@/lib/ai-explain-result";
import { evaluateAiRequestRateLimits } from "@/lib/rate-limit";
import { getTrustedClientIp } from "@/lib/request-ip";

function buildErrorResponse(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (rawBody.length > explainResultLimits.maxRequestBodyChars) {
    return buildErrorResponse("Request body is too large.", 413);
  }

  const validated = validateExplainResultPayload(rawBody);
  if (!validated.ok) {
    return buildErrorResponse(validated.error, 400);
  }

  const clientIp = getTrustedClientIp(request);
  const dailyLimit = Number(process.env.AI_DAILY_LIMIT ?? "500");
  const aiBudget = await evaluateAiRequestRateLimits({
    clientIp,
    dailyKey: new Date().toISOString().slice(0, 10),
    dailyLimit: Number.isFinite(dailyLimit) && dailyLimit > 0 ? Math.floor(dailyLimit) : 500,
    dailyWindowSeconds: 24 * 60 * 60,
    perIpMax: 4,
    perIpWindowSeconds: 10 * 60,
  });

  if (!aiBudget.ok) {
    return NextResponse.json(
      { ok: false, error: aiBudget.errorMessage, reason: aiBudget.reason },
      { status: aiBudget.statusCode },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return buildErrorResponse("AI explanations are not configured.", 503);
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
  const messages = buildExplainResultMessages(validated.snapshot);
  const controller = new AbortController();
  const timeoutMs = 15_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        max_completion_tokens: 500,
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
      return NextResponse.json(
        { ok: false, error: "We could not generate an explanation right now.", reason: "openai_error" },
        { status: 502 },
      );
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
      return NextResponse.json(
        { ok: false, error: "We could not generate an explanation right now.", reason: "openai_error" },
        { status: 502 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.error("[ai-explain-result] Invalid JSON from model");
      }
      return NextResponse.json(
        { ok: false, error: "We could not generate an explanation right now.", reason: "openai_error" },
        { status: 502 },
      );
    }

    const explanation = normalizeExplainResultResponse(parsed);
    if (!explanation) {
      return NextResponse.json(
        { ok: false, error: "We could not generate an explanation right now.", reason: "openai_error" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      explanation,
      model,
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    if (process.env.NODE_ENV === "development") {
      console.error("[ai-explain-result] request failed", {
        errorType: error instanceof Error ? error.name : "unknown",
      });
    }
    return NextResponse.json(
      {
        ok: false,
        error: aborted
          ? "We could not generate an explanation right now."
          : "We could not generate an explanation right now.",
        reason: aborted ? "timeout" : "openai_error",
      },
      { status: aborted ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
