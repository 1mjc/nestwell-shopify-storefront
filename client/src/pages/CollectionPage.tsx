import { Footer, ProductGridSkeleton } from "@/pages/Home";
import { Header, ProductCard } from "@/components/storefront";
import { collectionFromSlug, collectionMeta, formatMoney, type Product } from "@/lib/store";
import { trpc } from "@/lib/trpc";
import { useSeo } from "@/hooks/useSeo";
import { ArrowDownUp, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { parseShopifyRating } from "@shared/productRating";

type PriceFilter = "all" | "under-50" | "50-100" | "over-100";
type RatingFilter = "all" | "four-plus";

export default function CollectionPage() {
  const [, params] = useRoute("/collections/:slug");
  const collection = collectionFromSlug(params?.slug || "");
  const collectionPath = params?.slug || "";
  const [price, setPrice] = useState<PriceFilter>("all");
  const [available, setAvailable] = useState(false);
  const [rating, setRating] = useState<RatingFilter>("all");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = trpc.shopify.collection.useQuery({ name: collection || "Sleep Hygiene" }, { enabled: Boolean(collection) });
  const clearFilters = () => {
    setPrice("all");
    setAvailable(false);
    setRating("all");
  };
  const products = useMemo(() => {
    let next = [...((query.data || []) as Product[])];
    next = next.filter(product => {
      const value = Number(product.priceRange.minVariantPrice.amount);
      const passPrice = price === "all" || (price === "under-50" && value < 50) || (price === "50-100" && value >= 50 && value <= 100) || (price === "over-100" && value > 100);
      const parsedRating = parseShopifyRating(product.rating);
      const passRating = rating === "all" || (parsedRating !== undefined && parsedRating >= 4);
      return passPrice && passRating && (!available || product.availableForSale);
    });
    if (sort === "low") next.sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount));
    if (sort === "high") next.sort((a, b) => Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount));
    if (sort === "new") next.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    return next;
  }, [available, price, query.data, rating, sort]);
  const hasRatings = ((query.data || []) as Product[]).some(product => parseShopifyRating(product.rating) !== undefined);
  if (!collection) return <div className="site-shell"><Header/><main className="not-found"><h1>Collection not found.</h1><Link href="/">Return home</Link></main><Footer/></div>;
  const meta = collectionMeta[collection];
  useSeo(`${collection} | Nestwell`, meta.description, `/collections/${collectionPath}`);
  return <div className="site-shell"><Header/><main><section className="collection-hero" style={{ background: meta.tone }}><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>{collection}</span></div><span className="eyebrow">{meta.eyebrow}</span><h1>{collection}</h1><p>{meta.description}</p></section>
    <section className="catalogue-wrap"><div className="catalogue-toolbar"><button className="filter-button" onClick={() => setFiltersOpen(value => !value)}><SlidersHorizontal size={17}/> Filter</button><span>{products.length} pieces to explore</span><label className="sort-select"><ArrowDownUp size={16}/><select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Nestwell picks</option><option value="new">Recently updated</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><ChevronDown size={15}/></label></div>
        <div className="catalogue-layout"><aside className={`filter-panel ${filtersOpen ? "is-open" : ""}`}><div><strong>Refine</strong><button className="filter-close" onClick={() => setFiltersOpen(false)}><X size={18}/></button></div><fieldset><legend>Price</legend>{(["all", "under-50", "50-100", "over-100"] as PriceFilter[]).map(value => <label key={value}><input type="radio" checked={price === value} onChange={() => setPrice(value)}/><span>{value === "all" ? "All prices" : value === "under-50" ? `Under ${formatMoney({ amount: "50", currencyCode: "CAD" })}` : value === "50-100" ? `${formatMoney({ amount: "50", currencyCode: "CAD" })} – ${formatMoney({ amount: "100", currencyCode: "CAD" })}` : `Over ${formatMoney({ amount: "100", currencyCode: "CAD" })}`}</span></label>)}</fieldset>{hasRatings ? <fieldset><legend>Rating</legend><label><input type="radio" checked={rating === "all"} onChange={() => setRating("all")}/><span>All products</span></label><label><input type="radio" checked={rating === "four-plus"} onChange={() => setRating("four-plus")}/><span>4 stars & up</span></label></fieldset> : null}<fieldset><legend>Availability</legend><label><input type="checkbox" checked={available} onChange={event => setAvailable(event.target.checked)}/><span>Ready to ship</span></label></fieldset><p className="filter-note">Prices and availability update in real time. The star filter appears only when reliable product ratings are available; Nestwell never generates ratings.</p></aside>
        <div className="catalogue-grid">{query.isLoading ? <ProductGridSkeleton /> : query.isError ? <div className="no-results" role="alert"><h2>We couldn’t load this collection.</h2><p>Please check your connection and try again. Catalogue availability updates in real time.</p><button onClick={() => void query.refetch()}>Try again</button></div> : products.map(product => <ProductCard product={product} key={product.id}/>)}{!query.isLoading && !query.isError && !products.length && <div className="no-results"><h2>Nothing matches those filters.</h2><button onClick={clearFilters}>Clear filters</button></div>}</div></div></section>
  </main><Footer/></div>;
}
