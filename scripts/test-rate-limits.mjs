import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

function transpile(url, { stripServerOnly = false } = {}) {
  let source = readFileSync(url, "utf8");
  if (stripServerOnly) {
    source = source.replace(/^import\s+"server-only";\s*$/gm, "");
  }
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2020,
      strict: true,
    },
  });
  const outFile = join(tmpdir(), `buzzpay-${Date.now()}-${Math.random().toString(16).slice(2)}.mjs`);
  writeFileSync(outFile, compiled.outputText);
  return outFile;
}

const supabaseStub = join(tmpdir(), `buzzpay-supabase-stub-${Date.now()}.mjs`);
writeFileSync(supabaseStub, `export function getSupabaseServerClient() { return null; }\n`);
const vercelFunctionsUrl = await import.meta.resolve("@vercel/functions");

const rateLimitSource = readFileSync(new URL("../lib/rate-limit.ts", import.meta.url), "utf8")
  .replace(/^import\s+"server-only";\s*$/gm, "")
  .replaceAll("@/lib/supabase/server", pathToFileURL(supabaseStub).href);
const rateLimitCompiled = ts.transpileModule(rateLimitSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2020,
    strict: true,
  },
});
const rateLimitFile = join(tmpdir(), `buzzpay-rate-limit-${Date.now()}.mjs`);
writeFileSync(rateLimitFile, rateLimitCompiled.outputText);
const {
  checkRateLimit,
  evaluateAiRequestRateLimits,
} = await import(pathToFileURL(rateLimitFile));

const requestIpRaw = readFileSync(new URL("../lib/request-ip.ts", import.meta.url), "utf8")
  .replace(/^import\s+"server-only";\s*$/gm, "")
  .replaceAll("@vercel/functions", vercelFunctionsUrl);
const requestIpCompiled = ts.transpileModule(requestIpRaw, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2020,
    strict: true,
  },
});
const requestIpSource = join(tmpdir(), `buzzpay-request-ip-${Date.now()}.mjs`);
writeFileSync(requestIpSource, requestIpCompiled.outputText);
const { getTrustedClientIp } = await import(pathToFileURL(requestIpSource));

const robotsSource = transpile(new URL("../app/robots.ts", import.meta.url));
const { default: robots } = await import(pathToFileURL(robotsSource));

const limitedClient = {
  async rpc() {
    return { data: [{ limited: true, current_count: 6 }], error: null };
  },
};
const availableClient = {
  async rpc() {
    return { data: [{ limited: false, current_count: 1 }], error: null };
  },
};
const unavailableClient = {
  async rpc() {
    return { data: null, error: { message: "down" } };
  },
};

const limited = await checkRateLimit({
  client: limitedClient,
  key: "report:email:test@example.com",
  max: 5,
  windowSeconds: 600,
});
assert.equal(limited.limited, true);

const unavailable = await checkRateLimit({
  client: null,
  key: "report:email:test@example.com",
  max: 5,
  windowSeconds: 600,
});
assert.equal(unavailable.unavailable, true);

const aiAllowed = await evaluateAiRequestRateLimits({
  client: availableClient,
  clientIp: "203.0.113.10",
  perIpMax: 4,
  perIpWindowSeconds: 600,
  dailyLimit: 500,
  dailyWindowSeconds: 86400,
  dailyKey: "2026-06-09",
});
assert.deepEqual(aiAllowed, { ok: true });

const aiPerIpLimited = await evaluateAiRequestRateLimits({
  client: limitedClient,
  clientIp: "203.0.113.10",
  perIpMax: 4,
  perIpWindowSeconds: 600,
  dailyLimit: 500,
  dailyWindowSeconds: 86400,
  dailyKey: "2026-06-09",
});
assert.equal(aiPerIpLimited.ok, false);
assert.equal(aiPerIpLimited.statusCode, 429);

let rpcCount = 0;
const aiDailyLimited = await evaluateAiRequestRateLimits({
  client: {
    async rpc(name, params) {
      rpcCount += 1;
      if (rpcCount === 1) {
        return { data: [{ limited: false, current_count: 1 }], error: null };
      }
      return { data: [{ limited: true, current_count: 501 }], error: null };
    },
  },
  clientIp: "203.0.113.10",
  perIpMax: 4,
  perIpWindowSeconds: 600,
  dailyLimit: 500,
  dailyWindowSeconds: 86400,
  dailyKey: "2026-06-09",
});
assert.equal(aiDailyLimited.ok, false);
assert.equal(aiDailyLimited.statusCode, 503);

const aiUnavailable = await evaluateAiRequestRateLimits({
  client: unavailableClient,
  clientIp: "203.0.113.10",
  perIpMax: 4,
  perIpWindowSeconds: 600,
  dailyLimit: 500,
  dailyWindowSeconds: 86400,
  dailyKey: "2026-06-09",
});
assert.equal(aiUnavailable.ok, false);
assert.equal(aiUnavailable.statusCode, 503);

const trustedRequest = new Request("https://example.com", {
  headers: {
    "x-vercel-id": "sfo1::abc123",
    "x-forwarded-for": "198.51.100.23, 10.0.0.1",
  },
});
assert.equal(getTrustedClientIp(trustedRequest), "198.51.100.23");

const unknownRequest = new Request("https://example.com");
assert.equal(getTrustedClientIp(unknownRequest), "unknown");

assert.deepEqual(robots(), {
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/", "/go/"],
  },
  sitemap: "https://www.buzzpay.app/sitemap.xml",
});

const routeSource = readFileSync(new URL("../app/api/report-request/route.ts", import.meta.url), "utf8");
assert.match(routeSource, /checkRateLimit/);
assert.match(routeSource, /durable rate limiter unavailable; continuing/);

const aiRouteSource = readFileSync(new URL("../app/api/ai/explain-result/route.ts", import.meta.url), "utf8");
assert.match(aiRouteSource, /evaluateAiRequestRateLimits/);
assert.match(aiRouteSource, /AI_DAILY_LIMIT/);
assert.match(aiRouteSource, /max_completion_tokens/);

console.log("rate limit and robots tests passed");
