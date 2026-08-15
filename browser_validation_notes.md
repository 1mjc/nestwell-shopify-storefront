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

## 2026-08-15 Checkout 404 Investigation

A live cart created through the project's own Shopify client returned a checkout URL on the `wenestwell.com` host, for example `https://wenestwell.com/cart/c/<token>?key=…`. Requesting that URL returned **HTTP 404** with no redirect. The cart token itself is valid; the failure is host-related. Shopify issues checkout links on the store's configured customer-facing domain, and `wenestwell.com` now resolves to the Manus-hosted storefront, which has no `/cart/c/...` route. The fix is to send shoppers to the Shopify-owned checkout host (`kjir11-dn.myshopify.com`) so the session is served by Shopify.

Further tracing confirmed a domain conflict rather than a cart defect. Requests to `kjir11-dn.myshopify.com/cart/c/<token>`, `/cart/<variant>:1`, and `/checkout` all answered **301** and redirected to `wenestwell.com`, because that domain is still registered as the store's primary customer-facing domain inside Shopify. Since `wenestwell.com` now resolves to this headless storefront, every Shopify checkout path lands on the storefront's 404 handler.

The safe storefront fix is to normalize each live Shopify cart URL onto `kjir11-dn.myshopify.com` and append Shopify's `_fd=0` redirect-suppression parameter. A direct test of `https://kjir11-dn.myshopify.com/checkout?_fd=0` stayed on Shopify's host rather than redirecting to `wenestwell.com`; it was routed to Shopify's normal password/checkout handling instead of the storefront 404. The previous idea of forwarding `/cart` or `/checkout` through the storefront was deliberately not retained because Shopify redirects its primary-domain traffic back to `wenestwell.com`, which would produce a loop.

After publishing the checkout URL normalization, the live AuraSleep product page and persisted one-item cart reloaded successfully. The refreshed cart drawer exposed the Secure checkout action for the approved end-to-end handoff test; no purchase action has been taken.

The first post-publish browser click occurred while the previous production revision was still propagating and therefore reached the old `wenestwell.com/cart/c/...` 404 path. Once the deployment propagated, a direct query to the published `shopify.cart` endpoint returned `https://kjir11-dn.myshopify.com/cart/c/...` with the full Shopify cart token, original query values, and `_fd=0`. The live server now has the intended checkout URL normalization.

The product page was reloaded again after the verified propagation window, and the persisted cart reopened with its Secure checkout control available. The already approved final navigation is the remaining browser check; no payment or order action will be performed.

The final approved browser handoff confirmed the storefront no longer sends the cart token directly to the original `/cart/c/...` 404 URL. Shopify accepted the normalized checkout URL, but its own checkout flow then redirected the browser to `https://wenestwell.com/password`. Because `wenestwell.com` is served by the headless storefront while Shopify still treats it as the store's primary domain and is password-protected, that Shopify password route becomes another storefront 404. This proves the remaining blocker is a Shopify domain setting, not the cart, token, or storefront checkout client.

After the owner disabled Shopify password protection, direct Shopify requests showed `/checkout?_fd=0` routed into Shopify's checkout flow rather than `wenestwell.com/password`, and `/password?_fd=0` redirected to the Shopify host root. The live storefront product page and cart drawer also loaded successfully for the final approved checkout navigation; no purchase will be made.

The approved live checkout navigation then reached **Shopify Checkout** at `kjir11-dn.myshopify.com/checkouts/...` with the cart's bathrobe line item, CAD $30.22 subtotal, contact, delivery, payment, Shop Pay, PayPal, and Google Pay controls visible. The storefront 404 and password redirect are resolved. No contact, payment, shipping, or order data was entered.

For the requested attribution cleanup, the published storefront was inspected at the top and bottom of the page and its rendered HTML was searched. No `Made with Manus` content or associated in-page markup was present in the project source or customer-facing DOM. This indicates the reported control is platform-level browser/hosting chrome rather than a code element the storefront can safely remove; the public Studio navigation and routes have been removed from the project and await publication.

After publication propagated, the live home HTML no longer contained the `/admin/seo` navigation link. Both `https://wenestwell.com/studio` and `https://wenestwell.com/admin/seo` returned the customer-facing **404 Page Not Found** response, confirming the public Studio experience has been removed. The live Shopify checkout browser test remained successful after the owner disabled password protection.
