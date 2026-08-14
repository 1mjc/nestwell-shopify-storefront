export function normalizeCartQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(20, Math.floor(quantity)));
}
