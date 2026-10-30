import Link from "next/link";
import { notFound } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";
import { nakshatras } from "@/lib/nakshatra";
import { childrenOf, crumbsFor, isRecord, resolve, type Resolved, type RouteDef } from "@/lib/routes";
import { cardPhoto, photoFor, type Photo } from "@/lib/photos";
import { button, display, pad, stage, title } from "@/lib/ui";
import { getCollection, getHome, getPage, getRecord, metaLines, metaText, type WpItem, type WpPage } from "@/lib/wp";

export async function PageScreen({ path, search, course }: { path: string; search?: string; course?: string }) {
  const resolved = resolve(path);
  if (!resolved) notFound();
  if (!isRecord(resolved) && resolved.kind === "home") return <HomeScreen />;
  if (isRecord(resolved)) return <RecordScreen route={resolved} />;
  if (resolved.kind === "hub") return <HubScreen route={resolved} />;
  if (resolved.kind === "catalogue") return <CatalogueScreen route={resolved} search={search} />;
  if (resolved.kind === "form") return <FormScreen route={resolved} course={course} />;
  if (resolved.kind === "feature") return <FeatureScreen route={resolved} />;
  return <EditorialScreen route={resolved} />;
}

async function HomeScreen() {
  const home = await getHome();
  const { settings } = home;
  const projects = await getCollection({ type: "programme" });
  const films = await getCollection({ type: "publication", publicationType: "video" });
  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-black supports-[height:100dvh]:min-h-[100dvh]" aria-label="Homepage Hero">
        <img src="/photos/herbs-honey.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <video className="hero-video" autoPlay muted loop playsInline poster="/photos/herbs-honey.jpg">
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(3,11,16,.84), rgba(3,11,16,.28) 52%, rgba(3,11,16,.5))" }} />
        <div className="absolute bottom-[136px] w-full px-8 text-center text-text-inverted">
          <p className="text-sm italic uppercase tracking-[0.42px]">{settings.heroKicker}</p>
          <h1 className="mt-4 text-5xl font-bold leading-5xl-tight md:text-6xl">{settings.heroTitle}</h1>
          <p className="mx-auto mt-4 max-w-4xl text-2xl font-regular">{settings.heroLead}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link className={button} href="/knowledge">Explore knowledge</Link>
            <Link className={button} href="/collaborate">Work with me</Link>
          </div>
        </div>
      </section>
      <section className={`${pad} py-16`}>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[8.5rem_1fr]">
          <img className="portrait portrait-lg" src="/photos/arun-chandan.png" alt="Dr Arun Chandan" width={800} height={800} />
          <div>
            <p className="text-sm italic uppercase">Verified from the public biography</p>
            <h2 className={`${title} mt-2`}>Experience on the record</h2>
            <ul className="m-0 mt-4 list-none p-0">
              {[
                "BAMS, 1990, Rajiv Gandhi Government Ayurvedic College, Paprola.",
                "Later led the Regional-cum-Facilitation Centre, Northern Region-I, National Medicinal Plants Board.",
                "Retired from government service in May 2026. Advisory work continues.",
                "Based between Dharamshala and Joginder Nagar, Himachal Pradesh.",
              ].map((fact) => (
                <li key={fact} className="border-b border-border-accented py-3">{fact}</li>
              ))}
            </ul>
            <p className="mt-4"><Link href="/about/dr-arun-chandan">Read the biography</Link></p>
          </div>
        </div>
        <ul className="audience">
          {[
            ["/plants/cultivation", "Farmers and FPOs", "Cultivation, planting material, and conservation. A species note names the plant. It does not set a crop recipe."],
            ["/research", "Researchers", "Public project notes and essays. Laboratory files and unpublished results stay off this site."],
            ["/consulting", "Manufacturers", "Identity, quality, and whether a product idea deserves a scoped feasibility review."],
            ["/academy", "Students", "Course outlines for medicinal plants and community knowledge. Dates and fees wait for a real intake."],
            ["/consulting/evaluation-and-policy", "Policy teams", "Programme design and evaluation questions, scoped in writing before any finding is claimed."],
            ["/collaborate", "Partners", "A research idea, a field collaboration, or an invitation to speak. The form is not a contract."],
          ].map(([href, heading, text]) => (
            <li key={href}>
              <Link href={href}>
                <strong>{heading}</strong>
                <span>{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className={`${pad} py-16`}>
        <p className="text-sm italic uppercase">Six pillars</p>
        <h2 className={`${display} mt-3`}>Where the work sits</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {[
            ["/lokayurveda", "LokAyurveda", "Community knowledge, recorded with consent.", "/photos/flowers.jpg", "A row of colourful flowers"],
            ["/medicinal-plants", "Medicinal plants", "Species notes for identity, cultivation context, and conservation.", "/photos/turmeric.jpg", "Fresh turmeric roots"],
            ["/research", "Research", "Public project notes. Unpublished results stay private.", "/photos/herbal-jars.jpg", "Jars of herbs on a wooden table"],
            ["/academy", "Academy", "Course outlines. Dates and fees wait for a real intake.", "/photos/hands-herbs.jpg", "Hands working herbs in a mortar"],
            ["/consulting", "Consulting", "Advisory conversations. No price list on this site.", "/photos/tea.jpg", "A glass cup of tea"],
            ["/collaborate", "Collaborate", "A proposal from a farmer, a laboratory, a brand, or an institution.", "/photos/spices-market.jpg", "Dried fruit, tea, and spices"],
          ].map(([href, heading, text, src, alt]) => (
            <article key={href}>
              <Link className="info-card" href={href}>
                <img src={src} alt={alt} />
                <div>
                  <strong>{heading}</strong>
                  <p>{text}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className={`${pad} bg-background-bg-stage py-16`}>
        <p className="text-sm italic uppercase">From the library</p>
        <h2 className={`${display} text-text`}>Articles and plants</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h3 className={title}><Link href="/knowledge/articles">Articles</Link></h3>
            {home.articles.length ? (
              <ul className="m-0 mt-4 list-none p-0">
                {home.articles.map((item) => (
                  <li key={item.id} className="border-b border-border-accented py-3">
                    <Link href={item.path}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-4">Essays will appear here as they are published.</p>}
          </div>
          <div>
            <h3 className={title}><Link href="/plants">Plant profiles</Link></h3>
            {home.plants.length ? (
              <ul className="m-0 mt-4 list-none p-0">
                {home.plants.map((item) => (
                  <li key={item.id} className="border-b border-border-accented py-3">
                    <Link href={item.path}>{item.title}</Link>
                    {metaText(item, "botanicalName") ? <span className="mt-1 block text-base">{metaText(item, "botanicalName")}</span> : null}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-4">Plant profiles are added from WordPress.</p>}
          </div>
        </div>
      </section>
      <section className={`${pad} py-16`}>
        <p className="text-sm italic uppercase">Public work</p>
        <h2 className={`${display} mt-3`}>Projects and films</h2>
        <p className="mt-4 max-w-3xl">Project notes stay qualitative until a source is approved. The films are the ones published on the official channel.</p>
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h3 className={title}><Link href="/research/projects">Projects</Link></h3>
            <ul className="m-0 mt-4 list-none p-0">
              {projects.items.slice(0, 4).map((item) => (
                <li key={item.id} className="border-b border-border-accented py-3">
                  <Link href={metaText(item, "enquiryLink") || "/research/projects"}>{item.title}</Link>
                  <span className="mt-1 block text-base">{item.summary}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={title}><Link href="/knowledge/herbal-tv">From the channel</Link></h3>
            <ul className="m-0 mt-4 list-none p-0">
              {films.items.slice(0, 4).map((item) => (
                <li key={item.id} className="border-b border-border-accented py-3">
                  <a href={metaText(item, "externalUrl") || "/publications"}>{item.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className={`${pad} py-16`}>
        <div className="grid grid-cols-1 items-center gap-8 border border-border-accented lg:grid-cols-2">
          <img src="/photos/dried-herbs.jpg" alt="Dried herbal leaves packed in market bags" className="h-96 w-full object-cover" />
          <div className="p-6">
            <p className="text-sm italic uppercase">Collaboration</p>
            <h2 className={title}>Send a proposal</h2>
            <p className="mt-2">Farmers, laboratories, manufacturers, institutions, and students can write. The team replies to the enquiry. Nothing on this page is a signed partnership.</p>
            <p className="mt-4"><Link className={button} href="/collaborate">Open the collaboration form</Link></p>
          </div>
        </div>
      </section>
      <NewsletterBand source="/" />
    </>
  );
}

function NewsletterBand({ source }: { source: string }) {
  return (
    <section className="news-band" id="newsletter" aria-labelledby="newsletter-title">
      <img className="news-band-photo" src="/photos/flowers.jpg" alt="" />
      <div className="news-band-scrim" />
      <div className={`${pad} news-band-inner`}>
        <div>
          <p className="text-sm italic uppercase">Newsletter</p>
          <h2 className={`${display} mt-3`} id="newsletter-title">Occasional notes</h2>
          <p className="mt-4 max-w-xl text-2xl font-regular">Plants, courses, and the work in Himachal Pradesh. No payment on this list.</p>
          <ul className="news-points">
            <li>A note when something new is published</li>
            <li>Your email is used only for this list</li>
            <li>You can unsubscribe later</li>
          </ul>
          <p className="mt-4 max-w-xl text-base">Official WhatsApp and Telegram links will be added when the team publishes them.</p>
        </div>
        <div className="news-card">
          <p className="text-sm italic uppercase">Join the list</p>
          <p className="mt-2 mb-4">Leave an email. A name is optional.</p>
          <EnquiryForm kind="newsletter" source={source} />
        </div>
      </div>
    </section>
  );
}

function Shell({ route, title: heading, summary, page }: { route: { path: string; kicker: string; medical?: boolean }; title: string; summary?: string; page: WpPage | null }) {
  return (
    <header className={stage}>
      <nav aria-label="Breadcrumb">
        <ol className="m-0 flex list-none flex-wrap gap-2 p-0 text-sm">
          <li><Link href="/">Home</Link></li>
          {crumbsFor(route.path, heading).map((crumb, index, all) => (
            <li key={crumb.href}>
              <span className="px-1">/</span>
              {index === all.length - 1 ? <span aria-current="page">{crumb.label}</span> : <Link href={crumb.href}>{crumb.label}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      {route.path === "/about/dr-arun-chandan" ? (
        <img className="portrait" src="/photos/arun-chandan.png" alt="Dr Arun Chandan" width={800} height={800} />
      ) : null}
      <p className="mt-6 text-sm italic uppercase">{page?.kicker || route.kicker}</p>
      <h1 className="page-title mt-3 text-text">{heading}</h1>
      {summary ? <p className="mt-4 max-w-3xl text-2xl font-regular">{summary}</p> : null}
      {page?.status === "draft" ? <p className="note">Draft. Editors can still change this page in WordPress.</p> : null}
      {page?.legalDraft ? <p className="note">Draft for legal review. Do not treat this text as a finished policy.</p> : null}
      {route.medical ? (
        <p className="note">
          General education, not a diagnosis or emergency care. <Link href="/medical-disclaimer">Medical disclaimer</Link>.
        </p>
      ) : null}
      {route.path === "/about/dr-arun-chandan" ? null : <PagePhoto path={route.path} />}
    </header>
  );
}

function PagePhoto({ path }: { path: string }) {
  const photo = photoFor(path);
  if (!photo) return null;
  return <img src={photo.src} alt={photo.alt} className="page-photo" />;
}

function Body({ page }: { page: WpPage | null }) {
  if (!page?.html) return <div className="prose"><p>This page is being prepared in WordPress. The address is already reserved.</p></div>;
  return <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />;
}

async function HubScreen({ route }: { route: RouteDef }) {
  const page = await getPage(route.path);
  return (
    <article>
      <Shell route={route} title={page?.title || route.title} summary={page?.summary || route.description} page={page} />
      <div className={`${pad} py-12`}>
        <Body page={page} />
        <p className="mb-0 mt-10 text-sm italic uppercase">In this section</p>
        <ChildList parent={route.path} />
      </div>
    </article>
  );
}

async function EditorialScreen({ route }: { route: RouteDef }) {
  const page = await getPage(route.path);
  return (
    <article>
      <Shell route={route} title={page?.title || route.title} summary={page?.summary || route.description} page={page} />
      <div className={`${pad} reading py-12`}>
        <div>
          <Body page={page} />
          {route.path === "/medical-astrology/plants-and-nakshatras" ? <NakshatraTable /> : null}
        </div>
        <Related parent={route.parent} current={route.path} />
      </div>
    </article>
  );
}

async function CatalogueScreen({ route, search }: { route: RouteDef; search?: string }) {
  const page = await getPage(route.path);
  const collection = await getCollection({
    type: route.collection || "article",
    publicationType: route.publicationType,
    eventKind: route.eventKind,
    search,
  });
  return (
    <article>
      <Shell route={route} title={page?.title || route.title} summary={page?.summary || route.description} page={page} />
      <div className={`${pad} py-12`}>
        <Body page={page} />
        <div className="catalogue-bar">
          <p className="m-0">{collection.items.length ? `${collection.items.length} published` : "Nothing is published in this list yet."}</p>
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end" method="get">
            <label className="block w-full sm:w-80">
              <span className="mb-1 block text-sm">Search this list</span>
              <input className="w-full border border-border-accented bg-white px-3 py-2" name="q" defaultValue={search || ""} />
            </label>
            <button className={button} type="submit">Search</button>
          </form>
        </div>
        {collection.items.length ? (
          <ul className="info-grid">
            {collection.items.map((item, index) => (
              <li key={item.id}>
                <CatalogueCard item={item} photo={photoFor(item.path) || cardPhoto(index)} />
                {item.status === "draft" ? <p className="mt-1 text-sm">Draft</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8">Nothing has been published in this list yet.</p>
        )}
      </div>
    </article>
  );
}

function CatalogueCard({ item, photo }: { item: WpItem; photo: Photo }) {
  const line = itemLine(item);
  const external = metaText(item, "externalUrl");
  const youtubeId = safeYoutube(metaText(item, "youtubeId"));
  const src = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : photo.src;
  const body = (
    <>
      <img src={src} alt="" />
      <div>
        <strong>{item.title}</strong>
        {line ? <p>{line}</p> : null}
      </div>
    </>
  );
  if (external) return <a className="info-card" href={external}>{body}</a>;
  if (item.type === "publication" || item.type === "event" || item.type === "programme") {
    const href = metaText(item, "enquiryLink");
    if (href) return <Link className="info-card" href={href}>{body}</Link>;
    return <div className="info-card">{body}</div>;
  }
  return <Link className="info-card" href={item.path}>{body}</Link>;
}

function itemLine(item: WpItem) {
  if (item.type === "course") {
    return [metaText(item, "audience"), metaText(item, "duration"), metaText(item, "feeText") || "Confirmed with each intake", metaText(item, "nextIntake") || "To be announced"].filter(Boolean).join(" · ");
  }
  if (item.type === "plant") return [metaText(item, "botanicalName"), metaText(item, "region")].filter(Boolean).join(" · ") || item.summary;
  if (item.type === "event") return [metaText(item, "startDate"), metaText(item, "location")].filter(Boolean).join(" · ") || item.summary;
  if (item.type === "publication") return metaText(item, "pubDate") || item.summary;
  return item.summary;
}

async function RecordScreen({ route }: { route: Extract<Resolved, { kind: "record" }> }) {
  const item = await getRecord(route.recordType, route.slug);
  if (!item) notFound();
  return (
    <article>
      <Shell route={route} title={item.title} summary={item.summary} page={null} />
      <div className={`${pad} reading py-12`}>
        <div>
          {item.status === "draft" ? <p className="note">Draft.</p> : null}
          {route.recordType === "plant" ? <PlantFacts item={item} /> : null}
          {route.recordType === "course" ? <CourseFacts item={item} /> : null}
          {item.html ? <div className="prose" dangerouslySetInnerHTML={{ __html: item.html }} /> : null}
          {route.recordType === "course" ? (
            <p className="mt-6"><Link className={button} href={`/courses/apply?course=${item.slug}`}>Apply</Link></p>
          ) : null}
        </div>
        <RecordAside item={item} />
      </div>
    </article>
  );
}

function PlantFacts({ item }: { item: WpItem }) {
  const rows = [
    ["Common name", metaText(item, "commonName")],
    ["Botanical name", metaText(item, "botanicalName")],
    ["Family", metaText(item, "family")],
    ["Local names", metaText(item, "localNames")],
    ["Region", metaText(item, "region")],
    ["Review", metaText(item, "reviewNote")],
    ["Traditional context", metaText(item, "uses")],
    ["Cultivation", metaText(item, "cultivationNote")],
    ["Conservation", metaText(item, "conservationNote")],
    ["References", metaText(item, "references")],
  ].filter((row) => row[1]);
  if (!rows.length) return null;
  const nameKeys = new Set(["Common name", "Botanical name", "Family", "Local names", "Region"]);
  const named = rows.filter(([label]) => nameKeys.has(label));
  const rest = rows.filter(([label]) => !nameKeys.has(label));
  return (
    <div className="identity">
      <FactPanel title="Identity" rows={named} />
      <FactPanel title="Limits of this note" rows={rest} />
    </div>
  );
}

function FactPanel({ title: heading, rows }: { title: string; rows: string[][] }) {
  if (!rows.length) return null;
  return (
    <section className="identity-panel">
      <h2>{heading}</h2>
      <dl className="m-0">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CourseFacts({ item }: { item: WpItem }) {
  return (
    <>
      <dl className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[
          ["Audience", metaText(item, "audience")],
          ["Duration", metaText(item, "duration")],
          ["Format", metaText(item, "format")],
          ["Fee", metaText(item, "feeText") || "Confirmed with each intake"],
          ["Next intake", metaText(item, "nextIntake") || "To be announced"],
        ].map(([label, value]) => (
          <div key={label} className="border-b border-border-accented pb-3">
            <dt className="text-sm">{label}</dt>
            <dd className="mt-1">{value}</dd>
          </div>
        ))}
      </dl>
      <LineList title="Learning outcomes" lines={metaLines(item, "outcomes")} />
      {metaText(item, "eligibility") ? <p><strong>Eligibility. </strong>{metaText(item, "eligibility")}</p> : null}
      {metaText(item, "schedule") ? <p><strong>Schedule. </strong>{metaText(item, "schedule")}</p> : null}
      <LineList title="Documents" lines={metaLines(item, "documents")} />
      <LineList title="Application steps" lines={metaLines(item, "applicationSteps")} />
    </>
  );
}

function LineList({ title: heading, lines }: { title: string; lines: string[] }) {
  if (!lines.length) return null;
  return (
    <>
      <h2 className={`${title} mt-8`}>{heading}</h2>
      <ul>{lines.map((line) => <li key={line}>{line}</li>)}</ul>
    </>
  );
}

async function FormScreen({ route, course }: { route: RouteDef; course?: string }) {
  const page = await getPage(route.path);
  const courses = route.form === "application" ? (await getCollection({ type: "course" })).items : [];
  return (
    <article>
      <Shell route={route} title={page?.title || route.title} summary={page?.summary || route.description} page={page} />
      {route.form === "newsletter" ? (
        <>
          <div className={`${pad} py-12`}><Body page={page} /></div>
          <NewsletterBand source={route.path} />
        </>
      ) : (
        <div className={`${pad} form-split py-12`}>
          <Body page={page} />
          <div className="form-card">
            <p className="text-sm italic uppercase">Your enquiry</p>
            <div className="mt-4">
              <EnquiryForm kind={route.form || "contact"} source={route.path} courses={courses.map((item) => ({ slug: item.slug, title: item.title }))} selectedCourse={course || ""} />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

async function ChannelList() {
  const videos = await getCollection({ type: "publication", publicationType: "video" });
  if (!videos.items.length) return <p className="mt-6">Films are added when they are published on the official channel.</p>;
  return (
    <ul className="info-grid">
      {videos.items.map((item) => {
        const youtubeId = safeYoutube(metaText(item, "youtubeId"));
        const href = metaText(item, "externalUrl") || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : "/publications");
        return (
          <li key={item.id}>
            <a className="info-card" href={href}>
              {youtubeId ? <img src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`} alt="" /> : null}
              <div><strong>{item.title}</strong></div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

async function FeatureScreen({ route }: { route: RouteDef }) {
  const page = await getPage(route.path);
  const herb = route.feature === "herb" ? (await getCollection({ type: "plant", herb: true })).items[0] : null;
  const youtubeId = safeYoutube(page?.youtubeId || "");
  return (
    <article>
      <Shell route={route} title={page?.title || route.title} summary={page?.summary || route.description} page={page} />
      <div className={`${pad} py-12`}>
        <Body page={page} />
        {route.feature === "herb" && herb ? <p className="mt-6"><Link href={herb.path}>{herb.title}</Link> is the current Herb of the Week.</p> : null}
        {route.feature === "herb" && !herb ? <p className="mt-6">No plant is marked Herb of the Week yet.</p> : null}
        {route.feature !== "herb" && youtubeId ? (
          <div className="video mt-6">
            <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title={page?.title || route.title} allowFullScreen />
          </div>
        ) : null}
        {route.feature === "tv" ? <ChannelList /> : null}
        {route.feature === "podcast" ? <p className="mt-6">A separate podcast feed is not published yet. Films from the same official channel are on <Link href="/knowledge/herbal-tv">Herbal TV</Link>.</p> : null}
      </div>
    </article>
  );
}

function Related({ parent, current }: { parent?: string; current: string }) {
  if (!parent) return null;
  const siblings = childrenOf(parent).filter((child) => child.path !== current).slice(0, 4);
  if (!siblings.length) return null;
  return (
    <aside className="reading-side">
      <p className="text-sm italic uppercase">Also in this section</p>
      {siblings.map((child) => (
        <Link className="side-link" key={child.path} href={child.path}>
          {child.title}
          <span>{child.description}</span>
        </Link>
      ))}
    </aside>
  );
}

function RecordAside({ item }: { item: WpItem }) {
  const links = metaLines(item, "relatedLinks").slice(0, 4);
  return (
    <aside className="reading-side">
      <p className="text-sm italic uppercase">Keep going</p>
      <Link className="side-link" href={item.type === "plant" ? "/plants" : item.type === "course" ? "/courses" : "/knowledge/articles"}>
        {item.type === "plant" ? "All species" : item.type === "course" ? "All courses" : "All articles"}
      </Link>
      {item.type === "plant" ? <Link className="side-link" href="/plants/conservation">Conservation</Link> : null}
      {item.type === "article" ? <Link className="side-link" href="/lokayurveda">LokAyurveda</Link> : null}
      {links.map((href) => (
        <a className="side-link" key={href} href={href}>{href.replace(/^https?:\/\//, "")}</a>
      ))}
    </aside>
  );
}

function ChildList({ parent }: { parent: string }) {
  const children = childrenOf(parent);
  if (!children.length) return null;
  return (
    <ul className="info-grid">
      {children.map((child, index) => {
        const photo = photoFor(child.path) || cardPhoto(index);
        return (
          <li key={child.path}>
            <Link className="info-card" href={child.path}>
              <img src={photo.src} alt="" />
              <div>
                <strong>{child.title}</strong>
                <p>{child.description}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function NakshatraTable() {
  return (
    <div className="table-wrap mt-8">
      <table>
        <caption className="mb-3 text-start">Nakshatra plants named by Shri Dhanwantry Ayurvedic College. Other lists differ. Names only, not uses.</caption>
        <thead>
          <tr>
            <th scope="col">Nakshatra</th>
            <th scope="col">Sanskrit name</th>
            <th scope="col">Botanical name</th>
            <th scope="col">Common name</th>
          </tr>
        </thead>
        <tbody>
          {nakshatras.map((row) => (
            <tr key={row[0]}>
              {row.map((cell) => <td key={`${row[0]}-${cell}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function safeYoutube(value: string) {
  return /^[a-zA-Z0-9_-]{6,20}$/.test(value) ? value : "";
}
