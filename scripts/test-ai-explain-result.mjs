import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const helperSource = readFileSync(new URL("../lib/ai-explain-result.ts", import.meta.url), "utf8")
  .replace(/^import\s+"server-only";\s*$/m, "");
const helperCompiled = ts.transpileModule(helperSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2020,
    strict: true,
  },
});
const helperFile = join(tmpdir(), `buzzpay-ai-helper-${Date.now()}.mjs`);
writeFileSync(helperFile, helperCompiled.outputText);
const {
  buildExplainResultMessages,
  normalizeExplainResultResponse,
  validateExplainResultPayload,
  explainResultLimits,
} = await import(pathToFileURL(helperFile));

const baseSnapshot = {
  calculatorSlug: "w2-vs-c2c",
  calculatorName: "W2 vs C2C Calculator",
  generatedAt: "2026-06-08T12:00:00.000Z",
  assumptionsVersion: "2026-06-08",
  summary: "C2C appears ahead by $12,000.",
  assumptions: ["Uses 2026 planning assumptions", "Tax rate is user supplied"],
  keyInputs: {
    "W2 salary": "$120,000.00",
    "C2C hourly rate": "$110.00/hr",
  },
  keyResults: {
    "Estimated difference": "$12,000.00",
    "C2C retained value": "$82,000.00",
  },
};

const valid = validateExplainResultPayload(JSON.stringify({ resultSnapshot: baseSnapshot }));
assert.equal(valid.ok, true);
assert.equal(valid.snapshot.calculatorSlug, "w2-vs-c2c");

const missing = validateExplainResultPayload(JSON.stringify({}));
assert.equal(missing.ok, false);
assert.match(missing.error, /snapshot/i);

const oversized = validateExplainResultPayload("x".repeat(explainResultLimits.maxRequestBodyChars + 1));
assert.equal(oversized.ok, false);

const prompt = buildExplainResultMessages(valid.snapshot);
assert.match(prompt.system, /not a CPA/);
assert.match(prompt.user, /Key inputs:/);
assert.match(prompt.user, /Key results:/);
assert.match(prompt.user, /W2 vs C2C Calculator/);

const explanation = normalizeExplainResultResponse({
  summary: "C2C can be better when billable hours are realistic.",
  keyTakeaways: ["Higher rate must cover downtime."],
  risksAndAssumptions: ["Tax rate is only a planning estimate."],
  nextSteps: ["Compare the offer against your W2 package."],
  negotiationTips: ["Ask for a higher rate if the contract has unpaid gaps."],
  disclaimer: "Educational only, not tax, legal, or financial advice.",
});
assert.equal(explanation?.summary, "C2C can be better when billable hours are realistic.");

const aiComponentSource = readFileSync(new URL("../components/AIResultExplanation.tsx", import.meta.url), "utf8");
assert.doesNotMatch(aiComponentSource, /useEffect\s*\(/);
assert.match(aiComponentSource, /Explain my result with AI/);
assert.match(aiComponentSource, /fetch\("\/api\/ai\/explain-result"/);
assert.match(aiComponentSource, /Generating your explanation\.\.\./);
assert.match(aiComponentSource, /rateLimited/);
assert.match(aiComponentSource, /dailyBudgetUnavailable/);
assert.match(aiComponentSource, /timeout/);
assert.match(aiComponentSource, /aria-live="polite"/);

console.log("ai explain result tests passed");
