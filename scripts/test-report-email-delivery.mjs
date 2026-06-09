import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

function transpileToTemp(url) {
  const source = readFileSync(url, "utf8");
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

const reportEmailSource = new URL("../lib/report-request-email.ts", import.meta.url);
const reportEmailOut = transpileToTemp(reportEmailSource);
const reportEmailUrl = pathToFileURL(reportEmailOut).href;

const deliverySource = readFileSync(new URL("../lib/report-email-delivery.ts", import.meta.url), "utf8");
const deliveryCompiled = ts.transpileModule(deliverySource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2020,
    strict: true,
  },
});
const deliveryOut = join(tmpdir(), `buzzpay-delivery-${Date.now()}-${Math.random().toString(16).slice(2)}.mjs`);
writeFileSync(
  deliveryOut,
  deliveryCompiled.outputText.replaceAll("@/lib/report-request-email", reportEmailUrl),
);

const { deliverReportEmail } = await import(pathToFileURL(deliveryOut));

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

const skipped = await deliverReportEmail({
  resendClient: null,
  from: null,
  to: "lead@example.com",
  calculatorName: "W2 vs C2C Calculator",
  pagePath: "/w2-vs-c2c",
  resultSnapshot: snapshot,
});

assert.deepEqual(skipped, {
  status: "skipped",
  emailError: "Resend not configured",
  resendEmailId: null,
});

let sendCalls = 0;
const sentPayloads = [];
const success = await deliverReportEmail({
  resendClient: {
    emails: {
      async send(payload) {
        sendCalls += 1;
        sentPayloads.push(payload);
        return { data: { id: "email_123" }, error: null };
      },
    },
  },
  from: "BuzzPay <reports@buzzpay.app>",
  replyTo: "help@buzzpay.app",
  to: "lead@example.com",
  firstName: "Sam",
  calculatorName: "W2 vs C2C Calculator",
  pagePath: "/w2-vs-c2c",
  resultSnapshot: snapshot,
});

assert.equal(sendCalls, 1);
assert.equal(sentPayloads[0].replyTo, "help@buzzpay.app");
assert.equal(sentPayloads[0].subject, "Your BuzzPay contractor report");
assert.match(sentPayloads[0].text, /BuzzPay/);
assert.match(sentPayloads[0].text, /Educational contractor finance tools/);
assert.match(sentPayloads[0].text, /https:\/\/www\.buzzpay\.app\/privacy/);
assert.match(sentPayloads[0].html, /BuzzPay/);
assert.match(sentPayloads[0].html, /Educational contractor finance tools/);
assert.match(sentPayloads[0].html, /affiliate-disclosure/);
assert.deepEqual(success, {
  status: "sent",
  emailError: null,
  resendEmailId: "email_123",
});

const failed = await deliverReportEmail({
  resendClient: {
    emails: {
      async send() {
        return { data: null, error: { message: "boom", statusCode: 500 } };
      },
    },
  },
  from: "BuzzPay <reports@buzzpay.app>",
  to: "lead@example.com",
  calculatorName: "W2 vs C2C Calculator",
  pagePath: "/w2-vs-c2c",
});

assert.deepEqual(failed, {
  status: "failed",
  emailError: "Email delivery failed.",
  resendEmailId: null,
});

console.log("report email delivery tests passed");
