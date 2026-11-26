"use client";
import { useCmsCopy } from "./cms-provider";


import { blogCategories, type BlogPost } from '../content/blog';
import { sitePath, siteSrcSet } from '../lib/site-path';
import shared from './settlements.module.css';
import home from './home-blog.module.css';
import styles from './blog-card.module.css';

export function BlogCard({post,variant = 'home',idPrefix = 'blog'}: {post: BlogPost;variant?: 'home' | 'listing';idPrefix?: string}) {
  const cms = useCmsCopy();
  const blogCategories = cms.data("data.blogCategories", _cmsSource_blogCategories);

  const {slug,category,title} = post;
  const listing = variant === 'listing';
  const image = `/images/blog/${slug}`;
  const titleId = `${idPrefix}-${slug}`;
  const displayTitle = listing ? title.replace(/(^| )(Как|как|в|для) /gu, '$1$2\u00a0') : title;
  const titleParts = listing && slug === 'zemelnyy-sertifikat' ? displayTitle.split(': ') : null;
  return <a className={shared.card} href={sitePath(`/blog/${slug}`)} aria-labelledby={titleId}>
    <div className={`${shared.photoBox} ${listing ? styles.photo : home.photo}`}>
      <picture className={shared.photo}>
        <img src={sitePath(`${image}.webp`)} srcSet={siteSrcSet(`${image}-480.webp 480w, ${image}.webp 890w`)}
          sizes="(width < 768px) calc(100vw - 40px), (width <= 1280px) calc((100vw - 60px) / 2), (width <= 1920px) calc((95.83vw - 60px) / 4), 445px"
          width={890} height={1200} alt="" loading="lazy" decoding="async" />
      </picture>
      <ul className={shared.tags}><li>{blogCategories[category].cardLabel}</li></ul>
    </div>
    <h3 className={shared.cardTitle} id={titleId}>{titleParts ? <>{titleParts[0]}:<br />{titleParts[1]}</> : displayTitle}</h3>
    <span className={shared.arrow} aria-hidden="true" />
  </a>;
}

const _cmsSource_blogCategories = blogCategories;
