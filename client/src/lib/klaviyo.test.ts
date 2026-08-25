import { describe, expect, it } from "vitest";
import { klaviyoForTest } from "./klaviyo";

describe("Klaviyo Shopify variant mapping", () => {
  it("uses the numeric Shopify resource identifier required for inventory-aware restock alerts", () => {
    expect(klaviyoForTest.numericShopifyId("gid://shopify/ProductVariant/490203"))
      .toBe("490203");
    expect(klaviyoForTest.numericShopifyId("not-a-shopify-gid")).toBe("");
  });

  it("builds a public client-event payload for an explicitly consented product/cart interaction", () => {
    expect(
      klaviyoForTest.clientEventPayload(
        "Nestwell Added to Cart",
        {
          productId: "gid://shopify/Product/44",
          variantId: "gid://shopify/ProductVariant/490203",
          title: "AuraSleep",
          price: "36.99",
          currencyCode: "CAD",
          handle: "aurasleep-white-noise-mask",
        },
        "HELLO@WENESTWELL.COM",
        1,
      ),
    ).toMatchObject({
      data: {
        type: "event",
        attributes: {
          properties: {
            ProductID: "44",
            VariantID: "490203",
            ProductName: "AuraSleep",
            Currency: "CAD",
            Quantity: 1,
          },
          metric: { data: { type: "metric", attributes: { name: "Nestwell Added to Cart" } } },
          profile: {
            data: {
              type: "profile",
              attributes: { email: "hello@wenestwell.com" },
            },
          },
        },
      },
    });
  });
});
