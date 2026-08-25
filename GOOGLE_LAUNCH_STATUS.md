# Nestwell Google Sales Readiness Status

**Prepared:** August 16, 2026  
**Storefront:** `https://wenestwell.com`  
**Merchant Center:** `5820758319`  
**Current decision:** Do not launch paid ads until Google resolves the active Merchant Center Misrepresentation review and products become eligible.

## Executive Status

Nestwell has completed the essential customer-facing, domain, checkout, Merchant Center, and measurement setup work that is under store-owner control. The live storefront is connected to Shopify, customers reach Shopify Checkout without the former 404, `wenestwell.com` is verified and claimed in the existing Merchant Center account, and Google Analytics 4 is active for real storefront page views.

The remaining eligibility decision is now with Google: an owner-approved **Misrepresentation** review has been submitted. Google Merchant Center still blocks products from appearing in Canada until that review is resolved. Both saved Canada shipping services now show the aligned **11–23 business-day total** estimate, which is the calculated display of the public 1–3 business-day processing window plus the 10–20 business-day transit estimate.

> **No Google Ads account, campaign, spend, artificial review, test order, or product-data rewrite has been created as part of this work.**

| Launch area | Verified status | Evidence / action |
|---|---|---|
| Live domain | Ready | `wenestwell.com` is verified and claimed in the existing Merchant Center account. |
| Product landing pages | Aligned | Existing Shopify App API offer records submit to `wenestwell.com` product URLs; the prior URL-mismatch issue cleared. |
| Checkout | Ready | Live cart handoff reaches Shopify Checkout after password protection was disabled. |
| Customer transparency | Ready | Public Contact, Shipping, Returns, Privacy, and Terms routes are globally linked and use verified business/policy facts. |
| Merchant business details | Email identity update pending | Nestwell identity, Woodbridge address, and `https://wenestwell.com` remain configured. The legacy public email identity must be replaced in the relevant account and public records before this line can return to Ready. |
| Returns | Review pending | Merchant Center has Canada / defective-only / no-exchanges policy pointing to the live returns page. Google may take up to 10 days to review the saved policy. |
| Shipping | Ready | Both active Canada services now show 11–23 total business days, CAD $12 flat shipping, and free shipping over CAD $75; a dynamic sitewide/cart promotion now reflects this offer. |
| GA4 | Active | Nestwell Store property `G-F0PM857JTW` receives real-time storefront measurement. |
| Shopify purchase measurement | Connected | The existing Google & YouTube channel is connected to both Merchant Center and Nestwell Store GA4, Shopify’s supported completed-checkout path. A real completed order has not been placed solely for testing. |
| Merchant eligibility | Google review pending | Misrepresentation review request submitted with owner approval. |
| Google Ads | Not set up | No Ads account is linked and no paid campaign exists. This is intentional until products are approved. |

## Completed Remediation

### Public Storefront and Customer Trust

The public site now has a working Contact route, shared customer-care links, factual policy pages, the confirmed Nestwell support email, and owner-confirmed address details. Shipping text reflects the configured Shopify policy: Canada coverage, 1–3 business-day processing, a 10–20 business-day delivery estimate, CAD $12 standard shipping, and free shipping over CAD $75. The returns page frames the 30-day period as the time to contact Nestwell about qualifying damaged, defective, or incorrect items; it does not promise general discretionary returns.

The sitewide announcement and cart now surface the free-shipping offer dynamically. Customers see the CAD $75 threshold before browsing, a precise remaining amount below the threshold, and an unlocked message once the live cart total is above it. An exact CAD $75 cart correctly requires one additional cent because the published offer is stated as shipping **over** CAD $75.

### Merchant Center and Product Source

The existing Merchant Center account and existing Shopify App API source were retained; no duplicate account or replacement feed was created. The account’s website has been corrected from the old `myshopify.com` domain to `wenestwell.com`, then verified and claimed with an HTML verification tag deployed in the live storefront head. An affected AuraSleep offer now submits a `wenestwell.com` landing page, confirming source-to-domain alignment.

### Measurement

The Nestwell Store GA4 property and web stream were created for Canada, Toronto reporting time, Canadian Dollar, Shopping, and a sales objective. The storefront’s live document head loads the approved GA4 tag, and Analytics Realtime recorded a Canada visitor after a live page load. Shopify’s Google & YouTube channel now lists both Merchant Center and `G-F0PM857JTW (Nestwell Store)` as connected services. Shopify documents that its Google & YouTube channel is the supported way to connect GA4 and automatically collect certain ecommerce events after tags are configured.[1] [2]

### Post-Rejection Catalogue Claim Audit

A read-only Shopify Admin catalogue sample confirms the public product descriptions have been normalized to factual retail language: records use the **Nestwell** vendor, identify available options and material/usage context, and avoid claims of treatment, diagnosis, cure, guaranteed outcomes, or third-party endorsement. Baby-sleep products direct customers to current safe-sleep guidance, and the white-noise mask is explicitly presented as a personal accessory rather than a treatment for a health condition.

One item requires an owner review before any future Merchant Center request: **Handheld CES Device with Ear Clips**. Its current product description correctly disclaims use as a substitute for professional medical advice, diagnosis, or treatment, but its Shopify source handle includes sensitive terms such as “sleep aid,” “insomnia,” and “anxiety.” Do not add medical claims or change its Google categorization until its intended use, legal documentation, and applicable compliance status are confirmed.

## Remaining Actions

### Direct Sales Versus Google Ads

**Direct sales are ready now.** The live storefront, cart, checkout, policy pages, shipping offer, and customer support path operate independently of Merchant Center eligibility. **Google Shopping listings and paid ads remain blocked** until Google clears the account-level Misrepresentation issue after its review process. The current review outcome controls when that can happen; no further storefront deployment can override it.

### 1. Wait for Google’s Reviews

The return-policy review and Merchant Center Misrepresentation review are now outside the store’s direct control. Google may approve, request more evidence, or maintain the issue. Do not create a replacement Merchant Center account or a duplicate feed while the review is active. Merchant Center’s current issue page confirms that its Misrepresentation finding is account-level and blocks products in Canada until resolved.[3]

### 2. Start Ads Only After Product Approval

When Merchant Center product status becomes approved, create or connect a Google Ads account, then verify the Shopify Google & YouTube conversion setup before launching a small, controlled campaign. The first campaign should use one product group or a limited budget only after the account is eligible; that decision has not been made or executed here.

## Operational Checkpoints

| Checkpoint | Owner action | What success looks like |
|---|---|---|
| Shipping readback | Complete. | Both active Canada services show the calculated 11–23 business-day total and the approved CAD $12/free-over-CAD-$75 rule. |
| Return policy | Wait for Merchant policy review. | Canada policy remains verified and points to the live returns URL. |
| Misrepresentation review | Wait for Google email/dashboard outcome. | Account issue clears and product eligibility can be rechecked. |
| Product approval | Open Merchant Center products after review. | Products move from not approved to eligible/approved. |
| Ads readiness | Only after approval. | Link a Google Ads account, confirm conversions, then obtain separate owner approval for any budget or campaign. |

## References

[1] [Shopify Help Center — Setting up Google Analytics 4](https://help.shopify.com/en/manual/reports-and-analytics/google-analytics/google-analytics-setup)  
[2] [Google Merchant Center Help — Conversion tracking with the Google & YouTube app on Shopify](https://support.google.com/merchants/answer/13494537?hl=en)  
[3] [Google Merchant Center Help — Misrepresentation policy](https://support.google.com/merchants/answer/12079606?hl=en)
