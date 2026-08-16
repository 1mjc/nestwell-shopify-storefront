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
});
