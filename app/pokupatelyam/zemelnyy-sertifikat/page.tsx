import { ResponsiveImage } from "../../../components/responsive-image";

import { getCmsCopy } from "../../../lib/cms-store";
import { SitePage } from "../../../components/site-page";
import type { Metadata } from 'next';
import { Fragment, type CSSProperties } from 'react';
import reveal from '../../../components/card-reveal.module.css';
import { SectionHeading } from '../../../components/section-heading';
import { ActionLink } from '../../../components/action';
import { PhotoFormPanel } from '../../../components/photo-form-panel';
import { InlineRequestForm } from '../../../components/contact-dialog';
import { leadForms, leadTrigger } from '../../../lib/lead-attribution';
import { sitePath } from '../../../lib/site-path';
import { createPageMetadata, localizePageMetadata } from '../../../lib/site-metadata';
import styles from '../../../components/certificate-page.module.css';
import formPanel from '../../../components/photo-form-panel.module.css';
import buyerHero from '../../../components/buyer-hero.module.css';

const title = 'Земельный сертификат — Удачный посёлок';
const description = 'Поможем подобрать участок в Ленинградской области, разобраться в порядке использования земельного сертификата и оформить землю в собственность.';
const baseMetadata: Metadata = createPageMetadata({title,description,path:'/pokupatelyam/zemelnyy-sertifikat'});

const steps = [
  'Подбираем варианты и приглашаем на просмотр',
  'Уточняем условия вашего сертификата и пожелания к участку',
  'Согласовываем стоимость и порядок расчётов',
  'Помогаем подготовить документы и оформить участок',
  'Сопровождаем подготовку документов для использования сертификата',
];

