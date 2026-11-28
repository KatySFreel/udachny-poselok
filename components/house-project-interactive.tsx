"use client";

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { houseAsset, completedHouses, uyutnyy, projectAsset, projectCalculation, type HouseProject } from '../content/house-project';
import { sitePath } from '../lib/site-path';
import { SectionHeading } from './section-heading';
import { FilterChips } from './filter-chips';
import { AnimatedDialog } from './animated-dialog';
import { DialogCloseButton, InlineRequestForm } from './contact-dialog';
import { useMediaQuery } from './use-media-query';
import { usePhotoSlideshow } from './use-photo-slideshow';
import { CarouselControls } from './carousel-controls';
import { CrossfadePhoto } from './crossfade-photo';
import styles from './house-project.module.css';

export function HouseCalculationForm({project = uyutnyy}: {project?: HouseProject}) {
  const includeEmail = useMediaQuery('(width > 1280px)');
  return <InlineRequestForm definition={projectCalculation(project)} includeEmail={includeEmail} submitLabel="Получить расчёт" />;
}

function Thumbnails({photos,selected,onSelect,label,className = ''}: {photos:readonly string[];selected:number;onSelect:(index:number)=>void;label:string;className?:string}) {
  const rail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = rail.current;
    const active = row?.querySelector('[aria-pressed="true"]');
    if (!row || !active) return;
    const bounds = row.getBoundingClientRect();
    const photo = active.getBoundingClientRect();
    const delta = photo.left < bounds.left ? photo.left - bounds.left : Math.max(0,photo.right - bounds.right);
    if (delta) row.scrollBy({left:delta,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  },[selected]);
  return <div ref={rail} className={`${styles.thumbnails} ${className}`} role="group" aria-label={label}>
    {photos.map((photo,index) => <button key={photo} type="button" aria-label={`Фотография ${index + 1}`} aria-pressed={index === selected} onClick={() => onSelect(index)}>
      <img src={sitePath(houseAsset(photo))} alt="" width={250} height={141} loading="lazy" />
    </button>)}
  </div>;
}

export function HouseProjectHero({project = uyutnyy}: {project?: HouseProject}) {
  const heroPhotos = project.heroPhotos;
  const asset = (name: string) => projectAsset(project,name);
  const container = useRef<HTMLElement>(null);
  const {selected,select} = usePhotoSlideshow({container,count:heroPhotos.length});
  return <section ref={container} className={styles.hero} id="house-cover" data-cover-motion aria-labelledby="house-title" style={{'--hero-photo-count':heroPhotos.length} as CSSProperties}>
    <div className={styles.heroBackground} data-cover-parallax data-shaded={project.shadeHero || selected !== 0 || undefined}>
      <CrossfadePhoto photos={['hero.webp',...heroPhotos.slice(1)].map(asset)} selected={selected} mobileSource={asset('hero.webp')} alt={`Загородный дом «${project.name}» с террасой`} width={1920} height={1080} priority />
    </div>
    <div className={styles.heroContent}>
      <div className={styles.heroTitle}><p>Проект дома</p><h1 id="house-title">{project.name}</h1></div>
      <ul className={styles.heroTags}>
        <li><img src={sitePath(houseAsset('area-light.svg'))} alt="" width={24} height={24} />Общая площадь: {project.area}</li>
        <li><img src={sitePath(houseAsset('wallet.svg'))} alt="" width={20} height={20} />От {project.price}</li>
      </ul>
    </div>
    <div className={styles.mobileHeroPhoto}><CrossfadePhoto photos={heroPhotos.map(asset)} selected={selected} alt={`Дом «${project.name}» — ракурс ${selected + 1}`} width={1181} height={880} /></div>
    <Thumbnails photos={heroPhotos.map(asset)} selected={selected} onSelect={select} label={`Ракурсы проекта «${project.name}»`} className={styles.heroThumbnails} />
  </section>;
}

