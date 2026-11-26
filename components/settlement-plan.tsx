"use client";
import { useOutsideDismiss } from "./use-outside-dismiss";

import { formatNumber } from "../lib/format-number";


import type { CSSProperties } from 'react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { readPublicPlan } from '@plan-actions';
import { AerialSettlementPlan } from './aerial-settlement-plan';
import type { Plot, PlotStatus, SettlementPageData } from '../content/settlement-pages';
import { leadTrigger, settlementLeadForm } from "../lib/lead-attribution";
import { sitePath } from '../lib/site-path';
import { ActionButton } from './action';
import { AnimatedDialog } from './animated-dialog';
import { DialogCloseButton } from './contact-dialog';
import { useMediaQuery } from "./use-media-query";
import { ZoomControls } from "./zoom-controls";
import { useDragPan } from './use-drag-pan';
import panStyles from './pan-viewport.module.css';
import styles from './settlement-page.module.css';

const labels: Record<PlotStatus,string> = {available:'Свободен',reserved:'Забронирован',sold:'Продан',unknown:'Уточнить наличие',construction:'С подрядным строительством',unavailable:'Недоступен'};

export function SettlementPlan({ data }: { data: SettlementPageData }) {
  const [current,setCurrent]=useState(data);
  useEffect(()=>{let active=true;readPublicPlan(data.slug).then(saved=>{if(active&&saved)setCurrent({...data,plan:saved.plans[0],additionalPlans:saved.plans.slice(1)});}).catch(()=>{});return ()=>{active=false;};},[data]);
  return current.plan.appearance==='aerial'?<AerialSettlementPlan data={current}/>:<LegacySettlementPlan data={current}/>;
}

