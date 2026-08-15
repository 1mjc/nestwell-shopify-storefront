import { Footer } from "@/pages/Home";
import { Header, ProductCard, TrustStrip } from "@/components/storefront";
import { useCart } from "@/contexts/CartContext";
import { formatMoney, productImage, productSummary, type Product } from "@/lib/store";
import { trpc } from "@/lib/trpc";
import { useSeo } from "@/hooks/useSeo";
import { buildProductFaqs, extractProductSpecs } from "@shared/productFacts";
import { Check, ChevronDown, Minus, Plus, ShieldCheck, Truck, ZoomIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";

function variantFor(product: Product, choices: Record<string, string>) { return product.variants.find(variant => product.options.every(option => variant.selectedOptions.some(selected => selected.name === option.name && selected.value === choices[option.name]))); }

export default function ProductPage() {
  const [, params] = useRoute("/products/:handle");
  const productQuery = trpc.shopify.product.useQuery({ handle: params?.handle || "" }, { enabled: Boolean(params?.handle) });
  const product = productQuery.data as Product | null | undefined;
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addProduct, busy } = useCart();
  const relatedQuery = trpc.shopify.collection.useQuery({ name: product?.category || "Sleep Hygiene" }, { enabled: Boolean(product) });
  useEffect(() => { if (product) { setChoices(Object.fromEntries(product.options.map(option => [option.name, option.values[0] || ""]))); setActiveImage(0); setZoomed(false); } }, [product?.id]);
  const selected = useMemo(() => product ? variantFor(product, choices) || product.variants[0] : undefined, [choices, product]);
  useSeo(product?.seo.title || (product ? `${product.title} | Nestwell` : "Nestwell | Rest Better, Live Softer"), product?.seo.description || (product ? productSummary(product).slice(0, 160) : "Considered comfort for sleep, home, wellness, and nursery rituals."), `/products/${params?.handle || ""}`);
  useEffect(() => { if (!product) return; const id = "nestwell-product-jsonld"; document.getElementById(id)?.remove(); const script = document.createElement("script"); script.id = id; script.type = "application/ld+json"; script.text = JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: product.title, description: productSummary(product), image: product.images.map(image => image.url), brand: { "@type": "Brand", name: "Nestwell" }, url: window.location.href, offers: selected ? { "@type": "Offer", price: selected.price.amount, priceCurrency: selected.price.currencyCode, availability: selected.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: window.location.href } : undefined }); document.head.appendChild(script); return () => script.remove(); }, [product, selected]);
  if (productQuery.isLoading) return <div className="site-shell"><Header/><main className="product-loading"><span/><span/></main></div>;
  if (!product) return <div className="site-shell"><Header/><main className="not-found"><h1>This product is taking a quiet moment.</h1><Link href="/">Return home</Link></main><Footer/></div>;
  const images = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const related = ((relatedQuery.data || []) as Product[]).filter((item: Product) => item.id !== product.id).slice(0, 4);
  const specs = [...extractProductSpecs({ category: product.category, productType: product.productType, description: product.description, options: product.options, variants: product.variants }), ...(selected?.sku ? [{ label: "SKU", value: selected.sku }] : [])];
  const faqs = buildProductFaqs({ category: product.category, productType: product.productType, description: product.description, options: product.options, variants: product.variants }, specs);
  return <div className="site-shell"><Header/><main><div className="product-breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href={`/collections/${product.category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}`}>{product.category}</Link><span>/</span><span>{product.title}</span></div>
    <section className="product-layout"><div className="gallery"><button className={`gallery-main ${zoomed ? "is-zoomed" : ""}`} onClick={() => setZoomed(value => !value)} aria-label={zoomed ? "Zoom out product image" : "Zoom in product image"}>{images[activeImage] ? <img src={images[activeImage].url} alt={images[activeImage].altText || product.title} /> : <div className="product-image-fallback">Nestwell</div>}<span className="zoom-note"><ZoomIn size={15}/>{zoomed ? "Tap to zoom out" : "Tap to zoom"}</span></button><div className="gallery-thumbs">{images.map((image, index) => <button className={activeImage === index ? "active" : ""} onClick={() => { setActiveImage(index); setZoomed(false); }} key={image.url}><img src={image.url} alt={image.altText || `View ${index + 1}`} /></button>)}</div></div>
      <div className="product-purchase"><span className="eyebrow">{product.category}</span><h1>{product.title}</h1><p className="product-intro">{productSummary(product)}</p><div className="product-price"><strong>{formatMoney(selected?.price)}</strong>{selected?.compareAtPrice && <del>{formatMoney(selected.compareAtPrice)}</del>}</div><p className={`availability ${selected?.availableForSale ? "in-stock" : ""}`}><span/>{selected?.availableForSale ? "Available from Nestwell" : "Currently unavailable"}</p>
        {product.options.map(option => <fieldset className="variant-group" key={option.name}><legend>{option.name}: <b>{choices[option.name]}</b></legend><div>{option.values.map(value => <button key={value} className={choices[option.name] === value ? "selected" : ""} onClick={() => setChoices(current => ({ ...current, [option.name]: value }))}>{value}</button>)}</div></fieldset>)}
        <div className="purchase-row"><div className="quantity-control large"><button onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={16}/></button><b>{quantity}</b><button onClick={() => setQuantity(value => value + 1)} aria-label="Increase quantity"><Plus size={16}/></button></div><button className="filled-button add-button" disabled={!selected?.availableForSale || busy} onClick={() => selected && addProduct(product, selected.id, quantity)}>{busy ? "Updating cart…" : selected?.availableForSale ? "Add to cart" : "Unavailable"}</button></div>
        <div className="product-trust"><span><Truck size={17}/><b>Checkout-ready</b> Live variant availability</span><span><ShieldCheck size={17}/><b>Shop securely</b> Protected checkout</span></div>
      </div></section>
    <TrustStrip />
    <section className="product-detail-section"><div><span className="eyebrow">The details</span><h2>Made for the<br/><i>way you live.</i></h2><p>{productSummary(product)}</p></div><div className="detail-panels"><details open><summary>Specifications <ChevronDown size={18}/></summary><dl>{specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl></details>{faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question} <ChevronDown size={18}/></summary><p>{faq.answer}</p></details>)}<details><summary>Shipping and checkout <ChevronDown size={18}/></summary><p>Final delivery options, taxes, and timing are confirmed securely before you complete your order.</p></details></div></section>
    {related.length ? <section className="section related-section"><div className="section-head section-head-row"><div><span className="eyebrow">Continue exploring</span><h2>More in <i>{product.category}</i></h2></div><Link href={`/collections/${product.category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}`} className="text-button">View collection <ChevronDown size={16}/></Link></div><div className="product-rail">{related.map((item: Product) => <ProductCard product={item} key={item.id}/>)}</div></section> : null}
  </main><Footer/></div>;
}
