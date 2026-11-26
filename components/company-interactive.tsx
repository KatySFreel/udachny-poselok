'use client';
import { useCmsCopy } from "./cms-provider";


import { useLayoutEffect, useRef, useState } from 'react';
import { useMediaQuery } from './use-media-query';
import { CarouselControls } from './carousel-controls';
import { companyServices, companyTeam } from '../content/company';
import { sitePath } from '../lib/site-path';
import styles from './company-page.module.css';

export function CompanyServices() {
  const cms = useCmsCopy();
  const companyServices = cms.data("data.companyServices", _cmsSource_companyServices);

  const desktop = useMediaQuery('(width >= 1024px)');
  const [active, setActive] = useState<number | null>(1);
  const Trigger = desktop ? 'div' : 'button';
  return <div className={styles.services}>
    {companyServices.map((service, index) => <div className={styles.service} key={service.title} data-active={active === index} onPointerEnter={event => { if (desktop && event.pointerType === "mouse") setActive(index); }}>
      <Trigger className={styles.serviceTrigger} {...(!desktop ? {
        type: 'button' as const,
        'aria-expanded': active === index,
        'aria-controls': `company-service-${index}`,
        onClick: () => setActive(active === index ? null : index),
      } : {})}>
        <span className={styles.serviceNumber}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.serviceTitle}>{service.title}</span>
        <span className={styles.serviceToggle} aria-hidden="true">{active === index ? '−' : '+'}</span>
      </Trigger>
      <div className={styles.serviceReveal} id={`company-service-${index}`} inert={!desktop && active !== index}><div className={styles.serviceRevealInner}><div className={styles.serviceBody}>
        <span className={styles.serviceImage} data-image={service.image}><img src={sitePath(cms.text(`company-media.service.${service.image}`, `/images/company/${service.image}.webp`))} alt="" width={260} height={260} loading="lazy" /></span>
        <p>{service.description}</p>
      </div></div></div>
    </div>)}
  </div>;
}

