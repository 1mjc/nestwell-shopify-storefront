export type ProductFactInput = {
  category: string;
  productType: string;
  description: string;
  options: Array<{ name: string; values: string[] }>;
  variants: Array<{ title: string; availableForSale: boolean }>;
};

const FACT_LABELS = ["Material", "Ingredient", "Size", "Origin", "Use", "Item Type", "Care", "Feature", "Scent", "Smell", "Quantity"];

function cleaned(value: string) {
  return value.replace(/\s+/g, " ").replace(/[\u0000-\u001f]/g, "").trim().replace(/[;,.]+$/, "");
}

export function extractProductSpecs(input: ProductFactInput) {
  const source = cleaned(input.description);
  const facts: Array<{ label: string; value: string }> = [];
  for (const label of FACT_LABELS) {
    const expression = new RegExp(`${label}\\s*:\\s*([\\s\\S]{1,160}?)(?=\\s+(?:${FACT_LABELS.join("|")})\\s*:|$)`, "i");
    const match = source.match(expression);
    const value = match?.[1] ? cleaned(match[1]) : "";
    if (value && value.length < 130 && !facts.some(fact => fact.label.toLowerCase() === label.toLowerCase())) facts.push({ label, value });
  }
  if (input.productType) facts.unshift({ label: "Product type", value: input.productType });
  facts.unshift({ label: "Collection", value: input.category });
  facts.push({ label: "Options", value: input.options.map(option => `${option.name}: ${option.values.join(", ")}`).join(" · ") || `${input.variants.length} available variant${input.variants.length === 1 ? "" : "s"}` });
  return facts.slice(0, 7);
}

export function buildProductFaqs(input: ProductFactInput, specs: Array<{ label: string; value: string }>) {
  const material = specs.find(spec => /material|ingredient/i.test(spec.label));
  const size = specs.find(spec => /size/i.test(spec.label));
  const optionSummary = input.options.map(option => `${option.name.toLowerCase()} (${option.values.join(", ")})`).join(" and ");
  const faqs = [
    { question: "Which options can I choose?", answer: optionSummary ? `Choose from the live Shopify options shown above: ${optionSummary}. Availability is shown for the selected variant.` : "Choose from the live Shopify options shown above. Availability is shown for the selected variant." },
    { question: "How do I confirm the current price and availability?", answer: "Select your preferred option above. The price and availability displayed beside the purchase button reflect that live Shopify variant." },
  ];
  if (material) faqs.unshift({ question: "What is it made from?", answer: `Shopify lists ${material.value} under ${material.label.toLowerCase()} for this product.` });
  if (size) faqs.push({ question: "What size information is available?", answer: `Shopify lists: ${size.value}. Please confirm the selected option before checkout.` });
  return faqs.slice(0, 4);
}
