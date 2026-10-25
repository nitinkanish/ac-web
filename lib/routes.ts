export type CollectionType = "article" | "plant" | "course" | "programme" | "publication" | "event";
export type FormKind = "consultation" | "application" | "contact" | "newsletter";

export type RouteDef = {
  path: string;
  title: string;
  description: string;
  kicker: string;
  kind: "home" | "hub" | "editorial" | "catalogue" | "form" | "feature";
  parent?: string;
  nav?: boolean;
  collection?: CollectionType;
  publicationType?: string;
  eventKind?: string;
  form?: FormKind;
  feature?: "herb" | "podcast" | "tv";
  medical?: boolean;
};

export type RecordRef = {
  kind: "record";
  path: string;
  title: string;
  description: string;
  kicker: string;
  parent: string;
  recordType: "article" | "plant" | "course";
  slug: string;
  medical: boolean;
};

export type Resolved = RouteDef | RecordRef;

const page = (
  path: string,
  title: string,
  description: string,
  kicker: string,
  kind: RouteDef["kind"],
  extra: Partial<RouteDef> = {},
): RouteDef => ({ path, title, description, kicker, kind, ...extra });

export const routes: RouteDef[] = [
  page("/", "Dr Arun Chandan", "Ayurveda, medicinal plants, consultations, learning, and livelihoods.", "Home", "home"),

  page("/about", "About", "Dr Arun Chandan and the initiatives around his work.", "The work", "hub", { nav: true }),
  page("/about/dr-arun-chandan", "Dr Arun Chandan", "Biography of Dr Arun Chandan, Ayurvedic physician and medicinal-plant practitioner.", "Biography", "editorial", { parent: "/about" }),
  page("/about/lok-ayurveda", "Lok Ayurveda", "The unwritten Ayurveda of traditional community healthcare providers.", "Community knowledge", "editorial", { parent: "/about" }),
  page("/about/lok-ayurved-vishav-vidyapeeth", "Lok Ayurved Vishav Vidyapeeth", "A proposed centre for community-based medicine.", "An aim", "editorial", { parent: "/about" }),
  page("/about/grameen-shodhshala", "Grameen Shodhshala", "Village research for plants and community knowledge.", "Village research", "editorial", { parent: "/about" }),
  page("/about/himalayan-ayurveda-museum", "Himalayan Ayurveda Museum", "The Lok Ayurveda Museum and herbal garden at Joginder Nagar.", "Joginder Nagar", "editorial", { parent: "/about" }),

  page("/ayush", "Ayurveda and AYUSH", "Introductory pages for the five AYUSH systems.", "Five systems", "hub", { nav: true, medical: true }),
  page("/ayush/ayurveda", "Ayurveda", "A short introduction to Ayurveda.", "Ayurveda", "editorial", { parent: "/ayush", medical: true }),
  page("/ayush/yoga-and-naturopathy", "Yoga and Naturopathy", "A short introduction to Yoga and Naturopathy.", "Practice", "editorial", { parent: "/ayush", medical: true }),
  page("/ayush/unani", "Unani", "A short introduction to Unani.", "Unani", "editorial", { parent: "/ayush", medical: true }),
  page("/ayush/siddha", "Siddha", "A short introduction to Siddha.", "Siddha", "editorial", { parent: "/ayush", medical: true }),
  page("/ayush/homeopathy", "Homeopathy", "A short introduction to Homeopathy.", "Homeopathy", "editorial", { parent: "/ayush", medical: true }),

  page("/consultations", "Consultations", "Request a consultation by enquiry. No payment or live booking.", "A human reply", "hub", { nav: true, medical: true }),
  page("/consultations/what-to-expect", "What to expect", "How a consultation enquiry is handled.", "After you write", "editorial", { parent: "/consultations", medical: true }),
  page("/consultations/request", "Request a consultation", "Send a consultation enquiry for a later reply.", "Enquiry", "form", { parent: "/consultations", form: "consultation", medical: true }),

  page("/courses", "Training and courses", "Course catalogue. Fees and dates are published only when an intake is confirmed.", "Learning", "catalogue", { nav: true, collection: "course" }),
  page("/courses/apply", "Apply for a course", "Apply for a course. Learning stays offline in this phase.", "Application", "form", { parent: "/courses", form: "application" }),

  page("/plants", "Medicinal plants", "Plant profiles, cultivation, processing, nurseries, and conservation.", "Plant knowledge", "catalogue", { nav: true, collection: "plant", medical: true }),
  page("/plants/cultivation", "Cultivation", "Why cultivated medicinal-plant supply matters.", "From the field", "editorial", { parent: "/plants", medical: true }),
  page("/plants/processing", "Processing", "What happens after harvest, without manufacturing instructions.", "After harvest", "editorial", { parent: "/plants", medical: true }),
  page("/plants/nurseries-and-seeds", "Nurseries and seeds", "Quality planting material for medicinal plants.", "Planting material", "editorial", { parent: "/plants" }),
  page("/plants/conservation", "Conservation", "Using medicinal plants without emptying wild populations.", "Wild plants", "editorial", { parent: "/plants", medical: true }),

  page("/knowledge", "Knowledge hub", "Articles, publications, Herb of the Week, podcast, and Herbal TV.", "Library", "hub", { nav: true }),
  page("/knowledge/articles", "Articles", "Essays and notes on Ayurveda, plants, and livelihoods.", "Writing", "catalogue", { parent: "/knowledge", collection: "article", medical: true }),
  page("/knowledge/herb-of-the-week", "Herb of the Week", "One medicinal plant, chosen by the editors.", "This week", "feature", { parent: "/knowledge", feature: "herb", medical: true }),
  page("/knowledge/books", "Books", "Books, added when files and covers are ready.", "Longer works", "catalogue", { parent: "/knowledge", collection: "publication", publicationType: "book" }),
  page("/knowledge/ebooks", "E-books", "E-books, added when files are ready.", "On screen", "catalogue", { parent: "/knowledge", collection: "publication", publicationType: "ebook" }),
  page("/knowledge/posters", "Posters", "Posters for classrooms, farms, and workshops.", "Print", "catalogue", { parent: "/knowledge", collection: "publication", publicationType: "poster" }),
  page("/knowledge/manuals", "Manuals", "Manuals for training and field work.", "Practice", "catalogue", { parent: "/knowledge", collection: "publication", publicationType: "manual" }),
  page("/knowledge/dossiers", "Dossiers", "Short briefs on a species, a practice, or a policy question.", "Briefs", "catalogue", { parent: "/knowledge", collection: "publication", publicationType: "dossier" }),
  page("/knowledge/podcast", "Podcast", "Conversations embedded from YouTube when an episode is published.", "Listening", "feature", { parent: "/knowledge", feature: "podcast" }),
  page("/knowledge/herbal-tv", "Herbal TV", "Films embedded from YouTube when an id is published.", "Watching", "feature", { parent: "/knowledge", feature: "tv" }),

  page("/programmes", "Programmes and services", "Incubation, gardens, care, workplaces, labs, rights, and manufacturing.", "With others", "hub", { nav: true }),
  page("/programmes/incubation", "Incubation", "Support for herbal and medicinal-plant enterprise.", "Enterprise", "editorial", { parent: "/programmes" }),
  page("/programmes/nutrition-gardens", "Nutrition gardens", "Household and community gardens for food and medicinal plants.", "Gardens", "editorial", { parent: "/programmes" }),
  page("/programmes/elderly-care", "Elderly care", "Educational support for older people and their families.", "Older people", "editorial", { parent: "/programmes", medical: true }),
  page("/programmes/workplace-wellness", "Workplace wellness", "Educational sessions for teams and institutions.", "Workplaces", "editorial", { parent: "/programmes" }),
  page("/programmes/labs", "Labs", "Why identity and quality testing matter for medicinal plants.", "Quality", "editorial", { parent: "/programmes" }),
  page("/programmes/ipr", "IPR and community rights", "Consent, community rights, and benefit sharing.", "Consent", "editorial", { parent: "/programmes" }),
  page("/programmes/manufacturing", "Manufacturing", "Quality from the farm to a finished material. No shop.", "Making", "editorial", { parent: "/programmes" }),

  page("/medical-astrology", "Medical astrology", "Educational pages only. No chart orders.", "Education", "hub", { nav: true, medical: true }),
  page("/medical-astrology/plants-and-nakshatras", "Plants and nakshatras", "Nakshatra plants from one published garden tradition.", "Identification", "editorial", { parent: "/medical-astrology", medical: true }),

  page("/community", "Community", "Events, volunteering, and the newsletter. No member forum.", "Stay in touch", "hub", { nav: true }),
  page("/community/events", "Events", "Confirmed gatherings and field days.", "Gatherings", "catalogue", { parent: "/community", collection: "event", eventKind: "gathering" }),
  page("/community/webinars", "Webinars", "Online sessions, listed when a date exists.", "Online", "catalogue", { parent: "/community", collection: "event", eventKind: "webinar" }),
  page("/community/festivals", "Festivals", "Seasonal gatherings.", "Season", "catalogue", { parent: "/community", collection: "event", eventKind: "festival" }),
  page("/community/volunteering", "Volunteering", "Offer time for documentation, gardens, and events.", "Offer time", "editorial", { parent: "/community" }),
  page("/community/newsletter", "Newsletter", "Opt in to occasional updates.", "Updates", "form", { parent: "/community", form: "newsletter" }),

  page("/contact", "Contact", "Write to Dr Arun Chandan’s team.", "Write", "form", { form: "contact" }),
  page("/privacy", "Privacy", "Draft privacy policy.", "Draft", "editorial", { parent: "/contact" }),
  page("/cookies", "Cookie policy", "Draft cookie policy.", "Draft", "editorial", { parent: "/contact" }),
  page("/terms", "Terms", "Draft terms of use.", "Draft", "editorial", { parent: "/contact" }),
  page("/medical-disclaimer", "Medical disclaimer", "General education, not diagnosis or emergency care.", "Please read", "editorial", { medical: true }),
];

