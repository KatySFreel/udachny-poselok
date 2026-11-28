import { SitePage } from './site-page';
import { SectionHeading } from './section-heading';
import { HouseCard } from './house-card';
import { CatalogCard } from './catalog-card';
import { PhotoFormPanel } from './photo-form-panel';
import { HouseProjectHero, HouseProjectPlan, CompletedHouseGallery, HouseCalculationForm } from './house-project-interactive';
import { ActionLink } from './action';
import { Quiz } from './quiz';
import { houseAsset, houseQuiz, type HouseProject } from '../content/house-project';
import { leadTrigger } from '../lib/lead-attribution';
import { sitePath } from '../lib/site-path';
import styles from './house-project.module.css';
import houses from './home-houses.module.css';
import shared from './settlements.module.css';
import formPanel from './photo-form-panel.module.css';
import quiz from './home-quiz.module.css';

export function HouseProjectPage({project}: {project: HouseProject}) {
  return <SitePage className={styles.page} coverId="house-cover" mainId="house-main">
    <HouseProjectHero project={project} />
    <section className={`shell ${styles.section} ${styles.about}`} aria-labelledby="house-about-title">
      <SectionHeading stackedOnTablet id="house-about-title">О проекте</SectionHeading>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.overview}>
        <dl className={styles.features}>{project.features.map(feature => <div key={feature.icon}>
          <img src={sitePath(houseAsset(`${feature.icon}.svg`))} width={24} height={24} alt="" />
          <dd>{feature.value}</dd><dt>{feature.label}</dt>
        </div>)}</dl>
        <div className={styles.price}>
          <p>Стоимость от</p><strong>{project.price}</strong>
          <p>Строительство включает фундамент, стены, кровлю, окна и двери, а также сопровождение работ. По запросу подберём комплектацию и рассчитаем стоимость.</p>
          <ActionLink arrow variant="light" href="#house-quiz" {...leadTrigger(houseQuiz.id,{buttonId:`${project.slug}-price-calculation`,buttonLabel:'Получить расчёт',placement:'project-overview'})}>Получить расчёт</ActionLink>
        </div>
      </div>
    </section>
    <HouseProjectPlan project={project} />
    <section className={`shell ${formPanel.section}`} id="house-calculation" aria-labelledby="house-calculation-title">
      <PhotoFormPanel variant="construction" image={{src:'/images/certificate/house-keys.webp',alt:'Ключи от загородного дома',width:1280,height:853}} intro={<>
        <h2 id="house-calculation-title">Получить расчёт <em>строительства</em></h2>
        <p>Оставьте имя и телефон. Уточним детали и подготовим расчёт по этому проекту.</p>
      </>}><HouseCalculationForm project={project} /></PhotoFormPanel>
    </section>
    <CompletedHouseGallery />
    <section className={`shell ${quiz.section}`} id="house-quiz" aria-labelledby="house-quiz-title"><Quiz variant="house" /></section>
    <section className={`shell ${shared.section} ${styles.recommendations}`} aria-labelledby="house-recommendations-title" data-count={project.recommendations.length}>
      <SectionHeading stackedOnTablet label="Другие проекты" id="house-recommendations-title">Больше <em>архитектурных</em> решений</SectionHeading>
      <ul className={houses.grid}>
        {project.recommendations.map(house => <li key={house.slug}><HouseCard house={house} variant="catalog" /></li>)}
        <li className={houses.catalogSlot}><CatalogCard href="/doma#proekty-domov" label="Смотреть все проекты домов" title="Посмотреть все проекты домов" imageDirectory="/images/houses" pattern={{src:'/images/houses/pattern.svg',tablet:'/images/houses/pattern-tablet.svg',desktop:'/images/houses/pattern-desktop.svg',width:608}} className={houses.catalog} patternClassName={houses.pattern} /></li>
      </ul>
    </section>
  </SitePage>;
}
