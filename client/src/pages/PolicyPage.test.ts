import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Router } from "wouter";

vi.mock("@/hooks/useSeo", () => ({ useSeo: () => undefined }));
vi.mock("@/components/storefront", () => ({ Header: () => null }));
vi.mock("@/pages/Home", () => ({ Footer: () => null }));

import PolicyPage, { ContactPage, CONTACT_PATH, POLICY_PATHS } from "./PolicyPage";

describe("public policy routes", () => {
  it("keeps the five customer-care paths stable", () => {
    expect(POLICY_PATHS).toEqual({
      "contact-information": "/policies/contact-information",
      "shipping-policy": "/policies/shipping-policy",
      "refund-policy": "/policies/refund-policy",
      "privacy-policy": "/policies/privacy-policy",
      "terms-of-service": "/policies/terms-of-service",
    });
  });

  it("renders the return-policy customer-support route", () => {
    const html = renderToString(createElement(Router, { ssrPath: "/policies/refund-policy" }, createElement(PolicyPage)));
    expect(html).toContain("Returns &amp; refunds");
    expect(html).toContain("nestwell.ca@proton.me");
    expect(html).toContain("within 30 days of delivery");
  });

  it("renders the required public Contact route content without asserting an unverified mailing address", () => {
    const html = renderToString(createElement(Router, { ssrPath: "/contact" }, createElement(ContactPage)));
    expect(CONTACT_PATH).toBe("/contact");
    expect(html).toContain("Contact Nestwell");
    expect(html).toContain("nestwell.ca@proton.me");
    expect(html).not.toContain("14-3650 Langstaff Rd");
  });
});
