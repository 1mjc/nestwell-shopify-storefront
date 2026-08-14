import { describe, expect, it } from "vitest";
import { buildSeoMetadata } from "./seoMetadata";

describe("SEO metadata helper", () => {
  it("normalizes public canonical paths and keeps concise metadata", () => {
    const metadata = buildSeoMetadata("  Sleep Hygiene | Nestwell  ", "  Calm, precise collection copy.  ", "collections/sleep-hygiene");
    expect(metadata).toEqual({ title: "Sleep Hygiene | Nestwell", description: "Calm, precise collection copy.", canonicalPath: "/collections/sleep-hygiene" });
  });

  it("limits meta descriptions to a search-snippet-safe length", () => {
    expect(buildSeoMetadata("Nestwell", "a".repeat(180), "/").description).toHaveLength(160);
  });
});
