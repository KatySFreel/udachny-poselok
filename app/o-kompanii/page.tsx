
import { getCmsCopy } from "../../lib/cms-store";
import { ProjectCards } from "../../components/project-cards";
import { SitePage } from "../../components/site-page";
import type { Metadata } from 'next';
import { SectionHeading } from '../../components/section-heading';
import { ActionLink } from '../../components/action';
import { HomeExcursion } from '../../components/home-excursion';
import { CompanyServices, CompanyTeam } from '../../components/company-interactive';
import { CompanyIntroMotion, CompanyStats } from '../../components/company-motion';
import { sitePath } from '../../lib/site-path';
import { createPageMetadata } from '../../lib/site-metadata';
import shared from '../../components/settlements.module.css';
import styles from '../../components/company-page.module.css';

const title = 'О компании «Удачный посёлок» — участки в Ленинградской области';
const description = 'Создаём загородные посёлки с 2018 года. Помогаем выбрать участок, оформить его в собственность и подготовиться к строительству дома.';
const baseMetadata: Metadata = createPageMetadata({title,description,path:'/o-kompanii'});
const photos = [ ['hero-meadow','Участок с табличкой в летнем лугу'], ['hero-road','Зимняя дорога в посёлке'], ['hero-forest','Прогулка по лесной дороге'], ['hero-sunset','Заснеженная дорога вдоль елей'] ] as const;

