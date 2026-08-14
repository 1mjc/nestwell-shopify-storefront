import { describe, expect, it } from "vitest";
import { normalizeCart, type StorefrontCart } from "./shopify";

describe("Shopify cart normalization", () => {
  it("unwraps Shopify cart line connections for drawer rendering", () => {
    const raw = {
      id: "gid://shopify/Cart/example",
      checkoutUrl: "https://example.test/checkout",
      totalQuantity: 1,
      cost: { totalAmount: { amount: "49.99", currencyCode: "CAD" } },
      lines: {
        nodes: [{
          id: "gid://shopify/CartLine/example",
          quantity: 1,
          cost: { totalAmount: { amount: "49.99", currencyCode: "CAD" } },
          merchandise: { id: "gid://shopify/ProductVariant/example", title: "Black", price: { amount: "49.99", currencyCode: "CAD" }, product: { title: "AuraSleep White Noise Mask", handle: "aurasleep-white-noise-mask", featuredImage: null } },
        }],
      },
    } as unknown as StorefrontCart;

    expect(normalizeCart(raw).lines).toHaveLength(1);
    expect(normalizeCart(raw).lines[0]?.merchandise.product.handle).toBe("aurasleep-white-noise-mask");
  });
});
