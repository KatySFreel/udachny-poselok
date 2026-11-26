"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Settlement } from '../content/settlements';
import type { NearbyCategory, SettlementSurroundings } from '../content/settlement-surroundings';
import imageBounds from '../content/troitskaya-map-image.json';
import { mapDistanceKm, projectMapPoint, groupMapMarkers } from '../lib/static-map';
import { sitePath } from '../lib/site-path';
import shared from './settlements.module.css';
import styles from './settlement-surroundings-map.module.css';
import { MapMarker } from './map-marker';
import { MapSettlementCard } from './map-settlement-card';
import { mapRoutes } from "../lib/map-routes";
import { ZoomControls } from "./zoom-controls";
import { useOutsideDismiss } from './use-outside-dismiss';
import { useDragPan } from './use-drag-pan';
import panStyles from './pan-viewport.module.css';

const categories: { id: NearbyCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' }, { id: 'medicine', label: 'Медицина' },
  { id: 'education', label: 'Образование' }, { id: 'shops', label: 'Магазины' },
  { id: 'parks', label: 'Парки' }, { id: 'forest', label: 'Лес' },
];
export function SettlementSurroundingsMap({ name, data, settlement }: { name: string; data: SettlementSurroundings; settlement: Pick<Settlement,'slug' | 'location' | 'price'> }) {
  const [category, setCategory] = useState<NearbyCategory | 'all'>('all');
  const [selected, setSelected] = useState<string | null>('village');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState({ width: 0, height: 700 });
  const {dragging,handlers:panHandlers} = useDragPan();
  const [offset, setOffset] = useState({ left:0, top:0 });
  const board = useRef<HTMLDivElement>(null);
  const villageCard = useRef<HTMLElement>(null);
  const objectCard = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const markerRefs = useRef(new Map<string,HTMLButtonElement>());
  const closeButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const visible = useMemo(() => data.points.filter(point => category==='all' || point.category===category),[category,data.points]);
  const aspect = imageBounds.width/imageBounds.height;
  const width = Math.max(size.width,size.height*aspect)*zoom;
  const height = width/aspect;
  const village = projectMapPoint(data,imageBounds,width,height);
  const markers = useMemo(() => groupMapMarkers(visible,imageBounds,width,height),[visible,width,height]);
  const active = visible.find(point => point.id===selected);
  const activeGroup = markers.find(marker=>marker.id===selectedGroup);
  const isVillage = selected==='village';

  useEffect(() => {
    const element = villageCard.current;
    if (!element) return;
    const measure = () => board.current?.style.setProperty('--village-card-height',`${element.offsetHeight}px`);
    const observer = new ResizeObserver(measure); observer.observe(element); measure();
    return () => observer.disconnect();
  },[isVillage]);

  useEffect(() => {
    if (selected || selectedGroup) closeButton.current?.focus({ preventScroll:true });
  },[selected,selectedGroup]);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () => setSize({ width:element.clientWidth,height:element.clientHeight });
    const observer = new ResizeObserver(measure); observer.observe(element); measure();
    return () => observer.disconnect();
  },[]);

  const centerMap = useCallback(() => {
    const element = viewport.current;
    if (!element) return;
    const positions = [projectMapPoint(data,imageBounds,width,height),...markers.map(marker=>({x:marker.x,y:marker.y}))];
    const centerX = (Math.min(...positions.map(p=>p.x))+Math.max(...positions.map(p=>p.x)))/2;
    const centerY = (Math.min(...positions.map(p=>p.y))+Math.max(...positions.map(p=>p.y)))/2;
    element.scrollTo({ left:centerX-element.clientWidth/2,top:centerY-element.clientHeight/2,behavior:'instant' });
  },[data,width,height,markers]);
  useEffect(() => { centerMap(); },[centerMap]);

  function closeDetails() {
    const key = selected || selectedGroup;
    if (key) markerRefs.current.get(key)?.focus({ preventScroll:true });
    setSelected(null); setSelectedGroup(null);
  }
  useOutsideDismiss({
    enabled: !!(selected || selectedGroup),
    refs: [villageCard, objectCard],
    onDismiss: () => { setSelected(null); setSelectedGroup(null); },
    ignore: target => !!board.current?.contains(target) && !!target.closest('[data-marker-group], [data-settlement-pin]'),
  });
  const destination = isVillage?data:active;
  const route = destination ? `https://yandex.ru/maps/?rtext=${isVillage?'':`${data.latitude},${data.longitude}`}~${destination.latitude},${destination.longitude}&rtt=auto` : '';
  const villageRoutes = mapRoutes(name,data);
  const label = categories.find(item=>item.id===category)!.label;

  return <div className={styles.wrapper}>
    <nav className={styles.categories} aria-label="Окружение посёлка">
      {categories.map(item=><button key={item.id} className={shared.chip} type="button" aria-pressed={category===item.id} onClick={()=>{setCategory(item.id);setSelected(null);setSelectedGroup(null);setZoom(1);}}>{item.label}</button>)}
    </nav>
    <div ref={board} className={`shell ${styles.board}`} style={{'--village-x':`${village.x-offset.left}px`,'--village-y':`${village.y-offset.top}px`} as CSSProperties} data-surroundings-map data-category={category} onKeyDown={event=>{if(event.key==='Escape' && (selected || selectedGroup)){event.preventDefault();closeDetails();}}}>
      <div ref={viewport} {...panHandlers} className={`${styles.viewport} ${panStyles.viewport}`} data-dragging={dragging || undefined} role="region" aria-label={`Карта окружения посёлка ${name}. Перемещение перетаскиванием или клавишами со стрелками.`} tabIndex={0}
        onScroll={event=>setOffset({left:event.currentTarget.scrollLeft,top:event.currentTarget.scrollTop})}>
        <div className={styles.plane} style={{width,height}}>
          <img className={styles.background} src={sitePath('/images/settlements/troitskaya-sloboda/surroundings-map.svg')} alt="Карта дорог, населённых пунктов и природных территорий рядом с Троицкой Слободой" width={imageBounds.width} height={imageBounds.height} loading="lazy" decoding="async" draggable={false}/>
          {markers.map(marker=><MapMarker key={marker.id} ref={node=>{
            const keys=[marker.id,...marker.points.map(point=>point.id)];keys.forEach(key=>{if(node)markerRefs.current.set(key,node);else markerRefs.current.delete(key);});
          }} className={styles.marker} style={{left:marker.x,top:marker.y}} type="button" data-marker-group data-poi-ids={marker.points.map(point=>point.id).join(' ')} aria-label={marker.points.length===1?marker.points[0].name:`Показать объекты рядом: ${marker.points.length}`} aria-expanded={selectedGroup===marker.id || marker.points.some(point=>point.id===selected)} onClick={()=>{
            if(marker.points.length===1){setSelected(selected===marker.points[0].id?null:marker.points[0].id);setSelectedGroup(null);}
            else {setSelected(null);setSelectedGroup(selectedGroup===marker.id?null:marker.id);}
          }} pinClassName={styles.pin} badge={marker.points.length>1 && <span className={styles.count}>{marker.points.length}</span>}
            labelClassName={`${styles.markerLabel} ${marker.points.length===1 && marker.points[0].labelLines?styles.twoLineLabel:''} ${Math.abs(marker.x-village.x)<180 && Math.abs(marker.y-village.y)<95?styles.quietLabel:''}`}
            label={marker.points.length===1?(marker.points[0].labelLines?.map(line=><span key={line}>{line}</span>) ?? marker.points[0].name):`${category==='all'?'Объекты рядом':label} · ${marker.points.length}`} />)}
          <MapMarker ref={node=>{if(node)markerRefs.current.set('village',node);else markerRefs.current.delete('village');}} className={`${styles.marker} ${styles.village}`} style={{left:village.x,top:village.y}} data-settlement-pin aria-label={`Показать посёлок ${name}`} aria-expanded={isVillage} onClick={()=>{setSelected(isVillage?null:'village');setSelectedGroup(null);}} label={name} />
        </div>
      </div>
      <button className={styles.reset} type="button" onClick={()=>{setZoom(1);setSelected('village');setSelectedGroup(null);centerMap();}}>Показать посёлок и объекты</button>
      <ZoomControls className={styles.zoomControls} value={zoom} max={2.5} step={.5} onChange={value=>{setSelectedGroup(null);setZoom(value);}} increaseLabel="Приблизить карту" decreaseLabel="Отдалить карту" />
      {isVillage && <MapSettlementCard ref={villageCard} settlement={{...settlement,name:`«${name}»`}} routes={villageRoutes} className={styles.villageCard} titleId={titleId} onClose={closeDetails} href="#settlement-plan" pointer={false} showAction={false} />}
      {(active || activeGroup) && <article ref={objectCard} className={styles.details} aria-labelledby={titleId}>
        <button ref={closeButton} className={styles.close} type="button" aria-label="Закрыть карточку объекта" onClick={closeDetails}><img src={sitePath('/icons/quiz/close.svg')} width={15.5} height={15.5} alt=""/></button>
        <p className={styles.detailCategory}>{activeGroup?'Окружение посёлка':categories.find(item=>item.id===active!.category)!.label}</p>
        <h3 className={shared.cardTitle} id={titleId}>{activeGroup?'Объекты рядом':active!.name}</h3>
        {activeGroup && <ul className={styles.objectList}>{activeGroup.points.map(point=><li key={point.id}><button type="button" data-object-id={point.id} onClick={()=>{setSelected(point.id);setSelectedGroup(null);}}>{point.name}</button></li>)}</ul>}
        {active?.address && <p>{active.address}</p>}
        {active && <p>{mapDistanceKm(data,active).toLocaleString('ru-RU',{maximumFractionDigits:1})} км по прямой от посёлка «{name}»</p>}
        {!activeGroup && <a href={route} target="_blank" rel="noopener noreferrer">Построить маршрут</a>}
      </article>}
      <a className={styles.credit} href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>
    </div>
    <p className={`shell ${styles.caption}`} role="status" aria-live="polite">{visible.length?`${label}: объектов на карте — ${visible.length}. До ${data.radiusKm} км от посёлка.`:`В категории «${label}» пока нет отмеченных объектов.`}</p>
  </div>;
}
