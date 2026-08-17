import { createElement } from "react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Router } from "wouter";

vi.mock("@/lib/trpc", () => ({ trpc: {} }));

import { Footer } from "./Home";
import { CONTACT_PATH, POLICY_PATHS } from "./PolicyPage";

describe("policy navigation", () => {
  it("registers the public policy route in the storefront router", () => {
    const appSource = readFileSync(fileURLToPath(new URL("../App.tsx", import.meta.url)), "utf8");
    expect(appSource).toContain('path={"/policies/:slug"}>{() => <PolicyPage />}</Route>');
    expect(appSource).toContain('path={"/contact"} component={ContactPage}');
    expect(appSource).toContain('path={"/about"} component={AboutPage}');
  });

  it("renders every policy destination in the shared footer", () => {
    const html = renderToString(createElement(Router, { ssrPath: "/" }, createElement(Footer)));
    expect(html).toContain('href="/about"');
    expect(html).toContain(`href="${CONTACT_PATH}"`);
    Object.entries(POLICY_PATHS).filter(([slug]) => slug !== "contact-information").forEach(([, path]) => expect(html).toContain(`href="${path}"`));
  });
});
