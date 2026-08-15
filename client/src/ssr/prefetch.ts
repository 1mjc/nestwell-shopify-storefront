import { getQueryKey } from "@trpc/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { collectionFromSlug, collectionMeta, type CollectionName } from "@/lib/store";
import { trpc } from "@/lib/trpc";

export type HeadMeta = {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noindex?: boolean;
  notFound?: boolean;
  jsonLd?: Record<string, unknown>;
};

export type SsrPrefetch = {
  catalogue: () => Promise<any>;
  collection: (input: { name: CollectionName }) => Promise<any>;
  product: (input: { handle: string }) => Promise<any>;
};

const SITE = "Nestwell | Rest Better, Live Softer";
const DEFAULT_DESCRIPTION = "Thoughtful essentials for sleep, comfort, natural home rituals, wellness, and nursery moments.";
const seed = (queryClient: QueryClient, key: unknown, data: unknown) => (queryClient as any).setQueryData(key, data);
const routePath = (url: string) => { try { return decodeURI(url.split("?")[0]).replace(/\/+$/, "") || "/"; } catch { return url.split("?")[0] || "/"; } };

export async function prefetchForPath(url: string, queryClient: QueryClient, prefetch: SsrPrefetch): Promise<HeadMeta> {
  const path = routePath(url);
  if (path === "/") {
    const catalogue = await prefetch.catalogue();
    seed(queryClient, getQueryKey(trpc.shopify.catalogue, undefined, "query"), catalogue);
    return { title: SITE, description: DEFAULT_DESCRIPTION, canonicalPath: "/" };
  }
  const collectionMatch = path.match(/^\/collections\/([^/]+)$/);
  if (collectionMatch) {
    const collection = collectionFromSlug(collectionMatch[1]);
    if (!collection) return { title: SITE, description: DEFAULT_DESCRIPTION, notFound: true };
    const products = await prefetch.collection({ name: collection });
    seed(queryClient, getQueryKey(trpc.shopify.collection, { name: collection }, "query"), products);
    const meta = collectionMeta[collection];
    return { title: `${collection} | Nestwell`, description: meta.description, canonicalPath: path };
  }
  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const handle = productMatch[1];
    const product = await prefetch.product({ handle });
    if (!product) return { title: SITE, description: DEFAULT_DESCRIPTION, notFound: true };
    seed(queryClient, getQueryKey(trpc.shopify.product, { handle }, "query"), product);
    const related = await prefetch.collection({ name: product.category });
    seed(queryClient, getQueryKey(trpc.shopify.collection, { name: product.category }, "query"), related);
    const variant = product.variants[0];
    const description = (product.seo?.description || product.description || DEFAULT_DESCRIPTION).replace(/\s+/g, " ").trim().slice(0, 160);
    return {
      title: product.seo?.title || `${product.title} | Nestwell`,
      description,
      canonicalPath: path,
      ogImage: product.featuredImage?.url,
      ogImageAlt: product.featuredImage?.altText || product.title,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description,
        image: product.images?.map((image: { url: string }) => image.url),
        brand: { "@type": "Brand", name: "Nestwell" },
        offers: variant ? { "@type": "Offer", price: variant.price.amount, priceCurrency: variant.price.currencyCode, availability: variant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } : undefined,
      },
    };
  }
  return { title: SITE, description: DEFAULT_DESCRIPTION, notFound: true };
}
