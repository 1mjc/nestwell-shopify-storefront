import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Router } from "wouter";

vi.mock("@/lib/trpc", () => ({ trpc: {} }));
vi.mock("@/components/storefront", () => ({ Header: () => createElement("header", null, "Nestwell"), ProductCard: () => null, TrustStrip: () => null }));
vi.mock("@/contexts/CartContext", () => ({ useCart: () => ({}) }));
vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/pages/Home", async () => {
  const actual = await vi.importActual<typeof import("./Home")>("./Home");
  return { ...actual, Footer: () => createElement("footer", null, "Customer care") };
});

import { StorefrontClarity } from "./Home";
import { ProductFeedback } from "./ProductPage";

describe("factual trust surfaces", () => {
  it("publishes genuine support, correspondence, policy, and checkout guidance", () => {
    const html = renderToString(createElement(Router, { ssrPath: "/" }, createElement(StorefrontClarity)));
    expect(html).toContain("support@wenestwell.com");
    expect(html).toContain("14-3650 Langstaff Rd Unit #818");
    expect(html).toContain("Secure checkout handoff");
    expect(html).toContain("Shipping");
    expect(html).toContain("Returns");
  });

  it("collects honest order-tied feedback without presenting supplier reviews as Nestwell reviews", () => {
    const html = renderToString(createElement(ProductFeedback, { productTitle: "Rest Pillow" }));
    expect(html).toContain("Share product feedback");
    expect(html).toContain("support@wenestwell.com");
    expect(html).toContain("Nestwell order");
    expect(html).not.toContain("AliExpress");
  });
});
