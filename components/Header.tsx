"use client";

import Link from "next/link";
import { useState } from "react";
import { navItems } from "@/lib/routes";
import { textLink } from "@/lib/ui";

const bar = ["/about", "/plants", "/courses", "/knowledge"];

export default function Header() {
  const [open, setOpen] = useState(false);
  const items = navItems();
  const close = () => setOpen(false);

  return (
    <>
      <div className="pointer-events-none fixed top-8 left-0 right-0 z-20 flex justify-center">
        <Link href="/" className="pointer-events-auto shadow-md" onClick={close}>
          <img src="/brand/logo.png" alt="Arun Chandan" width={512} height={512} className="block h-20 w-20" />
        </Link>
      </div>

      {open ? (
        <div className="from-gradient-backdrop-dark-2 to-gradient-backdrop-dark-1 fixed top-0 left-0 z-[9998] h-[100vh] w-[100vw] overflow-y-auto bg-gradient-to-b backdrop-blur-[48px]">
          <div className="px-8 pt-28 pb-36 text-text-inverted">
            <button className="text-sm italic uppercase" type="button" onClick={close}>
              Close
            </button>
            <ul className="m-0 mt-8 list-none p-0">
              {items.map((item) => (
                <li key={item.path} className="mt-6">
                  <Link className="text-text-inverted text-4xl font-regular" href={item.path} onClick={close}>
                    {item.title}
                  </Link>
                  {item.children.length ? (
                    <ul className="m-0 mt-2 list-none p-0">
                      {item.children.map((child) => (
                        <li key={child.path} className="mt-1">
                          <Link className="text-text-inverted text-base" href={child.path} onClick={close}>
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
              <li className="mt-6">
                <Link className="text-text-inverted text-4xl font-regular" href="/contact" onClick={close}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      <section className="pointer-events-none fixed bottom-8 left-1/2 z-[61] flex w-full -translate-x-1/2 items-center justify-center gap-2 lg:w-max">
        <section className="pointer-events-auto flex h-14 w-fit items-center rounded-full border border-border-accented bg-white p-2 pe-8 shadow-md md:h-[72px] md:p-2 lg:h-[72px] lg:p-3">
          <button
            className="to-gradient-blue from-gradient-green flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b text-sm text-text-inverted md:h-[56px] md:w-[56px]"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <nav className="hidden items-center gap-10 px-10 lg:flex" aria-label="Primary">
            <ul className="m-0 flex list-none items-center gap-10 p-0">
              {items
                .filter((item) => bar.includes(item.path))
                .map((item) => (
                  <li key={item.path}>
                    <Link className={textLink} href={item.path}>
                      {item.path === "/plants" ? "Plants" : item.path === "/courses" ? "Courses" : item.path === "/knowledge" ? "Knowledge" : item.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </section>
        <Link className="ac-button pointer-events-auto hidden bg-background-bg-inverted px-5 py-3 text-sm text-text-inverted italic uppercase lg:inline-flex" href="/consultations/request">
          Consultation
        </Link>
      </section>
    </>
  );
}
