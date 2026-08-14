import { describe, expect, it } from "vitest";
import { normalizeCartQuantity } from "./cartQuantity";

describe("cart quantity normalization", () => {
  it("preserves a selected multi-item quantity for the Shopify cart mutation", () => {
    expect(normalizeCartQuantity(3)).toBe(3);
  });

  it("constrains invalid cart quantities to a valid shopper-safe range", () => {
    expect(normalizeCartQuantity(0)).toBe(1);
    expect(normalizeCartQuantity(42)).toBe(20);
  });
});
