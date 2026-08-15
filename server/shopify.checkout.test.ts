import { describe, expect, it } from "vitest";
import { SHOPIFY_STOREFRONT_DOMAIN, resolveCheckoutUrl } from "./shopify";

describe("resolveCheckoutUrl", () => {
  it("moves a storefront-domain checkout link onto the Shopify checkout host", () => {
    const issued = "https://wenestwell.com/cart/c/hWNFfcfkxpp3f787buvHxxti?key=abc%3D%3D&_s=1234";
    const resolved = new URL(resolveCheckoutUrl(issued));

    expect(resolved.hostname).toBe(SHOPIFY_STOREFRONT_DOMAIN);
    expect(resolved.pathname).toBe("/cart/c/hWNFfcfkxpp3f787buvHxxti");
    expect(resolved.searchParams.get("key")).toBe("abc==");
    expect(resolved.searchParams.get("_s")).toBe("1234");
  });

  it("suppresses Shopify's redirect back onto the storefront's primary domain", () => {
    const issued = "https://wenestwell.com/cart/c/token?key=abc";
    const resolved = new URL(resolveCheckoutUrl(issued));
    expect(resolved.searchParams.get("_fd")).toBe("0");
  });

  it("leaves an already-Shopify-hosted checkout link intact", () => {
    const issued = `https://${SHOPIFY_STOREFRONT_DOMAIN}/cart/c/token?key=xyz`;
    expect(resolveCheckoutUrl(issued)).toBe(issued);
  });

  it("returns unusable values unchanged instead of throwing", () => {
    expect(resolveCheckoutUrl("")).toBe("");
    expect(resolveCheckoutUrl("not-a-url")).toBe("not-a-url");
  });
});
