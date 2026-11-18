export const canonicalUrl = process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined;
export const indexable = Boolean(canonicalUrl) && process.env.PAGES_PREVIEW !== "1";
export const metadataBase = indexable ? canonicalUrl
  : process.env.PREVIEW_URL ? new URL(process.env.PREVIEW_URL) : undefined;