export function HouseProjectPlan({project = uyutnyy}: {project?: HouseProject}) {
  const [view, setView] = useState<'drawing'|'visualization'>('drawing');
  const [variantId,setVariantId] = useState(project.planVariants?.[0]?.id ?? '');
  const variant = project.planVariants?.find(item => item.id === variantId);
  const drawing = variant ? {width:variant.drawingWidth,height:variant.drawingHeight,rotate:variant.rotate} : project.planDrawing;
  const planFile = variant ? variant[view] : `${view}.webp`;
  const drawingSlotRatio = project.planVariants?.length
    ? Math.min(...project.planVariants.map(item => item.slotRatio ?? 1067 / 828))
    : undefined;
  const ratio = view === 'drawing' ? drawingSlotRatio : 1090 / 737.14;
  const visualization = project.planVisualization ?? {width:1254,height:1254};
  const slotStyle = {
    '--plan-visualization-ratio': visualization.width / visualization.height,
    ...(variant ? {'--plan-slot-ratio':ratio,'--plan-rotated-width':`${100 / (ratio ?? 1)}%`,'--plan-rotated-height':`${100 * (ratio ?? 1)}%`} : {}),
  } as CSSProperties;
  return <section className={`shell ${styles.section}`} aria-labelledby="house-plan-title">
    <SectionHeading stackedOnTablet label="Планировка" id="house-plan-title">Внутреннее пространство дома</SectionHeading>
    <FilterChips items={[{id:'drawing',label:'Чертёж'},{id:'visualization',label:'Визуализация'}]} value={view} onChange={setView} label="Вид планировки" controls="house-plan-content" />
    <div className={styles.plan} id="house-plan-content">
      <div className={styles.planImage} data-view={view} data-rotate={drawing.rotate || undefined} data-variants={variant ? true : undefined} style={slotStyle}>
        <div className={styles.planSlot}><img src={sitePath(projectAsset(project,planFile))} alt={view === 'drawing' ? `Чертёж дома «${project.name}»${variant ? ` — ${variant.label}` : ": две спальни, кухня-гостиная, санузел и терраса"}` : `Объёмная визуализация планировки дома «${project.name}» с мебелью${variant ? ` — ${variant.label}` : ""}`} width={view === 'drawing' ? drawing.width : visualization.width} height={view === 'drawing' ? drawing.height : visualization.height} loading="lazy" /></div>
        {project.planVariants && <FilterChips items={project.planVariants} value={variantId} onChange={setVariantId} label="Вариант планировки" controls="house-plan-content" className={styles.planVariantFilters} />}
      </div>
      <div className={styles.rooms}>
        <h3>Помещения и площади</h3><p>Детализация планировочного решения</p>
        <dl>{project.rooms.map(room => <div key={room.name}><dt>{room.name}</dt><dd>{room.area}</dd></div>)}</dl>
      </div>
    </div>
  </section>;
}

export function CompletedHouseGallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [isOpen,setIsOpen] = useState(false);
  const [house, setHouse] = useState(0);
  const selectedHouse = completedHouses[house];
  const {selected:photo,select:setPhoto,move} = usePhotoSlideshow({container:dialog,count:selectedHouse.photos.length,enabled:isOpen});
  function open(index:number) { setHouse(index);setPhoto(0);setIsOpen(true);dialog.current?.showModal(); }
  return <section className={`shell ${styles.section}`} aria-labelledby="house-built-title">
    <SectionHeading stackedOnTablet label="Реализованные проекты" id="house-built-title">Дома, которые мы <em>уже построили</em></SectionHeading>
    <ul className={styles.completedGrid}>{completedHouses.map((item,index) => <li key={item.name}>
      <button type="button" className={styles.completedCard} onClick={() => open(index)} aria-label={`Открыть фотографии: ${item.name}`} aria-haspopup="dialog">
        <img src={sitePath(houseAsset(item.cover))} alt={item.name} width={1280} height={853} loading="lazy" />
        <span><img src={sitePath(houseAsset('collection.svg'))} alt="" width={24} height={24} /></span>
      </button>
    </li>)}</ul>
    <AnimatedDialog ref={dialog} data-house-gallery className={styles.galleryDialog} aria-label={`Фотогалерея: ${selectedHouse.name}`} onClose={() => setIsOpen(false)} onKeyDown={event => {
      if(event.key === 'ArrowLeft') {event.preventDefault();move(-1);}
      if(event.key === 'ArrowRight') {event.preventDefault();move(1);}
    }}>
      <DialogCloseButton />
      <div className={styles.galleryPhoto} id="completed-house-photo">
        <CrossfadePhoto key={house} photos={selectedHouse.photos.map(houseAsset)} selected={photo} alt={`${selectedHouse.name}, фотография ${photo + 1} из ${selectedHouse.photos.length}`} width={1280} height={853} />
        <Thumbnails photos={selectedHouse.photos} selected={photo} onSelect={setPhoto} label="Фотографии построенного дома" />
      </div>
      <CarouselControls viewportId="completed-house-photo" label="Перелистывание фотографий" previousLabel="Предыдущая фотография" nextLabel="Следующая фотография" onPrevious={() => move(-1)} onNext={() => move(1)} />
      <p className={styles.visuallyHidden} aria-live="polite">Фотография {photo + 1} из {selectedHouse.photos.length}</p>
    </AnimatedDialog>
  </section>;
}
