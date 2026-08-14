export type ShopifyRatingValue = { value?: string | null } | null | undefined;

/**
 * Parses Shopify's standard `reviews.rating` metafield value without creating
 * a rating when the catalogue does not provide one.
 */
export function parseShopifyRating(rating: ShopifyRatingValue): number | undefined {
  if (!rating?.value) return undefined;
  try {
    const parsed = JSON.parse(rating.value) as { value?: string | number } | string | number;
    const rawValue = typeof parsed === "object" && parsed !== null ? parsed.value : parsed;
    const value = Number(rawValue);
    return Number.isFinite(value) ? value : undefined;
  } catch {
    const value = Number(rating.value);
    return Number.isFinite(value) ? value : undefined;
  }
}
