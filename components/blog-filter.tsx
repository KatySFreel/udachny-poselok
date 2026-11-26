"use client";
import { useCmsCopy } from "./cms-provider";


import { useEffect, useRef, useState, type ReactNode } from "react";
import { FilterChips } from "./filter-chips";
import { blogCategories } from "../content/blog";
import styles from "./home-blog.module.css";
import shared from "./settlements.module.css";
import listing from './blog-page.module.css';

const categories = ["all", "news", "articles"] as const;
type Category = keyof typeof blogCategories;

export function BlogFilter({
  cards,
  catalog,
  variant = 'home',
}: {
  cards: readonly { id: string; category: Category; card: ReactNode }[];
  catalog?: ReactNode;
  variant?: 'home' | 'listing';
}) {
  const cms = useCmsCopy();
  const blogCategories = cms.data("data.blogCategories", _cmsSource_blogCategories);

  const [selected, setSelected] = useState<Category | "all">("all");
  const resultsRef = useRef<HTMLDivElement>(null);
  const visible = selected === "all" ? cards : cards.filter(({ category }) => category === selected);
  const resultsId = variant === 'listing' ? 'blog-results' : 'home-blog-results';

  useEffect(() => {
    const results = resultsRef.current;
    if (variant !== 'listing' || !results) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      const entering = entries.filter(entry => entry.isIntersecting);
      entering.forEach((entry,index) => {
        observer.unobserve(entry.target);
        if (reduced.matches || document.activeElement && entry.target.contains(document.activeElement)) return;
        const animation = entry.target.animate([
          {opacity:0,transform:'translateY(24px)'},
          {opacity:1,transform:'translateY(0)'},
        ], {duration:650,delay:Math.min(index,3) * 70,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, {rootMargin:'0px 0px -24px'});
    results.querySelectorAll(':scope > ul > li, :scope > p').forEach(card => observer.observe(card));
    const cancel = () => animations.forEach(animation => animation.cancel());
    const focus = (event: FocusEvent) => animations.forEach(animation => {
      const target = (animation.effect as KeyframeEffect | null)?.target;
      if (target instanceof Element && event.target instanceof Node && target.contains(event.target)) animation.cancel();
    });
    reduced.addEventListener('change',cancel);
    results.addEventListener('focusin',focus);
    return () => {observer.disconnect();cancel();reduced.removeEventListener('change',cancel);results.removeEventListener('focusin',focus);};
  }, [selected,variant]);

  return (
    <>
      <FilterChips className={variant === 'listing' ? `${shared.scrollFilters} ${listing.filters}` : undefined} items={categories.map(id => ({id,label:id === 'all' ? cms.text("copy.blog-filter.1", 'Все') : blogCategories[id].label}))} value={selected} onChange={setSelected} label={cms.text("copy.blog-filter.2", "Категория публикаций")} controls={resultsId} />
      <p className={shared.resultStatus} role="status">{visible.length ? `Публикаций: ${visible.length}` : cms.text("copy.blog-filter.3", 'В этой категории пока нет публикаций.')}</p>
      <div ref={resultsRef} id={resultsId} className={variant === 'listing' ? 'shell' : undefined}>
        {visible.length > 0 ? (
          <ul className={`${shared.grid} ${variant === 'listing' ? listing.grid : styles.grid}`} data-category={selected}>
            {visible.map(({ id, card }) => <li key={id}>{card}</li>)}
            {catalog && <li>{catalog}</li>}
          </ul>
        ) : (
          <p className={styles.empty} role="status">{cms.text("copy.blog-filter.4", "В этой категории пока нет публикаций.")}</p>
        )}
      </div>
    </>
  );
}

const _cmsSource_blogCategories = blogCategories;