function LegacySettlementPlan({ data }: { data: SettlementPageData }) {
  const plans = [data.plan, ...(data.additionalPlans ?? [])];
  const [planIndex, setPlanIndex] = useState(0);
  const plan = plans[planIndex];
  const interactive = plan.plots.length > 0;
  const inlinePan = useDragPan();
  const expandedPan = useDragPan();
  const [selected, setSelected] = useState<Plot | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const desktop = useMediaQuery('(min-width: 1024px)');
  useEffect(() => { setFiltersOpen(desktop); },[desktop]);
  const [filters, setFilters] = useState<{minArea?:number;maxArea?:number;minPrice?:number;maxPrice?:number;statuses:string[]}>({statuses:[]});
  const full = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const inlineCard = useRef<HTMLElement>(null);
  const expandedCard = useRef<HTMLElement>(null);
  const filterPanel = useRef<HTMLDetailsElement>(null);
  useOutsideDismiss({ enabled: !!selected, refs: [inlineCard, expandedCard], onDismiss: () => setSelected(null) });
  useOutsideDismiss({ enabled: filtersOpen && !desktop, refs: [filterPanel], onDismiss: () => setFiltersOpen(false) });
  const id = useId();
  const matching = plan.plots.filter(plot => {
    if (filters.statuses.length && !filters.statuses.includes(plot.status)) return false;
    if (filters.minArea !== undefined && (plot.area === undefined || plot.area < filters.minArea)) return false;
    if (filters.maxArea !== undefined && (plot.area === undefined || plot.area > filters.maxArea)) return false;
    if (filters.minPrice !== undefined && (plot.price === undefined || plot.price < filters.minPrice)) return false;
    if (filters.maxPrice !== undefined && (plot.price === undefined || plot.price > filters.maxPrice)) return false;
    return true;
  });
  const ids = new Set(matching.map(p=>p.id));
  const filtered = filters.statuses.length > 0 || Object.entries(filters).some(([key,value])=>key!=='statuses' && value!==undefined);
  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const number = (key:string) => String(values.get(key) ?? '').trim() ? Number(values.get(key)) : undefined;
    setFilters({minArea:number('minArea'),maxArea:number('maxArea'),minPrice:number('minPrice'),maxPrice:number('maxPrice'),statuses:values.getAll('status').map(String)});
    setSelected(null);
  }
  function reset() { form.current?.reset(); setFilters({statuses:[]}); setSelected(null); }
  function artwork(expanded = false) {
    const pan = expanded ? expandedPan : inlinePan;
    return <div {...pan.handlers} className={`${styles.planViewport} ${panStyles.viewport} ${expanded ? styles.expandedViewport : ''}`} data-dragging={pan.dragging || undefined} tabIndex={0} role="region" aria-label={`Генплан ${data.name}. Перемещение перетаскиванием или клавишами со стрелками.`}>
      <svg className={styles.planArt} style={{"--plan-zoom":zoom} as CSSProperties} viewBox={`0 0 ${plan.width} ${plan.height}`} aria-label={`Генплан ${plan.label ?? data.name}`}>
        <image href={plan.backgroundDataUrl??sitePath(`${data.assets}/${plan.image}.${plan.imageExtension??'webp'}`)} width={plan.width} height={plan.height} />
        <g aria-hidden="true">{plan.plots.map(plot=><polygon key={plot.id} points={plot.points.map(p=>p.join(',')).join(' ')} fill="white" stroke="#929292" strokeWidth={2}/>)}</g>
        {plan.plots.map(plot => {
          const x=plot.points.reduce((n,p)=>n+p[0],0)/plot.points.length;
          const y=plot.points.reduce((n,p)=>n+p[1],0)/plot.points.length;
          return <g key={plot.id} role="button" tabIndex={ids.has(plot.id) ? 0 : -1}
            aria-label={`Участок ${plot.number}, ${labels[plot.status]}${plot.area ? `, ${plot.area} соток` : ''}${plot.price ? `, ${formatNumber(plot.price)} рублей` : ''}`}
            aria-pressed={selected?.id === plot.id} data-status={plot.status} data-dimmed={!ids.has(plot.id) || undefined}
            className={styles.plot} onClick={()=>setSelected(plot)} onKeyDown={event=>{
              if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelected(plot);}
            }}>
            <polygon points={plot.points.map(point=>point.join(',')).join(' ')} />
            <text x={x} y={plot.area ? y-20 : y+8} textAnchor="middle">{plot.number}</text>
            {plot.area && <>
              <rect x={x-38} y={y-12} width={76} height={28} rx={14} />
              <text className={styles.plotArea} x={x} y={y+9} textAnchor="middle">{plot.area.toLocaleString('ru-RU')} сот</text>
              <text className={styles.plotPrice} x={x} y={y+40} textAnchor="middle">{plot.price ? `${formatNumber(plot.price)}₽` : ''}</text>
            </>}
          </g>;
        })}
      </svg>
    </div>;
  }
  function controls(expanded=false) {
    return <ZoomControls className={styles.planControls} label="Масштаб генплана" value={zoom} max={3} step={.25} onChange={setZoom} increaseLabel="Увеличить генплан" decreaseLabel="Уменьшить генплан">
      <button type="button" onClick={()=>setZoom(1)} aria-label="Сбросить масштаб">1:1</button>
      {!expanded && <button type="button" onClick={()=>full.current?.showModal()} aria-label="Развернуть генплан">⛶</button>}
    </ZoomControls>;
  }
  function card(expanded=false) {
    return selected && <article ref={expanded ? expandedCard : inlineCard} className={styles.plotDetails} aria-labelledby={`${id}-selected-${expanded}`}>
      <button type="button" className={styles.smallClose} aria-label="Закрыть участок" onClick={()=>setSelected(null)}>×</button>
      <p>{labels[selected.status]}</p><h3 id={`${id}-selected-${expanded}`}>Участок № {selected.number}</h3>
      <dl><div><dt>Площадь</dt><dd>{selected.area ? `${selected.area.toLocaleString('ru-RU')} соток` : 'Уточняется'}</dd></div>
        <div><dt>Стоимость</dt><dd>{selected.price ? `${formatNumber(selected.price)} ₽` : 'Уточняется'}</dd></div></dl>
      <button type="button" className="action action--primary action--text"
        {...leadTrigger(settlementLeadForm('visit',data.slug,data.name).id, {buttonId:expanded ? 'plan-fullscreen-visit' : 'plan-visit',buttonLabel:'Записаться на просмотр',placement:'plan',plotId:selected.id,plotNumber:selected.number})}
        onClick={() => {
          full.current?.close();
          const request = document.getElementById(`${data.slug}-visit`);
          if (request instanceof HTMLDialogElement) request.showModal();
        }}>Записаться на просмотр</button>
    </article>;
  }
  return <div data-reveal>
    {plans.length > 1 && <div className={styles.planTabs} role="group" aria-label="Выбор генплана">
      {plans.map((item,index) => <button type="button" key={item.image} aria-pressed={planIndex === index} onClick={() => {setPlanIndex(index);setZoom(1);setSelected(null);reset();}}>{item.label ?? data.name}</button>)}
    </div>}
    <div className={styles.planLayout} data-static={!interactive || undefined}>
    {interactive && <details ref={filterPanel} className={styles.filterDetails} open={filtersOpen} onToggle={event=>setFiltersOpen(event.currentTarget.open)}>
      <summary>Фильтры</summary>
      <form className={styles.plotFilters} ref={form} onSubmit={apply}>
        <h3>Фильтры</h3>
        <fieldset><legend>Площадь участка, сотки</legend><div className={styles.rangeFields}>
          <label>От<input aria-label="Площадь от" name="minArea" type="number" min="0" max="1000" step="0.1" placeholder="6" /></label>
          <label>До<input aria-label="Площадь до" name="maxArea" type="number" min="0" max="1000" step="0.1" placeholder="20" /></label>
        </div></fieldset>
        <fieldset><legend>Стоимость, ₽</legend><div className={styles.rangeFields}>
          <label>От<input aria-label="Стоимость от" name="minPrice" type="number" min="0" step="1000" placeholder="1 000 000" /></label>
          <label>До<input aria-label="Стоимость до" name="maxPrice" type="number" min="0" step="1000" placeholder="5 000 000" /></label>
        </div></fieldset>
        <fieldset><legend>Статусы</legend>{(['available','reserved','sold'] as const).map(status=><label className={styles.statusChoice} key={status}><input type="checkbox" name="status" value={status}/><i data-status={status}/>{labels[status]}</label>)}</fieldset>
        <ActionButton type="submit">Применить</ActionButton>
        {filtered && <><p className={styles.filterCount} role="status">{matching.length ? `Найдено участков: ${matching.length}` : 'По этим параметрам участков нет'}</p><button type="button" className={styles.resetFilters} onClick={reset}>Сбросить фильтры</button></>}
      </form>
    </details>}
    <div className={styles.planBoard}>{artwork()}{controls()}{card()}</div>
    <AnimatedDialog ref={full} className={styles.fullPlan} aria-label="Генплан на весь экран">
      <DialogCloseButton/>{artwork(true)}{controls(true)}{card(true)}
    </AnimatedDialog>
    </div>
  </div>;
}
