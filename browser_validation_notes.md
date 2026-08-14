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

The restarted AuraSleep product route rendered its live Shopify image, current price, variant choices, quantity selector, and add-to-cart action under the server-rendered storefront path.

The AuraSleep quantity control was increased from one to two, and the live Shopify cart correctly reported a total quantity of three when combined with the prior test line, with a `$149.97` subtotal. The temporary cart line was then removed successfully, returning the cart to zero items.

The Natural Home Comfort grid correctly changed from six live products to zero products when the `$50.00 – $100.00` price band was selected, showing the expected empty state. Clearing that filter restored all six products, and the Ready to ship availability filter preserved the six currently sale-available Shopify products.

The available browser session was confirmed as an authenticated Nestwell administrator and reached the protected SEO Studio, which displayed the live Shopify product selector and its review-only draft-generation action.

The repaired server-side AuraSleep Shopify-to-LLM pipeline returned a structured, review-only SEO draft with a title, metadata, five benefits, five FAQs, and factual information-gap flags. The response explicitly identified missing charging, material, dimension, care, sound-control, speaker, connectivity, warranty, and compliance data rather than inventing claims.

The authenticated browser-side Studio action was then re-run against the live AuraSleep Shopify record. It completed successfully and rendered the review-ready title, metadata, product introduction, benefits, Shopify-derived specifications, FAQ candidates, and a dedicated “Confirm before publishing” list. The workflow neither publishes nor overwrites any Shopify content.

The final visual QA pass captured the home page, Sleep Hygiene collection, and AuraSleep product page at both 1280px and 375px widths. Desktop showed the collection’s live price, availability, and real Shopify `reviews.rating` controls; the star filter appears only where Shopify supplies that metafield. At the mobile breakpoint, the public catalogue, filter trigger, product card grid, gallery, variant selector, quantity control, add-to-cart action, specification and FAQ sections, related products, and footer remained usable without horizontal overflow. Earlier browser checks in this log cover the loading skeleton, empty-filter result, Escape-dismissed search, live cart drawer, multi-quantity cart update, and non-destructive checkout handoff.

After the SSR remediation, a fresh live Sleep Hygiene load again displayed all four Shopify products and the price, availability, and real `reviews.rating` refinements. The collection disclosure now makes clear that the star filter uses a Shopify-provided metafield and never manufactures customer ratings.

Final route assertions verified that server-rendered AuraSleep HTML contains its `https://wenestwell.com/products/aurasleep-white-noise-mask` canonical and Product JSON-LD. A deliberately unknown product returned HTTP 404 with `noindex`. A fresh product-page and collection-page browser load completed without new Suspense, hydration, client-render fallback, or HTML-parsing errors in the browser console. The collection now also includes a recoverable `role="alert"` error state with a retry action; its no-results reset clears price, availability, and rating filters together.

Fresh full-page captures taken after the SSR and collection-state remediation showed the home page, Sleep Hygiene collection, and AuraSleep PDP at 1280px and 375px. At both widths, the primary navigation, live catalogue grid, filter affordance, product gallery, variant controls, quantity stepper, cart entry point, factual product details, related-product links, and footer remained visible and usable. The collection loading-error branch is covered by an automated server-rendered regression test that verifies the accessible alert and retry control; the final suite passed 24 tests across 14 files, and the production client, SSR, and server builds completed successfully.
