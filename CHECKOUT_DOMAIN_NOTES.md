# Checkout Domain Conflict — Findings (2026-08-15)

## Symptom
Adding a product and clicking checkout landed on a 404 page.

## Evidence gathered
- A live cart created via the project's Shopify client returned:
  `https://wenestwell.com/cart/c/<token>?key=…&_s=…&_y=…` → **HTTP 404**.
- Rewriting the host to `kjir11-dn.myshopify.com` produced a **301** back to
  `https://wenestwell.com/cart/c/<token>…`.
- Direct Shopify paths also redirect to the same place:
  - `kjir11-dn.myshopify.com/cart/c/<token>` → 301 → `wenestwell.com/...`
  - `kjir11-dn.myshopify.com/cart/<variantId>:1` → 301 → `wenestwell.com/...`
  - `kjir11-dn.myshopify.com/checkout` → 301 → `wenestwell.com/checkout`
- `https://wenestwell.com/` responds 200 from the Manus-hosted storefront
  (`x-manus-proxy-mode: transparent/1`, `x-powered-by: Express`).
- `https://www.wenestwell.com/` 301-redirects to `https://wenestwell.com/`.
- `wenestwell.com/cart/c/testtoken`, `/checkout`, and `/cart/<variant>:1` all
  returned 404 from the storefront.

## Root cause
`wenestwell.com` is still configured in Shopify as the store's primary
customer-facing domain, so Shopify mints checkout links on it and redirects its
own checkout paths there. That hostname now resolves to this headless
storefront, which does not own Shopify's checkout paths — hence the 404.

Confirmed directly through the Shopify Admin API:

```
shop.name              = "Nestwell"
shop.myshopifyDomain   = "kjir11-dn.myshopify.com"
shop.primaryDomain.host = "wenestwell.com"   ← Shopify sends checkout here
```

Because DNS for `wenestwell.com` now points at the Manus-hosted storefront,
Shopify's checkout redirect cannot reach Shopify's own servers. Forwarding in
the storefront alone cannot fully break the cycle: Shopify will keep bouncing
`kjir11-dn.myshopify.com/checkout` back to `wenestwell.com`. The durable fix is
a domain change inside Shopify Admin.

## Fix applied in the storefront
Cart URL normalization now replaces the public storefront host with
`kjir11-dn.myshopify.com` and adds Shopify's `_fd=0` redirect-suppression
parameter. This preserves the cart token and all Shopify-issued query values
while keeping the shopper on Shopify's own checkout host. A direct
`/checkout?_fd=0` request was routed to Shopify's password/checkout handling,
not back to the storefront's 404 page.

An initial idea to server-forward `/cart` and `/checkout` through the
storefront was rejected and removed: Shopify's primary-domain redirect would
simply return that request to `wenestwell.com`, creating a redirect loop.

## Recommended owner action (durable fix)
In Shopify Admin → Settings → Domains, ensure the domain Shopify uses for
checkout is a Shopify-served host (for example, keep `kjir11-dn.myshopify.com`
as the primary domain, or dedicate a subdomain such as `checkout.wenestwell.com`
/ `shop.wenestwell.com` to Shopify) while `wenestwell.com` serves this
storefront. A single hostname cannot be served by both systems.
