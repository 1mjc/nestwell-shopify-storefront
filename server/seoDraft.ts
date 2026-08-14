import { invokeLLM, type InvokeResult } from "./_core/llm";
import type { StorefrontProduct } from "./shopify";
import { z } from "zod";

export type SeoDraft = {
  shopperTitle: string;
  metaTitle: string;
  metaDescription: string;
  introduction: string;
  benefits: string[];
  specs: Array<{ label: string; value: string }>;
  faqs: Array<{ question: string; answer: string }>;
  category: string;
  informationGaps: string[];
};

export function buildSeoDraftPrompt(product: StorefrontProduct): string {
  const variants = product.variants.slice(0, 12).map(variant => ({
    title: variant.title,
    price: `${variant.price.amount} ${variant.price.currencyCode}`,
    sku: variant.sku,
    options: variant.selectedOptions,
  }));
  return JSON.stringify({
    product: {
      currentTitle: product.title,
      rawDescription: product.description,
      productType: product.productType,
      tags: product.tags,
      vendor: product.vendor,
      collectionRecommendation: product.category,
      variants,
    },
    instructions: [
      "Write a draft for the Nestwell brand: composed, calm, precise, and helpful.",
      "Use only facts supplied in the product record. Do not invent certifications, medical benefits, materials, dimensions, shipping promises, reviews, ratings, warranties, safety claims, or compatibility.",
      "Use benefit-led but non-hyped language. Avoid cure, treat, diagnose, guaranteed, best, and unsupported wellness claims.",
      "The meta title should be 50–60 characters when possible. The meta description should be 140–160 characters when possible.",
      "If a crucial product fact is missing, name it in informationGaps rather than guessing.",
      "FAQ answers must be conservative and factual, and may explain that the buyer should confirm details in the specification section when a fact is unavailable.",
    ],
  });
}

const schema = {
  type: "object",
  properties: {
    shopperTitle: { type: "string" },
    metaTitle: { type: "string" },
    metaDescription: { type: "string" },
    introduction: { type: "string" },
    benefits: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
    specs: {
      type: "array",
      items: {
        type: "object",
        properties: { label: { type: "string" }, value: { type: "string" } },
        required: ["label", "value"],
        additionalProperties: false,
      },
      minItems: 2,
      maxItems: 8,
    },
    faqs: {
      type: "array",
      items: {
        type: "object",
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
        additionalProperties: false,
      },
      minItems: 3,
      maxItems: 5,
    },
    category: { type: "string" },
    informationGaps: { type: "array", items: { type: "string" }, maxItems: 8 },
  },
  required: ["shopperTitle", "metaTitle", "metaDescription", "introduction", "benefits", "specs", "faqs", "category", "informationGaps"],
  additionalProperties: false,
};

const seoDraftSchema = z.object({
  shopperTitle: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  introduction: z.string(),
  benefits: z.array(z.string()).min(3).max(5),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).min(2).max(8),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).min(3).max(5),
  category: z.string(),
  informationGaps: z.array(z.string()).max(8),
}).strict();

export function parseSeoDraftResponse(content: string): SeoDraft {
  return seoDraftSchema.parse(JSON.parse(content));
}

export function extractCompletionText(content: InvokeResult["choices"][number]["message"]["content"]) {
  if (typeof content === "string") return content;
  return content.filter(part => part.type === "text").map(part => part.text).join("");
}

export async function generateSeoDraft(product: StorefrontProduct): Promise<SeoDraft> {
  const result = await invokeLLM({
    model: "gpt-5-mini",
    maxCompletionTokens: 1800,
    messages: [
      {
        role: "system",
        content: "You are a meticulous ecommerce copywriter. Return only the requested structured output. Preserve factual accuracy over persuasion.",
      },
      { role: "user", content: buildSeoDraftPrompt(product) },
    ],
    outputSchema: { name: "nestwell_seo_draft", strict: true, schema },
  });
  const content = extractCompletionText(result.choices[0]?.message.content ?? "");
  if (!content.trim()) throw new Error("SEO assistant returned no text");
  return parseSeoDraftResponse(content);
}
