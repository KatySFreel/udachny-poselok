import type { MetadataRoute } from "next";
import { canonicalUrl, indexable } from "../lib/site-metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // Crawlers must be able to read the preview's noindex meta tag.
    rules: { userAgent: "*", allow: "/" },
    ...(indexable && canonicalUrl ? { sitemap: new URL("/sitemap.xml", canonicalUrl).href } : {}),
  };
}
