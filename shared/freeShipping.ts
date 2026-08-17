export const FREE_SHIPPING_THRESHOLD_CAD = 75;

export type FreeShippingProgress = {
  subtotal: number;
  remaining: number;
  qualified: boolean;
};

export function getFreeShippingProgress(subtotalInput: string | number | null | undefined): FreeShippingProgress {
  const parsed = typeof subtotalInput === "string" ? Number.parseFloat(subtotalInput) : subtotalInput;
  const subtotal = Number.isFinite(parsed) ? Math.max(0, Number(parsed)) : 0;
  const qualified = subtotal > FREE_SHIPPING_THRESHOLD_CAD;
  return {
    subtotal,
    remaining: qualified ? 0 : Math.max(0, FREE_SHIPPING_THRESHOLD_CAD - subtotal),
    qualified,
  };
}
