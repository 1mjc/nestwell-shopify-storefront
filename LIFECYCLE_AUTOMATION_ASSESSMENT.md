# Nestwell Lifecycle Automation Assessment

**Status:** Planning only. No customer data, email platform, customer message, review request, or new sales channel has been activated.

## Scope

The requested customer experience includes ten event-driven lifecycle flows: Welcome, Abandoned Cart, Browse Abandonment, Post-Purchase, Customer Thank You, Win-Back, Review Request, Back-in-Stock, and Product Abandonment. A complete implementation needs a marketing platform that can receive Shopify order/inventory data and receive consent-aware behavioural events from Nestwell’s separate headless storefront.

## Viable implementation options

| Approach | Coverage and customer experience | Trade-offs | Cost | Setup complexity |
|---|---|---|---|---|
| **Full lifecycle platform — Klaviyo connected to Shopify** | Can support the complete requested flow set, including Shopify-supported back-in-stock alerts, product/cart behaviour, post-purchase, win-back, and delivery-timed review requests. The storefront can add a branded opt-in form and only send the approved events after consent. | Requires a Klaviyo account, an approved app connection, and a small storefront tracking integration because Nestwell’s customer-facing site is headless rather than a Shopify theme. Customer messages must be built, reviewed, and explicitly activated. | Plan-dependent; confirm current Klaviyo plan and sender setup before activation. | Moderate. |
| **Shopify-native marketing only** | Supports Shopify’s native abandoned-checkout recovery and basic marketing email with minimal technical work. It is a lightweight start for checkout recovery and email capture. | Does **not** provide the requested complete lifecycle set on its own, particularly browse/product abandonment, full back-in-stock, delivery-timed reviews, and nuanced win-back flows. | Included or plan-dependent within the existing Shopify ecosystem; confirm current merchant entitlements in Admin. | Low. |

## Event and storefront constraints

Nestwell’s public storefront is a React application hosted separately from Shopify, while checkout, orders, products, inventory, and customer records are powered by the existing Shopify store. The selected lifecycle platform must therefore be connected to Shopify for commerce-side data and deliberately instrumented on the Nestwell storefront for consent-aware product-view, add-to-cart, email-subscription, and product-interest events. The full lifecycle option should use direct integration mechanisms rather than a scheduled poller; each event is timely and deterministic.

Klaviyo documents that Shopify `Added to Cart` and `Viewed Product` tracking depends on enabled behavioural/on-site tracking, and that tracking can be restricted by a visitor’s privacy consent. It also documents native Shopify support for a back-in-stock subscription event and stock-aware sending.[1][2]

## Verified account state — 2026-08-25

The owner created the **Nestwell** Klaviyo account, and the Klaviyo Integrations view shows the existing **Shopify** integration as **Enabled**. Klaviyo’s onboarding also created an **Email List** and recommended lifecycle-flow templates. The account’s 6-character public site ID is set through the project environment and has passed a non-emitting browser-client load check. No private API key has been created, copied, or used.

The implementation must keep all message actions in draft/manual state until the owner explicitly selects a live launch. The account view can show recommended template actions with prefilled status labels; those recommendations are not treated as approval to send customer email.

## Verified implementation details

Klaviyo’s official client subscription endpoint accepts a public site ID, requires the `application/vnd.api+json` content type and a revision header, and returns `202` when an explicit email-consent request is accepted. Nestwell’s existing `Email List` has ID `Uik6hB` and uses **double opt-in**. The legacy default sender/reply identity must be replaced with verified `hello@wenestwell.com` for marketing communication and `support@wenestwell.com` for support replies before any flow can leave Draft. The site’s footer uses that client-only endpoint; it never uses a private API key.

For unavailable Shopify variants, Klaviyo’s client Back in Stock endpoint accepts an email and the catalog variant ID in the documented form `$shopify:::$default:::<numeric Shopify variant ID>`. This queues only the requested variant and requires a separate Back in Stock flow before any future alert can be delivered. The public product page implements the request mechanism, but does not turn an email flow live.[7][8]

## First configured draft flow — 2026-08-25

The Klaviyo flow library’s “recommended” cards are previews; their displayed statuses do **not** represent active Nestwell automations. To avoid activating a template accidentally, the implementation created a separate saved flow, **Nestwell · Welcome Series (Draft)** (`RCbCUX`). It is triggered once when a profile is added to `Email List`, which is double opt-in, and is configured with **no re-entry**.

