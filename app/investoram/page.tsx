import { ResponsiveImage } from "../../components/responsive-image";

import { getCmsCopy } from "../../lib/cms-store";
import { SitePage } from '../../components/site-page';
import { SectionHeading } from '../../components/section-heading';
import { ProjectCards } from '../../components/project-cards';
import { ImageStack } from '../../components/image-stack';
import { ActionLink } from '../../components/action';
import { PhotoFormPanel } from '../../components/photo-form-panel';
import { InlineRequestForm } from '../../components/contact-dialog';
import { leadForms, leadTrigger } from '../../lib/lead-attribution';
import { createPageMetadata, localizePageMetadata } from '../../lib/site-metadata';
import { sitePath } from '../../lib/site-path';
import styles from '../../components/investors-page.module.css';
import formPanel from '../../components/photo-form-panel.module.css';
import splitCover from '../../components/split-cover.module.css';

const baseMetadata = createPageMetadata({title:'Инвесторам — Удачный посёлок',description:'Инвестиции в земельные проекты «Удачного посёлка» в Ленинградской области. Обсудите условия инвестирования и получите предложение на вашу сумму вложений.',path:'/investoram'});

export default async function InvestorsPage() {
  const cms = await getCmsCopy();

  return <SitePage className={styles.page} coverId="investors-cover" mainId="investors-main">
    <section className={`shell ${styles.hero} ${splitCover.hero}`} id="investors-cover" data-cover-motion aria-labelledby="investors-title">
      <div className={`${styles.heroIntro} ${splitCover.intro}`}>
        <div className={styles.yield} data-cover-part="description"><ImageStack className={styles.yieldPhotos} images={[cms.text("copy.investoram.1", '/images/investors/yield-1.webp'),cms.text("copy.investoram.2", '/images/investors/yield-2.webp')]} size={72}/><span>{cms.text("copy.investoram.3", "До 31% годовых")}</span></div>
        <h1 id="investors-title" data-cover-part="title"><span>{cms.text("copy.investoram.4", "Инвестиции в земельные")}</span><span>{cms.text("copy.investoram.5", "проекты ")}<em>{cms.text("copy.investoram.6", "«Удачного посёлка»")}</em></span></h1>
        <p data-cover-part="description">{cms.text("copy.investoram.7", "Оставьте заявку — расскажем о проектах в Ленинградской области и подготовим предложение на вашу сумму вложений.")}</p>
      </div>
      <div className={`${styles.heroPhoto} ${splitCover.photo}`} data-cover-image data-cover-parallax><ResponsiveImage src={cms.text("copy.investoram.8", '/images/investors/aerial.webp')} sizes="(width < 768px) 205vw, (width < 1024px) 100vw, 45vw" alt={cms.text("copy.investoram.9", "Земельные участки и дороги посёлка с высоты")} width={4032} height={2268} fetchPriority="high"/></div>
      <ActionLink data-cover-part="actions" href="#investor-meeting" arrow {...leadTrigger(leadForms.investors.id,{buttonId:'investors-hero',buttonLabel:cms.text("copy.investoram.10", 'Получить предложение'),placement:'hero'})}>{cms.text("copy.investoram.11", "Получить предложение")}</ActionLink>
    </section>
    <section className={`shell ${styles.projects}`} aria-labelledby="investors-projects-title">
      <SectionHeading id="investors-projects-title" label={cms.text("copy.investoram.12", "Наш опыт")} accent="red">{cms.text("copy.investoram.13", "Познакомьтесь с результатами")}<br/><em>{cms.text("copy.investoram.14", "нашей работы")}</em></SectionHeading>
      <p className={styles.projectsDescription}>{cms.text("copy.investoram.15", "С 2018 года развиваем загородные посёлки в Ленинградской области. За это время реализовали 17 посёлков и продали более 1 500 участков.")}</p>
      <ProjectCards subduedCompleted/>
    </section>
    <section className={`shell ${formPanel.section} ${styles.meeting}`} id="investor-meeting" aria-labelledby="investor-meeting-title">
      <PhotoFormPanel variant="office" image={{src:cms.text("copy.investoram.16", '/images/investors/office.webp'),alt:cms.text("copy.investoram.17", 'Офис «Удачного посёлка» с фирменным знаком над диваном'),width:1448,height:1086}}
        photoCaption={<span><img src={sitePath('/icons/office-location-filled.svg')} width={16} height={21.0055} alt=""/><span>{cms.text("copy.investoram.18", "Встретиться можно в нашем офисе:")}<br/>{cms.text("copy.investoram.19", "Санкт-Петербург, Московский проспект, 91, офис 702")}</span></span>}
        intro={<><h2 id="investor-meeting-title">{cms.text("copy.investoram.20", "Обсудите условия ")}<em>{cms.text("copy.investoram.21", "инвестирования")}</em></h2><p>{cms.text("copy.investoram.22", "Расскажите, какую сумму и на какой срок")}<br className={styles.desktopBreak}/> {cms.text("copy.investoram.23", " вы рассматриваете")}</p></>}>
        <InlineRequestForm definition={leadForms.investors} submitLabel={cms.text("copy.investoram.24", "Записаться на встречу")}/>
      </PhotoFormPanel>
    </section>
  </SitePage>;
}

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "investoram");
}
