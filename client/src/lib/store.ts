export const COLLECTIONS = [
  "Sleep Hygiene",
  "Comfort & Bedding",
  "Natural Home Comfort",
  "Wellness & Mindfulness",
  "Baby & Nursery",
] as const;

export type CollectionName = (typeof COLLECTIONS)[number];

export const collectionMeta: Record<CollectionName, { slug: string; eyebrow: string; description: string; tone: string }> = {
  "Sleep Hygiene": { slug: "sleep-hygiene", eyebrow: "Evening essentials", description: "Build a calmer, darker, quieter wind-down ritual.", tone: "#dde7df" },
  "Comfort & Bedding": { slug: "comfort-bedding", eyebrow: "Resting layers", description: "Soft, breathable pieces that make the everyday feel more considered.", tone: "#eee4d7" },
  "Natural Home Comfort": { slug: "natural-home-comfort", eyebrow: "Gentle at home", description: "Tactile home essentials for rooms that feel grounded and cared for.", tone: "#e7e2d2" },
  "Wellness & Mindfulness": { slug: "wellness-mindfulness", eyebrow: "Small rituals", description: "Simple tools for creating a more intentional reset.", tone: "#dfe9e6" },
  "Baby & Nursery": { slug: "baby-nursery", eyebrow: "Little beginnings", description: "Comfort-forward essentials for gentler nursery routines.", tone: "#eadfd4" },
};

export const collectionFromSlug = (slug: string): CollectionName | undefined =>
  COLLECTIONS.find(collection => collectionMeta[collection].slug === slug);

export type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  vendor: string;
  category: CollectionName;
  images: Array<{ url: string; altText: string | null; width?: number | null; height?: number | null }>;
  featuredImage: { url: string; altText: string | null } | null;
  options: Array<{ name: string; values: string[] }>;
  variants: Array<{
    id: string;
    title: string;
    availableForSale: boolean;
    price: { amount: string; currencyCode: string };
    compareAtPrice: { amount: string; currencyCode: string } | null;
    sku: string | null;
    selectedOptions: Array<{ name: string; value: string }>;
    image: { url: string; altText: string | null } | null;
  }>;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string }; maxVariantPrice: { amount: string; currencyCode: string } };
  seo: { title: string | null; description: string | null };
  rating: { value: string; type: string } | null;
  updatedAt: string;
  availableForSale: boolean;
};

export const formatMoney = (money?: { amount: string; currencyCode: string } | null) => {
  if (!money) return "—";
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: money.currencyCode, maximumFractionDigits: 2 }).format(Number(money.amount));
};

export const productImage = (product: Product) => product.featuredImage?.url || product.images[0]?.url || "";

export const cleanProductTitle = (title: string) => title.replace(/\s+/g, " ").trim();

export const productSummary = (product: Product) => conciseProductSummary(product.description);
import { conciseProductSummary } from "@shared/productSummary";