Its first action remains **Draft**. The saved subject is “Welcome to a quieter kind of comfort” and the saved preview text is “A small note from Nestwell, plus a place to begin.” The body has not been activated or sent. This establishes the correct model for all remaining lifecycle flows: explicit trigger, recipient safeguards, draft message action, test review, then a separate owner-approved Live decision.

## Second configured draft flow — 2026-08-25

The implementation also created **Nestwell · Post-Purchase Care (Draft)** (`XxgjAf`) against the native Shopify **Placed Order** metric. It is currently set to **no re-entry** and has no trigger/profile filters; these settings are intentionally conservative until product, order-state, and consent suppression rules are validated. Its first action remains **Draft**, with the saved subject “A few notes for your new comfort” and preview text “Helpful care guidance from Nestwell.” No customer has received it.

## Safeguards built into the plan

| Safeguard | Planned rule |
|---|---|
| Email permission | Only send marketing messages to people who have given the required marketing permission. Present a clear sign-up disclosure and an accessible unsubscribe path. Treat this design as a compliance baseline, not legal advice; have Canadian counsel review final CASL/privacy language. |
| Behavioural tracking | Do not send product-view, cart, or product-interest events until the visitor has given the necessary functional/marketing-cookie consent in the applicable region. |
| Purchase suppressions | Recovery flows stop when an order is placed. Post-purchase and thank-you flows exclude cancelled/refunded orders where the chosen platform supports the data. |
| Review integrity | Send a genuine feedback/review request only after delivery or a conservative fulfilment delay. Never create, seed, or display reviews. Any future incentive must be available regardless of review sentiment and transparently labelled where the review platform requires it. |
| Back-in-stock accuracy | Allow shoppers to explicitly request a restock alert for a specific product/variant. Do not advertise stock availability before the inventory source confirms it. |
| Sending pressure | Limit each early lifecycle flow to concise, staged messages; use suppression and frequency controls to avoid overlapping recovery or promotional email. |

## Proposed flow map for the full-lifecycle option

| Flow | Primary trigger | Initial safe message plan | Key suppression / control |
|---|---|---|---|
| Welcome | Explicit email-list subscription | Brand introduction, how Nestwell works, core collections, and support/policy links. | Do not send before subscription consent. |
| Abandoned Cart | Identified subscriber adds a product but does not purchase | Product reminder and cart return path; no unsupported scarcity claims. | Stop after purchase; do not overlap checkout recovery. |
| Browse Abandonment | Consented, identified subscriber views a product without adding it | Product reminder with factual product details. | Cap frequency and stop after add-to-cart or purchase. |
| Product Abandonment | High-intent product behaviour defined in the selected platform | Address factual hesitation points such as shipping, returns, and support access. | Do not duplicate Browse Abandonment for the same product/event window. |
| Post-Purchase | Confirmed Shopify order | Thank the customer, summarize next steps, and set factual fulfilment expectations. | Exclude orders that are cancelled before send. |
| Customer Thank You | Short delay after a confirmed purchase | Relationship-focused note with relevant collection discovery. | One per order or a controlled repeat-customer rule. |
| Win-Back | No purchase for owner-approved period | Gentle reminder of Nestwell’s catalogue and current policy terms. | Suppress unengaged or unsubscribed profiles. |
| Review Request | Delivered order or conservative post-fulfilment delay | Ask for honest feedback and route it to an approved review tool. | No request before likely delivery; never fabricate social proof. |
| Back-in-Stock | Shopper explicitly subscribes to unavailable item | Notify only when that same product/variant returns to available stock. | Product/variant-specific queue and inventory threshold. |

## References

[1]: https://help.klaviyo.com/hc/en-us/articles/6985692431259 "Klaviyo Help Center — Troubleshooting added to cart tracking"
[2]: https://help.klaviyo.com/hc/en-us/articles/360051612551 "Klaviyo Help Center — Understanding how back in stock flows work"
[3]: https://help.klaviyo.com/hc/en-us/articles/115003872251 "Klaviyo Help Center — How to build a back in stock flow"
[4]: https://help.klaviyo.com/hc/en-us/articles/16319809379611 "Klaviyo Help Center — How to request reviews from customers with Klaviyo Reviews flows"
[5]: https://help.klaviyo.com/hc/en-us/articles/115002779391 "Klaviyo Help Center — How to create a third-party product review flow"
[6]: https://help.shopify.com/en/manual/promoting-marketing/create-marketing/abandoned-checkouts "Shopify Help Center — Recovering abandoned checkouts"
[7]: https://developers.klaviyo.com/en/reference/create_client_subscription "Klaviyo Developers — Create Client Subscription"
[8]: https://developers.klaviyo.com/en/docs/how_to_set_up_custom_back_in_stock "Klaviyo Developers — Set up back in stock via API"

