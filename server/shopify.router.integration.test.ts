import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const publicContext = {
  user: null,
  req: { protocol: "https", headers: {} },
  res: {},
} as TrpcContext;

describe("shopify router integration", () => {
  it("returns live Nestwell catalogue products through the project router", async () => {
    const caller = appRouter.createCaller(publicContext);
    const catalogue = await caller.shopify.catalogue();

    expect(catalogue.length).toBeGreaterThan(0);
    expect(catalogue.some(product => product.handle === "aurasleep-white-noise-mask")).toBe(true);
    expect(catalogue.some(product => product.category === "Sleep Hygiene")).toBe(true);
  }, 15_000);
});
