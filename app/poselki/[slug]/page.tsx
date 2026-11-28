import { getCmsCopy } from "../../../lib/cms-store";
import { formatNumber } from "../../../lib/format-number";
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SettlementPage } from '../../../components/settlement-page';
import { getSettlementPage, settlementPages } from '../../../content/settlement-pages';
import { createPageMetadata, localizePageMetadata } from '../../../lib/site-metadata';

export function generateStaticParams() {
  return settlementPages.map(({slug})=>({slug}));
}
export const dynamicParams = false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug}=await params;
  const original=getSettlementPage(slug);
  const cms=await getCmsCopy();
  const data=original ? cms.data(`settlement.${slug}`,original) : null;
  if(!data)return {};
  return localizePageMetadata(createPageMetadata({
    title:`${data.name} — земельные участки | Удачный посёлок`,
    description:`Участки в посёлке «${data.name}» от ${formatNumber(data.startingPrice)} ₽. ${data.location}, ${data.distance}. Генплан, фотографии и запись на просмотр.`,
    path:`/poselki/${slug}`,
    image:{src:cms.text(`settlement-media.${slug}.hero`, `${data.assets}/hero.webp`),alt:`Посёлок ${data.name} с высоты`},
  }), cms, `settlement-${slug}`);
}
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const data=getSettlementPage(slug);
  if(!data)notFound();
  return <SettlementPage data={data}/>;
}
