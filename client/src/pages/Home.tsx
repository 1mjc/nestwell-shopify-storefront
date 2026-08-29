import { Header, ProductCard, TrustStrip } from "@/components/storefront";
import { COLLECTIONS, collectionMeta, type Product } from "@/lib/store";
import { trpc } from "@/lib/trpc";
import { NESTWELL_LOGO_ALT, NESTWELL_LOGO_URL } from "@/lib/brand";
import { useSeo } from "@/hooks/useSeo";
import { ArrowRight, CircleArrowDown, Sparkles } from "lucide-react";
import React from "react";
import { Link } from "wouter";
import { EmailSignup } from "@/components/LifecycleCapture";

const heroUrl = "/manus-storage/nestwell-hero-bedroom_ea2b7860.png";

export default function Home() {
  useSeo("Nestwell | Rest Better, Live Softer", "Considered comfort for sleep, home, wellness, and nursery rituals — live from Nestwell.", "/");
  const catalogue = trpc.shopify.catalogue.useQuery();
  const products = (catalogue.data || []) as Product[];
  const featured = products.slice(0, 8);

  return <div className="site-shell"><Header />
    <main>
      <section className="hero-section"><div className="hero-image" style={{ backgroundImage: `url(${heroUrl})` }} /><div className="hero-overlay" />
        <div className="hero-copy"><span className="eyebrow hero-eyebrow">A softer way home</span><h1>Make room for<br/><i>deep rest.</i></h1><p>Considered comfort for sleep, home, wellness, and the earliest days of family life.</p><div className="hero-actions"><Link href="/collections/sleep-hygiene" className="filled-button">Explore sleep essentials <ArrowRight size={17}/></Link><a className="text-button" href="#collections">Find your ritual <CircleArrowDown size={16}/></a></div></div>
        <div className="hero-note"><span>01</span><p>Created for the<br/>quietest part of your day.</p></div>
      </section>
      <TrustStrip />
      <section id="collections" className="section collection-intro"><div className="section-head"><div><span className="eyebrow">Shop by ritual</span><h2>Wellbeing starts<br/>with the <i>everyday.</i></h2></div><p>Explore practical comforts selected for the spaces and routines where you recharge, care, and begin again.</p></div>
        <div className="collection-grid">{COLLECTIONS.map((collection, index) => <Link href={`/collections/${collectionMeta[collection].slug}`} className={`collection-tile tile-${index + 1}`} key={collection} style={{ background: collectionMeta[collection].tone }}><div><span>0{index + 1}</span><h3>{collection}</h3><p>{collectionMeta[collection].description}</p></div><ArrowRight size={20}/></Link>)}</div>
      </section>
      <section className="section bestsellers-section"><div className="section-head section-head-row"><div><span className="eyebrow">Live from Nestwell</span><h2>Begin with what<br/>feels <i>good.</i></h2></div><Link href="/collections/natural-home-comfort" className="text-button">View all comforts <ArrowRight size={16}/></Link></div>
        {catalogue.isLoading ? <ProductGridSkeleton /> : featured.length ? <div className="product-rail">{featured.map(product => <ProductCard key={product.id} product={product} />)}</div> : <EmptyCatalogue />}
      </section>
      <section className="editorial-split"><div className="editorial-image"><img src={heroUrl} alt="Sunlit linen bedroom sanctuary"/></div><div className="editorial-copy"><span className="eyebrow">Our point of view</span><h2>Comfort is a<br/><i>daily practice.</i></h2><p>Nestwell is a place for small upgrades that help a room feel calmer, a routine feel more intentional, and rest feel a little more within reach.</p><Link href="/collections/wellness-mindfulness" className="text-button">Discover wellness rituals <ArrowRight size={16}/></Link><span className="editorial-mark"><Sparkles size={20}/> Rest, made personal.</span></div></section>
    </main>
    <Footer />
  </div>;
}

export function ProductGridSkeleton() { return <div className="product-rail">{Array.from({ length: 4 }).map((_, index) => <div className="card-skeleton" key={index}><span /><i /><b /></div>)}</div>; }
function EmptyCatalogue() { return <div className="empty-catalogue"><p>The live Nestwell catalogue is loading. Please refresh in a moment.</p></div>; }
export function Footer() { return <footer className="site-footer"><div className="footer-top"><div><Link href="/" className="wordmark" aria-label="Nestwell home"><img src={NESTWELL_LOGO_URL} alt={NESTWELL_LOGO_ALT} className="brand-logo" /></Link><p>Small rituals for deeper rest and softer routines.</p></div><EmailSignup /><div><span className="eyebrow">Explore</span>{COLLECTIONS.slice(0, 4).map(collection => <Link key={collection} href={`/collections/${collectionMeta[collection].slug}`}>{collection}</Link>)}</div><div><span className="eyebrow">Customer care</span><Link href="/about">About Nestwell</Link><Link href="/contact">Contact</Link><Link href="/policies/shipping-policy">Shipping &amp; delivery</Link><Link href="/policies/refund-policy">Returns &amp; refunds</Link><Link href="/policies/privacy-policy">Privacy</Link><Link href="/policies/terms-of-service">Terms of service</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Nestwell</span><span>Live catalogue · Secure checkout</span></div></footer>; }
