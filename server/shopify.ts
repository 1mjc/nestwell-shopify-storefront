export const SHOPIFY_STOREFRONT_DOMAIN = "kjir11-dn.myshopify.com";
const API_VERSION = "2026-07";

export const COLLECTIONS = [
  "Sleep Hygiene",
  "Comfort & Bedding",
  "Natural Home Comfort",
  "Wellness & Mindfulness",
  "Baby & Nursery",
] as const;

export type NestwellCollection = (typeof COLLECTIONS)[number];

export type StorefrontProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  vendor: string;
  category: NestwellCollection;
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
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  seo: { title: string | null; description: string | null };
  rating: { value: string; type: string } | null;
  updatedAt: string;
  availableForSale: boolean;
};

export type StorefrontCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  lines: Array<{
    id: string;
    quantity: number;
    cost: { totalAmount: { amount: string; currencyCode: string } };
    merchandise: {
      id: string;
      title: string;
      price: { amount: string; currencyCode: string };
      product: { title: string; handle: string; featuredImage: { url: string; altText: string | null } | null };
    };
  }>;
};

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id title handle description descriptionHtml productType tags vendor updatedAt availableForSale
    featuredImage { url altText }
    images(first: 12) { nodes { url altText width height } }
    options { name values }
    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    variants(first: 100) {
      nodes {
        id title availableForSale sku
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
        image { url altText }
      }
    }
    seo { title description }
    rating: metafield(namespace: "reviews", key: "rating") { value type }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    cost { totalAmount { amount currencyCode } }
    lines(first: 100) {
      nodes {
        id quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id title price { amount currencyCode }
            product { title handle featuredImage { url altText } }
          }
        }
      }
    }
  }
`;

export function categorizeProduct(input: Pick<StorefrontProduct, "title" | "tags" | "productType">): NestwellCollection {
  const text = `${input.title} ${input.productType} ${input.tags.join(" ")}`.toLowerCase();
  if (/(baby|infant|newborn|nursery|nursing|breastfeed|swaddle|toddler)/.test(text)) return "Baby & Nursery";
  if (/(white noise|sleep mask|blackout|insomnia|dream|sleep mist|sleep aid)/.test(text)) return "Sleep Hygiene";
  if (/(pillow|sheet|blanket|bedding|duvet|comforter|robe|coverlet)/.test(text)) return "Comfort & Bedding";
  if (/(massage|body brush|exfoliat|loofah|wellness|mindful|stress)/.test(text)) return "Wellness & Mindfulness";
  return "Natural Home Comfort";
}

function asProduct(product: Omit<StorefrontProduct, "category">): StorefrontProduct {
  const raw = product as unknown as {
    images?: StorefrontProduct["images"] | { nodes: StorefrontProduct["images"] };
    variants?: StorefrontProduct["variants"] | { nodes: StorefrontProduct["variants"] };
  };
  const images = Array.isArray(raw.images) ? raw.images : raw.images?.nodes || [];
  const variants = Array.isArray(raw.variants) ? raw.variants : raw.variants?.nodes || [];
  return { ...product, images, variants, category: categorizeProduct(product) };
}

async function storefrontRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured");

  const response = await fetch(`https://${SHOPIFY_STOREFRONT_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) throw new Error(`Shopify Storefront API returned ${response.status}`);
  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (payload.errors?.length) throw new Error(payload.errors.map(error => error.message).join("; "));
  if (!payload.data) throw new Error("Shopify Storefront API returned no data");
  return payload.data;
}

export async function getProducts(searchQuery = ""): Promise<StorefrontProduct[]> {
  const data = await storefrontRequest<{ products: { nodes: Array<Omit<StorefrontProduct, "category">> } }>(
    `query Products($query: String) { products(first: 100, query: $query) { nodes { ...ProductFields } } } ${PRODUCT_FRAGMENT}`,
    { query: searchQuery || null }
  );
  return data.products.nodes.map(asProduct);
}

export async function getCollectionProducts(collection: NestwellCollection): Promise<StorefrontProduct[]> {
  const products = await getProducts();
  return products.filter(product => product.category === collection);
}

export async function getProductByHandle(handle: string): Promise<StorefrontProduct | null> {
  const data = await storefrontRequest<{ product: Omit<StorefrontProduct, "category"> | null }>(
    `query ProductByHandle($handle: String!) { product(handle: $handle) { ...ProductFields } } ${PRODUCT_FRAGMENT}`,
    { handle }
  );
  return data.product ? asProduct(data.product) : null;
}

