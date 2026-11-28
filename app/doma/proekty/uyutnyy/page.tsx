import { HouseProjectPage } from '../../../../components/house-project-page';
import { uyutnyy } from '../../../../content/house-project';
import { createPageMetadata } from '../../../../lib/site-metadata';

export const metadata = createPageMetadata({title:'Проект дома «Уютный» — Удачный посёлок',description:'Каркасный одноэтажный дом «Уютный»: 48 м², две спальни и терраса. Планировка, фотографии и расчёт стоимости строительства от 2 810 000 ₽.',path:'/doma/proekty/uyutnyy',image:{src:`${uyutnyy.assetDirectory}/hero.webp`,alt:'Проект загородного дома «Уютный»'}});

export default function Page() { return <HouseProjectPage project={uyutnyy} />; }
