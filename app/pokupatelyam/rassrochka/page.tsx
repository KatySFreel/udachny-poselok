
import { getCmsCopy } from "../../../lib/cms-store";
import type { Metadata } from 'next';
import { SitePage } from '../../../components/site-page';
import { SectionHeading } from '../../../components/section-heading';
import { ActionLink } from '../../../components/action';
import { PaymentCard, type PaymentOption } from '../../../components/payment-card';
import { PhotoFormPanel } from '../../../components/photo-form-panel';
import { InlineRequestForm } from '../../../components/contact-dialog';
import { leadForms, leadTrigger } from '../../../lib/lead-attribution';
import { createPageMetadata } from '../../../lib/site-metadata';
import { sitePath } from '../../../lib/site-path';
import styles from '../../../components/installment-page.module.css';
import formPanel from '../../../components/photo-form-panel.module.css';
import buyerHero from '../../../components/buyer-hero.module.css';

const baseMetadata: Metadata = createPageMetadata({
  title: 'Рассрочка на земельный участок — Удачный посёлок',
  description: 'Земельный участок в рассрочку напрямую от застройщика. Специальные и стандартные условия покупки, фиксация цены и индивидуальный расчёт платежей.',
  path: '/pokupatelyam/rassrochka',
});

const offers = [
  { name: 'Берег Тигоды', image: 'bereg-tigody', title: '18 месяцев без процентов и без первого взноса за участок', description: <>Платежи равные. Предложение доступно со старта продаж.</> },
  { name: 'Истории Севера', image: 'istorii-severa', title: '12 месяцев без процентов', description: <>Первый взнос за участок — <span>50 000 ₽</span>, остаток — равными ежемесячными платежами.</> },
  { name: 'Троицкая Слобода', image: 'troitskaya-sloboda', title: 'Новая рассрочка на 24 месяца', description: <>С первоначальным взносом <span>30% от стоимости участка</span> и ставкой <span>20% годовых.</span> Предложение действует только во второй очереди и распространяется на все участки стоимостью от 1 000 000 ₽</> },
];
const terms: PaymentOption[] = [
  { title: 'Первоначальный взнос', description: '50% от стоимости участка для обоих вариантов.', number: { id: '01', src: '/images/installment/01.svg', width: 154.157, height: 97.4019 } },
  { title: '6 месяцев без процентов', description: 'Оставшуюся половину стоимости оплачиваете частями в течение полугода.', number: { id: '02', src: '/images/installment/02.svg', width: 176.717, height: 97.4019 } },
  { title: '12 месяцев с процентами', description: 'Остаток оплачиваете в течение года. До подписания договора покажем график платежей и итоговую стоимость с учётом процентов.', number: { id: '03', src: '/images/installment/03.svg', width: 173.911, height: 97.4 } },
];

