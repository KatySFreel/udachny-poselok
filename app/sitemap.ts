import type { MetadataRoute } from "next";
import { canonicalUrl, indexable } from "../lib/site-metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexable && canonicalUrl
    ? ["/", "/poselki"].map((path) => ({ url: new URL(path, canonicalUrl).href }))
    : [];
}
