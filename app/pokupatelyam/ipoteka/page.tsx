import { ResponsiveImage } from "../../../components/responsive-image";

import { getCmsCopy } from "../../../lib/cms-store";
import type { Metadata } from 'next';
import { SitePage } from '../../../components/site-page';
import { SectionHeading } from '../../../components/section-heading';
import { ActionLink } from '../../../components/action';
import { PaymentCard, type PaymentOption } from '../../../components/payment-card';
import { PhotoFormPanel } from '../../../components/photo-form-panel';
import { InlineRequestForm } from '../../../components/contact-dialog';
import { leadForms, leadTrigger } from '../../../lib/lead-attribution';
import { createPageMetadata, localizePageMetadata } from '../../../lib/site-metadata';
import { sitePath } from '../../../lib/site-path';
import buyer from '../../../components/installment-page.module.css';
import buyerHero from '../../../components/buyer-hero.module.css';
import formPanel from '../../../components/photo-form-panel.module.css';
import styles from '../../../components/mortgage-page.module.css';

const baseMetadata: Metadata = createPageMetadata({
  title: 'Ипотека на участок и строительство дома — Удачный посёлок',
  description: 'Поможем подобрать участок в Ленинградской области или аккредитованный проект дома, подготовить документы и подать заявку на ипотеку в банк.',
  path: '/pokupatelyam/ipoteka',
});

const options = [
  {title:'На покупку участка',description:'Подберём участок под ваши планы и бюджет, уточним, подходит ли он под условия выбранной ипотечной программы, и подготовим документы по объекту',image:'plot'},
  {title:'На строительство дома',description:'Предложим наши аккредитованные проекты, рассчитаем стоимость строительства и поможем собрать документы для банка. Если участок уже есть, подберём проект с учётом его параметров. Если участка ещё нет, поможем выбрать землю и дом вместе.',image:'house'},
];
const steps: PaymentOption[] = [
  {title:'Уточняем вашу задачу',description:'Обсуждаем, что вы планируете: купить участок, построить дом или подобрать оба варианта.',number:{id:'01',src:'/images/mortgage/01.svg',width:154.157,height:97.402}},
  {title:'Готовим заявку',description:'Помогаем собрать документы и подать их в банк. Если вы уже выбрали банк, подготовим документы по участку или проекту дома для его рассмотрения.',number:{id:'02',src:'/images/mortgage/02.svg',width:176.717,height:97.402}},
  {title:'Сопровождаем сделку',description:'Банк принимает решение и сообщает условия. После одобрения поможем с оформлением покупки или договора на строительство.',number:{id:'03',src:'/images/mortgage/03.svg',width:173.911,height:97.4}},
];

export default async function MortgagePage() {
  const cms = await getCmsCopy();
  const options = cms.data("local.ipoteka.options", _cmsSource_options);
  const steps = cms.data("local.ipoteka.steps", _cmsSource_steps);

  return <SitePage className={buyer.page} coverId="mortgage-cover" mainId="mortgage-main">
    <section className={`shell ${buyer.hero} ${buyerHero.hero}`} id="mortgage-cover" data-cover-motion aria-labelledby="mortgage-title">
      <div className={`${buyer.heroIntro} ${styles.heroIntro}`}>
        <h1 id="mortgage-title" data-cover-part="title"><em>{cms.text("copy.ipoteka.1", "Ипотека")}</em> {cms.text("copy.ipoteka.2", " на участок")}<br className={styles.titleBreak}/> {cms.text("copy.ipoteka.3", " и строительство дома")}</h1>
        <p data-cover-part="description">{cms.text("copy.ipoteka.4", "Поможем подобрать участок в Ленинградской области или аккредитованный проект дома, подготовить документы и подать заявку в банк")}</p>
      </div>
      <picture className={`${buyer.heroPhoto} ${buyerHero.photo} ${styles.heroPhoto}`} data-cover-image data-cover-parallax>
        <img src={sitePath(cms.text("copy.ipoteka.5", '/images/mortgage/hero.webp'))} alt={cms.text("copy.ipoteka.6", "Загородный посёлок среди лесов и полей")} width={1280} height={720} fetchPriority="high" />
      </picture>
      <ActionLink data-cover-part="actions" href="#mortgage-calculation" arrow {...leadTrigger(leadForms.mortgage.id,{buttonId:'mortgage-hero',buttonLabel:cms.text("copy.ipoteka.7", 'Узнать условия ипотеки'),placement:'hero'})}>{cms.text("copy.ipoteka.8", "Узнать условия ипотеки")}</ActionLink>
    </section>

    <section className={`shell ${buyer.section}`} aria-labelledby="mortgage-options-title">
      <SectionHeading id="mortgage-options-title" label={cms.text("copy.ipoteka.9", "Варианты покупки")}>{cms.text("copy.ipoteka.10", "На что можно оформить ипотеку")}</SectionHeading>
      <div className={styles.options}>{options.map(option => <article className={styles.option} key={option.image}>
        <div><h3>{option.title}</h3><p>{option.description}</p></div>
        <ResponsiveImage src={`/images/mortgage/${option.image}.webp`} sizes="(width < 768px) 100vw, (width < 1024px) 40vw, 24vw" alt={option.image === 'plot' ? cms.text("copy.ipoteka.11", 'Участки в загородном посёлке') : cms.text("copy.ipoteka.12", 'Деревянный дом среди луговых цветов')} width={4096} height={option.image === 'plot' ? 3067 : 2731} loading="lazy" />
      </article>)}</div>
    </section>

    <section className={`shell ${buyer.section}`} aria-labelledby="mortgage-help-title">
      <SectionHeading id="mortgage-help-title" label={cms.text("copy.ipoteka.13", "Наша помощь")}>{cms.text("copy.ipoteka.14", "Как мы помогаем оформить ипотеку")}</SectionHeading>
      <div className={buyer.terms}>{steps.map((option,index) => <PaymentCard key={option.number.id} option={option} headingId={`mortgage-step-${index}`} variant="installment" />)}</div>
    </section>

    <section className={`shell ${formPanel.section} ${styles.calculation}`} id="mortgage-calculation" aria-labelledby="mortgage-calculation-title">
      <PhotoFormPanel variant="centered" image={{src:cms.text("copy.ipoteka.15", '/images/mortgage/keys.webp'),alt:cms.text("copy.ipoteka.16", 'Ключи с брелоком в форме дома'),width:1536,height:1024}} intro={<>
        <h2 id="mortgage-calculation-title">{cms.text("copy.ipoteka.17", "Узнайте, какие условия ипотеки ")}<em>{cms.text("copy.ipoteka.18", "доступны для вашей покупки")}</em></h2>
        <p>{cms.text("copy.ipoteka.19", "Оставьте контакты и расскажите о своих планах. Менеджер свяжется с вами, поможет разобраться в вариантах и объяснит, с чего начать.")}</p>
      </>}>
        <InlineRequestForm definition={leadForms.mortgage} submitLabel={cms.text("copy.ipoteka.20", "Получить расчёт")} choiceField={{name:'mortgagePurpose',label:cms.text("copy.ipoteka.21", 'Выберите цель ипотеки'),options:[cms.text("copy.ipoteka.22", 'Купить участок'),cms.text("copy.ipoteka.23", 'Построить дом / участок и дом'),cms.text("copy.ipoteka.24", 'Участок и дом')]}} />
      </PhotoFormPanel>
    </section>
  </SitePage>;
}

const _cmsSource_options = options;
const _cmsSource_steps = steps;

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "ipoteka");
}