export default async function InstallmentPage() {
  const cms = await getCmsCopy();
  const offers = cms.data("local.rassrochka.offers", _cmsSource_offers);
  const terms = cms.data("local.rassrochka.terms", _cmsSource_terms);

  return <SitePage className={styles.page} coverId="installment-cover" mainId="installment-main">
    <section className={`shell ${styles.hero} ${buyerHero.hero}`} id="installment-cover" data-cover-motion aria-labelledby="installment-title">
      <div className={styles.heroIntro}>
        <h1 id="installment-title" data-cover-part="title">{cms.text("copy.rassrochka.1", "Земельный участок")}<br/>{cms.text("copy.rassrochka.2", "в рассрочку ")}<em>{cms.text("copy.rassrochka.3", "без банка")}</em></h1>
        <p data-cover-part="description">{cms.text("copy.rassrochka.4", "Выберите участок в Ленинградской области и платите частями напрямую застройщику")}</p>
      </div>
      <picture className={`${styles.heroPhoto} ${buyerHero.photo}`} data-cover-image data-cover-parallax>
        <source media="(width < 768px)" srcSet={cms.imageSet("copy.rassrochka.6", sitePath(cms.text("copy.rassrochka.5", '/images/installment/house-mobile.webp')))} />
        <img src={sitePath(cms.text("copy.rassrochka.6", '/images/installment/house.webp'))} alt={cms.text("copy.rassrochka.7", "Деревянный загородный дом среди луговых трав")} width={4096} height={2731} fetchPriority="high" />
      </picture>
      <ActionLink data-cover-part="actions" href="#installment-calculation" arrow {...leadTrigger(leadForms.installment.id, {buttonId:'installment-hero',buttonLabel:cms.text("copy.rassrochka.8", 'Рассчитать рассрочку'),placement:'hero'})}>{cms.text("copy.rassrochka.9", "Рассчитать рассрочку")}</ActionLink>
    </section>

    <section className={`shell ${styles.section}`} aria-labelledby="installment-offers-title">
      <SectionHeading id="installment-offers-title" label={cms.text("copy.rassrochka.10", "Особые предложения")}>{cms.text("copy.rassrochka.11", "Специальные условия в посёлках")}</SectionHeading>
      <div className={styles.offers}>
        {offers.map(offer => <article className={styles.offer} key={offer.image}>
          <h3>«{offer.name}»<br/>{cms.text("copy.rassrochka.12", "2-я очередь")}</h3>
          <img className={styles.offerPhoto} src={sitePath(`/images/installment/${offer.image}.webp`)} alt={`Вид на посёлок «${offer.name}»`} width={220} height={220} loading="lazy" />
          <div className={styles.offerCopy}><h4>{offer.title}</h4><p>{offer.description}</p></div>
        </article>)}
        <div className={styles.emblem} aria-hidden="true"><img src={sitePath(cms.text("copy.rassrochka.13", '/images/installment/emblem.svg'))} width={291.933} height={333.019} alt="" loading="lazy" /></div>
      </div>
    </section>

    <section className={`shell ${styles.section}`} aria-labelledby="installment-terms-title">
      <SectionHeading id="installment-terms-title" label={cms.text("copy.rassrochka.14", "Типовой формат")}>{cms.text("copy.rassrochka.15", "Стандартные условия")}</SectionHeading>
      <div className={styles.terms}>{terms.map((option,i) => <PaymentCard key={option.number.id} option={option} headingId={`installment-term-${i}`} variant="installment" />)}</div>
    </section>

    <section className={`shell ${styles.price}`} aria-labelledby="installment-price-title">
      <img className={styles.pricePhoto} src={sitePath(cms.text("copy.rassrochka.16", '/images/installment/field.webp'))} alt="" width={1280} height={853} loading="lazy" />
      <div className={styles.priceCopy}>
        <h2 id="installment-price-title">{cms.text("copy.rassrochka.17", "Фиксируем цену участка ")}<em>{cms.text("copy.rassrochka.18", "на весь срок рассрочки")}</em></h2>
        <p>{cms.text("copy.rassrochka.19", "Вы заключаете договор напрямую с застройщиком. До подписания покажем размер первого взноса, даты и суммы платежей, а также итоговую стоимость покупки по выбранным условиям.")}</p>
      </div>
    </section>

    <section className={`shell ${formPanel.section} ${styles.calculation}`} id="installment-calculation" aria-labelledby="installment-calculation-title">
      <PhotoFormPanel image={{src:cms.text("copy.rassrochka.20", '/images/installment/house-keys.webp'),alt:cms.text("copy.rassrochka.21", 'Ключи от загородного дома в руке'),width:1536,height:1024}} intro={<>
        <h2 id="installment-calculation-title">{cms.text("copy.rassrochka.22", "Узнайте свой ")}<em>{cms.text("copy.rassrochka.23", "ежемесячный платёж")}</em></h2>
        <p>{cms.text("copy.rassrochka.24", "Расскажите, какой первый взнос и ежемесячный платёж вам удобны. Подберём варианты и подготовим расчёт.")}</p>
      </>}>
        <InlineRequestForm definition={leadForms.installment} submitLabel={cms.text("copy.rassrochka.25", "Получить расчёт")} />
      </PhotoFormPanel>
    </section>
  </SitePage>;
}

const _cmsSource_offers = offers;
const _cmsSource_terms = terms;

export async function generateMetadata() {
  const cms = await getCmsCopy();
  const title = cms.text("seo.rassrochka.title", "Рассрочка на земельный участок — Удачный посёлок");
  const description = cms.text("seo.rassrochka.description", "Земельный участок в рассрочку напрямую от застройщика. Специальные и стандартные условия покупки, фиксация цены и индивидуальный расчёт платежей.");
  return { ...baseMetadata, title, description, openGraph: { ...baseMetadata.openGraph, title, description }, twitter: { ...baseMetadata.twitter, title, description } };
}
