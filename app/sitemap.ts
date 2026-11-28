import type { MetadataRoute } from "next";
import { canonicalUrl, indexable } from "../lib/site-metadata";
import { settlements } from "../content/settlements";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexable && canonicalUrl
    ? ["/", "/doma", "/doma/proekty/uyutnyy", "/doma/proekty/skandi", "/doma/proekty/smayl", "/doma/proekty/panorama", "/poselki", "/o-kompanii", "/investoram", "/partneram", "/kontakty", "/blog", "/pokupatelyam/zemelnyy-sertifikat", "/pokupatelyam/rassrochka", "/pokupatelyam/ipoteka", "/approval", "/newsletter-consent",
      ...settlements.map(({slug}) => `/poselki/${slug}`),
    ].map((path) => ({ url: new URL(path, canonicalUrl).href }))
    : [];
}
