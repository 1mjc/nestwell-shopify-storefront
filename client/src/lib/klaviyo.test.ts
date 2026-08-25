import { describe, expect, it } from "vitest";
import { klaviyoForTest } from "./klaviyo";

describe("Klaviyo Shopify variant mapping", () => {
  it("uses the numeric Shopify resource identifier required for inventory-aware restock alerts", () => {
    expect(klaviyoForTest.numericShopifyId("gid://shopify/ProductVariant/490203"))
      .toBe("490203");
    expect(klaviyoForTest.numericShopifyId("not-a-shopify-gid")).toBe("");
  });
});
