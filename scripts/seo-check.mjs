import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, normalize } from "node:path";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import ts from "typescript";

const repoRoot = process.cwd();

function transpileTsModule(relativePath) {
  const source = readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.Preserve,
      strict: true,
    },
  });
  const outFile = join(tmpdir(), `buzzpay-seo-check-${relativePath.replace(/[\\/.:]/g, "_")}-${Date.now()}.mjs`);
  writeFileSync(outFile, compiled.outputText);
  return outFile;
}

async function main() {
  const registryFile = transpileTsModule("lib/seo-registry.ts");
  const { seoPages, seoSitemapPaths } = await import(pathToFileURL(registryFile));

  const requiredRoutes = [
    "/",
    "/contractor-finance",
    "/contractor-rate-calculator",
    "/w2-vs-c2c",
    "/s-corp-savings-calculator",
    "/llc-vs-s-corp",
    "/1099-tax-calculator",
    "/cookie-policy",
    "/privacy",
    "/affiliate-disclosure",
    "/guides/w2-vs-c2c-which-pays-more",
    "/guides/how-much-should-an-it-contractor-charge",
    "/guides/c2c-vs-1099-vs-w2",
    "/guides/s-corp-tax-savings-for-contractors",
    "/guides/contractor-business-expenses-checklist",
    "/guides/quarterly-taxes-for-1099-contractors",
    "/guides/llc-vs-s-corp-for-consultants",
    "/guides/how-to-calculate-a-contractor-hourly-rate",
    "/guides/what-is-a-reasonable-s-corp-salary",
    "/guides/how-to-switch-from-w2-to-c2c",
    "/contractor-rate-calculator/it-consultant",
    "/contractor-rate-calculator/software-engineer",
    "/contractor-rate-calculator/project-manager",
    "/contractor-rate-calculator/data-engineer",
    "/contractor-rate-calculator/business-analyst",
  ];

  for (const route of requiredRoutes) {
    assert.ok(seoSitemapPaths.includes(route), `Missing route in SEO registry/sitemap: ${route}`);
  }

  const sitemapSource = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  assert.match(sitemapSource, /seoSitemapPaths/);
  assert.ok(!sitemapSource.includes("/api/"), "Sitemap source should not include /api/ routes");
  assert.ok(!sitemapSource.includes("/go/"), "Sitemap source should not include /go/ routes");

  const robotsSource = readFileSync(new URL("../app/robots.ts", import.meta.url), "utf8");
  assert.match(robotsSource, /disallow:\s*\[[^\]]*\/api\//s);
  assert.match(robotsSource, /disallow:\s*\[[^\]]*\/go\//s);

  const titleEntries = seoPages.map((page) => page.title.trim()).filter(Boolean);
  const duplicateTitles = titleEntries.filter((title, index) => titleEntries.indexOf(title) !== index);
  assert.equal(duplicateTitles.length, 0, `Duplicate SEO titles found: ${Array.from(new Set(duplicateTitles)).join(", ")}`);

  for (const page of seoPages) {
    const fullPath = normalize(join(repoRoot, page.source));
    assert.ok(existsSync(fullPath), `Missing source file for SEO page ${page.path}: ${page.source}`);
  }

  console.log("seo check passed");
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
