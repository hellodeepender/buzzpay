# buzzpay.app

Free tools for freelancers & small businesses: payment fee calculator, invoice generator, freelance rate calculator. Affiliate-first monetization; tools are client-side, page shells are statically generated for SEO (one indexable page per tool).

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure
- `app/` — routes. Each tool is its own page (`/payment-fee-calculator`, `/invoice-generator`, `/freelance-rate-calculator`) with metadata, WebApplication + FAQPage JSON-LD, an explainer section, and FAQ.
- `components/` — `FeeCalculator`, `InvoiceGenerator`, `RateCalculator` (client), plus `Header`, `Footer`, `RecoCard`, `JsonLd`.
- Design tokens live in `tailwind.config.ts`; base styles + print rules in `app/globals.css`.

## TODO before launch
1. **Affiliate links:** replace every `href="#"` in `<RecoCard>` usages (in the three calculator components) with your real affiliate links. Targets: Quaderno (fee), FreshBooks (invoice + rate).
2. **OG image:** add `app/opengraph-image.png` (1200×630).
3. **Analytics:** add Vercel Analytics or GA4.
4. Verify fee preset defaults against current Stripe/PayPal/Square rates.

## Deploy
Vercel project → add domains `buzzpay.app` + `www.buzzpay.app` → point Cloudflare DNS (DNS-only) to Vercel → submit `https://buzzpay.app/sitemap.xml` to Google Search Console.

## Phase 2 (after a tool ranks)
Freemium: Supabase auth + Stripe. Free calculators stay free; paid (~$5–9/mo) unlocks saved clients/presets, recurring invoices, footer removal, multi-currency. Gate via `profiles.plan`.