## Welcome popup QA — 2026-08-25

The sitewide popup was visually checked at desktop and mobile viewports. It opens as a focus-managed dialog after a short client-side delay, presents explicit marketing consent plus an optional personalization checkbox, links the Privacy Policy, and exposes a **Not now** dismissal. Its fourteen-day local dismissal rule is covered by Vitest; a successful signup suppresses it for 180 days. The popup uses only the Klaviyo public site identifier and the established double-opt-in list. It does not enable a Klaviyo marketing flow or change any existing email action from Draft.

The dismissal repair was validated on 2026-08-25: local storage now holds the popup’s **next eligible timestamp**, and the display decision compares the current time directly against that timestamp. Reduced-motion visitors bypass the opening delay and the popup’s animation/transition styles are disabled by the corresponding media query. Desktop and mobile visual checks, the 44-test suite, and the production client, SSR, and server builds passed after this repair.

## Customer Thank You draft — 2026-08-25

**Nestwell · Customer Thank You (Draft)** (`S6gDVn`) is saved with the native Shopify **Placed Order** metric and **no re-entry**. Its first email action remains **Draft** with the subject “Thank you for choosing Nestwell” and preview “A quiet thank-you from Nestwell.” No message body has been activated and no customer email has been sent.

## Customer Win-Back draft — 2026-08-25

**Nestwell · Customer Win-Back (Draft)** (`RmUAT2`) is saved with the native Shopify **Placed Order** metric and remains entirely Draft. The required inactivity delay and the subsequent draft email still need to be configured before this flow can be treated as launch-ready; this separation deliberately prevents an immediate or misleading win-back message.

## Back-in-Stock draft — 2026-08-25

**Nestwell · Back-in-Stock Alert (Draft)** (`WxcYuP`) is saved with the **Subscribed to Back in Stock** metric used by the Nestwell product-page availability request. Its first email action remains **Draft** with the subject “The item you asked about is back in stock” and preview “You asked to hear when it returned.” No message has been activated or delivered.

## Abandoned-cart metric constraint — 2026-08-25

**Nestwell · Abandoned Cart (Draft)** (`RfRQnW`) was created as a blank Draft. Klaviyo currently exposes Shopify checkout/order metrics and API Active on Site / Viewed Product metrics, but the new consent-gated Nestwell cart event has not yet appeared in the flow-trigger selector. The flow is intentionally left without a trigger rather than being incorrectly wired to **Checkout Started** or any other event. A valid cart trigger will be attached only after the intended event is visible in Klaviyo and its post-purchase suppression is configured.

## Browse-Abandonment draft — 2026-08-25

**Nestwell · Browse Abandonment (Draft)** (`Uv8PV6`) is saved with the API **Viewed Product** metric and an email-only Draft action titled “Browse reminder · Still considering it?” The subject is “Still thinking about a little more comfort?” and the preview is “Return when it feels right for you.” An accidental unsent text-message action was removed before any content or delivery configuration; no SMS is configured and no customer message was sent.

## Review-request draft — 2026-08-25

**Nestwell · Review Request (Draft)** (`RAYmLm`) is saved with Shopify **Fulfilled Order** as the conservative available trigger and an email-only Draft action titled “Review request · How has it been?” The subject is “How has your Nestwell item been?” and the preview is “Your honest feedback helps us improve.” No review, rating, incentive, or fabricated testimonial was created. The request remains Draft-only and needs a delivery-timing delay plus an actual review destination before it may be considered for activation; Fulfilled Order is not treated as proof of delivery.

The owner confirmed the planned feedback path on 2026-08-25: after a **14-day post-fulfillment buffer**, the draft email should invite the customer to **reply directly to Nestwell** with honest feedback rather than linking to a review platform. This remains a planning and Draft-only instruction until the flow configuration and launch-gate review are complete.

The Draft flow’s sequencing was corrected on 2026-08-25. The initial unsent email action was removed and recreated after the saved **Wait 14 days** action. The current canvas is therefore **Fulfilled Order → Wait 14 days → Review request email (Draft)**. The recreated Draft email retains the neutral name, subject “How has your Nestwell item been?”, and preview “Your honest feedback helps us improve.” No email or SMS was sent during the correction.

