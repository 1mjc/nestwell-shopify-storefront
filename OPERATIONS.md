# Nestwell Storefront Operating Guide

## What powers the storefront

Nestwell reads its public catalogue, variants, sale availability, cart state, and checkout URL from the Shopify Headless Storefront API connected to **kjir11-dn.myshopify.com**. Product records are mapped into the following storefront collections: **Sleep Hygiene**, **Comfort & Bedding**, **Natural Home Comfort**, **Wellness & Mindfulness**, and **Baby & Nursery**.

| Customer route | Purpose |
|---|---|
| `/` | Brand story, collection discovery, and live product rail |
| `/collections/:slug` | Collection grid with live price and availability filtering |
| `/products/:handle` | Live Shopify product page, variants, gallery zoom, factual details, related products, cart entry, and structured data |
| `/studio` or `/admin/seo` | Protected Nestwell SEO drafting studio |
| `/sitemap.xml` | Live Shopify-backed product and collection sitemap |
| `/robots.txt` | Crawler access policy and sitemap reference |

## Managing products and product pages

The storefront deliberately treats Shopify as the source of truth. Update product titles, product media, prices, options, sale availability, and supplier facts in Shopify, then reload the Nestwell route to see the changes. The product detail table extracts material, origin, size, feature, care, and option facts only when they are present in Shopify’s product description; unsupported claims are not added by the storefront.

Long supplier specifications are retained in the detail table while the lead product copy is shortened to emphasize readable factual prose. This keeps dropshipping product pages useful without inventing certifications, review ratings, delivery promises, or wellness claims.

## SEO and Google-readiness

Public home, collection, and product routes are server-rendered with live Shopify data. Each route receives a distinct title, description, canonical URL, Open Graph metadata, and, for products, Product/Offer JSON-LD. The canonical base is configured through `CANONICAL_ORIGIN`; it has been validated as a reachable public origin.

Before launch, submit `https://<your-domain>/sitemap.xml` in Google Search Console after the published project is assigned to the final domain. Check that the published domain is the same origin configured for canonical metadata.

## Using the SEO studio

The SEO studio is restricted to authenticated Nestwell administrators. After signing in, choose a live Shopify product and request a draft. The assistant produces a structured, reviewable draft containing a shopper title, metadata, a factual introduction, benefit language, specification candidates, FAQs, and explicit information gaps. It is intentionally a drafting tool: review every draft against the Shopify source record before publishing changes in Shopify.

> The studio is not designed to invent customer reviews, ratings, medical claims, materials, certifications, dimensions, or delivery promises. Missing facts are surfaced as information gaps.

## Ratings and customer feedback

Collection filtering can read Shopify’s standard `reviews.rating` metafield when a verified reviews integration publishes it. The current public catalogue does not expose verified review-rating values, so the rating control remains absent rather than displaying fabricated ratings. Once a reviews provider populates that metafield, the **4 stars & up** filter will appear automatically.

## Launch checklist

| Check | Owner action |
|---|---|
| Shopify catalogue | Confirm key products have correct options, media, sale availability, and product facts |
| Ratings | Connect a verified reviews provider if rating filtering is required immediately |
| Studio | Sign in as the Nestwell project owner and review one SEO draft before relying on the workflow operationally |
| Checkout | Add a low-risk product, adjust quantity, and continue to Shopify checkout without completing an order |
| Search | Search a known product title from the header and confirm it opens the correct product page |
| SEO | Confirm canonical tags use the published domain and submit `/sitemap.xml` to Search Console |
