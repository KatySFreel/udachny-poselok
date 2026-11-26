"use client";
import { useCmsCopy } from "./cms-provider";


import { leadTrigger } from '../lib/lead-attribution';
import { sitePath } from '../lib/site-path';
import { ActionButton } from './action';
import shared from './settlements.module.css';
import styles from './settlement-page.module.css';

const visits = {
  visit: {
    title: <>Проводим экскурсии <em>каждые выходные</em></>,
    description:'Выберите удобную дату. Согласуем время, отправим маршрут и покажем участки, которые подходят по вашим параметрам.',
    tag:'В посёлке',image:'visit',alt:'Дорога в посёлке',label:'Записаться на просмотр',mobileLabel:'Записаться на просмотр',buttonId:'settlement-excursion-visit',variant:'primary',
  },
  'online-visit': {
    title: <>Посмотрите участок <em>по видеосвязи</em></>,
    description:'Если пока не получается приехать, проведём индивидуальный онлайн-показ. Менеджер выйдет на связь из посёлка, покажет выбранный участок и ответит на ваши вопросы.',
    tag:'По видеосвязи',image:'online-visit',alt:'Онлайн-показ участка по видеосвязи',label:'Записаться на онлайн-просмотр',mobileLabel:'Записаться на онлайн',buttonId:'settlement-online-visit',variant:'light',
  },
} as const;
export function SettlementVisitCard({kind,slug,assets}: {kind:keyof typeof visits;slug:string;assets:string}) {
  const cms = useCmsCopy();
  const visits = cms.data("local.settlement-visit-card.visits", _cmsSource_visits);

  const visit = visits[kind];
  const formId = `${slug}-${kind}`;
  const open = {commandfor:formId,command:"show-modal"};
  return <article data-reveal>
    <div className={styles.visitCopy}>
      <h3 className={shared.cardTitle}>{kind === 'visit' ? <>{cms.text('settlement-visits.visit.title', 'Проводим экскурсии ')}<em>{cms.text('settlement-visits.visit.accent', 'каждые выходные')}</em></> : <>{cms.text('settlement-visits.online.title', 'Посмотрите участок ')}<em>{cms.text('settlement-visits.online.accent', 'по видеосвязи')}</em></>}</h3>
      <p>{visit.description}</p>
    </div>
    <figure className={styles.visitMedia}>
      <img src={sitePath(cms.text(`settlement-media.${slug}.${visit.image}`, `${assets}/${visit.image}.webp`))} alt={visit.alt} loading="lazy" />
      <figcaption className={styles.visitTag}>{visit.tag}</figcaption>
    </figure>
    <ActionButton arrow variant={visit.variant} aria-label={visit.label} {...open} {...leadTrigger(formId,{buttonId:visit.buttonId,buttonLabel:visit.label,placement:'visits'},{continueFrom:slug})}>
      <span className={styles.visitDesktopLabel}>{visit.label}</span>
      <span className={styles.visitMobileLabel}>{visit.mobileLabel}</span>
    </ActionButton>
  </article>;
}

const _cmsSource_visits = visits;
