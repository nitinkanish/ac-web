import Link from "next/link";
import { button, display, pad, stage } from "@/lib/ui";

export default function NotFound() {
  return (
    <article>
      <header className={stage}>
        <p className="text-sm italic uppercase">Missing page</p>
        <h1 className={`${display} mt-3 text-text`}>This page is not on the site.</h1>
        <p className="mt-4 max-w-4xl text-2xl font-regular">The address may be old, or the page has not been published.</p>
      </header>
      <p className={`${pad} py-12`}>
        <Link className={button} href="/">
          Back to the home page
        </Link>
      </p>
    </article>
  );
}
