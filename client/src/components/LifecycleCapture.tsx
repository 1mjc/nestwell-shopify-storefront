import { subscribeToNestwellEmails, subscribeToRestockAlert } from "@/lib/klaviyo";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import React, { useState } from "react";
import { Link } from "wouter";

const WELCOME_POPUP_DISMISS_KEY = "nestwell-welcome-popup-dismissed-at";
const WELCOME_POPUP_DISMISS_MS = 14 * 24 * 60 * 60 * 1000;
const WELCOME_POPUP_SUCCESS_MS = 180 * 24 * 60 * 60 * 1000;

function shouldDisplayWelcomePopup(nextEligibleAt: string | null, now: number) {
  const eligibleAt = Number(nextEligibleAt);
  return !Number.isFinite(eligibleAt) || eligibleAt <= now;
}

export const welcomePopupForTest = { shouldDisplayWelcomePopup, WELCOME_POPUP_DISMISS_MS };

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

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [personalization, setPersonalization] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  React.useEffect(() => {
    if (typeof window === "undefined" || !shouldDisplayWelcomePopup(window.localStorage.getItem(WELCOME_POPUP_DISMISS_KEY), Date.now())) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setOpen(true), reducedMotion ? 0 : 1600);
    return () => window.clearTimeout(timer);
  }, []);

  function rememberDismissal(duration: number) {
    if (typeof window !== "undefined") window.localStorage.setItem(WELCOME_POPUP_DISMISS_KEY, String(Date.now() + duration));
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) rememberDismissal(state === "success" ? WELCOME_POPUP_SUCCESS_MS : WELCOME_POPUP_DISMISS_MS);
    setOpen(nextOpen);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      await subscribeToNestwellEmails(email, personalization, "Nestwell welcome popup");
      setState("success");
      setMessage("Please check your inbox to confirm your subscription.");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not save your signup.");
    }
  }

  return <Dialog open={open} onOpenChange={handleOpenChange}>
    <DialogContent className="welcome-popup-content" showCloseButton={false}>
      <div className="welcome-popup-art" aria-hidden="true"><span>nestwell<span>·</span></span><p>Make room for<br/><i>deep rest.</i></p><small>01 / A softer way home</small></div>
      <div className="welcome-popup-copy">
        <DialogClose className="welcome-popup-close" aria-label="Close email signup">Not now</DialogClose>
        <span className="eyebrow">A quieter inbox</span>
        <DialogTitle>Start with a softer <i>rhythm.</i></DialogTitle>
        <DialogDescription>Join for considered Nestwell notes, new comfort updates, and a little more room to rest.</DialogDescription>
        {state === "success" ? <div className="welcome-popup-success" role="status"><strong>You’re nearly in.</strong><p>{message}</p><DialogClose className="filled-button">Close</DialogClose></div> : <form onSubmit={submit} className="welcome-popup-form">
          <label className="sr-only" htmlFor="nestwell-welcome-email">Email address</label>
          <input id="nestwell-welcome-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
          <label className="signup-check popup-check"><input type="checkbox" checked={personalization} onChange={event => setPersonalization(event.target.checked)} /> <span>Optional: use my product and cart activity to make Nestwell emails more relevant.</span></label>
          <p className="welcome-popup-notice">By joining, you agree to receive Nestwell marketing emails. You can unsubscribe at any time. Read our <Link href="/policies/privacy-policy">Privacy Policy</Link>.</p>
          <button className="filled-button" disabled={state === "loading"}>{state === "loading" ? "Saving…" : "Join by email"}</button>
          {state === "error" && <p className="welcome-popup-error" role="status">{message}</p>}
        </form>}
      </div>
    </DialogContent>
  </Dialog>;
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
