import { describe, expect, it } from "vitest";
import { buildSeoDraftPrompt } from "./seoDraft";
import { categorizeProduct } from "./shopify";

describe("Nestwell catalogue taxonomy", () => {
  it("classifies baby sleep products into the exact Baby & Nursery collection", () => {
    expect(categorizeProduct({ title: "Soft Newborn Sleep Sack", tags: [], productType: "" })).toBe("Baby & Nursery");
  });

  it("classifies bedding products into the exact Comfort & Bedding collection", () => {
    expect(categorizeProduct({ title: "Cooling Bamboo Fitted Sheet", tags: [], productType: "" })).toBe("Comfort & Bedding");
  });

  it("preserves product facts in the SEO assistant prompt", () => {
    const prompt = buildSeoDraftPrompt({
      id: "gid://shopify/Product/1", title: "Bamboo Pillowcase", handle: "bamboo-pillowcase", description: "Cooling pillow cover.", descriptionHtml: "<p>Cooling pillow cover.</p>", productType: "", tags: ["bamboo"], vendor: "Nestwell", category: "Comfort & Bedding", images: [], featuredImage: null, options: [], variants: [], priceRange: { minVariantPrice: { amount: "19.99", currencyCode: "CAD" }, maxVariantPrice: { amount: "19.99", currencyCode: "CAD" } }, seo: { title: null, description: null }, updatedAt: "2026-08-14", availableForSale: true,
    });
    expect(prompt).toContain("Bamboo Pillowcase");
    expect(prompt).toContain("Do not invent certifications");
  });
});
