import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageScreen } from "@/components/Views";
import { resolve, staticPaths } from "@/lib/routes";

type Props = { params: Promise<{ slug?: string[] }>; searchParams: Promise<{ q?: string; course?: string }> };

export function generateStaticParams() {
  return [{ slug: [] as string[] }, ...staticPaths().filter((path) => path !== "/").map((path) => ({ slug: path.split("/").filter(Boolean) }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = slug?.length ? `/${slug.join("/")}` : "/";
  const resolved = resolve(path);
  if (!resolved) return { title: "Page not found" };
  return {
    title: resolved.kind === "home" ? { absolute: "Dr Arun Chandan · Ayurveda, medicinal plants and livelihoods" } : resolved.title,
    description: resolved.description,
    alternates: { canonical: path },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const path = slug?.length ? `/${slug.join("/")}` : "/";
  if (!resolve(path)) notFound();
  return <PageScreen path={path} search={query.q} course={query.course} />;
}

export const dynamicParams = true;
