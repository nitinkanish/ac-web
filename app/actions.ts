"use server";

import { wpPost } from "@/lib/wp";

export type FormState =
  | { status: "idle" }
  | { status: "ok"; reference: string }
  | { status: "error"; errors: Record<string, string> };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function submitForm(_prev: FormState, formData: FormData): Promise<FormState> {
  if (text(formData, "company")) return { status: "ok", reference: "received" };

  const payload = {
    kind: text(formData, "kind"),
    source: text(formData, "source") || "/",
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    consent: formData.get("consent") === "yes",
    cookieConsent: formData.get("cookieConsent") === "yes",
    visitorType: text(formData, "visitorType"),
    location: text(formData, "location"),
    mode: text(formData, "mode"),
    topic: text(formData, "topic"),
    preferredDate: text(formData, "preferredDate"),
    preferredTime: text(formData, "preferredTime"),
    note: text(formData, "note"),
    course: text(formData, "course"),
    background: text(formData, "background"),
    organisation: text(formData, "organisation"),
    message: text(formData, "message"),
  };

  const errors = validate(payload);
  if (Object.keys(errors).length) return { status: "error", errors };

  const result = await wpPost("/ac/v1/submissions", payload);
  if (result && result.ok === true && typeof result.reference === "string") {
    return { status: "ok", reference: result.reference };
  }
  const data = result?.data as { errors?: Record<string, string> } | undefined;
  if (data?.errors) return { status: "error", errors: data.errors };
  return { status: "error", errors: { form: "The form could not be sent. Please try again in a moment." } };
}

function validate(data: {
  kind: string;
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  visitorType: string;
  mode: string;
  course: string;
  message: string;
}) {
  const errors: Record<string, string> = {};
  if (data.email && !emailPattern.test(data.email)) errors.email = "Enter a valid email address.";
  if (data.kind === "newsletter") {
    if (!emailPattern.test(data.email)) errors.email = "Enter a valid email address.";
    if (!data.consent) errors.consent = "Consent is required to join the newsletter.";
  } else if (data.kind === "welcome") {
    if (!data.visitorType) errors.visitorType = "Choose the option that best describes you.";
    if (data.consent && !data.name && !data.email && !data.phone) {
      errors.contact = "Add a name, mobile number, or email so the team can respond.";
    }
  } else if (data.kind === "consultation" || data.kind === "application" || data.kind === "contact") {
    if (data.name.length < 2) errors.name = "Enter your name.";
    if (!data.email && !data.phone) errors.contact = "Add an email address or a mobile number.";
    if (!data.consent) errors.consent = "Consent is required so the team can reply.";
    if (data.kind === "consultation" && !data.mode) errors.mode = "Choose a preferred way to consult.";
    if (data.kind === "application" && !data.course) errors.course = "Tell us which course you want to apply for.";
    if (data.kind === "contact" && data.message.length < 10) errors.message = "Add a short message.";
  } else {
    errors.form = "This form is not available.";
  }
  return errors;
}
