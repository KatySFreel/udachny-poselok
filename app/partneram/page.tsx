import { ResponsiveImage } from "../../components/responsive-image";

import { getCmsCopy } from "../../lib/cms-store";
import { SitePage } from '../../components/site-page';
import { ImageStack } from '../../components/image-stack';
import { ActionLink } from '../../components/action';
import { PhotoFormPanel } from '../../components/photo-form-panel';
import { InlineRequestForm } from '../../components/contact-dialog';
import { leadForms, leadTrigger } from '../../lib/lead-attribution';
import { createPageMetadata, localizePageMetadata } from '../../lib/site-metadata';
import { sitePath } from '../../lib/site-path';
import styles from '../../components/partners-page.module.css';
import formPanel from '../../components/photo-form-panel.module.css';
import splitCover from '../../components/split-cover.module.css';

const baseMetadata = createPageMetadata({title:'Партнёрская программа — Удачный посёлок',description:'Рекомендуйте «Удачный посёлок» и получайте вознаграждение за покупку участков по вашей персональной ссылке. До 350 000 ₽ с учётом премий за 15 участков.',path:'/partneram'});

export default async function PartnersPage() {
  const cms = await getCmsCopy();

  return <SitePage className={styles.page} coverId="partners-cover" mainId="partners-main">
    <section className={`shell ${styles.hero} ${splitCover.hero}`} id="partners-cover" data-cover-motion aria-labelledby="partners-title">
      <div className={`${styles.heroIntro} ${splitCover.intro}`}>
        <ImageStack className={styles.thumbnails} images={[cms.text("copy.partneram.1", '/images/partners/thumbnail-1.webp'),cms.text("copy.partneram.2", '/images/partners/thumbnail-2.webp'),cms.text("copy.partneram.3", '/images/partners/thumbnail-3.webp')]} size={72}/>
        <h1 id="partners-title" data-cover-part="title"><span>{cms.text("copy.partneram.4", "Рекомендуйте")}</span><em>{cms.text("copy.partneram.5", "«Удачный посёлок»")}</em><span>{cms.text("copy.partneram.6", "и получайте ")}<strong>{cms.text("copy.partneram.7", "до 350 000 ₽")}</strong></span></h1>
        <div className={styles.conditions} data-cover-part="description">
          <div className={styles.description}>
            <p><span>10 000 ₽</span> {cms.text("copy.partneram.8", " за каждый участок, купленный по вашей рекомендации, и ")}<span>{cms.text("copy.partneram.9", "до 200 000 ₽")}</span> {cms.text("copy.partneram.10", " дополнительных премий. За 15 купленных участков — ")}<span>{cms.text("copy.partneram.11", "350 000 ₽ с учётом премий")}</span>.</p>
            <p>{cms.text("copy.partneram.12", "Поделитесь персональной ссылкой* —")}<br/><strong>{cms.text("copy.partneram.13", "всё остальное мы возьмём на себя.")}</strong></p>
          </div>
          <div className={styles.divider} aria-hidden="true"><img src={sitePath(cms.text("copy.partneram.14", '/images/partners/divider.svg'))} alt=""/></div>
          <p className={styles.note}>{cms.text("copy.partneram.15", "* Для участия получите ссылку у менеджера отдела сопровождения клиентов.")}</p>
        </div>
      </div>
      <div className={`${styles.heroPhoto} ${splitCover.photo}`} data-cover-image data-cover-parallax><ResponsiveImage src={cms.text("copy.partneram.16", '/images/partners/landscape.webp')} sizes="(width < 1024px) 100vw, 45vw" alt={cms.text("copy.partneram.17", "Пара на прогулке у реки среди загородных просторов")} width={2731} height={4096} fetchPriority="high"/></div>
      <ActionLink data-cover-part="actions" href="#partner-link" arrow {...leadTrigger(leadForms.partners.id,{buttonId:'partners-hero',buttonLabel:cms.text("copy.partneram.18", 'Получите персональную ссылку'),placement:'hero'})}>{cms.text("copy.partneram.19", "Получите персональную ссылку")}</ActionLink>
    </section>
    <section className={`shell ${formPanel.section} ${styles.request}`} id="partner-link" aria-labelledby="partner-link-title">
      <PhotoFormPanel variant="personal-link" image={{src:cms.text("copy.partneram.20", '/images/partners/house-keys.webp'),alt:cms.text("copy.partneram.21", 'Ключи от дома с фирменным брелоком «Удачного посёлка»'),width:1536,height:1024}}
        intro={<><h2 id="partner-link-title">{cms.text("copy.partneram.22", "Получите ")}<em>{cms.text("copy.partneram.23", "персональную ссылку")}</em></h2><p>{cms.text("copy.partneram.24", "Оставьте контакты — менеджер свяжется с вами и пришлёт ссылку.")}</p></>}>
        <InlineRequestForm definition={leadForms.partners} submitLabel={cms.text("copy.partneram.25", "Получить ссылку")}/>
      </PhotoFormPanel>
    </section>
  </SitePage>;
}

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "partneram");
}