export async function getProductById(id: string): Promise<StorefrontProduct | null> {
  const data = await storefrontRequest<{ node: Omit<StorefrontProduct, "category"> | null }>(
    `query ProductById($id: ID!) { node(id: $id) { ... on Product { ...ProductFields } } } ${PRODUCT_FRAGMENT}`,
    { id }
  );
  return data.node ? asProduct(data.node) : null;
}

export async function searchProducts(query: string): Promise<StorefrontProduct[]> {
  if (query.trim().length < 2) return [];
  return getProducts(query.trim());
}

export function normalizeCart(cart: StorefrontCart): StorefrontCart {
  const raw = cart as unknown as { lines: StorefrontCart["lines"] | { nodes: StorefrontCart["lines"] } };
  return {
    ...cart,
    checkoutUrl: resolveCheckoutUrl(cart.checkoutUrl),
    lines: Array.isArray(raw.lines) ? raw.lines : raw.lines?.nodes || [],
  };
}

/**
 * Shopify mints checkout links on the store's configured customer-facing domain.
 * That domain now serves this headless storefront, which has no `/cart/c/...`
 * route, so the shopper would receive a 404. Re-point the checkout session at
 * the Shopify-owned host, which always serves checkout, and preserve the path,
 * cart token, and every query parameter exactly as Shopify issued them.
 */
export function resolveCheckoutUrl(checkoutUrl: string): string {
  if (!checkoutUrl) return checkoutUrl;
  try {
    const url = new URL(checkoutUrl);
    if (url.hostname === CHECKOUT_HOST) return url.toString();
    url.hostname = CHECKOUT_HOST;
    url.protocol = "https:";
    url.port = "";
    // `_rdiscovery=false` keeps Shopify from re-resolving the shopper back onto
    // the store's primary domain, which now serves this headless storefront.
    url.searchParams.set("_fd", "0");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/**
 * Host that reliably serves Shopify checkout for this store. Shopify redirects
 * `<shop>.myshopify.com` to the configured primary domain unless the redirect is
 * suppressed, so checkout links must both target this host and disable that
 * follow-on redirect.
 */
export const CHECKOUT_HOST = SHOPIFY_STOREFRONT_DOMAIN;

function cartResult(cart: StorefrontCart | null, errors: Array<{ message: string }> = []): StorefrontCart {
  if (errors.length) throw new Error(errors.map(error => error.message).join("; "));
  if (!cart) throw new Error("Shopify could not create or update the cart");
  return normalizeCart(cart);
}

export async function getCart(cartId: string): Promise<StorefrontCart | null> {
  const data = await storefrontRequest<{ cart: StorefrontCart | null }>(
    `query Cart($id: ID!) { cart(id: $id) { ...CartFields } } ${CART_FRAGMENT}`,
    { id: cartId }
  );
  return data.cart ? normalizeCart(data.cart) : null;
}

export async function createCart(variantId: string, quantity: number): Promise<StorefrontCart> {
  const data = await storefrontRequest<{ cartCreate: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> } }>(
    `mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { ...CartFields } userErrors { message } } } ${CART_FRAGMENT}`,
    { input: { lines: [{ merchandiseId: variantId, quantity }] } }
  );
  return cartResult(data.cartCreate.cart, data.cartCreate.userErrors);
}

export async function addCartLine(cartId: string, variantId: string, quantity: number): Promise<StorefrontCart> {
  const data = await storefrontRequest<{ cartLinesAdd: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> } }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } } } ${CART_FRAGMENT}`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  );
  return cartResult(data.cartLinesAdd.cart, data.cartLinesAdd.userErrors);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<StorefrontCart> {
  const data = await storefrontRequest<{ cartLinesUpdate: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> } }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } } } ${CART_FRAGMENT}`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return cartResult(data.cartLinesUpdate.cart, data.cartLinesUpdate.userErrors);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<StorefrontCart> {
  const data = await storefrontRequest<{ cartLinesRemove: { cart: StorefrontCart | null; userErrors: Array<{ message: string }> } }>(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { message } } } ${CART_FRAGMENT}`,
    { cartId, lineIds: [lineId] }
  );
  return cartResult(data.cartLinesRemove.cart, data.cartLinesRemove.userErrors);
}
