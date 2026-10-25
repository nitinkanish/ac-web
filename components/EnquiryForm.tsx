"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitForm, type FormState } from "@/app/actions";
import { button, field } from "@/lib/ui";

const initial: FormState = { status: "idle" };
const modes = [
  ["in-person", "In person"],
  ["whatsapp", "WhatsApp"],
  ["zoom", "Zoom"],
  ["email", "Email"],
  ["post", "Post"],
];

export default function EnquiryForm({
  kind,
  source,
  courses = [],
  selectedCourse = "",
}: {
  kind: "consultation" | "application" | "contact" | "newsletter";
  source: string;
  courses?: { slug: string; title: string }[];
  selectedCourse?: string;
}) {
  const [state, action, pending] = useActionState(submitForm, initial);
  if (state.status === "ok") {
    return (
      <div className="border border-border-accented p-4" role="status">
        <h2 className="font-regular text-2xl">We have received this.</h2>
        <p>
          Your reference is <strong>{state.reference}</strong>. Keep it if you write again about the same enquiry.
        </p>
      </div>
    );
  }
  const errors = state.status === "error" ? state.errors : {};
  return (
    <form action={action} noValidate>
      {errors.form ? (
        <p className="border border-border-accented p-4" role="alert">
          {errors.form}
        </p>
      ) : null}
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="source" value={source} />
      <p className="hp" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      {kind !== "newsletter" ? (
        <Field label="Name" name="name" error={errors.name} autoComplete="name" required />
      ) : (
        <Field label="Name, if you want it on the list" name="name" autoComplete="name" />
      )}
      <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" required={kind === "newsletter"} />
      {kind !== "newsletter" ? <Field label="Mobile" name="phone" type="tel" autoComplete="tel" /> : null}
      {errors.contact ? <p className="text-sm">{errors.contact}</p> : null}
      {kind === "contact" ? <Field label="Organisation" name="organisation" /> : null}
      {kind !== "newsletter" && kind !== "contact" ? <Field label="Location" name="location" autoComplete="address-level2" /> : null}
      {kind === "consultation" ? (
        <fieldset className="m-0 border-0 p-0">
          <legend>Preferred mode</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {modes.map(([value, label]) => (
              <label className="flex items-center gap-2" key={value}>
                <input type="radio" name="mode" value={value} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {errors.mode ? <p className="text-sm">{errors.mode}</p> : null}
        </fieldset>
      ) : null}
      {kind === "consultation" ? (
        <>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm">Topic</span>
            <select className={field} name="topic" defaultValue="Ayurveda">
              {["Ayurveda", "Medicinal plants", "A course", "A programme", "Something else"].map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </label>
          <Field label="Preferred date" name="preferredDate" type="date" />
          <Field label="Preferred time" name="preferredTime" type="time" />
          <Area label="Note" name="note" />
        </>
      ) : null}
      {kind === "application" ? (
        <>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm">Course</span>
            {courses.length ? (
              <select className={field} name="course" defaultValue={selectedCourse} aria-invalid={Boolean(errors.course)}>
                <option value="">Choose a course</option>
                {courses.map((course) => (
                  <option value={course.slug} key={course.slug}>
                    {course.title}
                  </option>
                ))}
              </select>
            ) : (
              <input className={field} name="course" defaultValue={selectedCourse} aria-invalid={Boolean(errors.course)} placeholder="Name the subject you want to study" />
            )}
          </label>
          {errors.course ? <p className="text-sm">{errors.course}</p> : null}
          <Area label="Background" name="background" />
        </>
      ) : null}
      {kind === "contact" ? <Area label="Message" name="message" error={errors.message} required /> : null}
      <label className="mt-4 flex items-start gap-2">
        <input type="checkbox" name="consent" value="yes" />
        <span>
          {kind === "newsletter" ? "I agree to receive the newsletter. I can unsubscribe later." : "I agree to be contacted about this enquiry."}{" "}
          <Link href="/privacy">Privacy policy</Link>.
        </span>
      </label>
      {errors.consent ? <p className="text-sm">{errors.consent}</p> : null}
      <div className="mt-6">
        <button className={button} type="submit" disabled={pending}>
          {pending ? "Sending" : "Send"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  autoComplete,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm">{label}</span>
      <input className={field} name={name} type={type} autoComplete={autoComplete} required={required} aria-invalid={Boolean(error)} />
      {error ? <span className="mt-1 block text-sm">{error}</span> : null}
    </label>
  );
}

function Area({ label, name, error, required = false }: { label: string; name: string; error?: string; required?: boolean }) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm">{label}</span>
      <textarea className={field} name={name} required={required} aria-invalid={Boolean(error)} />
      {error ? <span className="mt-1 block text-sm">{error}</span> : null}
    </label>
  );
}
