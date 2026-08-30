import { Link, useLocation } from "wouter";
import { ArrowRight, ChevronDown, ChevronRight, Menu, Minus, PackageCheck, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { COLLECTIONS, collectionMeta, formatMoney, productImage, type Product } from "@/lib/store";
import { trpc } from "@/lib/trpc";
import { NESTWELL_LOGO_ALT, NESTWELL_LOGO_URL } from "@/lib/brand";
import { FREE_SHIPPING_THRESHOLD_CAD, getFreeShippingProgress } from "@shared/freeShipping";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const image = productImage(product);
  return <Link href={`/products/${product.handle}`} className="product-card group" aria-label={`View ${product.title}`}>
    <div className={`product-image-shell ${compact ? "product-image-compact" : ""}`}>
      {image ? <img src={image} alt={product.featuredImage?.altText || product.title} className="product-image" loading="lazy" /> : <div className="product-image-fallback">Nestwell</div>}
      {!product.availableForSale && <span className="sold-out-label">Currently unavailable</span>}
      <span className="category-label">{product.category}</span>
    </div>
    <div className="product-card-copy">
      <h3>{product.title}</h3>
      <div className="product-card-bottom"><span>{formatMoney(product.priceRange.minVariantPrice)}</span><ArrowRight size={16} aria-hidden="true" /></div>
    </div>
  </Link>;
}

export function Header() {
  const [, navigate] = useLocation();
  const { cart, setOpen } = useCart();
  const shippingProgress = getFreeShippingProgress(cart?.cost.totalAmount.amount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const search = trpc.shopify.search.useQuery({ query }, { enabled: query.trim().length >= 2 });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <>
    <div className="announcement" aria-live="polite"><span>{shippingProgress.qualified ? "Free Canada shipping unlocked" : `Free Canada shipping over CAD $${FREE_SHIPPING_THRESHOLD_CAD}`}</span><span className="announcement-desktop">{cart?.lines.length ? shippingProgress.qualified ? "Your cart qualifies for free shipping" : `${formatMoney({ amount: shippingProgress.remaining.toFixed(2), currencyCode: "CAD" })} away from free shipping` : "Live availability · Secure checkout"}</span></div>
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Nestwell home"><img src={NESTWELL_LOGO_URL} alt={NESTWELL_LOGO_ALT} className="brand-logo" /></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <button className="nav-trigger" onClick={() => setMenuOpen(value => !value)}>Shop by ritual <ChevronDown size={15} /></button>
        <Link href="/collections/sleep-hygiene">Sleep</Link>
        <Link href="/collections/baby-nursery">Baby & Nursery</Link>
      </nav>
      <div className="header-actions">
        <button onClick={() => setSearchOpen(true)} aria-label="Search catalogue"><Search size={20} /></button>
        <button onClick={() => setOpen(true)} className="bag-button" aria-label={`Open cart with ${cart?.totalQuantity || 0} items`}><ShoppingBag size={20} /><span>{cart?.totalQuantity || 0}</span></button>
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen(value => !value)} aria-label="Open menu"><Menu size={22} /></button>
      </div>
      {menuOpen && <div className="mega-menu">
        <div className="mega-menu-head"><span className="eyebrow">Shop with intention</span><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
        <div className="mega-menu-grid">{COLLECTIONS.map(collection => <Link key={collection} href={`/collections/${collectionMeta[collection].slug}`} onClick={() => setMenuOpen(false)} className="mega-menu-link"><span className="mini-mark">0{COLLECTIONS.indexOf(collection) + 1}</span><span><strong>{collection}</strong><small>{collectionMeta[collection].description}</small></span><ChevronRight size={17} /></Link>)}</div>
      </div>}
    </header>
    {searchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search Nestwell catalogue">
      <div className="search-panel"><div className="search-field"><Search size={21}/><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the Nestwell catalogue" /><button onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={20} /></button></div>
        <div className="search-results">{query.trim().length < 2 ? <p>Type at least two characters to search sleep, comfort, wellness, and nursery essentials.</p> : search.isLoading ? <SearchSkeleton /> : search.data?.length ? search.data.slice(0, 6).map((product: Product) => <button key={product.id} className="search-result" onClick={() => { setSearchOpen(false); navigate(`/products/${product.handle}`); }}><img src={productImage(product)} alt="" /><span><small>{product.category}</small><strong>{product.title}</strong><em>{formatMoney(product.priceRange.minVariantPrice)}</em></span><ArrowRight size={17} /></button>) : <p>No exact matches yet. Try a material, room, or product type.</p>}</div>
      </div>
    </div>}
  </>;
}

