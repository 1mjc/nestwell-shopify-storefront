import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const guestContext = {
  user: {
    id: 42,
    openId: "shopper-user",
    name: "Shopper",
    email: "shopper@example.com",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
} satisfies TrpcContext;

describe("seo.generate authorization", () => {
  it("rejects non-admin callers before any Shopify or LLM generation occurs", async () => {
    const caller = appRouter.createCaller(guestContext);
    await expect(caller.seo.generate({ productId: "gid://shopify/Product/1" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