Review-email body configuration, 2026-08-25: the Draft Review Request was opened in Klaviyo’s text-only editor and saved with the owner-approved body inviting recipients to reply directly with what worked well and what Nestwell could improve. It explicitly states that no rating needs to be selected and no reward is attached. A direct post-save readback showed the full body, the **Draft** indicator, and `support@wenestwell.com` as the checked reply-to identity. No review-platform link, rating control, customer email, or SMS was added.

Klaviyo Draft-status audit, 2026-08-25: the live Flows list directly showed all nine Nestwell automations in **Draft** status: Abandoned Cart, Back-in-Stock Alert, Browse Abandonment, Customer Thank You, Customer Win-Back, Post-Purchase Care, Product Abandonment, Review Request, and Welcome Series. The list confirms **Abandoned Cart** and **Product Abandonment** have no trigger configured; this is intentional pending the consented cart metric and a measurable stronger-interest condition. Back-in-Stock uses `Subscribed to Back in Stock`; Browse uses `Viewed Product`; Customer Thank You, Customer Win-Back, and Post-Purchase Care use `Placed Order`; Review Request uses `Fulfilled Order`; and Welcome Series uses added-to-list membership. No Draft was converted to live status during this audit.

Klaviyo sender-settings audit, 2026-08-25: the account’s Email → Sender information screen was opened read-only. The visible configuration was limited to the free-plan Klaviyo-footer branding choice; it did not expose a verified custom sender or reply-to identity. No sender setting was changed. The next applicable verification must occur in the email-level sender control or dedicated domain/sender verification interface before `hello@wenestwell.com` or `support@wenestwell.com` is selected.

Branded sending-domain setup, 2026-08-25: Klaviyo’s manual domain wizard was configured for the **Marketing** email type, root `wenestwell.com`, and branded sending subdomain `send.wenestwell.com`, with dynamic routing selected. The wizard now requires DNS verification; no DNS record has been published and no Klaviyo flow/message has been activated. The visible initial delegation records require the `send` host to point to `ns1.klaviyo.com`, `ns2.klaviyo.com`, and `ns3.klaviyo.com`; the remaining records must be captured and applied by an authorized DNS administrator before verification can be requested.

Owner-directed cleanup, 2026-08-25: the owner declined the technical sending-subdomain approach. The unverified `send.wenestwell.com` Klaviyo configuration was deleted from the account before DNS verification began. The Domains screen now shows no sending domain configured. No new mailbox was created, no DNS record was published, and no flow or customer message was activated. The approved routing remains `hello@wenestwell.com` for general/marketing communication and `support@wenestwell.com` for support inquiries only.

Draft sender routing, 2026-08-25: after the owner confirmed both approved mailboxes already exist, the Review Request Draft email’s sender and checked reply-to identity were changed from the legacy address to `support@wenestwell.com`. Its flow remained Draft, with the existing **Fulfilled Order → Wait 14 days → email** sequence and non-incentivized subject/preview unchanged. The Welcome Series Draft is open next; its first message remains Draft and retains the saved “Welcome · A softer beginning” name, welcome subject, and preview while its sender is prepared for `hello@wenestwell.com`.

The Welcome Series Draft sender and checked reply-to identity were subsequently saved as `hello@wenestwell.com`. The message action stayed Draft and no delivery was enabled. These two saved flows now demonstrate the approved split: `hello@wenestwell.com` for general/marketing communication and `support@wenestwell.com` for direct support feedback replies. The remaining saved Draft emails require the same read-only audit and general-identity update before the legacy address can be treated as fully removed from lifecycle automation.

The sender audit and migration completed for every Draft flow that currently contains an email action. The following Draft emails now use `hello@wenestwell.com` as both sender and reply-to: **Welcome Series**, **Post-Purchase Care**, **Customer Thank You**, **Back-in-Stock Alert**, and **Browse Abandonment**. The delivery-timed **Review Request** alone uses `support@wenestwell.com` as both sender and reply-to, because it invites direct support feedback. The untriggered Abandoned Cart and Product Abandonment drafts contain no email action, and the Win-Back Draft has no message action pending its conservative delay configuration. No verification prompt appeared during these Draft-only sender saves; no mailbox, subdomain, DNS record, customer email, or SMS was created or sent.

