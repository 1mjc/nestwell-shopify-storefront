import { getProductByHandle } from "../server/shopify.ts";
import { generateSeoDraft } from "../server/seoDraft.ts";

const product = await getProductByHandle("aurasleep-white-noise-mask");
if (!product) throw new Error("Expected live AuraSleep product was not found");

const draft = await generateSeoDraft(product);
if (!draft.metaTitle || !draft.metaDescription || draft.benefits.length < 3) {
  throw new Error("Live SEO draft did not satisfy the expected structured content contract");
}

console.log(JSON.stringify({
  shopperTitle: draft.shopperTitle,
  metaTitle: draft.metaTitle,
  informationGaps: draft.informationGaps,
  benefitCount: draft.benefits.length,
  faqCount: draft.faqs.length,
}, null, 2));
