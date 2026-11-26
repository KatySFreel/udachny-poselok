import { getCmsCopy } from "../../../lib/cms-store";
import { formatNumber } from "../../../lib/format-number";
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SettlementPage } from '../../../components/settlement-page';
import { getSettlementPage, settlementPages } from '../../../content/settlement-pages';

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
  return {title:cms.text(`seo.settlement-${slug}.title`, `${data.name} — земельные участки | Удачный посёлок`),description:cms.text(`seo.settlement-${slug}.description`, `Участки в посёлке «${data.name}» от ${formatNumber(data.startingPrice)} ₽. ${data.location}, ${data.distance}. Генплан, фотографии и запись на просмотр.`),alternates:{canonical:`/poselki/${slug}`}};
}
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const data=getSettlementPage(slug);
  if(!data)notFound();
  return <SettlementPage data={data}/>;
}
