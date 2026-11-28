
import { getCmsCopy } from "../../lib/cms-store";
import { SitePage } from '../../components/site-page';
import { SectionHeading } from '../../components/section-heading';
import { HouseCard } from '../../components/house-card';
import { PhotoFormPanel } from '../../components/photo-form-panel';
import { InlineRequestForm } from '../../components/contact-dialog';
import { constructionProjects, readyHouses } from '../../content/houses';
import { leadForms } from '../../lib/lead-attribution';
import { createPageMetadata, localizePageMetadata } from '../../lib/site-metadata';
import { sitePath } from '../../lib/site-path';
import houses from '../../components/home-houses.module.css';
import formPanel from '../../components/photo-form-panel.module.css';
import styles from '../../components/construction-page.module.css';

const baseMetadata = createPageMetadata({title:'Строительство домов — Удачный посёлок',description:'Проекты загородных домов и готовые дома. Выберите подходящий проект и получите расчёт стоимости строительства.',path:'/doma'});

export default async function ConstructionPage() {
  const cms = await getCmsCopy();
  const constructionProjects = cms.data("data.constructionProjects", _cmsSource_constructionProjects);
  const readyHouses = cms.data("data.readyHouses", _cmsSource_readyHouses);

  return <SitePage className={styles.page} coverId="construction-cover" mainId="construction-main">
    <section className={`shell ${styles.hero}`} id="construction-cover" aria-labelledby="construction-title">
      <div className={styles.banner} data-cover-motion>
        <picture data-cover-parallax>
          <img src={sitePath(cms.text("copy.doma.1", '/images/construction/hero.webp'))} alt={cms.text("copy.doma.2", "Загородные дома в окружении леса")} width={1866} height={471} fetchPriority="high" />
        </picture>
        <h1 id="construction-title">{cms.text("copy.doma.3", "Строительство ")}<em>{cms.text("copy.doma.4", "домов")}</em></h1>
      </div>
    </section>
    <section className={`shell ${styles.catalog}`} aria-labelledby="construction-projects-title" id="proekty-domov">
      <SectionHeading id="construction-projects-title" accent="red"><em>{cms.text("copy.doma.5", "Проекты")}</em> {cms.text("copy.doma.6", " домов")}</SectionHeading>
      <ul className={`${houses.grid} ${styles.grid}`}>
        {constructionProjects.map(house => <li key={house.slug}><HouseCard house={house} variant="catalog" /></li>)}
      </ul>
    </section>
    <section className={`shell ${styles.catalog}`} aria-labelledby="construction-ready-title" id="gotovye-doma">
      <SectionHeading id="construction-ready-title" accent="red"><em>{cms.text("copy.doma.7", "Готовые")}</em> {cms.text("copy.doma.8", " дома")}</SectionHeading>
      <ul className={`${houses.grid} ${houses.readyGrid} ${styles.grid}`}>
        {readyHouses.map(house => <li key={house.slug}><HouseCard house={house} ready variant="catalog" /></li>)}
      </ul>
    </section>
    <section className={`shell ${formPanel.section}`} id="construction-calculation" aria-labelledby="construction-calculation-title">
      <PhotoFormPanel variant="construction" image={{src:cms.text("copy.doma.9", '/images/construction/calculation.webp'),alt:cms.text("copy.doma.10", 'Деревянный дом за цветущим лугом'),width:1280,height:853}} intro={<>
        <h2 id="construction-calculation-title">{cms.text("copy.doma.11", "Рассчитаем стоимость ")}<em>{cms.text("copy.doma.12", "строительства дома")}</em></h2>
        <p data-reveal>{cms.text("copy.doma.13", "Оставьте имя и телефон. Мы свяжемся с вами, обсудим, какой дом вы хотите построить, и подготовим расчёт.")}</p>
      </>}>
        <InlineRequestForm definition={leadForms.construction} submitLabel={cms.text("copy.doma.14", "Получить расчёт")} />
      </PhotoFormPanel>
    </section>
  </SitePage>;
}

const _cmsSource_constructionProjects = constructionProjects;
const _cmsSource_readyHouses = readyHouses;

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "doma");
}
