"use client";
import { useCmsCopy } from "./cms-provider";


import { formatNumber } from "../lib/format-number";
import { SitePage } from "./site-page";
import type { SettlementPageData } from "../content/settlement-pages";
import { settlementPaymentOptions } from "../content/settlement-payment";
import { settlements } from "../content/settlements";
import { site } from "../content/site";
import { sitePath } from "../lib/site-path";
import { ActionButton, ActionLink } from "./action";
import { CatalogCard } from "./catalog-card";
import { PaymentCard } from "./payment-card";
import { RoundLink } from "./round-link";
import { SectionHeading as Heading } from "./section-heading";
import { SettlementCard } from "./settlement-card";
import { SettlementGallery } from "./settlement-gallery";
import { SettlementVisitCard } from "./settlement-visit-card";
import { SettlementPlan } from "./settlement-plan";
import { HouseCard } from "./house-card";
import houseStyles from "./home-houses.module.css";
import { PhotoFormPanel } from "./photo-form-panel";
import { InlineRequestForm, RequestDialog } from "./contact-dialog";
import { leadTrigger, settlementLeadForm } from "../lib/lead-attribution";
import { HomeSettlementsMapBoard } from "./home-settlements-map-board";
import { SettlementSurroundingsPreview } from "./settlement-surroundings-preview";
import formPanel from "./photo-form-panel.module.css";
import shared from "./settlements.module.css";
import styles from "./settlement-page.module.css";

