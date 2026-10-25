"use client";
import { useEffect, useRef, useState } from "react";
import motion from "@/data/motion.json";
import navigation from "@/data/navigation.json";
import site from "@/data/site.json";
import { render, renderChildren } from "@/lib/render";
import type { JsonNode } from "@/lib/types";

type MenuKey = keyof typeof navigation.menuOverlay;
const CONSENT_KEY = "bayer-clone-cookie-consent";

const text = (el: Element) => (el.textContent || "").replace(/\s+/g, " ").trim();

/** Burger mega-menu, search modal and cookie banner, all rendered from JSON. */
export default function Overlays() {
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [search, setSearch] = useState(false);
  const [cookie, setCookie] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // Mega-menu open animation: timings measured from the original (Web Animations API).
  useEffect(() => {
    const root = menuRef.current;
    if (menu && root && !wasOpen.current) runMotion(root, motion.menuOpen);
    wasOpen.current = !!menu;
  }, [menu]);

  const closeMenu = () => {
    const root = menuRef.current;
    if (!root) return setMenu(null);
    const total = runMotion(root, motion.menuClose);
    setTimeout(() => setMenu(null), total);
  };

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setCookie(true);
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest("[data-clone-overlay]")) return;
      const b = t.closest("button");
      if (!b) return;
      const label = b.getAttribute("aria-label") || "";
      if (label.startsWith("Burger Menu")) setMenu("root");
      else if (label === "Search") setSearch(true);
      else if (text(b) === "Cookie Settings") setCookie(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menu || search ? "hidden" : "";
  }, [menu, search]);

  const onMenuClick = (e: React.MouseEvent) => {
    const b = (e.target as Element).closest("button");
    if (!b) return;
    const label = b.getAttribute("aria-label") || "";
    const txt = text(b);
    if (label === "Close" || label === "Close menu") return closeMenu();
    if (label === "Back" || txt === "Back") return setMenu("root");
    if (txt in navigation.menuOverlay) return setMenu(txt as MenuKey);
    // Deeper levels live on bayer.com: open the panel's overview link.
    const panelLink = b.closest("ul, nav")?.querySelector<HTMLAnchorElement>("a[href]");
    if (label.startsWith("Pause")) {
      const v = b.closest("div")?.parentElement?.querySelector("video");
      if (v) { if (v.paused) v.play(); else v.pause(); }
      return;
    }
    if (!label && panelLink) window.location.href = panelLink.href;
  };

  const onSearchClick = (e: React.MouseEvent) => {
    const b = (e.target as Element).closest("button");
    if (b?.getAttribute("aria-label") === "Close search modal") setSearch(false);
  };

  const onCookieClick = (e: React.MouseEvent) => {
    const b = (e.target as Element).closest("button");
    if (!b) return;
    localStorage.setItem(CONSENT_KEY, b.id || "closed");
    setCookie(false);
  };

  return (
    <>
      {menu && (
        <div data-clone-overlay="menu" ref={menuRef} onClick={onMenuClick}>
          {renderChildren(navigation.menuOverlay[menu] as unknown as JsonNode)}
        </div>
      )}
      {search && (
        <div data-clone-overlay="search" onClick={onSearchClick}>
          {renderChildren(navigation.searchOverlay as unknown as JsonNode)}
        </div>
      )}
      {cookie && (
        <div data-clone-overlay="cookie" onClick={onCookieClick}>
          {render(site.cookieBanner as unknown as JsonNode)}
        </div>
      )}
    </>
  );
}

type Step = { selector: string; keyframes: Keyframe[]; duration: number; delay: number; stagger?: number; easing: string };

function runMotion(root: HTMLElement, steps: Step[]) {
  let end = 0;
  for (const st of steps) {
    root.querySelectorAll<HTMLElement>(st.selector).forEach((el, i) => {
      const delay = st.delay + (st.stagger ?? 0) * i;
      el.animate(st.keyframes, { duration: st.duration, delay, easing: st.easing, fill: "both" });
      end = Math.max(end, delay + st.duration);
    });
  }
  return end;
}
