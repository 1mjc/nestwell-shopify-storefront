# Nestwell Multi-Market Readiness

**Audit date:** 2026-08-26  
**Requested customer markets:** Canada, United States, United Kingdom, and Australia

## Direct Shopify capability evidence

The connected Shopify store identifies **CAD** as its shop currency and reports **CAD** as its only enabled presentment currency. Its delivery profiles currently expose a Domestic zone for **Canada** and a **US Cross-border** zone for the **United States**. The connected read-only access could not read Shopify Markets, so Markets configuration could not be independently verified through this channel.

| Topic | Directly confirmed | Customer-facing implication |
| --- | --- | --- |
| Store currency | CAD only | Do not promise USD, GBP, or AUD price presentation. |
| Delivery zones | Canada and United States | Canada and U.S. availability can be described only within the verified scope. |
| United Kingdom | No configured delivery zone observed | Do not claim U.K. shipping until the checkout/delivery configuration is confirmed. |
| Australia | No configured delivery zone observed | Do not claim Australian shipping until the checkout/delivery configuration is confirmed. |
| Markets API | Access denied | Do not infer market activation, local payment methods, duties, or tax behavior. |

## Safe implementation boundary

The existing public site is Canada-only, including the CAD $75 free-shipping message. The owner subsequently confirmed that free shipping should apply above CAD $75 in all four requested markets and approved the proposed standard CAD rates below. However, the direct store readback still supports only Canada and the United States, and the permitted Shopify delivery mutation rejected the attempted update because this store uses the newer multi-condition configuration. **No U.K. or Australian zone was added, and no U.S. rate was changed.**

The storefront must not publish U.K. or Australian service claims, cross-border delivery estimates, duty statements, free-shipping eligibility, local currency promises, or tax claims until the approved Shopify delivery configuration is saved and re-verified. Until then, the only safe global statement is that checkout shows the available delivery options, taxes, and final total for an eligible address.

## Owner approval and mutation outcome

On 2026-08-29, the owner confirmed the exact proposed rates in this document and confirmed that free shipping over CAD $75 applies to Canada, the United States, the United Kingdom, and Australia. A read-only schema review was completed, followed by an attempted minimal Shopify delivery update for the U.S. threshold and the two new zones. Shopify rejected the operation under the connected integration’s newer delivery-configuration API. The owner must save the approved configuration in Shopify Admin before the storefront can truthfully announce four-market service. No storefront market claim was changed as part of the failed mutation.

## Existing Shopify delivery-rate readback

The General profile currently has the following active Canada and U.S. methods. Canada already has the intended CAD $75 free-shipping threshold. The United States has weight-banded rates and a separate CAD $100 free-shipping threshold, which must change to CAD $75 to match the owner’s confirmed all-market rule.

| Market zone | Existing method | Existing rate / condition |
| --- | --- | --- |
| Canada | Standard | CAD $12.00 without a condition |
| Canada | Standard | CAD $0.00 at order total ≥ CAD $75.00 |
| United States | Standard International | CAD $7.90 at 0–0.5 kg |
| United States | Standard International | CAD $19.90 at 0.5001–1.5 kg |
| United States | Standard International | CAD $29.90 at 1.5001–30 kg |
| United States | Standard International | CAD $0.00 at order total ≥ CAD $100.00 |

## Proposed standard CAD rate structure for approval

This proposal retains the current Canada and U.S. light/medium/heavy shipping logic, changes U.S. free shipping to the owner-confirmed CAD $75 threshold, and applies clear weight-banded standard rates to the new U.K. and Australian zones. It avoids unverified delivery-time, duty, and tax promises.

| Market | 0–0.5 kg | 0.5001–1.5 kg | 1.5001–30 kg | Free shipping |
| --- | ---: | ---: | ---: | --- |
| Canada | CAD $12.00 standard | CAD $12.00 standard | CAD $12.00 standard | CAD $0.00 at ≥ CAD $75 |
| United States | CAD $7.90 | CAD $19.90 | CAD $29.90 | CAD $0.00 at ≥ CAD $75 |
| United Kingdom | CAD $12.90 | CAD $24.90 | CAD $34.90 | CAD $0.00 at ≥ CAD $75 |
| Australia | CAD $14.90 | CAD $27.90 | CAD $39.90 | CAD $0.00 at ≥ CAD $75 |

The precise rate proposal above is not yet written to Shopify. It is a customer-price and delivery-configuration decision requiring owner confirmation immediately before the settings change.
