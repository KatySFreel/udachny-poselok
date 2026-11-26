'use client';
import { useCmsCopy } from "./cms-provider";


import { formatNumber } from "../lib/format-number";


import { companyMetrics } from '../content/company';
import { useEffect, useRef } from 'react';
import styles from './company-page.module.css';

/** Scroll updates stay outside React and stop when the cover leaves the viewport. */
export function CompanyIntroMotion() {
  useEffect(() => {
    const cover = document.getElementById('company-cover');
    const photos = Array.from(cover?.querySelectorAll<HTMLElement>('[data-company-parallax]') ?? []);
    if (!cover || !photos.length) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const factors = [0.045, -0.03, 0.035, -0.045];
    const offsets = photos.map(() => 0);
    let targets = photos.map(() => 0);
    let frame = 0;
    let lastTime = 0;
    let visible = true;

    function draw(time: number) {
      frame = 0;
      if (!visible || reduced.matches || document.hidden) return;
      const smoothing = 1 - Math.exp(-Math.min(lastTime ? time - lastTime : 16, 64) / 100);
      lastTime = time;
      let moving = false;
      photos.forEach((photo, index) => {
        const difference = targets[index] - offsets[index];
        offsets[index] = Math.abs(difference) < 0.04 ? targets[index] : offsets[index] + difference * smoothing;
        photo.style.setProperty('--company-photo-offset', `${offsets[index].toFixed(3)}px`);
        if (Math.abs(difference) >= 0.04) moving = true;
      });
      if (moving) frame = requestAnimationFrame(draw);
    }
    function update() {
      if (reduced.matches || document.hidden) return;
      const bounds = cover!.getBoundingClientRect();
      visible = bounds.bottom > 0 && bounds.top < innerHeight;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        return;
      }
      const cap = innerWidth < 768 ? 8 : innerWidth < 1024 ? 16 : 24;
      targets = factors.map(factor => Math.max(-cap, Math.min(cap, -bounds.top * factor)));
      if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(draw);
      }
    }
    function resetMotion() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      offsets.fill(0);
      photos.forEach(photo => photo.style.removeProperty('--company-photo-offset'));
      if (!reduced.matches) update();
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('visibilitychange', resetMotion);
    reduced.addEventListener('change', resetMotion);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      document.removeEventListener('visibilitychange', resetMotion);
      reduced.removeEventListener('change', resetMotion);
      photos.forEach(photo => photo.style.removeProperty('--company-photo-offset'));
    };
  }, []);
  return null;
}


function formatStatistic(index: number, value: number) {
  return index === 1 ? `С ${value} года` : `${formatNumber(value)}${index === 2 ? '+' : ''}`;
}

export function CompanyStats() {
  const cms = useCmsCopy();

  const companyMetrics = cms.data("data.companyMetrics", _cmsSource_companyMetrics);
  const statistics = [
  { value: companyMetrics.completedSettlements, from: 0, duration: 1550, label: String(companyMetrics.completedSettlements), description: cms.text("company.stats.completed", "Реализованных посёлков") },
  { value: companyMetrics.sinceYear, from: 2000, duration: 1750, label: `С ${companyMetrics.sinceYear} года`, description: <>{cms.text("company.stats.since", "Работаем на рынке загородной")}<br/>{cms.text("company.stats.market", "недвижимости")}</> },
  { value: companyMetrics.landowners, from: 0, duration: 1950, label: `${formatNumber(companyMetrics.landowners).replace(/\u00a0/g," ")}+`, description: cms.text("company.stats.clients", "довольных клиентов") },
] as const;

  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const cards = Array.from(section.current?.children ?? []) as HTMLElement[];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new Set<Element>();
    const frames = new Map<Element, number>();
    function finish(card: HTMLElement, index: number) {
      const value = card.querySelector<HTMLElement>('[data-company-count-value]');
      if (value) value.textContent = formatStatistic(index, statistics[index].value);
      const frame = frames.get(card);
      if (frame !== undefined) cancelAnimationFrame(frame);
      frames.delete(card);
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || reduced.matches || seen.has(entry.target)) return;
        const card = entry.target as HTMLElement;
        const index = cards.indexOf(card);
        const output = card.querySelector<HTMLElement>('[data-company-count-value]');
        if (index < 0 || !output) return;
        seen.add(card);
        observer.unobserve(card);
        const statistic = statistics[index];
        const started = performance.now();
        output.textContent = formatStatistic(index, statistic.from);
        function tick(time: number) {
          const progress = Math.min(1, (time - started) / statistic.duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          output!.textContent = formatStatistic(index, Math.round(statistic.from + (statistic.value - statistic.from) * eased));
          if (progress < 1) frames.set(card, requestAnimationFrame(tick));
          else finish(card, index);
        }
        frames.set(card, requestAnimationFrame(tick));
      });
    }, { threshold: 0.45 });
    function motionChanged() {
      cards.forEach(finish);
      observer.disconnect();
      if (!reduced.matches) cards.forEach((card, index) => {
        if (seen.has(card)) return;
        const output = card.querySelector<HTMLElement>('[data-company-count-value]');
        if (output) output.textContent = formatStatistic(index, statistics[index].from);
        observer.observe(card);
      });
    }
    motionChanged();
    reduced.addEventListener('change', motionChanged);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', motionChanged);
      cards.forEach(finish);
    };
  }, []);
  return <section className={`shell ${styles.stats}`} aria-label={cms.text("copy.company-motion.1", "Компания в цифрах")} ref={section}>
    {statistics.map((statistic, index) => <div key={statistic.value}>
      <strong><span className={styles.counterAccessible}>{statistic.label}</span><span className={styles.counterVisual} aria-hidden="true"><span className={styles.counterReserve}>{statistic.label}</span><span data-company-count-value>{formatStatistic(index, statistic.value)}</span></span></strong>
      <p>{statistic.description}</p>
    </div>)}
  </section>;
}

const _cmsSource_companyMetrics = companyMetrics;
