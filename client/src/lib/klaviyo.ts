const siteId = import.meta.env.VITE_KLAVIYO_PUBLIC_API_KEY?.trim();
const EMAIL_LIST_ID = "Uik6hB";
const CONSENT_KEY = "nestwell-marketing-personalization";
const EMAIL_KEY = "nestwell-marketing-email";
const KLAVIYO_REVISION = "2026-07-15";

type CommerceItem = {
  productId: string;
  variantId: string;
  title: string;
  price: string;
  currencyCode: string;
  handle: string;
};

type KlaviyoBrowser = {
  identify: (properties: Record<string, unknown>) => void;
  track: (name: string, properties?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    klaviyo?: KlaviyoBrowser;
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function browserStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function hasPersonalizationConsent() {
  return browserStorage()?.getItem(CONSENT_KEY) === "granted";
}

function shopperEmail() {
  return browserStorage()?.getItem(EMAIL_KEY) || "";
}

function numericShopifyId(id: string) {
  const segment = id.split("/").at(-1) || "";
  return /^\d+$/.test(segment) ? segment : "";
}

function klaviyoItem(item: CommerceItem) {
  return {
    ProductID: numericShopifyId(item.productId),
    VariantID: numericShopifyId(item.variantId),
    ProductName: item.title,
    ProductURL: `${window.location.origin}/products/${item.handle}`,
    Price: Number(item.price),
    Currency: item.currencyCode,
  };
}

async function loadKlaviyo() {
  if (!siteId || typeof window === "undefined") return null;
  if (window.klaviyo) return window.klaviyo;

  const existing = document.querySelector<HTMLScriptElement>("script[data-nestwell-klaviyo]");
  if (existing) {
    await new Promise<void>((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Klaviyo could not be loaded.")), { once: true });
      window.setTimeout(resolve, 2_000);
    });
    return window.klaviyo || null;
  }

  const script = document.createElement("script");
  script.async = true;
  script.dataset.nestwellKlaviyo = "true";
  script.src = `https://static.klaviyo.com/onsite/js/${encodeURIComponent(siteId)}/klaviyo.js`;
  document.head.appendChild(script);
  await new Promise<void>((resolve, reject) => {
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Klaviyo could not be loaded.")), { once: true });
  });
  return window.klaviyo || null;
}

async function clientPost(path: string, body: Record<string, unknown>) {
  if (!siteId) throw new Error("Email signup is not yet configured.");
  const response = await fetch(`https://a.klaviyo.com${path}?company_id=${encodeURIComponent(siteId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      revision: KLAVIYO_REVISION,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("We could not save your request. Please try again.");
}

export async function subscribeToNestwellEmails(email: string, personalization: boolean) {
  const normalizedEmail = normalizeEmail(email);
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw new Error("Enter a valid email address.");

  await clientPost("/client/subscriptions/", {
    data: {
      type: "subscription",
      attributes: {
        custom_source: "Nestwell storefront footer signup",
        profile: {
          data: {
            type: "profile",
            attributes: {
              email: normalizedEmail,
              subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
            },
          },
        },
      },
      relationships: { list: { data: { type: "list", id: EMAIL_LIST_ID } } },
    },
  });

  if (personalization) {
    browserStorage()?.setItem(CONSENT_KEY, "granted");
    browserStorage()?.setItem(EMAIL_KEY, normalizedEmail);
    const klaviyo = await loadKlaviyo();
    klaviyo?.identify({ email: normalizedEmail, "Nestwell personalization consent": true });
  }
}

async function trackConsentedEvent(name: string, item: CommerceItem, quantity?: number) {
  if (!hasPersonalizationConsent() || !shopperEmail()) return;
  try {
    const klaviyo = await loadKlaviyo();
    if (!klaviyo) return;
    klaviyo.identify({ email: shopperEmail(), "Nestwell personalization consent": true });
    klaviyo.track(name, { ...klaviyoItem(item), ...(quantity ? { Quantity: quantity } : {}) });
  } catch {
    // Customer shopping must remain usable if a third-party analytics request is unavailable.
  }
}

export function trackViewedProduct(item: CommerceItem) {
  void trackConsentedEvent("Nestwell Product Viewed", item);
}

export function trackAddedToCart(item: CommerceItem, quantity: number) {
  void trackConsentedEvent("Nestwell Added to Cart", item, quantity);
}

export async function subscribeToRestockAlert(email: string, variantId: string) {
  const normalizedEmail = normalizeEmail(email);
  const numericVariantId = numericShopifyId(variantId);
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw new Error("Enter a valid email address.");
  if (!numericVariantId) throw new Error("This product option cannot accept an availability alert yet.");

  await clientPost("/client/back-in-stock-subscriptions/", {
    data: {
      type: "back-in-stock-subscription",
      attributes: {
        profile: { data: { type: "profile", attributes: { email: normalizedEmail } } },
        channels: ["EMAIL"],
      },
      relationships: {
        variant: { data: { type: "catalog-variant", id: `$shopify:::$default:::${numericVariantId}` } },
      },
    },
  });
}

export const klaviyoForTest = { numericShopifyId };
