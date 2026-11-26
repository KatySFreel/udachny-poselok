import type { MetadataRoute } from "next";
import { canonicalUrl, indexable } from "../lib/site-metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexable && canonicalUrl
    ? ["/", "/poselki", "/o-kompanii", "/pokupatelyam/ipoteka", "/pokupatelyam/rassrochka", "/pokupatelyam/zemelnyy-sertifikat", "/poselki/istorii-severa", "/poselki/bereg-tigody", "/poselki/divnyy", "/poselki/severnyy-bereg", "/poselki/zelenyy-les", "/poselki/simo"].map((path) => ({ url: new URL(path, canonicalUrl).href }))
    : [];
}
