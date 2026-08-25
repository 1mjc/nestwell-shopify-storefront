import { describe, expect, it } from "vitest";

describe("Klaviyo public site identifier", () => {
  it("loads the official browser client without emitting an event", async () => {
    const siteId = process.env.VITE_KLAVIYO_PUBLIC_API_KEY;

    expect(siteId).toMatch(/^[A-Za-z0-9_-]{6,}$/);

    const response = await fetch(
      `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${encodeURIComponent(siteId ?? "")}`,
      { signal: AbortSignal.timeout(15_000) },
    );

    expect(response.ok).toBe(true);
    expect(response.headers.get("content-type")).toContain("javascript");
  }, 20_000);
});
