import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Router } from "wouter";

vi.mock("@/contexts/CartContext", () => ({ useCart: () => ({}) }));
vi.mock("@/lib/trpc", () => ({ trpc: {} }));

import { TrustBadgeLinks, TrustStrip } from "./storefront";

describe("factual trust badges", () => {
  it("links customer assurances to real policy and support destinations", () => {
    const html = renderToString(createElement(Router, { ssrPath: "/" }, createElement(TrustBadgeLinks)));
    expect(html).toContain("Secure checkout");
    expect(html).toContain("Clear delivery");
    expect(html).toContain("30-day issue support");
    expect(html).toContain("Written support");
    expect(html).toContain("/policies/shipping-policy");
    expect(html).toContain("/policies/refund-policy");
    expect(html).toContain("/contact");
  });

  it("keeps the homepage assurance strip grounded in policy and About links", () => {
    const html = renderToString(createElement(Router, { ssrPath: "/" }, createElement(TrustStrip)));
    expect(html).toContain("Free Canada shipping");
    expect(html).toContain("Secure checkout");
    expect(html).toContain("/policies/terms-of-service");
    expect(html).toContain("/about");
    expect(html).not.toContain("certified");
  });
});