Draft-status validation, 2026-08-25: each configured email was reopened directly after its sender save. The Welcome, Post-Purchase Care, Customer Thank You, Back-in-Stock Alert, Browse Abandonment, and Review Request canvases each continued to display **Draft** for both the parent flow and its email action. The general Flows list did not render reliably during a later read-only view, so this record relies on the direct per-flow readbacks rather than inferring status from an incomplete list screen.

Complete Draft-status audit, 2026-08-25: Klaviyo’s rendered Flows list directly showed all nine Nestwell automations as **Draft**: Abandoned Cart, Back-in-Stock Alert, Browse Abandonment, Customer Thank You, Customer Win-Back, Post-Purchase Care, Product Abandonment, Review Request, and Welcome Series. The list also confirmed the intentionally untriggered status of Abandoned Cart and Product Abandonment; all configured flows report zero conversions. No live, manual, or SMS flow appears in this Nestwell flow set.

Welcome email body configuration, 2026-08-25: the Welcome Series was opened from its double-opt-in Email List trigger and its Draft email was set up as text-only. The saved content welcomes the subscriber to Nestwell, explains the sleep/home/wellness/family-life focus, invites them to explore at their own pace, and states that they can update preferences or unsubscribe at any time. The post-save content readback shows **Draft** and `hello@wenestwell.com` as the sender; no discount, offer, customer email, or activation was added.

Post-Purchase Care body configuration, 2026-08-25: the Shopify Placed Order Draft email was set up as text-only and saved with factual guidance to consult the order confirmation, tracking updates, product, and packaging care information. It directs order, delivery, and product questions to `support@wenestwell.com`. The direct post-save readback shows **Draft** and `hello@wenestwell.com` as the sender. No unsupported delivery promise, incentive, customer email, SMS, or activation was added.

Customer Thank You body configuration, 2026-08-25: the companion Shopify Placed Order Draft email was set up as text-only and saved with a factual appreciation message. It thanks the customer without discount, reward, or review request and directs any order, delivery, or product query to `support@wenestwell.com`. The direct post-save readback shows **Draft** and `hello@wenestwell.com` as the sender. No customer message, SMS, or activation was added.

Back-in-Stock pre-content audit, 2026-08-25: the Draft availability-alert flow uses the native **Subscribed to Back in Stock** trigger. Its email is named “Availability alert · Back at Nestwell,” has the factual subject “The item you asked about is back in stock,” uses `hello@wenestwell.com` as sender/reply-to, and remains Draft. No stock-alert message has been activated or sent.

Back-in-Stock body configuration, 2026-08-25: the explicit stock-interest Draft email was set up as text-only and saved with a factual availability notice. It tells the subscriber that availability can change before checkout, directs them to Nestwell for the latest product options and stock status, and provides `support@wenestwell.com` for questions. The direct post-save readback shows **Draft** and `hello@wenestwell.com` as sender. No claim of reserved stock, customer email, SMS, or activation was added.

Browse Abandonment body configuration, 2026-08-25: the Viewed Product Draft email was set up as text-only and saved with a low-pressure reminder. It tells the recipient they may return whenever it suits them, asks them to check the current product page because availability and options can change, and directs questions to `support@wenestwell.com`. The direct post-save readback shows **Draft** and `hello@wenestwell.com` as sender. No discount, urgency, customer email, SMS, or activation was added.

Win-Back timing audit, 2026-08-25: the existing Draft flow uses the native Shopify **Placed Order** trigger. A saved **Wait 75 days** action now follows that trigger, matching the planned re-engagement interval. No email or SMS action was added because the flow still requires explicit marketing-consent eligibility and a new-order suppression check after the wait; it must remain Draft-only until those safeguards can be verified.

Win-Back safeguard follow-up, 2026-08-25: the direct Draft canvas readback continues to show only **Placed Order → Wait 75 days → End**. The loaded flow markup confirms that sequence but exposes no readable consent or profile-filter configuration in the saved page state. The browser control needed to open the trigger-details panel timed out, so no inferred filter was added. The flow remains safely without an email action pending a direct, verifiable filter configuration path.

Win-Back trigger configuration, 2026-08-25: the trigger-details panel was subsequently reopened. The flow had been configured to allow re-entry; this was corrected and saved as **No re-entry**. The panel directly confirms that no trigger filter and no profile filter are currently applied. The flow remains **Placed Order → Wait 75 days → End**, Draft-only, and message-free while an explicit consent-eligibility filter is evaluated.

