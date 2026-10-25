import type { MetadataRoute } from "next";
import { staticPaths } from "@/lib/routes";
import { getCollection } from "@/lib/wp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = new Set(staticPaths());
  const [articles, plants, courses] = await Promise.all([
    getCollection({ type: "article" }),
    getCollection({ type: "plant" }),
    getCollection({ type: "course" }),
  ]);
  for (const item of [...articles.items, ...plants.items, ...courses.items]) {
    if (item.status === "publish") paths.add(item.path);
  }
  return [...paths].map((path) => ({
    url: `https://arunchandan.com${path === "/" ? "" : path}`,
    lastModified: new Date(),
  }));
}