export function SettlementPage({ data: sourceData }: { data: SettlementPageData }) {
  const cms = useCmsCopy();
  const settlementPaymentOptions = cms.data("data.settlementPaymentOptions", _cmsSource_settlementPaymentOptions);
  const settlements = cms.data("data.settlements", _cmsSource_settlements);
  const site = cms.data("data.site", _cmsSource_site);
  const data = cms.data(`settlement.${sourceData.slug}`, sourceData);

  const asset = (name: string) => sitePath(name.startsWith("/") ? name : cms.text(`settlement-media.${data.slug}.${name}`, `${data.assets}/${name}.webp`));
  const visitId = `${data.slug}-visit`;
  const onlineId = `${data.slug}-online-visit`;
  const openVisit = { commandfor: visitId, command: "show-modal" };
  const videoUrl = data.videoUrl || site.socials.find(social => social.id === "rutube")!.href;

  return (
    <SitePage className={styles.page} coverId="settlement-cover" mainId="settlement-main" dialogs={<><RequestDialog id={visitId} title={cms.text("copy.settlement-page.1", "Запись на просмотр")} definition={settlementLeadForm("visit",data.slug,data.name)} submitLabel={cms.text("copy.settlement-page.2", "Записаться на просмотр")} description={`Оставьте имя и телефон. Согласуем удобное время и покажем участки в посёлке «${data.name}».`} />
      <RequestDialog id={onlineId} title={cms.text("copy.settlement-page.3", "Просмотр по видеосвязи")} definition={settlementLeadForm("online-visit",data.slug,data.name)} submitLabel={cms.text("copy.settlement-page.4", "Записаться на просмотр")} description={`Оставьте имя и телефон. Согласуем удобное время и покажем участки в посёлке «${data.name}».`} /></>}>

        <section className={styles.hero} id="settlement-cover" data-cover-motion aria-labelledby="settlement-title">
          <picture className={styles.heroPhoto} data-cover-parallax>
            <img src={asset("hero")} alt={`Посёлок ${data.name} с высоты`} width={1920} height={1080} fetchPriority="high" />
          </picture>
          <div className={styles.heroContent}>
            <p data-cover-part="label">{data.kind ?? cms.text("copy.settlement-page.5", 'Посёлок')}</p>
            <h1 id="settlement-title" aria-label={data.name} data-cover-part="title"><em>{(data.heroTitleLines ?? [data.name]).map(line => <span key={line}>{line}</span>)}</em></h1>
            <ul className={styles.heroTags} data-cover-part="description">
              <li><span className={styles.heroTagIcon}><img src={sitePath("/icons/settlement-location.svg")} width={14} height={18} alt="" /></span><span>{data.mobileLocation ? <><span className={styles.heroDesktopLocation}>{data.location}</span><span className={styles.heroMobileLocation}>{data.mobileLocation}</span></> : data.location}, {data.distance}</span></li>
              <li><span className={styles.heroTagIcon}><img src={sitePath('/icons/settlement-wallet.svg')} width={24} height={24} alt="" /></span><span>{cms.text("copy.settlement-page.6", "Участки от ")}{formatNumber(data.startingPrice)} ₽</span></li>
            </ul>
          </div>
          <div className={`hero__actions ${styles.heroActions}`} data-cover-part="actions">
            <ActionLink href="#settlement-plan" arrow>{cms.text("copy.settlement-page.7", "Выбрать участок")}</ActionLink>
            <ActionLink href="#settlement-visits" variant="light" arrow>{cms.text("copy.settlement-page.9", "Записаться на просмотр")}</ActionLink>
          </div>
        </section>

        <section className={`shell ${styles.about}`} aria-labelledby="settlement-about">
          <Heading id="settlement-about">{cms.text("copy.settlement-page.10", "О посёлке")}</Heading>
          <p className={styles.description} data-reveal>{data.description.startsWith('—') && <><span>{data.kind ? `${data.kind} «${data.name}»` : `«${data.name}»`}</span> </>}{data.description}</p>
          <div className={styles.advantages} data-count={data.advantages.length}>
            {data.advantages.map(item => (
              <article key={item.image} data-reveal>
                <img src={asset(item.image)} width={220} height={220} alt="" loading="lazy" decoding="async" />
                <h3 className={shared.cardTitle}>{item.title}</h3><p>{item.description}</p>
              </article>
            ))}
          </div>
          <p className={styles.noFees} data-reveal><img src={sitePath("/icons/quiz/verified.svg")} width={28.927} height={31.8209} alt="" />{cms.text("copy.settlement-page.11", "Инфраструктурные взносы отсутствуют")}</p>
        </section>

        <section className={styles.locationSection} aria-labelledby="settlement-location">
          <Heading className={styles.sectionHeading} label={cms.text("copy.settlement-page.12", "Расположение")} id="settlement-location">{cms.text("copy.settlement-page.13", "Расположение и окружение")}</Heading>
          {data.surroundingsImage ? <SettlementSurroundingsPreview slug={data.slug} name={data.name} image={`${data.assets}/${data.surroundingsImage}.webp`} includePickup={data.slug === 'istorii-severa'} /> : <div className={`shell ${styles.locationMap}`}>
            <HomeSettlementsMapBoard settlementSlug={data.slug} />
          </div>}
        </section>

        <section className={`shell ${styles.video}`} aria-labelledby="settlement-video">
          <img className={styles.videoBackground} src={asset("video-background")} alt="" loading="lazy" />
          <Heading label={cms.text("copy.settlement-page.14", "Онлайн-экскурсии")} id="settlement-video" inverse>{cms.text("copy.settlement-page.15", "Познакомьтесь с посёлком")}<br /><em>{cms.text("copy.settlement-page.16", "до поездки")}</em></Heading>
          <p data-reveal>{cms.text("copy.settlement-page.17", "Подбираем участки для разных жизненных сценариев и помогаем пройти путь от выбора земли до строительства дома.")}</p>
          <div className={styles.videoMedia} data-reveal>
            <a className={styles.videoLink} href={videoUrl} target="_blank" rel="noreferrer"><img src={asset("video-cover")} alt={`Онлайн-экскурсия: ${data.name}`} loading="lazy" /></a>
            <RoundLink className={styles.play} href={videoUrl} label={cms.text("copy.settlement-page.18", "Смотреть")} aria-label={`Смотреть онлайн-экскурсию: ${data.name}`} target="_blank" rel="noreferrer" />
          </div>
        </section>

        <section className={styles.gallery} aria-labelledby="settlement-gallery">
          <Heading className={styles.sectionHeading} label={cms.text("copy.settlement-page.19", "Фотогалерея")} id="settlement-gallery">{cms.text("copy.settlement-page.20", "Почувствуйте ")}<em>{cms.text("copy.settlement-page.21", "атмосферу")}</em> {cms.text("copy.settlement-page.22", " посёлка")}</Heading>
          <SettlementGallery data={data} />
        </section>

        {data.readyHouses && <section className={`shell ${styles.readyHouses}`} aria-labelledby="settlement-houses-title">
          <Heading className={styles.sectionHeading} label={cms.text("copy.settlement-page.23", "Готовые дома")} id="settlement-houses-title">{cms.text("copy.settlement-page.24", "Дом, который уже ")}<em>{cms.text("copy.settlement-page.25", "ждёт вас")}</em></Heading>
          <ul className={`${houseStyles.grid} ${houseStyles.readyGrid}`}>
            {data.readyHouses.map(house => <li key={house.slug}><HouseCard house={house} ready /></li>)}
          </ul>
        </section>}

        <section className={`shell ${styles.planSection}`} id="settlement-plan" aria-labelledby="settlement-plan-title">
          <Heading className={styles.sectionHeading} label={cms.text("copy.settlement-page.26", "Генплан")} id="settlement-plan-title" accent="red">{cms.text("copy.settlement-page.27", "Выберите ")}<em>{cms.text("copy.settlement-page.28", "свой участок")}</em></Heading>
          <SettlementPlan data={data} />
        </section>

        <section className={`shell ${styles.visits}`} id="settlement-visits" aria-labelledby="settlement-visits-title">
          <Heading className={styles.sectionHeading} label={cms.text("copy.settlement-page.29", "Экскурсии по посёлку")} id="settlement-visits-title">{cms.text("copy.settlement-page.30", "Запись ")}<em>{cms.text("copy.settlement-page.31", "на просмотр")}</em></Heading>
          <div className={styles.visitCards}>
            {(['visit','online-visit'] as const).map(kind => <SettlementVisitCard key={kind} kind={kind} slug={data.slug} assets={data.assets} />)}
          </div>
        </section>

        <section className={`shell ${styles.payment}`} aria-labelledby="settlement-payment">
          <Heading className={styles.sectionHeading} label={cms.text("copy.settlement-page.32", "Способы покупки")} id="settlement-payment" accent="red">{cms.text("copy.settlement-page.33", "Выберите ")}<em>{cms.text("copy.settlement-page.34", "удобный")}</em> {cms.text("copy.settlement-page.35", " способ оплаты")}</Heading>
          <div className={styles.paymentCards} data-reveal>
            {settlementPaymentOptions.map(option => <PaymentCard key={option.number.id} option={option} headingId={`settlement-payment-option-${option.number.id}`} />)}
          </div>
        </section>

        <section className={`shell ${formPanel.section} ${styles.presentation}`} aria-labelledby="settlement-presentation">
          <PhotoFormPanel reveal variant="presentation" image={{src:`${data.assets}/presentation.webp`,alt:`Презентация посёлка ${data.name}`}} intro={<>
                <Heading id="settlement-presentation" accent="red">{cms.text("copy.settlement-page.36", "Всё о посёлке")}<br /><em>{cms.text("copy.settlement-page.37", "в одной презентации")}</em></Heading>
                <p>{cms.text("copy.settlement-page.38", "Сохраните расположение, генплан, фотографии и условия покупки «")}{data.name === cms.text("copy.settlement-page.39", "Троицкая Слобода") ? cms.text("copy.settlement-page.40", "Троицкой Слободы") : data.name}{cms.text("copy.settlement-page.41", "». Презентацию удобно обсудить с семьёй и использовать при сравнении участков.")}</p>
          </>}>
              <InlineRequestForm definition={settlementLeadForm("presentation",data.slug,data.name)} submitLabel={cms.text("copy.settlement-page.42", "Получить презентацию")} includeEmail />
              {data.presentationUrl && <a href={sitePath(data.presentationUrl)} download>{cms.text("copy.settlement-page.43", "Скачать презентацию")}</a>}
          </PhotoFormPanel>
        </section>

        <section className={`${shared.section} ${styles.related}`} aria-labelledby="settlement-related">
          <Heading className={styles.sectionHeading} label={cms.text("copy.settlement-page.44", "Коттеджные посёлки")} id="settlement-related" accent="red"><em>{cms.text("copy.settlement-page.45", "Сравните")}</em> {cms.text("copy.settlement-page.46", " другие варианты")}</Heading>
          <div className={styles.relatedRail} data-reveal>
            {data.related.map(slug => {
              const item = settlements.find(settlement => settlement.slug === slug);
              return item ? <SettlementCard key={slug} settlement={item} /> : null;
            })}
            <CatalogCard href="/poselki" label={cms.text("copy.settlement-page.47", "Посмотреть все посёлки")} title={cms.text("copy.settlement-page.48", "Посмотрите, что ещё мы подготовили для вас")} imageDirectory="/images/settlements" pattern={{ src: cms.text("copy.settlement-page.49", "/images/settlements/catalog-pattern.svg"), tablet: cms.text("copy.settlement-page.50", "/images/settlements/catalog-pattern-tablet.svg"), width: 445 }} />
          </div>
        </section>

    </SitePage>
  );
}

const _cmsSource_settlementPaymentOptions = settlementPaymentOptions;
const _cmsSource_settlements = settlements;
const _cmsSource_site = site;
