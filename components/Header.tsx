"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/routes";
import { textLink } from "@/lib/ui";

const bar = ["/about", "/plants", "/courses", "/knowledge"];
const primaryPaths = ["/about", "/plants", "/courses", "/knowledge"];
const labels: Record<string, string> = {
  "/about": "About",
  "/plants": "Plants",
  "/courses": "Courses",
  "/knowledge": "Knowledge",
  "/ayush": "Ayurveda",
  "/consultations": "Consultations",
  "/programmes": "Programmes",
  "/medical-astrology": "Medical astrology",
  "/community": "Community",
};

function labelFor(path: string, title: string) {
  return labels[path] || title;
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = navItems();
  const close = () => setOpen(false);
  const primary = primaryPaths.map((path) => items.find((item) => item.path === path)).filter((item) => item !== undefined);
  const secondary = items.filter((item) => !primaryPaths.includes(item.path));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {open ? null : (
        <div className="pointer-events-none fixed top-8 left-0 right-0 z-20 flex justify-center">
          <Link href="/" className="pointer-events-auto shadow-md">
            <img src="/brand/logo.png" alt="Arun Chandan" width={512} height={512} className="block h-20 w-20" />
          </Link>
        </div>
      )}

      {open ? (
        <div className="mega">
          <button className="mega-backdrop" type="button" aria-label="Close menu" onClick={close} />
          <div className="mega-panel" id="site-menu" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="mega-top">
              <Link href="/" onClick={(event) => { if (pathname === "/") { event.preventDefault(); close(); } }}>
                <img className="mega-logo" src="/brand/logo.png" alt="Arun Chandan" width={512} height={512} />
              </Link>
              <button className="mega-close" type="button" aria-label="Close menu" onClick={close}>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </div>
            <div className="mega-scroll">
              <ul className="mega-list mega-primary">
                {primary.map((item) => (
                  <MenuBranch key={item.path} item={item} />
                ))}
              </ul>
              <hr className="mega-rule" />
              <ul className="mega-list mega-secondary">
                {secondary.map((item) => (
                  <MenuBranch key={item.path} item={item} />
                ))}
              </ul>
            </div>
            <div className="mega-foot">
              <ul className="mega-utils">
                <li>
                  <Link href="/about">
                    <Pin />
                    Himachal Pradesh
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <Mail />
                    Contact
                  </Link>
                </li>
              </ul>
              <form className="mega-search" action="/knowledge/articles" method="get">
                <label className="mega-sr" htmlFor="mega-q">Search</label>
                <input id="mega-q" name="q" placeholder="What are you looking for?" />
                <button type="submit" aria-label="Search">
                  <SearchIcon />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <section className="site-nav pointer-events-none fixed bottom-8 left-1/2 flex w-full -translate-x-1/2 items-center justify-center gap-2 lg:w-max">
        <section className="pointer-events-auto flex h-14 w-fit items-center rounded-full border border-border-accented bg-white p-2 pe-8 shadow-md md:h-[72px] md:p-2 lg:h-[72px] lg:p-3">
          <button
            className="to-gradient-blue from-gradient-green flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b text-sm text-text-inverted md:h-[56px] md:w-[56px]"
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
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
                      {labelFor(item.path, item.title)}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </section>
      </section>
    </>
  );
}

function MenuBranch({
  item,
}: {
  item: { path: string; title: string; children: { path: string; title: string }[] };
}) {
  const label = labelFor(item.path, item.title);
  if (!item.children.length) {
    return (
      <li>
        <Link className="mega-link" href={item.path}>
          {label}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <details
        className="mega-details"
        onToggle={(event) => {
          const current = event.currentTarget;
          if (!current.open) return;
          current.closest("ul")?.querySelectorAll("details[open]").forEach((node) => {
            if (node !== current) node.removeAttribute("open");
          });
        }}
      >
        <summary>
          <span>{label}</span>
          <Chevron />
        </summary>
        <ul className="mega-sub">
          <li>
            <Link href={item.path}>Overview</Link>
          </li>
          {item.children.map((child) => (
            <li key={child.path}>
              <Link href={child.path}>{child.title}</Link>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}

function Chevron() {
  return (
    <svg className="mega-chevron" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M7 4l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Pin() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.5a4.2 4.2 0 0 0-4.2 4.2c0 3.2 4.2 8.8 4.2 8.8s4.2-5.6 4.2-8.8A4.2 4.2 0 0 0 8 1.5z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="5.7" r="1.3" fill="currentColor" />
    </svg>
  );
}

function Mail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.5" y="3.2" width="13" height="9.6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 4l6 5 6-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 12.2L16 16" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
