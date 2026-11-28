import { constructionProjects } from './houses';
import type { LeadFormDefinition } from '../lib/lead-attribution';

export const uyutnyy = {
  slug: 'uyutnyy',
  name: 'Уютный',
  price: '2 810 000 ₽',
  area: '48 м²',
  assetDirectory: '/images/house-projects/uyutnyy',
  heroPhotos: ['view-1.webp','view-2.webp','view-3.webp','view-4.webp'],
  shadeHero: false,
  planDrawing: {width:1292,height:1662,rotate:true},
  description: 'Одноэтажный загородный дом с классической архитектурой, светлой деревянной отделкой и уютной террасой. Простая форма и продуманная планировка делают проект удобным для комфортного проживания и отдыха на природе.',
  features: [
    {icon:'material',value:'Каркас',label:'Материал стен'},
    {icon:'area',value:'48 м²',label:'Общая площадь'},
    {icon:'size',value:'6 × 8 м',label:'Габариты'},
    {icon:'stairs',value:'1 этаж',label:'Этажность'},
    {icon:'bed',value:'2',label:'Спальни'},
    {icon:'bath',value:'1',label:'Санузлы'},
  ],
  rooms: [
    {name:'Терраса',area:'11,85 м²'},
    {name:'Кухня-гостиная',area:'16,21 м²'},
    {name:'Санузел',area:'2,85 м²'},
    {name:'Спальня 1',area:'6,15 м²'},
    {name:'Спальня 2',area:'6,15 м²'},
  ],
  recommendations: constructionProjects.filter(house => ['smayl','panorama','norman'].includes(house.slug)),
} as const;

export const houseCalculation: LeadFormDefinition = {id:'uyutnyy-calculation',name:'Расчёт строительства — Уютный',requestType:'construction'};
export const houseQuiz: LeadFormDefinition = {id:'house-project-quiz',name:'Подбор проекта дома — квиз',requestType:'house-quiz'};
export const houseAsset = (name: string) => name.startsWith('/') ? name : `/images/house-projects/uyutnyy/${name}`;

export const completedHouses = [
  {name:'Дом с деревянным фасадом',cover:'completed-4-1.webp',photos:['completed-4-1.webp','/images/construction/calculation.webp','completed-4-3.webp','completed-4-4.webp','completed-4-5.webp']},
  {name:'Дом в натуральном дереве',cover:'completed-1-1.webp',photos:['completed-1-1.webp','completed-1-2.webp']},
  {name:'Дом с красным фасадом',cover:'completed-2-1.webp',photos:['completed-2-1.webp','completed-2-2.webp']},
  {name:'Дом с тёмным фасадом',cover:'completed-3-1.webp',photos:['completed-3-1.webp','completed-3-2.webp','completed-3-3.webp','completed-3-4.webp','completed-3-5.webp']},
];

export type HouseProject = {
  slug: string;
  name: string;
  price: string;
  area: string;
  description: string;
  assetDirectory: string;
  heroPhotos: readonly string[];
  shadeHero: boolean;
  planDrawing: {width:number;height:number;rotate:boolean};
  planVisualization?: {width:number;height:number};
  features: readonly {icon:string;value:string;label:string}[];
  rooms: readonly {name:string;area:string}[];
  planVariants?: readonly {id:string;label:string;drawing:string;visualization:string;drawingWidth:number;drawingHeight:number;rotate?:boolean;slotRatio?:number}[];
  recommendations: typeof constructionProjects;
};

export const skandi: HouseProject = {
  slug: 'skandi', name: 'Сканди', price: '4 550 000 ₽', area: '66 м²',
  description: 'Современный одноэтажный загородный дом с продуманной планировкой и лаконичной архитектурой. Панорамное остекление и удобные габариты делают проект удобным для комфортного проживания и использования участка.',
  assetDirectory: '/images/house-projects/skandi',
  heroPhotos: ['hero.webp','view-2.webp','view-3.webp','view-4.webp'],
  shadeHero: true,
  planDrawing: {width:1850,height:1210,rotate:false},
  features: uyutnyy.features.map(feature => ({...feature,value:feature.icon === 'area' ? '66 м²' : feature.icon === 'size' ? '6 × 11 м' : feature.value})),
  rooms: [{name:'Терраса',area:'13,68 м²'},{name:'Кухня-гостиная',area:'26,53 м²'},{name:'Санузел',area:'4,18 м²'},{name:'Спальня 1',area:'7,63 м²'},{name:'Спальня 2',area:'7,63 м²'}],
  recommendations: constructionProjects.filter(house => ['uyutnyy','skandi'].includes(house.slug)),
};

