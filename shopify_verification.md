# Shopify Storefront API Verification

The Nestwell storefront is connected server-side to the exact Shopify domain **`kjir11-dn.myshopify.com`** through the official Shopify Headless channel. The application uses the channel’s **private Storefront API token** only on the server; it is not exposed to the browser.

| Verification point | Project path | Expected result |
| --- | --- | --- |
| Credential validation | `server/shopify.storefront.test.ts` | Authenticates to the current Shopify Storefront API version. |
| Application router integration | `server/shopify.router.integration.test.ts` | Calls the public `shopify.catalogue` router and confirms that live Nestwell products and the **Sleep Hygiene** category are returned. |
| Browser-ready commerce procedures | `server/routers.ts` | Provides typed product, collection, search, cart, line-item, and checkout-url operations to the storefront UI. |

The catalogue uses Shopify’s `availableForSale` signal for its shopper-facing availability filter. Exact per-variant inventory counts are intentionally not queried because the Headless token does not currently include the unauthenticated inventory-read permission. This keeps the storefront accurate without requesting broader access than necessary.
