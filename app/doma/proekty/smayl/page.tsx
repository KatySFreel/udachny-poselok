import { HouseProjectPage } from '../../../../components/house-project-page';
import { smayl } from '../../../../content/house-project';
import { createPageMetadata } from '../../../../lib/site-metadata';

export const metadata = createPageMetadata({title:'Проект дома «Смайл» — Удачный посёлок',description:'Каркасный одноэтажный дом «Смайл»: 66 м², две спальни, просторная кухня-гостиная и терраса. Планировка, фотографии и расчёт стоимости строительства от 4 700 000 ₽.',path:'/doma/proekty/smayl',image:{src:`${smayl.assetDirectory}/hero.webp`,alt:'Проект загородного дома «Смайл»'}});

export default function Page() { return <HouseProjectPage project={smayl} />; }
