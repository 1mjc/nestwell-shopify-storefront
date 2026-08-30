# Platform Enforcement Audit

**Audit date:** 2026-08-29  
**Scope:** Read-only review of current account status. No appeal, re-review, campaign, ad-account, spend, product-source, or customer-message action was taken.

## Google Merchant Center

The authenticated Nestwell Merchant Center account (**5820758319**) currently reports a critical account-level **Misrepresentation** policy issue. The Overview states that this issue prevents products from being shown across Google. The same readback reports that the account is not linked to Google Ads, and no action was taken to create or link an Ads account.

| Current Merchant Center metric | Direct readback |
| --- | --- |
| Total products | 105 |
| Approved | 0 |
| Limited | 0 |
| Not approved | 105 |
| Under review | 0 |
| Clicks in the displayed 28-day period | 3 |
| Store-quality information | Not currently available |

The page does not supply a specific corrective reason beyond the existing Misrepresentation classification. It is therefore not evidence that any particular website element, payment profile field, address, phone number, review, or policy page caused the restriction. A new blind review must not be submitted based on this dashboard alone.

## Meta

Meta Account Quality could not be audited because the connected browser is at Meta’s login page and does not have an authenticated business session. As a result, no Meta account, ad account, business asset, rejected ad, prohibited-content reason, appeal eligibility, or advertising ban has been verified. The owner must sign in to the relevant Meta Business account before the issue can be diagnosed or an appeal recommendation can be made.

The owner subsequently provided a Meta Account Quality notice dated **2026-08-19** for Nestwell. The notice states that the business is restricted from creating or running ads and from using or sharing audiences. Meta identifies the reason as use of an automation that does not follow its Advertising Standards on Account Integrity, with examples including large amounts of activity quickly created by a machine, automation that mimics human activity, and automation that detracts from authentic human activity. The notice offered a Request review action with 169 days remaining at the time of the screenshot. This is direct owner-provided evidence of the restriction reason; it does not identify a storefront-content violation. No review was requested.

## Customer reviews and contact-information boundary

AliExpress or supplier-listing reviews must not be copied, imported, relabelled, or displayed as Nestwell customer reviews. Doing so would misrepresent review origin and can increase policy and consumer-protection risk. Until an authentic Nestwell review source exists, the storefront should retain factual product information and avoid invented ratings, customer quotes, or testimonials.

The storefront already publishes `hello@wenestwell.com` for general correspondence and `support@wenestwell.com` for support. The owner’s established privacy preference is not to publish a personal phone number. A phone number may only be added after the owner confirms it is a dedicated business contact and approves its public use.

## Implemented storefront baseline

On 2026-08-29, the development storefront was read back in a browser after the factual trust implementation. The homepage now includes a visible **Shop with clarity** section linking customers to `support@wenestwell.com`, the public customer-correspondence address at 14-3650 Langstaff Rd Unit #818, Woodbridge, Ontario L4L 9A8, Canada, and the live Shipping, Returns, Privacy, and Terms pages. It also states that delivery options, taxes, and final total are shown before payment. The public About page now presents the same customer-contact and correspondence facts, while retaining the explicit no-personal-phone position.

The product-detail experience now includes an honest **Share product feedback** disclosure. It requests feedback only from a Nestwell purchaser, routes it to the support inbox with the product title in the email subject, and explicitly states that feedback is not represented as a verified customer review unless tied to a Nestwell order. No rating, testimonial, external marketplace review, review incentive, or supplier-review import was added.

## Customer-care and trust route verification

The complete public customer-care route set was rendered after the implementation: Contact, Shipping & Delivery, Returns & Refunds, Privacy, and Terms of Service. Each route loaded with the primary navigation and the customer-care footer links available. The copy remains consistent with the currently verified Canadian delivery configuration and does not announce U.K. or Australian shipping before Shopify delivery zones are saved.

| Surface | Current factual implementation | Remaining evidence gap |
| --- | --- | --- |
| Contact | Support email, general email, and public customer-correspondence address are directly visible. | A dedicated business telephone number has not been provided or approved for public use. |
| Shipping | Processing, delivery estimate, CAD $12 standard shipping, CAD $75 free-shipping threshold, tracking, and support escalation are visible for Canada. | Owner-approved U.S./U.K./Australia rates remain unsaved in Shopify. |
| Returns | Damaged, defective, or incorrect-item route, 30-day contact window, resolution criteria, and refund timing are visible. | Direct comparison with saved Shopify policy text remains pending. |
| Privacy and terms | Store operation, service-provider, support, price, availability, and checkout disclosures are visible. | Direct comparison with saved Shopify policy text remains pending. |
| Checkout and trust | The storefront discloses that delivery options, taxes, and final total appear before payment and labels the checkout handoff as secure. | Payment-method marks must only be added after their availability is directly confirmed in checkout. |
| Reviews | Authentic purchaser feedback is collected through the product-level support path and the live post-fulfillment lifecycle flow. | A verified review provider and actual Nestwell customer reviews are required before public review cards, ratings, or testimonials may be shown. |

These improvements are genuine storefront and customer-service implementations. They can support a later evidence-led account review, but they do not by themselves establish the cause of, or resolve, Google’s Misrepresentation restriction or Meta’s account-integrity restriction.

## Public HTTPS verification

On 2026-08-29, the public storefront loaded successfully at `https://wenestwell.com/` in the connected browser. The rendered homepage visibly includes the Shop with clarity section, support email, customer-correspondence address, policy links, CAD $75 Canada shipping statement, and secure-checkout guidance. This confirms that the current public site is served over HTTPS and exposes the implemented trust surfaces. It does not independently verify payment-method availability or an end-to-end completed checkout transaction.
