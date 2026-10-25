export type WpPage = {
  id: number;
  path: string;
  status: string;
  title: string;
  kicker: string;
  summary: string;
  html: string;
  legalDraft: boolean;
  youtubeId: string;
};

export type WpItem = {
  id: number;
  type: string;
  slug: string;
  status: string;
  title: string;
  summary: string;
  html: string;
  path: string;
  meta: Record<string, string | boolean>;
  terms: {
    publicationType?: string[];
    eventKind?: string[];
    topic?: string[];
  };
};

export type HomePayload = {
  settings: {
    heroKicker: string;
    heroTitle: string;
    heroLead: string;
    plantsTitle: string;
    plantsLead: string;
    email: string;
    phone: string;
    region: string;
  };
  articles: WpItem[];
  plants: WpItem[];
  courses: WpItem[];
  programmes: WpItem[];
  events: WpItem[];
  herb: WpItem | null;
};

const fallbackSettings: HomePayload["settings"] = {
  heroKicker: "Ayurveda, medicinal plants, and livelihoods",
  heroTitle: "Living knowledge, rooted in the Himalaya.",
  heroLead:
    "Dr Arun Chandan works with communities, practitioners, and learners on Ayurveda, medicinal plants, and the livelihoods that keep that knowledge alive.",
  plantsTitle: "A garden, a museum, and the plants between them",
  plantsLead:
    "At Joginder Nagar he describes a herbal garden, a herbarium, and the Lok Ayurveda Museum. The plant library will grow here as each profile is published.",
  email: "doctorchandan@gmail.com",
  phone: "7018001026",
  region: "Dharamshala and Joginder Nagar, Himachal Pradesh",
};

function origin() {
  return (process.env.WORDPRESS_URL || "http://ac.local").replace(/\/$/, "");
}

function requestHeaders(json = false): HeadersInit {
  const value: Record<string, string> = { Accept: "application/json" };
  if (json) value["Content-Type"] = "application/json";
  const user = process.env.WORDPRESS_USER;
  const pass = process.env.WORDPRESS_APP_PASSWORD?.replace(/\s+/g, "");
  if (user && pass) value.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
  if (process.env.WORDPRESS_PREVIEW_DRAFTS === "true") value["X-AC-Preview"] = "1";
  return value;
}

export async function wpGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${origin()}/wp-json${path}`, {
      headers: requestHeaders(),
      next: { revalidate: 60, tags: ["wordpress"] },
    });
    if (response.status === 404) return null;
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function wpPost(path: string, body: unknown): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(`${origin()}/wp-json${path}`, {
      method: "POST",
      headers: requestHeaders(true),
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function getPage(path: string) {
  const data = await wpGet<{ found: boolean; page?: WpPage }>(`/ac/v1/content?path=${encodeURIComponent(path)}`);
  return data?.found ? data.page ?? null : null;
}

export async function getCollection(query: { type: string; publicationType?: string; eventKind?: string; search?: string; herb?: boolean }) {
  const params = new URLSearchParams({ type: query.type });
  if (query.publicationType) params.set("publication_type", query.publicationType);
  if (query.eventKind) params.set("event_kind", query.eventKind);
  if (query.search) params.set("search", query.search);
  if (query.herb) params.set("herb", "1");
  const data = await wpGet<{ total: number; items: WpItem[] }>(`/ac/v1/collection?${params.toString()}`);
  return data ?? { total: 0, items: [] };
}

export async function getRecord(type: string, slug: string) {
  const data = await wpGet<{ found: boolean; item?: WpItem }>(
    `/ac/v1/record?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`,
  );
  return data?.found ? data.item ?? null : null;
}

export async function getHome(): Promise<HomePayload> {
  const data = await wpGet<HomePayload>("/ac/v1/home");
  if (!data) {
    return { settings: fallbackSettings, articles: [], plants: [], courses: [], programmes: [], events: [], herb: null };
  }
  return { ...data, settings: { ...fallbackSettings, ...data.settings } };
}

export function metaText(item: WpItem, key: string) {
  const value = item.meta[key];
  return typeof value === "string" ? value : "";
}

export function metaLines(item: WpItem, key: string) {
  return metaText(item, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
