import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const source = readFileSync(new URL("../lib/report-request-email.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2020,
    strict: true,
  },
});
const outFile = join(tmpdir(), `buzzpay-report-email-${Date.now()}.mjs`);
writeFileSync(outFile, compiled.outputText);
const { renderReportEmail } = await import(pathToFileURL(outFile));

const snapshot = {
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

const withSnapshot = renderReportEmail({
  firstName: "  Alex<script>  ",
  calculatorName: "W2 vs C2C Calculator",
  pagePath: "/w2-vs-c2c",
  resultSnapshot: snapshot,
});

assert.match(withSnapshot.text, /Here is your BuzzPay contractor finance report\./);
assert.match(withSnapshot.text, /Hi Alex,/);
assert.match(withSnapshot.text, /W2 salary: \$120,000\.00/);
assert.match(withSnapshot.text, /Estimated difference: \$12,000\.00/);
assert.match(withSnapshot.text, /Plain-English interpretation:\s+C2C appears ahead by \$12,000\./);
assert.match(withSnapshot.text, /W2 vs C2C/);
assert.match(withSnapshot.html, /BuzzPay/);
assert.match(withSnapshot.html, /Contractor finance report/);
assert.match(withSnapshot.html, /Report summary/);
assert.match(withSnapshot.html, /Key inputs/);
assert.match(withSnapshot.html, /Key results/);
assert.match(withSnapshot.html, /Assumptions/);
assert.match(withSnapshot.html, /Disclaimer/);
assert.match(withSnapshot.html, /Open calculator/);

const fallback = renderReportEmail({
  calculatorName: "W2 vs C2C Calculator",
  pagePath: "/w2-vs-c2c",
});

assert.match(fallback.text, /Your BuzzPay contractor finance report request is on file\./);
assert.match(fallback.html, /Your BuzzPay contractor finance report request is on file\./);
assert.doesNotMatch(fallback.text, /Key inputs/);

console.log("report request tests passed");
