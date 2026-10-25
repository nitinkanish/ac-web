"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { submitForm, type FormState } from "@/app/actions";
import { button, field } from "@/lib/ui";

const visitors = ["Farmer", "Student", "Doctor or vaidya", "Practitioner", "Wellness seeker", "Institution", "Other"];
const storageKey = "ac-welcome";

function readDismissed() {
  try {
    return Boolean(window.localStorage.getItem(storageKey));
  } catch {
    return false;
  }
}

function writeDismissed(mode: string) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ mode, at: new Date().toISOString() }));
  } catch {
    /* Private browsing can block storage. Closing still ends this visit. */
  }
  document.cookie = `ac-welcome=${mode}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function clearDismissed() {
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    /* Ignore storage failures. */
  }
  document.cookie = "ac-welcome=; Path=/; Max-Age=0; SameSite=Lax";
}

function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function WelcomeDialog() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return !readDismissed();
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (readDismissed()) setOpen(false);
    const choice = document.getElementById("privacy-choices");
    const onChoice = () => {
      clearDismissed();
      setOpen(true);
    };
    choice?.addEventListener("click", onChoice);
    return () => choice?.removeEventListener("click", onChoice);
  }, []);

  function close(mode: string) {
    writeDismissed(mode);
    setErrors({});
    setOpen(false);
  }

  async function onSubmit(formData: FormData) {
    const state: FormState = await submitForm({ status: "idle" }, formData);
    if (state.status === "error") {
      setErrors(state.errors);
      return;
    }
    close("submitted");
  }

  return (
    <div className="welcome-overlay" id="welcome" hidden={!open} suppressHydrationWarning role="presentation">
      <div className="welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <form className="welcome-form" action={onSubmit}>
          <div className="welcome-scroll">
          <p className="text-sm italic uppercase">First visit</p>
          <h2 id="welcome-title" className="mt-2 font-regular text-3xl">
            Tell us who is visiting, or skip.
          </h2>
          <p className="mt-2">Contact and cookies are separate choices. Skip leaves both unset.</p>
          <input type="hidden" name="kind" value="welcome" />
          <input type="hidden" name="source" value="/" />
          <p className="hp" aria-hidden="true">
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm">Name</span>
            <input className={field} name="name" autoComplete="name" />
          </label>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm">Email</span>
            <input className={field} name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} />
          </label>
          {errors.email ? <p className="text-sm">{errors.email}</p> : null}
          <label className="mt-4 block">
            <span className="mb-1 block text-sm">Mobile</span>
            <input className={field} name="phone" type="tel" autoComplete="tel" />
          </label>
          {errors.contact ? <p className="text-sm">{errors.contact}</p> : null}
          <label className="mt-4 block">
            <span className="mb-1 block text-sm">I am a</span>
            <select className={field} name="visitorType" defaultValue="" aria-invalid={Boolean(errors.visitorType)}>
              <option value="">Choose one</option>
              {visitors.map((visitor) => (
                <option key={visitor}>{visitor}</option>
              ))}
            </select>
          </label>
          {errors.visitorType ? <p className="text-sm">{errors.visitorType}</p> : null}
          <label className="mt-4 flex items-start gap-2">
            <input type="checkbox" name="consent" value="yes" />
            <span>
              You may contact me about this introduction. See the <Link href="/privacy">privacy policy</Link>.
            </span>
          </label>
          <label className="mt-3 flex items-start gap-2">
            <input type="checkbox" name="cookieConsent" value="yes" />
            <span>
              You may store optional cookies on this browser. See the <Link href="/cookies">cookie policy</Link>.
            </span>
          </label>
          </div>
          <div className="welcome-actions">
            <button className={button} type="submit">
              Save choices
            </button>
            <button className="text-sm underline" id="welcome-skip" type="button" onClick={() => close("skip")}>
              Skip
            </button>
          </div>
        </form>
      </div>
      <InlineScript html='{try{var popup=document.getElementById("welcome");if(popup&&localStorage.getItem("ac-welcome"))popup.hidden=true}catch(e){}}' />
    </div>
  );
}
