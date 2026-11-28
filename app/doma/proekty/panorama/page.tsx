import { HouseProjectPage } from '../../../../components/house-project-page';
import { panorama } from '../../../../content/house-project';
import { createPageMetadata } from '../../../../lib/site-metadata';

export const metadata = createPageMetadata({title:'Проект дома «Панорама» — Удачный посёлок',description:'Каркасный одноэтажный дом «Панорама»: 91 м², две или три спальни, панорамное остекление и терраса. Три варианта планировки и расчёт строительства от 5 800 000 ₽.',path:'/doma/proekty/panorama',image:{src:`${panorama.assetDirectory}/hero.webp`,alt:'Проект загородного дома «Панорама»'}});

export default function Page() { return <HouseProjectPage project={panorama} />; }
