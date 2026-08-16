import { Header } from "@/components/storefront";
import { useSeo } from "@/hooks/useSeo";
import { Footer } from "@/pages/Home";
import React from "react";
import { Link, useRoute } from "wouter";

export type PolicySlug =
  | "contact-information"
  | "shipping-policy"
  | "refund-policy"
  | "privacy-policy"
  | "terms-of-service";

export const CONTACT_PATH = "/contact";

type PolicySection = {
  heading: string;
  paragraphs: string[];
  email?: string;
  address?: string[];
};

type PolicyPageContent = {
  label: string;
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  path: string;
  sections: PolicySection[];
};

export const POLICY_PATHS: Record<PolicySlug, string> = {
  "contact-information": "/policies/contact-information",
  "shipping-policy": "/policies/shipping-policy",
  "refund-policy": "/policies/refund-policy",
  "privacy-policy": "/policies/privacy-policy",
  "terms-of-service": "/policies/terms-of-service",
};

export const POLICY_PAGES: Record<PolicySlug, PolicyPageContent> = {
  "contact-information": {
    label: "Customer care",
    title: "Contact Nestwell",
    intro: "Nestwell is an online retail store serving customers in Canada. For help with an order, delivery, return, or product question, contact us directly by email.",
    seoTitle: "Contact Nestwell | Customer Support",
    seoDescription: "Contact Nestwell for help with orders, products, delivery, or returns.",
    path: POLICY_PATHS["contact-information"],
    sections: [
      {
        heading: "Customer support",
        paragraphs: ["For questions about an order, a product, delivery, or a return, email our customer-support team. Please include your order number whenever you have one. Support replies by email so you have a clear written record of the conversation."],
        email: "nestwell.ca@proton.me",
      },
      {
        heading: "Registered business address",
        paragraphs: ["Nestwell’s registered business address is listed below. This address matches the business details in our Merchant Center account."],
        address: ["14-3650 Langstaff Rd Unit #818", "Woodbridge, Ontario L4L 9A8", "Canada"],
      },
    ],
  },
  "shipping-policy": {
    label: "Customer care",
    title: "Shipping & delivery",
    intro: "Nestwell currently ships within Canada. Available shipping charges, taxes, and the final order total are shown before you complete your purchase.",
    seoTitle: "Shipping & Delivery | Nestwell",
    seoDescription: "Read Nestwell’s shipping and delivery information before placing an order.",
    path: POLICY_PATHS["shipping-policy"],
    sections: [
      {
        heading: "Order processing",
        paragraphs: ["Orders are processed within 1–3 business days of purchase."],
      },
      {
        heading: "Estimated delivery",
        paragraphs: ["After an order ships, delivery typically takes 10–20 business days. Delivery timing can vary with carrier conditions."],
      },
      {
        heading: "Shipping rates and tracking",
        paragraphs: ["Standard shipping is CAD $12. Shipping is free on orders over CAD $75. A tracking number is sent by email once an order ships."],
      },
      {
        heading: "Order updates and delays",
        paragraphs: ["If an order has not arrived within 25 business days, contact our support team with your order number so we can investigate the available delivery information."],
        email: "nestwell.ca@proton.me",
      },
    ],
  },
  "refund-policy": {
    label: "Customer care",
    title: "Returns & refunds",
    intro: "If an item arrives damaged, defective, or incorrect, contact Nestwell within 30 days of delivery so we can review the order and offer an appropriate resolution.",
    seoTitle: "Returns & Refunds | Nestwell",
    seoDescription: "Read Nestwell’s process for damaged, defective, or incorrect items and approved refunds.",
    path: POLICY_PATHS["refund-policy"],
    sections: [
      {
        heading: "How to request help",
        paragraphs: ["Email our support team within 30 days of delivery and include your order number, a short description of the issue, and clear photos of the item and packaging where relevant. Please wait for return instructions before sending anything back."],
        email: "nestwell.ca@proton.me",
      },
      {
        heading: "Available resolutions",
        paragraphs: ["For a verified damaged, defective, or incorrect item, we may offer a replacement or refund. The appropriate option depends on the product, the order details, and the information available from the fulfilment partner."],
      },
      {
        heading: "Non-returnable situations",
        paragraphs: ["Items are not eligible for a refund solely because of buyer’s remorse or because they have been used as intended without a product issue. Nothing in this policy limits rights that cannot legally be excluded."],
      },
      {
        heading: "Refund timing",
        paragraphs: ["Approved refunds are returned to the original payment method. Your financial institution may take up to 10 business days to post a completed refund."],
      },
    ],
  },
  "privacy-policy": {
    label: "Customer care",
    title: "Privacy",
    intro: "This page explains, in plain language, how Nestwell uses information needed to run the store, fulfil orders, and provide customer support.",
    seoTitle: "Privacy Policy | Nestwell",
    seoDescription: "Learn how Nestwell handles customer and order information.",
    path: POLICY_PATHS["privacy-policy"],
    sections: [
      {
        heading: "Information used to operate the store",
        paragraphs: ["When you browse or place an order, information may be processed to provide the storefront, complete checkout, fulfil an order, communicate about the order, prevent fraud, and respond to customer-service requests."],
      },
      {
        heading: "Service providers",
        paragraphs: ["Nestwell uses service providers needed to operate e-commerce services, including checkout, payment processing, fulfilment, delivery, site hosting, and customer support. Those providers may process relevant information only as needed to provide their services and meet applicable obligations."],
      },
      {
        heading: "Your questions",
        paragraphs: ["If you have a question about information connected to your Nestwell order or account, contact us by email. Include enough detail for us to locate the relevant order without sending payment-card information by email."],
        email: "nestwell.ca@proton.me",
      },
    ],
  },
  "terms-of-service": {
    label: "Customer care",
    title: "Terms of service",
    intro: "These terms describe the basic conditions for using the Nestwell storefront and placing an order.",
    seoTitle: "Terms of Service | Nestwell",
    seoDescription: "Read the Nestwell terms of service for storefront use and orders.",
    path: POLICY_PATHS["terms-of-service"],
    sections: [
      {
        heading: "Product information and availability",
        paragraphs: ["We aim to present product information, images, prices, and availability accurately. Product availability can change, and an order may require review if a product is unavailable or if a material listing error is identified."],
      },
      {
        heading: "Pricing and checkout",
        paragraphs: ["The applicable price, available shipping options, taxes, and final total are shown in checkout before payment. If a pricing or availability issue affects an order, we will contact you using the information provided at checkout."],
      },
      {
        heading: "Customer responsibilities",
        paragraphs: ["You are responsible for providing accurate order and delivery information. Please review your order before completing checkout and contact us promptly if you believe an order detail is incorrect."],
      },
      {
        heading: "Need help?",
        paragraphs: ["Questions about an order, a policy, or the storefront can be sent to customer support. These terms do not limit consumer rights that cannot legally be excluded."],
        email: "nestwell.ca@proton.me",
      },
    ],
  },
};

