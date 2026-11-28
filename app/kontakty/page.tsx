
import { getCmsCopy } from "../../lib/cms-store";
import { SitePage } from '../../components/site-page';
import { SectionHeading } from '../../components/section-heading';
import { ActionLink } from '../../components/action';
import { ContactsRequest } from '../../components/contacts-request';
import { site } from '../../content/site';
import { sitePath } from '../../lib/site-path';
import { createPageMetadata, localizePageMetadata } from '../../lib/site-metadata';
import shared from '../../components/settlements.module.css';
import styles from '../../components/contacts-page.module.css';
import interaction from '../../components/link-card-interaction.module.css';

const baseMetadata = createPageMetadata({title:'Контакты — Удачный посёлок',description:'Телефон, почта и часы работы компании «Удачный посёлок». Офис в Санкт-Петербурге: Московский проспект, 91, БЦ «Маяк», офис 702. Схема проезда и обратный звонок.',path:'/kontakty'});

const departments = [
  {icon:'sales',title:'Отдел продаж',hours:'11:00–19:00',days:'Ежедневно',width:20.9795,height:20.5279},
  {icon:'support',title:'Отдел сопровождения клиентов',hours:'9:00–18:00',days:'Пн–Пт',width:23.5,height:16.5},
];

export default async function ContactsPage() {
  const cms = await getCmsCopy();
  const site = cms.data("data.site", _cmsSource_site);
  const departments = cms.data("local.kontakty.departments", _cmsSource_departments);

  return <SitePage className={styles.page} coverId="contacts-cover" mainId="contacts-main">
    <section className={`shell ${styles.section} ${styles.hero}`} id="contacts-cover" aria-labelledby="contacts-title" data-cover-motion>
      <div className={styles.intro}>
        <div className={shared.sectionLabel} data-cover-part="label">{cms.text("copy.kontakty.1", "Контакты")}</div>
        <h1 id="contacts-title" data-cover-part="title">{cms.text("copy.kontakty.2", "Контакты компании ")}<em>{cms.text("copy.kontakty.3", "«Удачный посёлок»")}</em></h1>
        <p data-cover-part="description">{cms.text("copy.kontakty.4", "Поможем выбрать участок, записаться на просмотр посёлка или обсудить строительство дома.")}</p>
      </div>
      <div className={styles.cards}>
        <a className={`${styles.contactCard} ${interaction.card}`} href={site.phoneHref} data-cover-part="contact">
          <span className={`${shared.arrow} ${styles.contactArrow} ${interaction.arrow}`} aria-hidden="true" />
          <img className={styles.contactArt} src={sitePath(cms.text("copy.kontakty.5", '/images/contacts/phone.svg'))} width={139} height={139} alt="" />
          <div className={styles.contactCopy}><h2 className={interaction.title}>{cms.text("copy.kontakty.6", "Позвонить нам")}</h2><span className={styles.contactValue}>{site.phone}</span></div>
        </a>
        <div className={`${styles.contactCard} ${interaction.card}`} data-cover-part="contact">
          <a className={styles.mailArrow} href={site.emailHref} aria-label={cms.text("copy.kontakty.7", "Написать нам на почту")} data-card-trigger><span className={`${shared.arrow} ${styles.contactArrow} ${interaction.arrow}`} aria-hidden="true" /></a>
          <img className={`${styles.contactArt} ${styles.mailArt}`} src={sitePath(cms.text("copy.kontakty.8", '/images/contacts/mail.svg'))} width={197} height={139} alt="" />
          <div className={styles.contactCopy}><h2 className={interaction.title}>{cms.text("copy.kontakty.9", "Написать нам")}</h2><div className={styles.mailRow}>
            <a className={styles.contactValue} href={site.emailHref} data-card-trigger>{site.email}</a>
            <div className={styles.messengers}>
              {site.messengers.map(({id,label,href}) => href ? <a key={id} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><img src={sitePath(`/images/contacts/${id}.svg`)} width={id === 'max' ? 44 : 40.3333} height={id === 'max' ? 44 : 40.3333} alt="" /></a> : <span key={id} aria-label={`${label}: ссылка уточняется`}><img src={sitePath(`/images/contacts/${id}.svg`)} width={id === 'max' ? 44 : 40.3333} height={id === 'max' ? 44 : 40.3333} alt="" /></span>)}
            </div>
          </div></div>
        </div>
      </div>
    </section>
    <section className={`shell ${styles.section}`} aria-labelledby="departments-title">
      <div className={styles.intro}>
        <SectionHeading label={cms.text("copy.kontakty.10", "Наши отделы")} id="departments-title" accent="red">{cms.text("copy.kontakty.11", "Всегда найдём время ")}<em>{cms.text("copy.kontakty.12", "для вашего вопроса")}</em></SectionHeading>
        <p>{cms.text("copy.kontakty.13", "Выберите нужный отдел и свяжитесь с нашими специалистами в удобное время.")}</p>
      </div>
      <div className={styles.cards}>{departments.map(department => <article key={department.icon} className={styles.department}>
        <div className={styles.smallIcon}><img src={sitePath(`/images/contacts/${department.icon}.svg`)} width={department.width} height={department.height} alt="" /></div>
        <h3>{department.title}</h3>
        <div className={styles.hours}><p>{department.hours}</p><span>{department.days}</span></div>
      </article>)}</div>
    </section>
    <section className={`shell ${styles.section}`} aria-labelledby="office-title">
      <SectionHeading label={cms.text("copy.kontakty.14", "Офис и как добраться")} id="office-title" accent="red">{cms.text("copy.kontakty.15", "Будем рады ")}<em>{cms.text("copy.kontakty.16", "видеть вас")}</em></SectionHeading>
      <div className={styles.office}>
        <div className={styles.officeMap}><iframe src={site.office.mapEmbedHref} title={cms.text("copy.kontakty.17", "Яндекс Карты: офис «Удачный посёлок», Московский проспект, 91")} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /></div>
        <div className={styles.officeDetails}>
          <div className={styles.officeItem}><div className={styles.smallIcon}><img src={sitePath(cms.text("copy.kontakty.18", '/images/contacts/location.svg'))} width={16} height={21.0055} alt="" /></div><h3>{cms.text("copy.kontakty.19", "Санкт-Петербург, Московский проспект, 91")}</h3><p>{cms.text("copy.kontakty.20", "БЦ «Маяк», 7-й этаж, офис 702.")}</p></div>
          <div className={styles.divider} aria-hidden="true"><img src={sitePath(cms.text("copy.kontakty.21", '/images/contacts/divider.svg'))} width={675.333} height={5.33333} alt="" /></div>
          <div className={styles.officeItem}><div className={styles.smallIcon}><img src={sitePath(cms.text("copy.kontakty.22", '/images/contacts/clock.svg'))} width={21.5} height={22.5} alt="" /></div><h3>{cms.text("copy.kontakty.23", "Часы работы:")}</h3><p>{cms.text("copy.kontakty.24", "Пн–пт, 9:00–18:00")}</p></div>
          <div className={styles.divider} aria-hidden="true"><img src={sitePath(cms.text("copy.kontakty.25", '/images/contacts/divider.svg'))} width={675.333} height={5.33333} alt="" /></div>
          <div className={styles.officeItem}><div className={styles.smallIcon}><img src={sitePath(cms.text("copy.kontakty.26", '/images/contacts/clock.svg'))} width={21.5} height={22.5} alt="" /></div><h3>{cms.text("copy.kontakty.27", "Как нас найти:")}</h3><p>{cms.text("copy.kontakty.28", "На проходной предъявите паспорт и скажите, что направляетесь в офис 702. Поднимитесь на лифте до 6-го этажа, затем пройдите ещё один лестничный пролёт пешком.")}</p></div>
          <ActionLink href={cms.text("copy.kontakty.29", "https://yandex.ru/maps/?rtext=~Санкт-Петербург,%20Московский%20проспект,%2091&rtt=auto")} target="_blank" rel="noopener noreferrer" arrow>{cms.text("copy.kontakty.30", "Построить маршрут")}</ActionLink>
        </div>
      </div>
    </section>
    <section className={`shell ${styles.requestSection}`} aria-labelledby="contacts-request-title"><ContactsRequest /></section>
  </SitePage>;
}

const _cmsSource_site = site;
const _cmsSource_departments = departments;

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "kontakty");
}