export function projectAsset(project: HouseProject, name: string) {
  return name.startsWith('/') ? name : `${project.assetDirectory}/${name}`;
}
export function projectCalculation(project: HouseProject): LeadFormDefinition {
  return {id:`${project.slug}-calculation`,name:`Расчёт строительства — ${project.name}`,requestType:'construction'};
}

export const smayl: HouseProject = {
  slug: 'smayl', name: 'Смайл', price: '4 700 000 ₽', area: '66 м²',
  description: 'Уютный загородный дом с уютной террасой для спокойного отдыха на природе. Просторная кухня-гостиная площадью почти 25 м² создаёт комфортное пространство для семейных вечеров, а две отдельные спальни позволяют каждому сохранить личное пространство. Лаконичная планировка сочетает функциональность, уют и всё необходимое для загородной жизни.',
  assetDirectory: '/images/house-projects/smayl',
  planVisualization: {width:1920,height:1080},
  heroPhotos: ['hero.webp','view-2.webp','view-3.webp','view-4.webp'],
  shadeHero: true,
  planDrawing: {width:1956,height:1382,rotate:false},
  features: uyutnyy.features.map(feature => ({...feature,value:feature.icon === 'area' ? '66 м²' : feature.icon === 'size' ? '9 × 6 м' : feature.value})),
  rooms: [{name:'Терраса',area:'12 м²'},{name:'Кухня-гостиная',area:'24,8 м²'},{name:'Санузел',area:'3,9 м²'},{name:'Спальня 1',area:'8,2 м²'},{name:'Спальня 2',area:'8,2 м²'}],
  recommendations: constructionProjects.filter(house => ['uyutnyy','skandi'].includes(house.slug)),
};

export const panorama: HouseProject = {
  slug: 'panorama', name: 'Панорама', price: '5 800 000 ₽', area: '91 м²',
  description: 'Современный загородный дом с панорамным остеклением и тёплой деревянной отделкой. Просторная терраса расширяет жилое пространство и создаёт комфортную зону отдыха, а архитектура дома гармонично сочетается с природным окружением.',
  assetDirectory: '/images/house-projects/panorama',
  planVisualization: {width:1920,height:1080},
  heroPhotos: ['hero.webp','view-2.webp','view-3.webp'],
  shadeHero: true,
  planDrawing: {width:718,height:1062,rotate:true},
  features: uyutnyy.features.map(feature => ({...feature,value:feature.icon === 'area' ? '91 м²' : feature.icon === 'size' ? '12 × 8,5 м' : feature.icon === 'bed' ? '2 / 3' : feature.value})),
  rooms: [{name:'Терраса',area:'14,0 м²'},{name:'Кухня-гостиная',area:'27,79 м²'},{name:'Санузел',area:'4,21 м²'},{name:'Спальня 1',area:'12,46 м²'},{name:'Спальня 2',area:'8,21 м²'},{name:'Тех. помещение',area:'3,19 м²'},{name:'Гардеробная',area:'2,16 м²'}],
  planVariants: [
    {id:'two-rooms',label:'2 Комнаты',drawing:'drawing.webp',visualization:'visualization.webp',drawingWidth:718,drawingHeight:1062,rotate:true,slotRatio:1090/737.14},
    {id:'three-rooms',label:'3 Комнаты',drawing:'drawing-3.webp',visualization:'visualization-3.webp',drawingWidth:1448,drawingHeight:1086,slotRatio:1090/810},
    {id:'three-rooms-terrace',label:'3 Комнаты + Терраса',drawing:'drawing-3-terrace.webp',visualization:'visualization-3-terrace.webp',drawingWidth:1551,drawingHeight:1014,slotRatio:1090/725},
  ],
  recommendations: constructionProjects.filter(house => ['uyutnyy','skandi'].includes(house.slug)),
};