Legacy-email audit, 2026-08-25: a source and operations scan found no remaining `nestwell.ca@proton.me` reference in active client, server, shared, Google-status, lifecycle, or operations material. The only retained occurrences are dated historical observations in `browser_validation_notes.md`; they are preserved as an audit trail and do not render on the public site, configure an active account setting, or appear in a Draft email sender/reply field.

Controlled custom-event repair, 2026-08-25: the initial owner-authorized product-view and cart test did not create either a `Nestwell Product Viewed` or `Nestwell Added to Cart` metric in Klaviyo. The browser helper previously relied on a third-party script call whose failures were intentionally swallowed to protect shopping. It now uses Klaviyo’s documented public client-event endpoint (`POST /client/events/`) with the public site ID, explicit profile email, product/cart properties, and metric name. This client-only endpoint is the supported public-browser route for custom events; it does not use a private key. The repair passed the full 45-test suite and production client, SSR, and server builds. A second, owner-authorized test-profile interaction is required after publication before any recovery Draft can be connected. References: https://developers.klaviyo.com/en/reference/create_client_event and https://developers.klaviyo.com/en/docs/javascript_api.

Endpoint normalization follow-up, 2026-08-25: the controlled retest initially still did not create a visible custom metric. The public endpoint was then normalized from `/client/events/` to Klaviyo’s documented `/client/events` route. The endpoint contract is now covered by an explicit unit test; the full suite passes **46 tests**, and the production client, SSR, and server builds pass. A final controlled post-publish retest remains required; the Cart and Product Abandonment Drafts stay untriggered and inactive until that readback succeeds.

Controlled metric readback, 2026-08-25: after the endpoint-normalized final test, Klaviyo Metrics directly displayed both **Nestwell Added to Cart** and **Nestwell Product Viewed**, increasing the account’s visible metric count from 20 to 22. The events were produced only by the owner-authorized `hello@wenestwell.com` test profile. No recovery flow was connected, activated, or sent during this verification; the test cart line was removed and the pre-existing cart line preserved.

Abandoned Cart trigger configuration, 2026-08-25: the saved **Nestwell · Abandoned Cart (Draft)** now uses the verified **Nestwell Added to Cart** metric and defaults to **No re-entry**. Its canvas ends immediately after the trigger; no email, SMS, WhatsApp, discount, delay, filter, or active status was added. A purchase-suppression condition remains mandatory before any future message action can be considered.

Abandoned Cart consent safeguard, 2026-08-25: the Draft trigger was directly read back and corrected to **No re-entry**. Its Profile filter now admits only a person who **can receive email marketing** because that person is **subscribed**. The flow remains message-free and Draft-only; no trigger filter, post-cart delay, purchase-suppression condition, email, SMS, incentive, or activation has been added.

Abandoned Cart timing safeguard, 2026-08-25: a saved **Wait 4 hours** action now follows the verified cart trigger and consent filter. The flow remains Draft-only and ends after that delay. A post-delay purchase-suppression split remains required before a customer-facing recovery action can be added; no email, SMS, discount, activation, checkout, or purchase action has occurred.

Abandoned Cart purchase-suppression safeguard, 2026-08-25: the post-delay split is saved with its first path requiring **Placed Order zero times since starting this flow**. Consequently, only subscribed profiles with a verified cart event, no re-entry, a four-hour wait, and no subsequent Shopify purchase enter the recovery-eligible path; everyone else exits. The flow remains Draft-only and message-free: no email, SMS, incentive, or activation has been added.

## Klaviyo Draft-status audit — 2026-08-25

The Klaviyo Flows list directly showed all eight saved Nestwell automations in **Draft**: Welcome Series, Post-Purchase Care, Customer Thank You, Customer Win-Back, Back-in-Stock Alert, Browse Abandonment, Review Request, and Abandoned Cart. The visible trigger list also confirmed that Abandoned Cart remains intentionally untriggered, while the other flows retain their documented list, product-view, stock-interest, fulfilment, or order signals. No row was displayed as Live and no SMS flow was created.

## Product-Abandonment draft — 2026-08-25

**Nestwell · Product Abandonment (Draft)** (`VzNap4`) is saved as an untriggered Draft. It is intentionally separate from Browse Abandonment and has no message action because the current available product-view metric does not, by itself, establish the stronger interest or non-purchase condition required for a truthful product-abandonment reminder. No customer message or SMS is configured.
