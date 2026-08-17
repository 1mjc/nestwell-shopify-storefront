import { describe, expect, it } from "vitest";
import { FREE_SHIPPING_THRESHOLD_CAD, getFreeShippingProgress } from "./freeShipping";

describe("free shipping progress", () => {
  it("keeps the published CAD $75 offer threshold and calculates the remaining subtotal", () => {
    expect(FREE_SHIPPING_THRESHOLD_CAD).toBe(75);
    expect(getFreeShippingProgress("30.22")).toEqual({ subtotal: 30.22, remaining: 44.78, qualified: false });
  });

  it("does not mark a cart as qualified until it is over the stated threshold", () => {
    expect(getFreeShippingProgress(75)).toEqual({ subtotal: 75, remaining: 0, qualified: false });
    expect(getFreeShippingProgress(75.01)).toEqual({ subtotal: 75.01, remaining: 0, qualified: true });
  });
});