export default async function CompanyPage() {
  const cms = await getCmsCopy();
  const photos = cms.data("local.o-kompanii.photos", _cmsSource_photos);

  return <SitePage className={styles.page} coverId="company-cover" mainId="company-main" motion={<CompanyIntroMotion />}>

      <section className={`shell ${styles.hero}`} id="company-cover" aria-labelledby="company-title">
        <div className={shared.sectionLabel}>{cms.text("copy.o-kompanii.1", "О нас")}</div>
        <h1 id="company-title">{cms.text("copy.o-kompanii.2", "Удачный посёлок")}</h1>
        <div className={styles.heroComposition}>
          <div className={styles.heroPhotos}>{photos.map(([name,alt],i)=><img key={name} className={styles[`heroPhoto${i+1}`]} data-company-parallax src={sitePath(cms.text(`company-media.hero.${name}`, `/images/company/${name}.webp`))} alt={alt} width={i===0||i===3?207:147} height={i===0||i===3?276:196} fetchPriority={i===0?'high':undefined} />)}</div>
          <div className={styles.emblem} aria-hidden="true">
            <svg className={styles.emblemRing} viewBox="0 0 280 280" width={280} height={280}>
              <defs><path id="company-emblem-circle" d="M 140,30 a 110,110 0 1,1 0,220 a 110,110 0 1,1 0,-220"/></defs>
              <text><textPath href="#company-emblem-circle" textLength={691.15} lengthAdjust="spacing">{cms.text("copy.o-kompanii.3", "УДАЧНЫЙ ПОСЕЛОК УДАЧНЫЙ ПОСЕЛОК ")}</textPath></text>
            </svg>
            <img src={sitePath('/icons/logo-symbol.svg')} alt="" width={91.87} height={106}/>
          </div>
        </div>
        <div className={styles.heroIntro}>
          <h2>{cms.text("copy.o-kompanii.4", "Дом начинается")}<br/>{cms.text("copy.o-kompanii.5", "с ")}<em>{cms.text("copy.o-kompanii.6", "правильно выбранного")}</em> {cms.text("copy.o-kompanii.7", " участка")}</h2>
          <p><span>{cms.text("copy.o-kompanii.8", "«Удачный посёлок»")}</span> {cms.text("copy.o-kompanii.9", " — девелопер загородных посёлков")}<br className={styles.desktopBreak}/> {cms.text("copy.o-kompanii.10", " в Ленинградской области. Помогаем выбрать участок, оформить")}<br className={styles.desktopBreak}/> {cms.text("copy.o-kompanii.11", " его в собственность и подготовиться к строительству дома.")}</p>
          <ActionLink href={sitePath('/poselki')} arrow>{cms.text("copy.o-kompanii.12", "Посмотреть посёлки")}</ActionLink>
        </div>
      </section>
      <CompanyStats/>
      <section className={`shell ${styles.mission}`} aria-labelledby="company-mission-title">
        <img className={styles.missionPhoto} src={sitePath(cms.text("copy.o-kompanii.13", '/images/company/mission.webp'))} alt={cms.text("copy.o-kompanii.14", "Луг и лес в Ленинградской области")} width={1280} height={853} loading="lazy"/>
        <div className={styles.missionPanel} data-reveal><img className={styles.missionWatermark} src={sitePath(cms.text("copy.o-kompanii.15", "/images/footer/watermark.svg"))} alt="" width={208} height={248} loading="lazy"/>
          <div className={shared.sectionLabel}>{cms.text("copy.o-kompanii.16", "Для чего мы работаем?")}</div>
          <h2 id="company-mission-title"><span className={styles.missionDesktopTitle}><span>{cms.text("copy.o-kompanii.17", "Чтобы своё место")}</span><span>{cms.text("copy.o-kompanii.18", "за городом стало ")}<em>{cms.text("copy.o-kompanii.19", "понятным")}</em></span><span><em>{cms.text("copy.o-kompanii.20", "и посильным решением")}</em></span></span><span className={styles.missionMobileTitle}>{cms.text("copy.o-kompanii.21", "Понятный и посильный путь ")}<em>{cms.text("copy.o-kompanii.22", "к своему месту за городом")}</em></span></h2>
          <div className={styles.missionCopy}><p>{cms.text("copy.o-kompanii.23", "У каждой семьи свои представления о загородной жизни.")}<br className={styles.desktopBreak}/> {cms.text("copy.o-kompanii.24", " Для одних это дача, сад и выходные с детьми. Для других — первый собственный участок или дом для постоянного проживания.")}</p><p>{cms.text("copy.o-kompanii.25", "Наша задача — помочь выбрать землю, которая подходит именно вам: по расположению, бюджету, окружению и возможностям дальнейшего обустройства.")}</p></div>
        </div>
      </section>
      <section className={`shell ${styles.servicesSection}`} aria-labelledby="company-services-title">
        <SectionHeading label={cms.text("copy.o-kompanii.26", "Наши услуги")} id="company-services-title">{cms.text("copy.o-kompanii.27", "Чем мы можем ")}<em>{cms.text("copy.o-kompanii.28", "помочь")}</em></SectionHeading>
        <CompanyServices/>
      </section>
      <section className={styles.teamSection} aria-labelledby="company-team-title">
        <div className={`shell ${styles.teamIntro}`}>
          <SectionHeading label={cms.text("copy.o-kompanii.29", "Наша команда")} id="company-team-title">{cms.text("copy.o-kompanii.30", "Люди, которые помогают")}<br/><em>{cms.text("copy.o-kompanii.31", "разобраться")}</em></SectionHeading>
          <div className={styles.teamCopy}>
            <p>{cms.text("copy.o-kompanii.32", "Выбор земли связан с вопросами, с которыми многие сталкиваются впервые. Как сравнить участки? Какие документы понадобятся? Что учесть перед строительством?")}</p>
            <img src={sitePath(cms.text("copy.o-kompanii.33", '/images/company/team-office.webp'))} alt={cms.text("copy.o-kompanii.34", "Специалисты компании работают в офисе")} width={1200} height={800} loading="lazy"/>
            <p>{cms.text("copy.o-kompanii.35", "Специалисты по подбору участков, оформлению сделок и строительству ответят на ваши вопросы и объяснят, что нужно сделать на каждом этапе.")}</p>
          </div>
        </div>
        <CompanyTeam/>
      </section>
      <section className={`shell ${styles.projects}`} aria-labelledby="company-projects-title">
        <SectionHeading label={cms.text("copy.o-kompanii.36", "Наши посёлки")} id="company-projects-title">{cms.text("copy.o-kompanii.37", "Познакомьтесь с результатами")}<br/><em>{cms.text("copy.o-kompanii.38", "нашей работы")}</em></SectionHeading>
        <p className={styles.projectsDescription}><span className={styles.projectsDesktopCopy}>{cms.text("copy.o-kompanii.39", "Посмотрите, какие посёлки мы уже создали, и сравните варианты")}<br className={styles.desktopBreak}/> {cms.text("copy.o-kompanii.40", " в продаже по расположению, окружению и условиям покупки.")}</span><span className={styles.projectsMobileCopy}>{cms.text("copy.o-kompanii.41", "С 2018 года развиваем загородные посёлки в Ленинградской области. За это время реализовали 17 посёлков и продали более 1 500 участков.")}</span></p>
        <ProjectCards/>
      </section>
      <HomeExcursion variant="about"/>
  </SitePage>;
}

const _cmsSource_photos = photos;

export async function generateMetadata() {
  const cms = await getCmsCopy();
  const title = cms.text("seo.o-kompanii.title", "О компании «Удачный посёлок» — участки в Ленинградской области");
  const description = cms.text("seo.o-kompanii.description", "Создаём загородные посёлки с 2018 года. Помогаем выбрать участок, оформить его в собственность и подготовиться к строительству дома.");
  return { ...baseMetadata, title, description, openGraph: { ...baseMetadata.openGraph, title, description }, twitter: { ...baseMetadata.twitter, title, description } };
}
