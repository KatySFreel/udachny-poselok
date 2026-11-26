"use client";
import { useCmsCopy } from "./cms-provider";


import { ImageStack } from './image-stack';
import { ActionLabel } from './action';
import { sitePath } from '../lib/site-path';
import styles from './project-cards.module.css';

export function ProjectCards({ subduedCompleted = false }: { subduedCompleted?: boolean }) {
  const cms = useCmsCopy();

  return <div className={styles.projectGrid}>
    {([{title:<>{cms.text("copy.project-cards.1", "Посёлки")}<br/>{cms.text("copy.project-cards.2", "в продаже")}</>,href:'/poselki',photo:'projects-sale',label:cms.text("copy.project-cards.3", 'Посёлки в продаже'),thumbs:'sale'},
      {title:<>{cms.text("copy.project-cards.4", "Реализованные")}<br/>{cms.text("copy.project-cards.5", "посёлки")}</>,href:'/poselki#completed-settlements',photo:'projects-completed',label:cms.text("copy.project-cards.6", 'Реализованные посёлки'),thumbs:'completed'}] as const).map(project =>
      <a className={styles.projectCard} key={project.photo} href={sitePath(project.href)} aria-label={project.label}>
        <div className={styles.projectInfo}><div><ImageStack className={styles.projectThumbs} images={[1,2,3,4].map(n => `/images/projects/${project.thumbs}-thumb-${n}.webp`)} size={72}/><h3>{project.title}</h3></div><ActionLabel arrow variant={subduedCompleted && project.thumbs === 'completed' ? 'light' : 'primary'}>{cms.text("copy.project-cards.7", "Смотреть")}</ActionLabel></div>
        <img className={styles.projectPhoto} src={sitePath(`/images/company/${project.photo}.webp`)} alt="" width={431} height={350} loading="lazy"/>
      </a>)}
  </div>;
}
