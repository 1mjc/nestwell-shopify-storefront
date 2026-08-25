import { subscribeToNestwellEmails, subscribeToRestockAlert } from "@/lib/klaviyo";
import React, { useState } from "react";
import { Link } from "wouter";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [personalization, setPersonalization] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      await subscribeToNestwellEmails(email, personalization);
      setState("success");
      setMessage("Please check your inbox to confirm your subscription.");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not save your signup.");
    }
  }

  return <section className="email-signup" aria-labelledby="email-signup-title"><span className="eyebrow">A quieter inbox</span><h2 id="email-signup-title">A little more room<br/><i>to rest.</i></h2><p>Occasional Nestwell notes, considered product updates, and early notice of new comforts.</p><form onSubmit={submit}><label className="sr-only" htmlFor="nestwell-email">Email address</label><div className="email-signup-row"><input id="nestwell-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /><button className="filled-button" disabled={state === "loading"}>{state === "loading" ? "Saving…" : "Join by email"}</button></div><label className="signup-check"><input type="checkbox" checked={personalization} onChange={event => setPersonalization(event.target.checked)} /> <span>Optional: use my product and cart activity to make Nestwell emails more relevant.</span></label><p className="signup-notice">By joining, you agree to receive Nestwell marketing emails. You can unsubscribe at any time. Read our <Link href="/policies/privacy-policy">Privacy Policy</Link>.</p>{state !== "idle" && <p className={`signup-status ${state}`} role="status">{message}</p>}</form></section>;
}

export function RestockAlert({ productTitle, variantId }: { productTitle: string; variantId: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      await subscribeToRestockAlert(email, variantId);
      setState("success");
      setMessage("You’re on the list for this option. We’ll email if it returns.");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not save your alert request.");
    }
  }

  return <form className="restock-alert" onSubmit={submit}><span className="eyebrow">Availability alert</span><h3>Let me know when this option returns.</h3><p>Request a one-time email for <b>{productTitle}</b>. This is not a marketing subscription.</p><label className="sr-only" htmlFor="restock-email">Email address for availability alert</label><div><input id="restock-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /><button className="filled-button" disabled={state === "loading"}>{state === "loading" ? "Saving…" : "Notify me"}</button></div>{state !== "idle" && <p className={`signup-status ${state}`} role="status">{message}</p>}</form>;
}