const routeMap = new Map(routes.map((route) => [route.path, route]));

export function resolve(path: string): Resolved | null {
  const known = routeMap.get(path);
  if (known) return known;

  const article = path.match(/^\/knowledge\/articles\/([a-z0-9-]+)$/);
  if (article) return record("article", article[1], "/knowledge/articles", "Article");
  const plant = path.match(/^\/plants\/([a-z0-9-]+)$/);
  if (plant) return record("plant", plant[1], "/plants", "Plant");
  const course = path.match(/^\/courses\/([a-z0-9-]+)$/);
  if (course) return record("course", course[1], "/courses", "Course");
  return null;
}

function record(recordType: RecordRef["recordType"], slug: string, parent: string, kicker: string): RecordRef {
  const path =
    recordType === "article"
      ? `/knowledge/articles/${slug}`
      : recordType === "plant"
        ? `/plants/${slug}`
        : `/courses/${slug}`;
  return {
    kind: "record",
    path,
    title: slug.replace(/-/g, " "),
    description: `${kicker} from the Arun Chandan library.`,
    kicker,
    parent,
    recordType,
    slug,
    medical: recordType !== "course",
  };
}

export function isRecord(value: Resolved): value is RecordRef {
  return value.kind === "record";
}

export function childrenOf(path: string) {
  return routes.filter((route) => route.parent === path);
}

export function navItems() {
  return routes.filter((route) => route.nav).map((item) => ({ ...item, children: childrenOf(item.path) }));
}

export function crumbsFor(path: string, current: string) {
  const resolved = resolve(path);
  let parent = resolved && "parent" in resolved ? resolved.parent : undefined;
  const chain: { href: string; label: string }[] = [];
  const seen = new Set<string>();
  while (parent && !seen.has(parent)) {
    seen.add(parent);
    const route = routeMap.get(parent);
    if (!route) break;
    chain.unshift({ href: route.path, label: route.title });
    parent = route.parent;
  }
  chain.push({ href: path, label: current });
  return chain;
}

export function staticPaths() {
  return routes.map((route) => route.path);
}
