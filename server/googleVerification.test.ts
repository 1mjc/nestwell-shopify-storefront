import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Google Merchant Center verification", () => {
  it("keeps the approved wenestwell.com verification tag in the document head", () => {
    const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

    expect(indexHtml).toContain(
      '<meta name="google-site-verification" content="IUI3N66kLLIxAAxAgeAHZKBpHgOMjrq3lRg00dbgG-U" />',
    );
  });

  it("keeps the owner-approved GA4 measurement tag in the document head", () => {
    const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

    expect(indexHtml).toContain('https://www.googletagmanager.com/gtag/js?id=G-F0PM857JTW');
    expect(indexHtml).toContain("gtag('config', 'G-F0PM857JTW')");
  });
});