export function CompanyTeam() {
  const cms = useCmsCopy();
  const companyTeam = cms.data("data.companyTeam", _cmsSource_companyTeam);

  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const animateScroll = useRef(false);
  const pendingTarget = useRef<number | null>(null);
  const scrollFrame = useRef<number | null>(null);
  activeIndex.current = active;

  useLayoutEffect(() => {
    if (window.matchMedia('(width < 1024px)').matches) {
      setActive(companyTeam.findIndex(person => person.image === 'vladislav'));
    }
  }, []);

  function align(index: number, smooth: boolean) {
    const viewport = rail.current;
    const card = viewport?.children[index + 1] as HTMLElement | undefined;
    if (!viewport || !card || !window.matchMedia('(width < 1024px)').matches) return;
    viewport.scrollTo({ left: card.offsetLeft - (viewport.clientWidth - card.clientWidth) / 2, behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' });
  }
  useLayoutEffect(() => {
    const viewport = rail.current;
    const card = viewport?.children[active + 1] as HTMLElement | undefined;
    const animate = animateScroll.current;
    animateScroll.current = false;
    if (!viewport || !card || !window.matchMedia('(width < 1024px)').matches) return;
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      align(active, false);
      return;
    }
    // Follow the card's changing width so expansion and centering finish together.
    const startLeft = viewport.scrollLeft;
    const startTime = performance.now();
    pendingTarget.current = active;
    viewport.dataset.animating = 'true';
    const frame = (now: number) => {
      const progress = Math.min((now - startTime) / 560, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const target = card.offsetLeft - (viewport.clientWidth - card.clientWidth) / 2;
      viewport.scrollTo({ left: startLeft + (target - startLeft) * eased, behavior: 'instant' });
      if (progress < 1) scrollFrame.current = requestAnimationFrame(frame);
      else {
        scrollFrame.current = null;
        delete viewport.dataset.animating;
        align(active, false);
        pendingTarget.current = null;
      }
    };
    scrollFrame.current = requestAnimationFrame(frame);
    return () => {
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = null;
      delete viewport.dataset.animating;
    };
  }, [active]);
  useLayoutEffect(() => {
    const viewport = rail.current;
    if (!viewport) return;
    let width = viewport.clientWidth;
    let resizeFrame: number | undefined;
    const resize = new ResizeObserver(() => {
      if (width === viewport.clientWidth) return;
      width = viewport.clientWidth;
      interruptScroll();
      viewport.dataset.resizing = 'true';
      align(activeIndex.current, false);
      if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => { delete viewport.dataset.resizing; });
    });
    resize.observe(viewport);
    const settle = () => {
      if (!window.matchMedia('(width < 1024px)').matches || viewport.dataset.animating) return;
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      if (pendingTarget.current !== null) {
        const target = viewport.children[pendingTarget.current + 1] as HTMLElement;
        if (Math.abs(target.offsetLeft + target.clientWidth / 2 - center) < 2) pendingTarget.current = null;
        return;
      }
      const cards = [...viewport.querySelectorAll<HTMLButtonElement>('button')];
      const nearest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft + card.clientWidth / 2 - center) < Math.abs(cards[best].offsetLeft + cards[best].clientWidth / 2 - center) ? index : best, 0);
      if (nearest !== activeIndex.current) {
        animateScroll.current = true;
        setActive(nearest);
      }
    };
    viewport.addEventListener('scrollend', settle);
    return () => { resize.disconnect(); if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame); viewport.removeEventListener('scrollend', settle); };
  }, []);
  function select(index: number) {
    animateScroll.current = true;
    pendingTarget.current = index;
    if (index === activeIndex.current) align(index, true);
    else setActive(index);
  }
  function interruptScroll() {
    pendingTarget.current = null;
    if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = null;
    if (rail.current) delete rail.current.dataset.animating;
  }
  function advance(direction: number) {
    select((activeIndex.current + direction + companyTeam.length) % companyTeam.length);
  }
  const clone = (person: typeof companyTeam[number], side: string) => <div key={side} className={`${styles.person} ${styles.personClone}`} aria-hidden="true"><img src={sitePath(cms.text(`company-media.team.${person.image}`, `/images/company/${person.image}.webp`))} alt="" width={300} height={400} loading="lazy"/></div>;
  return <div className={styles.teamSlider}>
    <div id="company-team" className={styles.teamRail} ref={rail} role="group" aria-label={cms.text("copy.company-interactive.1", "Сотрудники компании")} onPointerDown={interruptScroll} onWheel={interruptScroll} onKeyDown={event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const index = (active + (event.key === 'ArrowRight' ? 1 : -1) + companyTeam.length) % companyTeam.length;
      select(index);
      (rail.current?.children[index + 1] as HTMLElement | undefined)?.focus({preventScroll:true});
    }}>
      {clone(companyTeam[companyTeam.length - 1], 'before')}
      {companyTeam.map((person, index) => <button type="button" key={person.image} className={styles.person} data-active={active === index} aria-label={`${person.name}, ${person.role}`} aria-pressed={active === index} onClick={() => select(index)} onFocus={() => select(index)} onPointerMove={event => { if (event.pointerType === 'mouse' && window.matchMedia('(width >= 1024px)').matches) setActive(index); }}>
        <img src={sitePath(cms.text(`company-media.team.${person.image}`, `/images/company/${person.image}.webp`))} alt="" width={300} height={400} loading="lazy" />
        <span className={styles.personCaption}><strong>{person.name}</strong><span>{person.role}</span></span>
      </button>)}
      {clone(companyTeam[0], 'after')}
    </div>
    <div className={styles.teamCaptionReserve} aria-hidden="true">
      {companyTeam.map(person => <span className={styles.personCaption} key={person.image}><strong>{person.name}</strong><span>{person.role}</span></span>)}
    </div>
    <CarouselControls className={styles.teamControls} viewportId="company-team" label={cms.text("copy.company-interactive.2", "Переключение сотрудников")} previousLabel="Предыдущий сотрудник" nextLabel="Следующий сотрудник" onPrevious={() => advance(-1)} onNext={() => advance(1)} />
  </div>;
}

const _cmsSource_companyServices = companyServices;
const _cmsSource_companyTeam = companyTeam;
