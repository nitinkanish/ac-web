import { createElement, Fragment, type ReactNode } from "react";
import type { JsonNode, Variant } from "./types";

// Turns the JSON content trees in data/ into React elements.
const VOID = new Set(["area","base","br","col","embed","hr","img","input","link","meta","source","track","wbr"]);
const RENAME: Record<string, string> = {
  class: "className", for: "htmlFor", tabindex: "tabIndex", srcset: "srcSet", crossorigin: "crossOrigin",
  fetchpriority: "fetchPriority", autoplay: "autoPlay", playsinline: "playsInline", readonly: "readOnly",
  maxlength: "maxLength", minlength: "minLength", autocomplete: "autoComplete", colspan: "colSpan", rowspan: "rowSpan",
  enctype: "encType", novalidate: "noValidate", datetime: "dateTime", contenteditable: "contentEditable",
  spellcheck: "spellCheck", inputmode: "inputMode", "accept-charset": "acceptCharset", "http-equiv": "httpEquiv",
  "xlink:href": "xlinkHref", "xml:space": "xmlSpace", "xmlns:xlink": "xmlnsXlink", autofocus: "autoFocus",
  frameborder: "frameBorder", allowfullscreen: "allowFullScreen", referrerpolicy: "referrerPolicy",
  imagesrcset: "imageSrcSet", imagesizes: "imageSizes", enterkeyhint: "enterKeyHint", popovertarget: "popoverTarget",
};
const BOOL = new Set(["hidden","disabled","required","checked","multiple","open","autoFocus","noValidate","playsInline",
  "muted","autoPlay","loop","controls","readOnly","selected","inert","allowFullScreen","default","reversed"]);

function camel(k: string) {
  return k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function parseStyle(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  let depth = 0, quote = "", cur = "";
  const parts: string[] = [];
  for (const ch of s) {
    if (quote) { if (ch === quote) quote = ""; cur += ch; continue; }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === ";" && depth === 0) { parts.push(cur); cur = ""; continue; }
    cur += ch;
  }
  parts.push(cur);
  for (const p of parts) {
    const i = p.indexOf(":");
    if (i < 0) continue;
    const k = p.slice(0, i).trim(), v = p.slice(i + 1).trim();
    if (!k) continue;
    if (k.startsWith("--")) out[k] = v;
    else if (k.startsWith("-ms-")) out["ms" + camel(k.slice(3))] = v;
    else if (k.startsWith("-")) out[camel(k.slice(1)).replace(/^./, (c) => c.toUpperCase())] = v;
    else out[camel(k)] = v;
  }
  return out;
}

function props(tag: string, a: Record<string, string> = {}, key: string | number) {
  const p: Record<string, unknown> = { key };
  for (const [k0, v] of Object.entries(a)) {
    if (k0.startsWith("on")) continue;
    if (tag === "form" && k0 === "action") continue;
    let k = RENAME[k0] ?? k0;
    if (k === "style") { p.style = parseStyle(v); continue; }
    if ((tag === "input" || tag === "textarea" || tag === "select") && k === "value") { p.defaultValue = v; continue; }
    if (tag === "input" && k === "checked") { p.defaultChecked = true; continue; }
    if (tag === "option" && k === "selected") continue;
    if (!k.startsWith("aria-") && !k.startsWith("data-") && k.includes("-")) k = camel(k);
    if (k.includes(":")) continue;
    p[k] = BOOL.has(k) ? true : v;
  }
  return p;
}

export function render(n: JsonNode | undefined, key: string | number = 0): ReactNode {
  if (n === undefined || n === null) return null;
  if (typeof n === "string") return n;
  const { t, a, c } = n;
  const p = props(t, a, key);
  if (t === "style") return createElement("style", { ...p, dangerouslySetInnerHTML: { __html: (c ?? []).join("") } });
  if (t === "textarea") return createElement("textarea", { ...p, defaultValue: (c ?? []).filter((x) => typeof x === "string").join("") });
  if (VOID.has(t)) return createElement(t, p);
  let kids = c ?? [];
  if (["table","thead","tbody","tfoot","tr","colgroup","select","ul","ol"].includes(t)) kids = kids.filter((x) => typeof x !== "string" || x.trim());
  return createElement(t, p, ...kids.map((ch, i) => render(ch, i)));
}

export function renderChildren(n: JsonNode | undefined) {
  if (!n || typeof n === "string") return n ?? null;
  return createElement(Fragment, null, ...(n.c ?? []).map((ch, i) => render(ch, i)));
}

/** Renders a section that may have separate trees per breakpoint range (see data/README in the project README). */
export function renderVariant(v: Variant, key: string | number = 0): ReactNode {
  if (v.node) return render(v.node, key);
  return createElement(Fragment, { key },
    ...(v.bp ?? []).map((b) => createElement("div", { key: `${b.min}-${b.max}`, className: `bp-${b.min}-${b.max}` }, render(b.node, 0))),
  );
}
