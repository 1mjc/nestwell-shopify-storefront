import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { Router } from "wouter";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    shopify: {
      collection: {
        useQuery: () => ({
          data: undefined,
          isLoading: false,
          isError: true,
          refetch: vi.fn(),
        }),
      },
    },
  },
}));

vi.mock("@/hooks/useSeo", () => ({ useSeo: () => undefined }));
vi.mock("@/pages/Home", () => ({ Footer: () => null, ProductGridSkeleton: () => null }));
vi.mock("@/components/storefront", () => ({ Header: () => null, ProductCard: () => null }));

import CollectionPage from "./CollectionPage";

describe("CollectionPage live catalogue error state", () => {
  it("renders an accessible error notice with a retry control when Shopify data cannot load", () => {
    const html = renderToString(createElement(
      Router,
      { ssrPath: "/collections/sleep-hygiene" },
      createElement(CollectionPage),
    ));

    expect(html).toContain('role="alert"');
    expect(html).toContain("We couldn’t load this collection.");
    expect(html).toContain("Try again");
  });
});
