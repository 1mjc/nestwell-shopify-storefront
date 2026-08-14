import { Footer } from "@/pages/Home";
import { Header } from "@/components/storefront";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { formatMoney, type Product } from "@/lib/store";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Clipboard, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

export default function AdminSeo() {
  const auth = useAuth();
  const catalogue = trpc.shopify.catalogue.useQuery();
  const [productId, setProductId] = useState("");
  const generate = trpc.seo.generate.useMutation();
  const product = (catalogue.data || [] as Product[]).find((item: Product) => item.id === productId);
  if (auth.loading) return <div className="site-shell"><Header/><main className="admin-loading">Checking studio access…</main></div>;
  if (!auth.isAuthenticated) return <div className="site-shell"><Header/><main className="studio-gate"><span className="eyebrow">Nestwell studio</span><h1>Write with clarity,<br/><i>not filler.</i></h1><p>The SEO draft studio is reserved for the Nestwell team. Sign in to work with live product data and review structured copy drafts.</p><button className="filled-button" onClick={startLogin}>Sign in to the studio</button></main><Footer/></div>;
  return <div className="site-shell"><Header/><main className="studio-page"><section className="studio-intro"><span className="eyebrow">Admin · SEO draft studio</span><h1>Turn product facts into<br/><i>better discovery.</i></h1><p>Generate a careful, review-ready product description and metadata draft from the current Shopify record. Nothing is published automatically.</p></section><section className="studio-workspace"><div className="studio-controls"><label>Select a live product<select value={productId} onChange={event => setProductId(event.target.value)}><option value="">Choose a product</option>{(catalogue.data || [] as Product[]).map((item: Product) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label>{product && <div className="studio-product-summary"><span>{product.category}</span><strong>{product.title}</strong><small>From {formatMoney(product.priceRange.minVariantPrice)}</small></div>}<button className="filled-button" disabled={!productId || generate.isPending} onClick={() => generate.mutate({ productId })}><Wand2 size={17}/>{generate.isPending ? "Drafting from product facts…" : "Generate SEO draft"}</button><p><CheckCircle2 size={16}/> Drafts stay in this studio for human review. They do not overwrite Shopify product content.</p>{generate.error && <p className="studio-error">{generate.error.message}</p>}</div><div className="draft-panel">{generate.data ? <SeoDraftView data={generate.data.draft} /> : <div className="draft-empty"><Sparkles size={24}/><h2>Your draft will appear here.</h2><p>Select a product to generate a clear, fact-bound content starting point with missing-information flags.</p></div>}</div></section></main><Footer/></div>;
}

function SeoDraftView({ data }: { data: { shopperTitle: string; metaTitle: string; metaDescription: string; introduction: string; benefits: string[]; specs: Array<{ label: string; value: string }>; faqs: Array<{ question: string; answer: string }>; category: string; informationGaps: string[] } }) {
  return <div className="seo-draft"><div className="draft-head"><span className="eyebrow">Review-ready draft</span><button onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}><Clipboard size={15}/> Copy JSON</button></div><h2>{data.shopperTitle}</h2><div className="meta-preview"><small>Meta title</small><strong>{data.metaTitle}</strong><small>Meta description</small><p>{data.metaDescription}</p></div><section><h3>Product introduction</h3><p>{data.introduction}</p></section><section><h3>Benefits</h3><ul>{data.benefits.map(benefit => <li key={benefit}><CheckCircle2 size={15}/>{benefit}</li>)}</ul></section><section><h3>Suggested specifications</h3><dl>{data.specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl></section><section><h3>FAQ candidates</h3>{data.faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>{data.informationGaps.length ? <section className="gap-panel"><h3>Confirm before publishing</h3><ul>{data.informationGaps.map(gap => <li key={gap}>{gap}</li>)}</ul></section> : null}</div>;
}
