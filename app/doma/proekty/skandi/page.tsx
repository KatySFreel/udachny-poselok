import { HouseProjectPage } from '../../../../components/house-project-page';
import { skandi } from '../../../../content/house-project';
import { createPageMetadata } from '../../../../lib/site-metadata';

export const metadata = createPageMetadata({title:'Проект дома «Сканди» — Удачный посёлок',description:'Каркасный одноэтажный дом «Сканди»: 66 м², две спальни, панорамные окна и терраса. Планировка, фотографии и расчёт стоимости строительства от 4 550 000 ₽.',path:'/doma/proekty/skandi',image:{src:`${skandi.assetDirectory}/hero.webp`,alt:'Проект загородного дома «Сканди»'}});

export default function Page() { return <HouseProjectPage project={skandi} />; }
