import { describe, expect, it } from "vitest";
import { parseSeoDraftResponse } from "./seoDraft";

const validDraft = {
  shopperTitle: "Soft Bamboo Pillowcase",
  metaTitle: "Soft Bamboo Pillowcase | Nestwell",
  metaDescription: "A factual Nestwell description for a breathable pillowcase with variant-specific selection guidance.",
  introduction: "A calm, fact-bound introduction.",
  benefits: ["Benefit one", "Benefit two", "Benefit three"],
  specs: [{ label: "Material", value: "Bamboo" }, { label: "Options", value: "Standard" }],
  faqs: [{ question: "What is it made from?", answer: "Bamboo." }, { question: "Which options?", answer: "Standard." }, { question: "How do I check availability?", answer: "Select a variant." }],
  category: "Comfort & Bedding",
  informationGaps: [],
};

describe("SEO draft response validation", () => {
  it("accepts a complete structured SEO draft", () => {
    expect(parseSeoDraftResponse(JSON.stringify(validDraft)).metaTitle).toContain("Nestwell");
  });

  it("rejects an incomplete or non-schema draft response", () => {
    expect(() => parseSeoDraftResponse(JSON.stringify({ shopperTitle: "Only a title" }))).toThrow();
  });
});
