# Browser Validation Notes

## 2026-08-14 Live Storefront Checks

The live project router returned four **Sleep Hygiene** products through the browser-facing collection page. The **AuraSleep White Noise Mask** product page rendered its Shopify image gallery, four live color variants, price and comparison price, selected-variant availability, add-to-cart control, live specifications, FAQ panels, breadcrumbs, and related products. The browser document title updated to `AuraSleep White Noise Mask | Nestwell` after the live product response loaded.

The Storefront API implementation uses Shopify’s `availableForSale` status for availability rather than requesting raw quantity counts. This reflects the currently authorized Headless permissions and avoids displaying invented or stale inventory data.

The product gallery now exposes a dedicated zoom interaction, and the selected Black AuraSleep variant presented the live **Add to cart** action with its quantity control in the browser.

After the cart connection normalization fix and a full storefront reload, the header reflected **one live cart item** from Shopify for the persisted AuraSleep selection.

The corrected cart drawer displayed the live AuraSleep line item, selected Black variant, quantity controls, removal action, subtotal, and a Shopify checkout action. The checkout redirect was intentionally not invoked during QA.

The enhanced AuraSleep page rendered a Shopify-derived specification table containing its collection, live color options, and selected SKU, followed by factual option and availability FAQ content. No unsupported product or customer-review claims were introduced.

The refreshed AuraSleep product page retained its live cart count, Shopify variant controls, factual PDP detail content, and the corrected quantity-aware purchase controls.

The long bathroom-rug product demonstrated the richer live-data path: the PDP rendered Shopify-sourced material (100% Polyester), origin, feature, size, live options, SKU, and related factual FAQ candidates without inventing product claims.

The concise `/studio` alias now resolves to the Nestwell SEO studio and correctly presents the authenticated team sign-in gate rather than a 404 page.

The Natural Home Comfort collection rendered six live Shopify products with price and availability refinement controls. The global search overlay returned live Shopify results for “bath,” including the expected bath-rug catalogue entries, after its loading skeleton state.

The search overlay also closed cleanly with the Escape key, preserving an accessible keyboard exit path.
