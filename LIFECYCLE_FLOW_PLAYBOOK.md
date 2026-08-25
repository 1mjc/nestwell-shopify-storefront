# Nestwell Lifecycle Flow Playbook

> **Status:** Draft-only implementation plan as of 2026-08-25. No flow action may be switched to Live without the owner’s separate launch approval, a sender-domain check, a test-profile review, and a final consent/suppression audit.

## Operating safeguards

| Safeguard | Nestwell rule |
|---|---|
| Marketing eligibility | Send marketing only to explicitly consented email profiles. Keep the `Email List` on double opt-in. |
| Customer emails from checkout | Use Shopify transactional communications for order status. Do not treat a checkout email as automatic marketing permission. |
| Privacy-aware onsite events | Trigger the two headless-storefront metrics only after the shopper opted into the optional personalization checkbox and supplied their email. |
| Reviews | Ask only for honest feedback after delivery. Do not offer compensation, manufacture reviews, or pre-select a rating. |
| Frequency | Use Smart Sending for marketing emails, suppress recent purchasers from recovery flows, and prevent re-entry where a message could duplicate. |
| Back-in-stock | Send only through Klaviyo’s stock-aware trigger for the exact subscribed Shopify variant. |

## Event sources

| Event or source | Origin | Required use |
|---|---|---|
| `Added to list: Email List` | Footer explicit consent with double opt-in | Welcome flow only |
| `Nestwell Product Viewed` | Product detail page; personalization consent required | Browse and product-interest drafts |
| `Nestwell Added to Cart` | Successful headless cart mutation; personalization consent required | Cart-interest draft |
| `Started Checkout` / `Placed Order` | Shopify → Klaviyo native integration | Checkout recovery, post-purchase, thank-you, win-back, review drafts |
| `Back in Stock` | Klaviyo stock-aware Shopify catalog trigger | Variant-specific stock alert |

## Draft flow matrix

| Flow | Trigger and eligibility | Timing and content plan | Required draft safeguards |
|---|---|---|---|
| **Welcome Flow** | Added to `Email List`; no re-entry | Day 0: “Welcome to a quieter kind of comfort”; Day 3: how Nestwell chooses comfort essentials; Day 7: explore the five collections. | All three messages Draft; no promotional code implied. |
| **Abandoned Cart Flow** | `Nestwell Added to Cart`; explicit personalization consent; exclude Started Checkout and Placed Order since trigger | Wait 2 hours; one gentle note pointing to the exact product URL, not a false cart-reservation claim. | Draft only. Do not claim a cart is held or about to expire. |
| **Browse Abandonment Flow** | `Nestwell Product Viewed`; explicit personalization consent; exclude Added to Cart, Started Checkout, and Placed Order since event | Wait 4 hours; “Still considering it?” with the viewed product link and factual product details. | Draft only; use event `ProductURL`, `ProductName`, and `Price` properties. |
| **Product Abandonment Flow** | `Nestwell Product Viewed`; explicit personalization consent; no cart or order after event | Wait 24 hours; address a factual hesitation such as fit, material, care, or delivery policy. | Draft only; prevent overlap with Browse Abandonment with a conditional split/suppression. |
| **Post-Purchase Flow** | Shopify Placed Order; exclude cancelled/refunded orders as appropriate | Immediately: transaction-safe order-care note; Day 3: care/use guidance tailored by product category. | Keep marketing email separate from Shopify’s order confirmation. |
| **Customer Thank You Flow** | Shopify Placed Order; customer receives marketing only if consented | Day 1; branch first-order and returning customers, with thanks and no invented loyalty status. | Draft only; exclude same-day post-purchase follow-up. |
| **Customer Win-Back Flow** | Shopify Placed Order history; no order in 75 days; explicit marketing consent | Day 75: “It’s been a while”; Day 90: a single useful collection update. | Draft only; stop when a new order occurs; use Smart Sending. |
| **Review Request Flow** | Shopify fulfillment/delivery signal when available; explicit marketing consent | After a conservative delivery buffer: request an honest review or reply with feedback. | Draft only; no rating prompt, reward, testimonial, or claim of social proof. |
| **Product Back-in-Stock Flow** | Klaviyo Back in Stock event, exact Shopify catalog variant | Immediately when the subscribed variant becomes available; link to exact variant/product page. | Draft only; stock-aware flow must be configured before a queued alert can send. |
| **Product Interest / Abandonment Flow** | `Nestwell Product Viewed` or `Nestwell Added to Cart`; explicit personalization consent | Wait 48 hours; one concise product-specific reminder after the browse/cart flows have either not sent or completed. | Draft only; use a single exclusion strategy so a shopper never receives all three recovery messages. |

## Approved message foundations

| Flow | Subject | Preview | Core CTA |
|---|---|---|---|
| Welcome 1 | Welcome to a quieter kind of comfort | A small note from Nestwell, plus a place to begin. | Explore Nestwell |
| Cart | Still thinking it over? | A closer look at the item you added. | View the product |
| Browse | Still considering it? | Revisit the comfort that caught your eye. | See it again |
| Post-purchase | Thank you for choosing Nestwell | A few helpful notes for your new comfort. | Read care guidance |
| Thank-you | We’re glad you’re here | Thank you for making room for a softer routine. | Explore the collection |
| Win-back | A gentle reminder from Nestwell | New comforts, when you’re ready. | Visit Nestwell |
| Review | How did it fit into your routine? | Honest feedback helps us learn. | Share feedback |
| Back in stock | It’s available again | The option you asked about has returned. | View availability |

### Review Request Draft Body

> **Subject:** How has your Nestwell item been?  
> **Preview:** Your honest feedback helps us improve.

Hello,

We hope your Nestwell item has had time to settle into your routine. If you have a moment, please reply to this email with what has worked well and anything we could improve.

Your honest feedback helps us make more thoughtful choices for future Nestwell customers. There is no rating to select and no reward attached—just a direct conversation with our support team.

With thanks,  
Nestwell Support  
support@wenestwell.com

This is an owner-approved **Draft-only** body for the 14-day post-fulfillment Review Request. It must not be activated until the launch gate is completed.

## Launch gate

Before any email is made Live, the owner must confirm each of the following:

1. A real sender name, reply mailbox, physical mailing address in the email footer, and the required unsubscribe mechanism display correctly.
2. The double-opt-in confirmation and each marketing email are sent to a controlled test profile and reviewed on desktop/mobile.
3. All recovery flows include purchase/checkout suppression and no overlapping recovery flow can send to the same test profile.
4. Product URLs, product data, shipping wording, and return wording match the public Nestwell storefront.
5. The owner explicitly chooses **go live after validation** for the named flows.