type PolicyPageProps = { slugOverride?: PolicySlug; canonicalPathOverride?: string };

export default function PolicyPage({ slugOverride, canonicalPathOverride }: PolicyPageProps = {}) {
  const [, params] = useRoute("/policies/:slug");
  const slug = slugOverride || (params?.slug as PolicySlug | undefined);
  const policy = slug ? POLICY_PAGES[slug] : undefined;

  useSeo(
    policy?.seoTitle || "Nestwell policy",
    policy?.seoDescription || "Customer care information from Nestwell.",
    canonicalPathOverride || policy?.path || "/policies",
  );

  if (!policy) {
    return <div className="site-shell"><Header /><main className="policy-page policy-missing"><span className="eyebrow">Customer care</span><h1>That policy page is not available.</h1><p>Please return to the customer-care pages or contact Nestwell for help.</p><Link href="/" className="text-button">Return home</Link></main><Footer /></div>;
  }

  return <div className="site-shell"><Header /><main className="policy-page"><div className="policy-hero"><div><span className="eyebrow">{policy.label}</span><h1>{policy.title}</h1></div><p>{policy.intro}</p></div><div className="policy-content">{policy.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.email ? <a className="policy-email" href={`mailto:${section.email}`}>{section.email}</a> : null}{section.address ? <address aria-label="Registered business address">{section.address.map(line => <span key={line}>{line}</span>)}</address> : null}</section>)}</div></main><Footer /></div>;
}

export function ContactPage() {
  return <PolicyPage slugOverride="contact-information" canonicalPathOverride={CONTACT_PATH} />;
}
