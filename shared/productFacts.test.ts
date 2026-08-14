import { describe, expect, it } from "vitest";
import { buildProductFaqs, extractProductSpecs } from "./productFacts";

describe("product fact extraction", () => {
  const product = { category: "Natural Home Comfort", productType: "", description: "SPECIFICATIONS Material: 100% Polyester Origin: Mainland China Size: 47.2 in x 15.7 in", options: [{ name: "Color", values: ["Brown"] }], variants: [{ title: "Brown", availableForSale: true }] };
  it("extracts factual specifications without inventing product claims", () => {
    const specs = extractProductSpecs(product);
    expect(specs).toContainEqual({ label: "Material", value: "100% Polyester" });
    expect(specs).toContainEqual({ label: "Size", value: "47.2 in x 15.7 in" });
  });
  it("builds product-specific FAQ candidates from available facts", () => {
    const specs = extractProductSpecs(product);
    expect(buildProductFaqs(product, specs)[0]?.question).toBe("What is it made from?");
  });
});
