import { Header } from "@/components/storefront";
import { useSeo } from "@/hooks/useSeo";
import { Footer } from "@/pages/Home";
import React from "react";

const supportEmail = "support@wenestwell.com";

export default function AboutPage() {
  useSeo(
    "About Nestwell | How We Serve Customers",
    "Learn how Nestwell serves Canadian customers, supports orders, and communicates delivery and return information.",
    "/about",
  );

  return <div className="site-shell"><Header /><main className="policy-page about-page"><div className="policy-hero"><div><span className="eyebrow">About Nestwell</span><h1>Thoughtful comfort,<br />clearly supported.</h1></div><p>Nestwell is an online retail store serving customers in Canada with everyday products for sleep, home comfort, wellness, and family routines.</p></div><div className="policy-content"><section><h2>How Nestwell works</h2><p>Our storefront brings together products across our live catalogue so customers can review current product information, options, availability, and prices before placing an order. The available shipping options, taxes, and final total are shown in checkout before payment.</p></section><section><h2>Orders and fulfilment</h2><p>After checkout, orders are processed and fulfilled through the operating partners needed to prepare, ship, and deliver the selected product. We currently ship within Canada. Our published Shipping &amp; Delivery page explains the standard processing estimate, delivery estimate, shipping charge, free-shipping threshold, tracking updates, and delivery follow-up process.</p></section><section><h2>Support and resolutions</h2><p>If you need help with an order, delivery, product question, or qualifying item issue, contact Nestwell by email. We use written support correspondence so order details and next steps can be clearly documented. Our Returns &amp; Refunds page explains the process for damaged, defective, or incorrect items.</p><a className="policy-email" href={`mailto:${supportEmail}`}>{supportEmail}</a></section><section><h2>Business information</h2><p>Nestwell’s registered business details and customer-support email are displayed on our Contact page. We do not publish a personal phone number; email is our designated customer-support channel.</p></section><section><h2>Product names and brands</h2><p>Product names, trademarks, and images associated with a listed item belong to their respective owners. Nestwell does not claim an affiliation, endorsement, certification, or authorized-reseller relationship unless that relationship is expressly stated for a specific product.</p></section></div></main><Footer /></div>;
}