export default async function CertificatePage() {
  const cms = await getCmsCopy();
  const steps = cms.data("local.zemelnyy-sertifikat.steps", _cmsSource_steps);

  return <SitePage className={styles.page} coverId="certificate-cover" mainId="certificate-main">

      <section className={`shell ${styles.hero} ${buyerHero.hero}`} id="certificate-cover" data-cover-motion aria-labelledby="certificate-title">
        <div className={styles.heroIntro}>
          <h1 id="certificate-title" data-cover-part="title">{cms.text("copy.zemelnyy-sertifikat.1", "Ваш семейный участок — ")}<em>{cms.text("copy.zemelnyy-sertifikat.2", "с Земельным сертификатом")}</em></h1>
          <p data-cover-part="description">{cms.text("copy.zemelnyy-sertifikat.3", "Поможем подобрать участок в Ленинградской области, разобраться в порядке использования сертификата и оформить землю в собственность.")}</p>
        </div>
        <div className={`${styles.heroPhoto} ${buyerHero.photo}`} data-cover-image data-cover-parallax><ResponsiveImage src={cms.text("copy.zemelnyy-sertifikat.4", '/images/certificate/family-forest.webp')} sizes="100vw" alt={cms.text("copy.zemelnyy-sertifikat.5", "Семья с детьми гуляет в лесу возле загородного дома")} width={2000} height={3000} fetchPriority="high" /></div>
        <ActionLink data-cover-part="actions" href="#certificate-consultation" arrow {...leadTrigger(leadForms.certificate.id,{buttonId:"certificate-hero",buttonLabel:cms.text("copy.zemelnyy-sertifikat.6", "Подобрать участок по сертификату"),placement:"hero"})}>{cms.text("copy.zemelnyy-sertifikat.7", "Подобрать участок по сертификату")}</ActionLink>
      </section>

      <section className={`shell ${styles.experience}`} aria-labelledby="certificate-experience-title">
        <SectionHeading label={cms.text("copy.zemelnyy-sertifikat.8", "Опыт, которому доверяют семьи")} id="certificate-experience-title" accent="red">{cms.text("copy.zemelnyy-sertifikat.9", "С 2018 года помогаем")}<br/><em>{cms.text("copy.zemelnyy-sertifikat.10", "многодетным семьям")}</em> {cms.text("copy.zemelnyy-sertifikat.11", " приобретать землю")}</SectionHeading>
        <div className={styles.experienceBody}>
          <div className={styles.experiencePhoto}><img src={sitePath(cms.text("copy.zemelnyy-sertifikat.12", '/images/certificate/family-lake.webp'))} alt={cms.text("copy.zemelnyy-sertifikat.13", "Мама с детьми на прогулке у озера")} width={1000} height={1500} loading="lazy" /></div>
          <p className={styles.experienceCopy}>{cms.text("copy.zemelnyy-sertifikat.14", "Мы знаем, сколько вопросов возникает при первой покупке земли. Объясняем последовательность действий, помогаем подготовить документы и сопровождаем сделку до регистрации собственности.")}</p>
          <div className={styles.stat}><strong>1 000+</strong><p>{cms.text("copy.zemelnyy-sertifikat.15", "Семей уже получили нашу помощь в выборе и оформлении участка.")}</p></div>
        </div>
      </section>

      <section className={`shell ${styles.steps}`} aria-labelledby="certificate-steps-title">
        <SectionHeading label={cms.text("copy.zemelnyy-sertifikat.16", "Этапы покупки")} id="certificate-steps-title" accent="red">{cms.text("copy.zemelnyy-sertifikat.17", "Как проходит ")}<em>{cms.text("copy.zemelnyy-sertifikat.18", "покупка")}</em></SectionHeading>
        <ol className={styles.stepGrid}>{steps.map((step, i) => <Fragment key={step}><li className={`${styles.step} ${reveal.card}`} data-step={i + 1} data-reveal style={{ '--card-reveal-order': i } as CSSProperties}>
          <div className={styles.stepTop}><span>{String(i + 1).padStart(2, '0')}</span><img src={sitePath(cms.text("copy.zemelnyy-sertifikat.19", '/images/certificate/step-dot.svg'))} width={16} height={16} alt="" loading="lazy" /></div>
          <h3>{step}</h3>
        </li>{i === 1 && <li className={styles.emblemSlot} aria-hidden="true">
          <img className={styles.emblemMobile} src={sitePath(cms.text("copy.zemelnyy-sertifikat.20", '/images/certificate/emblem.svg'))} alt="" width={148} height={170.769} loading="lazy" />
          <img className={styles.emblemDesktop} src={sitePath(cms.text("copy.zemelnyy-sertifikat.21", '/images/certificate/emblem-desktop.svg'))} alt="" width={208} height={240} loading="lazy" />
          <img className={styles.emblemTablet} src={sitePath(cms.text("copy.zemelnyy-sertifikat.22", '/images/certificate/emblem-desktop.svg'))} alt="" width={208} height={240} loading="lazy" />
        </li>}</Fragment>)}</ol>
      </section>

      <section className={`shell ${formPanel.section} ${styles.consultation}`} id="certificate-consultation" aria-labelledby="certificate-consultation-title">
        <PhotoFormPanel image={{src:cms.text("copy.zemelnyy-sertifikat.23", '/images/certificate/house-keys.webp'),alt:cms.text("copy.zemelnyy-sertifikat.24", 'Ключи от дома на фоне загородного участка'),width:1536,height:1024}} intro={<><h2 id="certificate-consultation-title"><em>{cms.text("copy.zemelnyy-sertifikat.25", "Есть ")}<br className={styles.mobileBreak}/>{cms.text("copy.zemelnyy-sertifikat.26", "сертификат?")}</em> {cms.text("copy.zemelnyy-sertifikat.27", " Поможем сделать следующий шаг")}</h2><p>{cms.text("copy.zemelnyy-sertifikat.28", "Расскажите о ваших планах — предложим подходящие участки и объясним, как проходит покупка в вашей ситуации.")}</p></>}>
            <InlineRequestForm definition={leadForms.certificate} submitLabel={cms.text("copy.zemelnyy-sertifikat.29", "Получить консультацию")} />
        </PhotoFormPanel>
      </section>
  </SitePage>;
}

const _cmsSource_steps = steps;

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "zemelnyy-sertifikat");
}
