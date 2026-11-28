import { CmsProvider } from '../components/cms-provider';
import { publishedCmsValues, cmsPreviewPage, getCmsCopy } from '../lib/cms-store';
import { connection } from 'next/server';
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata, localizePageMetadata, indexable, metadataBase } from "../lib/site-metadata";
import { LeadTracking } from "../components/lead-tracking";
import { FormSimulation } from "../components/form-simulation";
import { SiteFonts } from "../components/site-fonts";
import "./hero-poster.css";
import "./globals.css";

const pageTitle = "Удачный посёлок — дома и участки в Ленинградской области";
const pageDescription = "Выберите участок в коттеджном посёлке или постройте дом в Ленинградской области. Земельный сертификат и покупка в рассрочку.";

const baseMetadata: Metadata = {
  metadataBase,
  robots: { index: indexable, follow: indexable },
  ...createPageMetadata({title:pageTitle,description:pageDescription,path:'/',siteName:'Удачный посёлок',image:{src:'/images/home-aerial-1440.webp',alt:'Коттеджный посёлок в Ленинградской области с высоты'}}),
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  if (process.env.PAGES_PREVIEW !== '1') await connection();
  const cmsValues = await publishedCmsValues();
  const previewPage = await cmsPreviewPage();
  return (
    <html lang="ru">
      <head>
        <SiteFonts />
        <noscript>
          <style>{".hero .hero__background img, .hero .hero__content > *, .hero .hero__offers, [data-cover-motion] > :is(img, h1), [data-cover-motion] [data-cover-part] { animation: none !important; }"}</style>
        </noscript>
      </head>
      <body>
        {previewPage && <div role="status" style={{position:"fixed",bottom:16,left:16,right:16,zIndex:9999,padding:"12px 20px",background:"var(--brown)",color:"var(--cream)",font:"14px var(--body-font)",borderRadius:6}}>Предпросмотр черновика: {previewPage.title}. Посетители видят опубликованную версию. <a href="?" style={{textDecoration:"underline"}}>Закрыть предпросмотр</a></div>}
        <CmsProvider values={cmsValues}><FormSimulation><LeadTracking>{children}</LeadTracking></FormSimulation></CmsProvider>
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "home");
}
