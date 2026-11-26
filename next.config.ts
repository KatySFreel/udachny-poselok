import type { NextConfig } from "next";

const pagesPreview = process.env.PAGES_PREVIEW === "1";
const basePath = pagesPreview ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

const config: NextConfig = {
  experimental:{serverActions:{bodySizeLimit:'12mb'}},
  ...(pagesPreview && {
    basePath,
    output: "export",
    trailingSlash: true,
    turbopack: { resolveAlias: { "@quiz-transport": "./lib/quiz-preview.ts", "@plan-actions": "./lib/plan-preview.ts", "@admin-actions": "./lib/admin-preview.ts" } },
  }),
};

export default config;
