import { describe, expect, it } from "vitest";

const shopDomain = "kjir11-dn.myshopify.com";
const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

describe("Shopify Storefront API configuration", () => {
  it("authenticates to the configured Nestwell store", async () => {
    expect(storefrontToken, "A Storefront API access token must be configured").toBeTruthy();

    const response = await fetch(`https://${shopDomain}/api/2026-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": storefrontToken as string,
      },
      body: JSON.stringify({
        query: "query StoreIdentity { shop { name } products(first: 1) { edges { node { id title } } } }",
      }),
    });

    expect(response.ok).toBe(true);
    const body = (await response.json()) as {
      data?: { shop?: { name?: string }; products?: { edges?: Array<{ node?: { id?: string; title?: string } }> } };
      errors?: unknown[];
    };
    expect(body.errors ?? []).toEqual([]);
    expect(body.data?.shop?.name).toBeTruthy();
    expect(body.data?.products?.edges?.[0]?.node?.title).toBeTruthy();
  }, 15_000);
});
