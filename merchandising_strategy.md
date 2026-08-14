# Nestwell Merchandising and Product-Page Framework

## Brand and Collection Architecture

Nestwell will present a calm, restorative home-wellness point of view rather than a generic marketplace. The five customer-facing collection names below are fixed and must be used exactly as shown in navigation, breadcrumbs, collection headings, and internal taxonomy rules. Existing supplier-style product titles should remain available in Shopify as the source record, while the storefront and SEO assistant prioritize clearer, accurate shopper-facing language.

| Exact collection name | Live-catalogue placement rule | Current examples |
| --- | --- | --- |
| **Sleep Hygiene** | Products supporting darkness, sound masking, evening routines, or sleep environment. | AuraSleep White Noise Mask; Lavender Sleep Mist; blackout curtains; sleep aid device. |
| **Comfort & Bedding** | Sheets, pillows, blankets, robes, and other tactile layers for rest. | Cooling bamboo pillowcases, fitted sheets, cooling blankets, waffle robe. |
| **Natural Home Comfort** | Bathroom comfort, home textiles, and natural-material home essentials. | Memory-foam bath mats, towel set, natural loofah, shower head filter. |
| **Wellness & Mindfulness** | Self-care and calming-routine tools with no unsupported therapeutic claims. | Body brush, sleep routine accessories, bath-care tools. |
| **Baby & Nursery** | Infant sleep, bath, feeding, and nursery comfort products. | Sleep sacks, swaddles, hooded towels, washcloths, nursing cover. |

## Product-Page Standard

Every product page will lead with a concise, accurate value proposition, then give shoppers the detail necessary to evaluate materials, dimensions, fit or compatibility, care, and variant availability. The design will include image zoom, the selected variant’s price and availability, a sticky purchase panel on desktop, and a mobile-first add-to-cart bar. A dedicated facts table and FAQ accordion will keep long-form information readable while serving specific discovery queries.

> Product and structured data must reflect the same factual product, price, currency, and stock information shown on the page and at checkout. The application will read this information live from Shopify rather than mirroring it in static copy. [1] [2]

The product template will create JSON-LD dynamically for the selected variant, including the product name, description, image, brand, SKU when available, canonical URL, offer price, currency, and live availability. Ratings and review schema will be intentionally omitted until genuine, customer-visible reviews are supplied by an approved source. This avoids fabricating social proof and keeps structured data aligned with merchant and consumer-protection expectations.

## SEO Assistant Output Standard

The admin assistant will generate a **draft** rather than silently overwrite Shopify data. It will produce a natural-language product title, meta title, meta description, introductory description, benefits, specification labels, FAQ candidates, and a category recommendation. It will be constrained to product facts supplied from Shopify and will flag missing material, size, care, safety, or compatibility information instead of inventing it. The human reviewer remains responsible for publishing any draft to Shopify.

For catalogue-scale dropshipping quality, product writing will follow a benefit-first, fact-supported structure; avoid copied supplier descriptions and unsupported claims; and keep product-feed copy descriptive rather than promotional. Shopify recommends writing descriptions for shoppers first, supporting benefits with features, and aligning PDP copy with shopping data. [3]

## References

[1]: [Google Merchant Center: Price requirements](https://support.google.com/merchants/answer/6324371?hl=en-IE)

[2]: [Shopify: Ecommerce schema markup guide](https://www.shopify.com/blog/ecommerce-schema)

[3]: [Shopify: SEO product descriptions](https://www.shopify.com/enterprise/blog/seo-product-descriptions)
