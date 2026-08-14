import { describe, expect, it } from "vitest";
import { conciseProductSummary } from "./productSummary";

describe("product summary shaping", () => {
  it("moves raw catalogue specifications behind readable factual product prose", () => {
    const summary = conciseProductSummary("SPECIFICATIONS Material: Polyester Origin: China This bathroom rug is made of soft microfiber fleece material filled with memory foam and has a durable non-slip rubber bottom.");
    expect(summary).toBe("This bathroom rug is made of soft microfiber fleece material filled with memory foam and has a durable non-slip rubber bottom.");
  });

  it("keeps concise factual descriptions intact", () => {
    expect(conciseProductSummary("You can't control the noise outside your window. You can control what you actually hear.")).toContain("You can't control");
  });
});
