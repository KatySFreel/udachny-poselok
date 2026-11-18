import type { Metadata } from "next";
import type { ReactNode } from "react";
import { canonicalUrl, indexable, metadataBase } from "../lib/site-metadata";
import { sitePath } from "../lib/site-path";
import { SiteFonts } from "../components/site-fonts";
import "./hero-poster.css";
import "./globals.css";

const pageTitle = "Удачный посёлок — дома и участки в Ленинградской области";
const pageDescription = "Выберите участок в коттеджном посёлке или постройте дом в Ленинградской области. Земельный сертификат и покупка в рассрочку.";

export const metadata: Metadata = {
  metadataBase,
  robots: { index: indexable, follow: indexable },
  ...(indexable && canonicalUrl ? { alternates: { canonical: new URL("/", canonicalUrl) } } : {}),
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    siteName: "Удачный посёлок",
    title: pageTitle,
    description: pageDescription,
    ...(metadataBase ? {
      url: new URL(sitePath("/"), metadataBase),
      images: [{
        url: new URL(sitePath("/images/home-aerial-1440.webp"), metadataBase),
        alt: "Коттеджный посёлок в Ленинградской области с высоты",
      }],
    } : {}),
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <SiteFonts />
        <noscript>
          <style>{".hero .hero__background img, .hero .hero__content > *, .hero .hero__offers { animation: none !important; }"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
