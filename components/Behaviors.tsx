"use client";
import { useEffect } from "react";

/** Wires up the interactive parts of the JSON-rendered markup: accordions, carousels, videos and forms. */
export default function Behaviors() {
  useEffect(() => {
    document.querySelectorAll<HTMLVideoElement>("video[autoplay]").forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });

    const carouselOf = (el: Element) => {
      let p: Element | null = el.parentElement;
      while (p && !p.querySelector('[aria-roledescription="slide"]')) p = p.parentElement;
      return p as HTMLElement | null;
    };

    const go = (root: HTMLElement, dir: number | null, to?: number) => {
      const slides = [...root.querySelectorAll<HTMLElement>('[aria-roledescription="slide"]')];
      if (!slides.length) return;
      const track = slides[0].parentElement as HTMLElement;
      track.dataset.cloneTrack = "1";
      const view = (track.parentElement as HTMLElement).clientWidth;
      const visible = Math.max(1, Math.round(view / (slides[0].offsetWidth || view)));
      const max = Math.max(0, slides.length - visible);
      const cur = Number(root.dataset.idx || 0);
      const next = to !== undefined ? Math.min(to, max) : Math.min(max, Math.max(0, cur + (dir ?? 0)));
      root.dataset.idx = String(next);
      track.style.transform = `translate3d(${-slides[next].offsetLeft}px,0,0)`;
      slides.forEach((s, i) => (s.style.opacity = i >= next && i < next + visible ? "1" : "0.25"));
      root.querySelectorAll<HTMLButtonElement>("button[aria-label]").forEach((b) => {
        const l = b.getAttribute("aria-label") || "";
        if (/^Previous/.test(l)) b.disabled = next === 0;
        if (/^Next/.test(l)) b.disabled = next >= max;
      });
      const dots = [...root.querySelectorAll<HTMLButtonElement>('button[aria-label^="Go to slide"]')];
      if (dots.length) {
        const on = root.dataset.dotOn || dots.find((d) => d.getAttribute("aria-current"))?.className || "";
        const off = root.dataset.dotOff || dots.find((d) => !d.getAttribute("aria-current"))?.className || "";
        root.dataset.dotOn = on;
        root.dataset.dotOff = off;
        dots.forEach((d, i) => {
          d.className = i === next ? on : off;
          if (i === next) d.setAttribute("aria-current", "true");
          else d.removeAttribute("aria-current");
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const acc = target.closest<HTMLButtonElement>("button.AccordionTrigger");
      if (acc) {
        const item = acc.parentElement as HTMLElement;
        const panel = acc.getAttribute("aria-controls")
          ? document.getElementById(acc.getAttribute("aria-controls")!)
          : (acc.nextElementSibling as HTMLElement | null);
        const open = acc.getAttribute("aria-expanded") !== "true";
        const state = open ? "open" : "closed";
        acc.setAttribute("aria-expanded", String(open));
        [acc, item].forEach((x) => x.setAttribute("data-state", state));
        if (panel) {
          panel.setAttribute("data-state", state);
          if (open) {
            panel.hidden = false;
            panel.style.setProperty("--radix-collapsible-content-height", panel.scrollHeight + "px");
          } else {
            setTimeout(() => { if (panel.getAttribute("data-state") === "closed") panel.hidden = true; }, 250);
          }
        }
        return;
      }
      const btn = target.closest<HTMLButtonElement>("button[aria-label]");
      if (btn) {
        const label = btn.getAttribute("aria-label") || "";
        if (/^(Previous|Next)/.test(label) || label.startsWith("Go to slide")) {
          const root = carouselOf(btn);
          if (root) {
            const m = label.match(/Go to slide (\d+)/);
            go(root, /^Previous/.test(label) ? -1 : 1, m ? Number(m[1]) - 1 : undefined);
          }
          return;
        }
        if (label === "Pause" || label === "Play" || label === "Play video" || label === "Pause video") {
          const scope = btn.closest("section, div.relative") || btn.parentElement;
          const v = scope?.querySelector("video") || btn.parentElement?.querySelector("video");
          if (v) {
            if (v.paused) v.play().catch(() => {}); else v.pause();
          }
          return;
        }
        if (label === "scroll down") {
          window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
          return;
        }
      }
    };
    const onSubmit = (e: Event) => e.preventDefault();
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);
  return null;
}
