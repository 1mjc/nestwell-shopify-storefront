import { describe, expect, it } from "vitest";

describe("CANONICAL_ORIGIN", () => {
  it("is a valid public origin with a reachable lightweight robots endpoint", async () => {
    const origin = process.env.CANONICAL_ORIGIN;
    expect(origin).toBeTruthy();
    const base = new URL(origin as string);
    expect(["http:", "https:"]).toContain(base.protocol);
    const response = await fetch(new URL("/robots.txt", base), { redirect: "follow" });
    expect(response.status).toBeLessThan(500);
  }, 15_000);
});
