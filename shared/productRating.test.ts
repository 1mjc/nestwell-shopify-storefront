import { describe, expect, it } from "vitest";
import { parseShopifyRating } from "./productRating";

describe("parseShopifyRating", () => {
  it("reads Shopify's structured reviews.rating metafield", () => {
    expect(parseShopifyRating({ value: '{"scale_min":"1.0","scale_max":"5.0","value":"4.7"}' })).toBe(4.7);
  });

  it("supports a numeric rating string while preserving absent data", () => {
    expect(parseShopifyRating({ value: "5" })).toBe(5);
    expect(parseShopifyRating(null)).toBeUndefined();
  });

  it("does not manufacture a rating from malformed source data", () => {
    expect(parseShopifyRating({ value: "not-a-rating" })).toBeUndefined();
  });
});
