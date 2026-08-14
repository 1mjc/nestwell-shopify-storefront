import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { generateSeoDraft } from "./seoDraft";
import { COLLECTIONS, addCartLine, createCart, getCart, getCollectionProducts, getProductByHandle, getProductById, getProducts, removeCartLine, searchProducts, updateCartLine } from "./shopify";
import { z } from "zod";

const collectionSchema = z.enum(COLLECTIONS);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  shopify: router({
    catalogue: publicProcedure.query(() => getProducts()),
    collection: publicProcedure.input(z.object({ name: collectionSchema })).query(({ input }) => getCollectionProducts(input.name)),
    product: publicProcedure.input(z.object({ handle: z.string().min(1) })).query(({ input }) => getProductByHandle(input.handle)),
    search: publicProcedure.input(z.object({ query: z.string().max(100) })).query(({ input }) => searchProducts(input.query)),
    cart: publicProcedure.input(z.object({ cartId: z.string().min(1) })).query(({ input }) => getCart(input.cartId)),
    createCart: publicProcedure.input(z.object({ variantId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).mutation(({ input }) => createCart(input.variantId, input.quantity)),
    addCartLine: publicProcedure.input(z.object({ cartId: z.string().min(1), variantId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).mutation(({ input }) => addCartLine(input.cartId, input.variantId, input.quantity)),
    updateCartLine: publicProcedure.input(z.object({ cartId: z.string().min(1), lineId: z.string().min(1), quantity: z.number().int().min(0).max(20) })).mutation(({ input }) => input.quantity === 0 ? removeCartLine(input.cartId, input.lineId) : updateCartLine(input.cartId, input.lineId, input.quantity)),
    removeCartLine: publicProcedure.input(z.object({ cartId: z.string().min(1), lineId: z.string().min(1) })).mutation(({ input }) => removeCartLine(input.cartId, input.lineId)),
  }),
  seo: router({
    generate: adminProcedure.input(z.object({ productId: z.string().min(1) })).mutation(async ({ input }) => {
      const product = await getProductById(input.productId);
      if (!product) throw new Error("Product not found in the live Shopify catalogue");
      return { product, draft: await generateSeoDraft(product) };
    }),
  }),
});

export type AppRouter = typeof appRouter;
