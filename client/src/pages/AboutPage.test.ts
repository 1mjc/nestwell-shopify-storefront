import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Router } from "wouter";

vi.mock("@/hooks/useSeo", () => ({ useSeo: vi.fn() }));
vi.mock("@/components/storefront", () => ({ Header: () => createElement("header", null, "Nestwell") }));
vi.mock("@/pages/Home", () => ({ Footer: () => createElement("footer", null, "Customer care") }));

import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("describes the verified retail, fulfilment, correspondence, and email-support model without publishing a personal phone number", () => {
    const html = renderToString(createElement(Router, { ssrPath: "/about" }, createElement(AboutPage)));
    expect(html).toContain("online retail store serving customers in Canada");
    expect(html).toContain("processed and fulfilled through the operating partners");
    expect(html).toContain("support@wenestwell.com");
    expect(html).toContain("hello@wenestwell.com");
    expect(html).toContain("14-3650 Langstaff Rd Unit #818");
    expect(html).toContain("Woodbridge, Ontario L4L 9A8");
    expect(html).toContain("does not claim an affiliation");
    expect(html).not.toContain("Phone number");
  });
});
