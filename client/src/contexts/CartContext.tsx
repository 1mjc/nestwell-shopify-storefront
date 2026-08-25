import { trpc } from "@/lib/trpc";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/store";
import { normalizeCartQuantity } from "@shared/cartQuantity";
import { trackAddedToCart } from "@/lib/klaviyo";
import { useRef } from "react";

type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  lines: Array<{
    id: string;
    quantity: number;
    cost: { totalAmount: { amount: string; currencyCode: string } };
    merchandise: { id: string; title: string; price: { amount: string; currencyCode: string }; product: { title: string; handle: string; featuredImage: { url: string; altText: string | null } | null } };
  }>;
};

type CartContextValue = {
  cart: Cart | null;
  busy: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  addProduct: (product: Product, variantId: string, quantity?: number) => void;
  updateLine: (lineId: string, quantity: number) => void;
  checkout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "nestwell-cart-id";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pendingAdd = useRef<{ product: Product; variantId: string; quantity: number } | null>(null);
  const utils = trpc.useUtils();

  useEffect(() => {
    setIsClient(true);
    setCartId(window.localStorage.getItem(CART_STORAGE_KEY));
  }, []);

  const cartQuery = trpc.shopify.cart.useQuery({ cartId: cartId ?? "pending" }, { enabled: Boolean(cartId), retry: false });
  useEffect(() => {
    if (cartQuery.data) setCart(cartQuery.data as Cart);
  }, [cartQuery.data]);

  const onCart = (next: Cart) => {
    const pending = pendingAdd.current;
    if (pending) {
      const variant = pending.product.variants.find(item => item.id === pending.variantId);
      if (variant) trackAddedToCart({ productId: pending.product.id, variantId: pending.variantId, title: pending.product.title, price: variant.price.amount, currencyCode: variant.price.currencyCode, handle: pending.product.handle }, pending.quantity);
      pendingAdd.current = null;
    }
    setCart(next);
    setCartId(next.id);
    window.localStorage.setItem(CART_STORAGE_KEY, next.id);
    utils.shopify.cart.setData({ cartId: next.id }, next);
  };

  const create = trpc.shopify.createCart.useMutation({ onSuccess: data => onCart(data as Cart), onError: error => toast.error(error.message) });
  const addLine = trpc.shopify.addCartLine.useMutation({ onSuccess: data => onCart(data as Cart), onError: error => toast.error(error.message) });
  const update = trpc.shopify.updateCartLine.useMutation({ onSuccess: data => onCart(data as Cart), onError: error => toast.error(error.message) });

  const value = useMemo<CartContextValue>(() => ({
    cart,
    busy: isClient && (create.isPending || addLine.isPending || update.isPending || cartQuery.isFetching),
    open,
    setOpen,
    addProduct: (product, variantId, quantity = 1) => {
      if (!variantId) return toast.error("Select an available option before adding to cart.");
      const selectedQuantity = normalizeCartQuantity(quantity);
      pendingAdd.current = { product, variantId, quantity: selectedQuantity };
      if (cartId) addLine.mutate({ cartId, variantId, quantity: selectedQuantity });
      else create.mutate({ variantId, quantity: selectedQuantity });
      setOpen(true);
      toast.success(`${selectedQuantity} × ${product.title} added to your cart.`);
    },
    updateLine: (lineId, quantity) => {
      if (!cartId) return;
      update.mutate({ cartId, lineId, quantity });
    },
    checkout: () => {
      if (cart?.checkoutUrl) window.location.assign(cart.checkoutUrl);
    },
  }), [addLine, cart, cartId, cartQuery.isFetching, create, isClient, open, update]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
