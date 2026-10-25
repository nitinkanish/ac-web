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
            <Link className={button} href="/about">Explore the work</Link>
            <Link className={button} href="/consultations/request">Request a consultation</Link>
          </div>
        </div>
      </section>
      <section className={`${pad} py-16`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4">
          {[
            ["/ayush/ayurveda", "01", "Ayurveda", "A plain introduction to the tradition he trained in.", "/photos/brass-bowl.jpg", "A brass bowl and flower"],
            ["/plants", "02", "Medicinal plants", "Profiles, cultivation, and conservation.", "/photos/turmeric.jpg", "Fresh turmeric roots"],
            ["/courses", "03", "Education", "Courses and applications, without invented fees.", "/photos/hands-herbs.jpg", "Hands working herbs in a mortar"],
            ["/programmes", "04", "Livelihood", "Gardens, incubation, and community programmes.", "/photos/spices-market.jpg", "Dried fruit, tea, and spices"],
          ].map(([href, index, heading, text, src, alt]) => (
            <article key={href}>
              <Link href={href} className="block">
                <img src={src} alt={alt} className="h-64 w-full object-cover" />
              </Link>
              <p className="mt-4 text-sm italic uppercase">{index}</p>
              <h2 className={`${title} mt-2`}>
                <Link href={href}>{heading}</Link>
              </h2>
              <p className="mt-2 text-base leading-base-tight">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={`${pad} bg-background-bg-stage py-16`}>
        <p className="text-sm italic uppercase">Start here</p>
        <h2 className={`${display} text-text`}>Three ways in</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <article>
            <Link href="/consultations" className="block"><img src="/photos/tea.jpg" alt="A glass cup of tea" className="h-64 w-full object-cover" /></Link>
            <h3 className={`${title} mt-4`}><Link href="/consultations">Consultations</Link></h3>
            <p className="mt-2">An enquiry for in-person, WhatsApp, Zoom, email, or post. No payment on this site.</p>
          </article>
          <article>
            <Link href="/courses" className="block"><img src="/photos/mortar.jpg" alt="A mortar and pestle with dried flowers" className="h-64 w-full object-cover" /></Link>
            <h3 className={`${title} mt-4`}><Link href="/courses">Courses</Link></h3>
            <p className="mt-2">{home.courses.length ? `${home.courses.length} published` : "The catalogue is ready. Intakes are announced when dates are real."}</p>
          </article>
          <article>
            <Link href="/knowledge/articles" className="block"><img src="/photos/herbal-jars.jpg" alt="Jars of herbs on a wooden table" className="h-64 w-full object-cover" /></Link>
            <h3 className={`${title} mt-4`}><Link href="/knowledge/articles">Articles</Link></h3>
            <p className="mt-2">{home.articles.length ? home.articles.map((item) => item.title).join(", ") : "Essays will appear here as they are published."}</p>
          </article>
        </div>
      </section>
      <section className={`${pad} py-16`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm italic uppercase">Medicinal plants</p>
            <h2 className={display}>{settings.plantsTitle}</h2>
            <p className="mt-4 max-w-4xl text-base leading-base-tight">{settings.plantsLead}</p>
            <p className="mt-4">
              <Link href="/plants">Open the plant library</Link>
              {" · "}
              <Link href="/plants/conservation">Read about conservation</Link>
            </p>
          </div>
          <div>
            {home.plants.length ? (
              <ul className="m-0 list-none p-0">
                {home.plants.map((item, index) => {
                  const photo = photoFor(item.path) || cardPhoto(index);
                  return (
                    <li key={item.id} className="border-b border-border-accented py-4">
                      <Link className="flex items-center gap-4" href={item.path}>
                        <img src={photo.src} alt="" width={96} height={96} className="h-16 w-16 object-cover" />
                        <span>
                          <span className="block text-2xl font-regular">{item.title}</span>
                          <span className="mt-1 block text-base">{item.summary}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>Plant profiles are added one at a time from WordPress. None are public yet.</p>
            )}
          </div>
        </div>
      </section>
      <section className={`${pad} py-8`}>
        <p className="text-sm italic uppercase">Community learning</p>
        <h2 className={display}>Programmes</h2>
        <ChildList parent="/programmes" />
      </section>
      <section className={pad}>
        <div className="grid grid-cols-1 items-center gap-8 border border-border-accented lg:grid-cols-2">
          <img src="/photos/bhringraj.jpg" alt="A white bhringraj flower and green leaves" className="h-96 w-full object-cover" />
          <div className="p-6">
            <p className="text-sm italic uppercase">Medical astrology</p>
            <h2 className={title}>Education only</h2>
            <p className="mt-2">There is no chart order and no payment. The nakshatra page names plants. It does not read a birth chart.</p>
            <p className="mt-4"><Link href="/medical-astrology">Read the introduction</Link></p>
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
      <h1 className={`${display} mt-3 text-text`}>{heading}</h1>
      {summary ? <p className="mt-4 max-w-4xl text-2xl font-regular">{summary}</p> : null}
      {page?.status === "draft" ? <p className="mt-4 border border-border-accented p-4">Draft. Editors can still change this page in WordPress.</p> : null}
      {page?.legalDraft ? <p className="mt-4 border border-border-accented p-4">Draft for legal review. Do not treat this text as a finished policy.</p> : null}
      {route.medical ? (
        <p className="mt-4 border border-border-accented p-4">
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
  return <img src={photo.src} alt={photo.alt} className="mt-8 h-96 w-full object-cover" />;
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
      <div className={`${pad} py-12`}>
        <Body page={page} />
        {route.path === "/medical-astrology/plants-and-nakshatras" ? <NakshatraTable /> : null}
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
        <form className="mt-6 flex flex-col gap-4 md:flex-row md:items-end" method="get">
          <label className="block w-full max-w-xl">
            <span className="mb-1 block text-sm">Search</span>
            <input className="w-full border border-border-accented bg-white px-3 py-2" name="q" defaultValue={search || ""} />
          </label>
          <button className={button} type="submit">Search</button>
        </form>
        {collection.items.length ? (
          <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-8 p-0 lg:grid-cols-3">
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
  const body = (
    <>
      <img src={photo.src} alt="" className="h-64 w-full object-cover" />
      <span className="mt-3 block text-2xl font-regular">{item.title}</span>
      {line ? <span className="mt-1 block text-base">{line}</span> : null}
    </>
  );
  if (external) return <a className="block" href={external}>{body}</a>;
  if (item.type === "publication" || item.type === "event" || item.type === "programme") return <div>{body}</div>;
  return <Link className="block" href={item.path}>{body}</Link>;
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
      <div className={`${pad} py-12`}>
        {item.status === "draft" ? <p className="border border-border-accented p-4">Draft.</p> : null}
        {route.recordType === "plant" ? <PlantFacts item={item} /> : null}
        {route.recordType === "course" ? <CourseFacts item={item} /> : null}
        {item.html ? <div className="prose" dangerouslySetInnerHTML={{ __html: item.html }} /> : null}
        {route.recordType === "course" ? (
          <p className="mt-6"><Link className={button} href={`/courses/apply?course=${item.slug}`}>Apply</Link></p>
        ) : null}
      </div>
    </article>
  );
}

function PlantFacts({ item }: { item: WpItem }) {
  const rows = [
    ["Common name", metaText(item, "commonName")],
    ["Botanical name", metaText(item, "botanicalName")],
    ["Region", metaText(item, "region")],
    ["Traditional context", metaText(item, "uses")],
    ["Cultivation", metaText(item, "cultivationNote")],
    ["Conservation", metaText(item, "conservationNote")],
    ["References", metaText(item, "references")],
  ].filter((row) => row[1]);
  if (!rows.length) return null;
  return (
    <dl className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="border-b border-border-accented pb-3">
          <dt className="text-sm">{label}</dt>
          <dd className="mt-1">{value}</dd>
        </div>
      ))}
    </dl>
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
        <div className={`${pad} py-12`}>
          <Body page={page} />
          <div className="mt-8 max-w-xl">
            <EnquiryForm kind={route.form || "contact"} source={route.path} courses={courses.map((item) => ({ slug: item.slug, title: item.title }))} selectedCourse={course || ""} />
          </div>
        </div>
      )}
    </article>
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
        {route.feature !== "herb" && !youtubeId ? <p className="mt-6">No YouTube episode is attached to this page yet.</p> : null}
      </div>
    </article>
  );
}

function Related({ parent, current }: { parent?: string; current: string }) {
  if (!parent) return null;
  const siblings = childrenOf(parent).filter((child) => child.path !== current).slice(0, 4);
  if (!siblings.length) return null;
  return (
    <>
      <h2 className={`${title} mt-12`}>Also in this section</h2>
      <ul className="m-0 list-none p-0">
        {siblings.map((child) => (
          <li key={child.path} className="border-b border-border-accented py-3">
            <Link href={child.path}>{child.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function ChildList({ parent }: { parent: string }) {
  return (
    <ul className="m-0 mt-8 list-none p-0">
      {childrenOf(parent).map((child) => (
        <li key={child.path} className="border-b border-border-accented py-4">
          <Link className="text-2xl font-regular" href={child.path}>{child.title}</Link>
          <p className="mt-1 text-base">{child.description}</p>
        </li>
      ))}
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