function SearchSkeleton() { return <div className="skeleton-list">{Array.from({ length: 4 }).map((_, index) => <div className="skeleton-row" key={index}><span /><i /><b /></div>)}</div>; }

export function CartDrawer() {
  const { cart, busy, open, setOpen, updateLine, checkout } = useCart();
  const shippingProgress = getFreeShippingProgress(cart?.cost.totalAmount.amount);
  if (!open) return null;
  return <div className="cart-layer"><button className="cart-backdrop" aria-label="Close cart" onClick={() => setOpen(false)} /><aside className="cart-drawer" aria-label="Shopping cart"><div className="cart-heading"><span><small>Your selection</small><h2>Cart ({cart?.totalQuantity || 0})</h2></span><button onClick={() => setOpen(false)} aria-label="Close cart"><X size={21}/></button></div>
    {!cart?.lines.length ? <div className="cart-empty"><ShoppingBag size={28}/><h3>There’s room for a softer ritual.</h3><p>Explore considered essentials for sleep, home, wellness, and nursery moments.</p><button onClick={() => setOpen(false)} className="filled-button">Continue exploring</button></div> : <><div className="cart-lines">{cart.lines.map(line => <div className="cart-line" key={line.id}><img src={line.merchandise.product.featuredImage?.url || ""} alt=""/><div><Link href={`/products/${line.merchandise.product.handle}`} onClick={() => setOpen(false)}>{line.merchandise.product.title}</Link><small>{line.merchandise.title !== "Default Title" ? line.merchandise.title : ""}</small><span>{formatMoney(line.merchandise.price)}</span><div className="quantity-control"><button disabled={busy} onClick={() => updateLine(line.id, line.quantity - 1)} aria-label="Decrease quantity"><Minus size={14}/></button><b>{line.quantity}</b><button disabled={busy} onClick={() => updateLine(line.id, line.quantity + 1)} aria-label="Increase quantity"><Plus size={14}/></button></div></div><button className="line-remove" disabled={busy} onClick={() => updateLine(line.id, 0)}>Remove</button></div>)}</div><div className="cart-footer"><div className={`shipping-progress ${shippingProgress.qualified ? "shipping-qualified" : ""}`}><PackageCheck size={18}/><span><strong>{shippingProgress.qualified ? "Free Canada shipping unlocked" : "Free Canada shipping available"}</strong><small>{shippingProgress.qualified ? "Your subtotal is over CAD $75." : `Add ${formatMoney({ amount: shippingProgress.remaining.toFixed(2), currencyCode: "CAD" })} to unlock free shipping over CAD $75.`}</small></span></div><TrustBadgeLinks compact/><div><span>Subtotal</span><strong>{formatMoney(cart.cost.totalAmount)}</strong></div><p>Taxes and delivery are confirmed securely at checkout.</p><button className="filled-button checkout-button" onClick={checkout} disabled={busy}>Secure checkout <ArrowRight size={17}/></button></div></>}
  </aside></div>;
}

export function TrustStrip() { return <section className="trust-strip" aria-label="Nestwell shopping assurances"><Link href="/policies/shipping-policy"><PackageCheck size={20}/><span><strong>Free Canada shipping</strong>On orders over CAD $75.</span></Link><Link href="/policies/terms-of-service"><ShieldCheck size={20}/><span><strong>Secure checkout</strong>Protected from cart to confirmation.</span></Link><Link href="/about"><Sparkles size={20}/><span><strong>Considered selection</strong>Curated for daily comfort.</span></Link></section>; }

export function TrustBadgeLinks({ compact = false }: { compact?: boolean }) { return <nav className={`trust-badge-links${compact ? " is-compact" : ""}`} aria-label="Nestwell customer assurances"><Link href="/policies/terms-of-service"><ShieldCheck size={18}/><span><strong>Secure checkout</strong><small>Final total before payment</small></span></Link><Link href="/policies/shipping-policy"><PackageCheck size={18}/><span><strong>Clear delivery</strong><small>Shipping details before ordering</small></span></Link><Link href="/policies/refund-policy"><Sparkles size={18}/><span><strong>30-day issue support</strong><small>For damaged, defective, or incorrect items</small></span></Link><Link href="/contact"><ArrowRight size={18}/><span><strong>Written support</strong><small>Order help at every stage</small></span></Link></nav>; }
