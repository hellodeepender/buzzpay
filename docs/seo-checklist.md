# SEO checklist

Use this checklist before shipping new public pages, guides, or programmatic SEO pages.

## Search Console

1. Submit `https://www.buzzpay.app/sitemap.xml` in Google Search Console.
2. Use URL Inspection on the page you changed.
3. Request indexing only after the page is live, canonical, and internally linked.
4. Watch for coverage errors, duplicate canonical issues, and pages that are crawled but not indexed.

## Bing Webmaster Tools

1. Submit the sitemap in Bing Webmaster Tools.
2. Inspect a sample URL after launch.
3. Check that Bing sees the canonical URL you expect.

## Before scaling programmatic pages

1. Add only pages that have a clear purpose and unique content.
2. Confirm the page has a canonical URL, breadcrumbs, and structured data where appropriate.
3. Add at least one strong internal link from a hub or relevant parent page.
4. Verify the title and meta description are unique.
5. Make sure the page is listed in the sitemap and not blocked by `robots.txt`.
6. Compare the page against the existing template to confirm it is not thin or duplicated.
7. Run `npm run seo:check` before creating more pages.

## Release checklist

1. Confirm `https://www.buzzpay.app/sitemap.xml` includes the new page.
2. Confirm `robots.txt` still disallows `/api/` and `/go/`.
3. Confirm there are no duplicate SEO titles in the registry.
4. Confirm the page appears in the relevant hub or calculator page.
5. Re-open the page in Search Console after a few days to confirm indexing status.

## Notes

- Keep adding pages slowly. A small pilot with real internal links is safer than a large batch of near-duplicate pages.
- If a page does not have unique value, do not index it yet.
- If a future page family needs local or state data, verify the data source, version, and review process before generating more URLs.
