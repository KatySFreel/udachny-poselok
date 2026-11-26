"use client";
import { useCmsCopy } from "./cms-provider";


import { InlineRequestForm } from "./contact-dialog";
import { leadForms } from "../lib/lead-attribution";
import { PhotoFormPanel } from "./photo-form-panel";
import styles from "./photo-form-panel.module.css";

export function HomeExcursion({ variant = "default" }: { variant?: "default" | "about" }) {
  const cms = useCmsCopy();

  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-excursion-title">
      <PhotoFormPanel variant={variant} image={{src:cms.text("copy.home-excursion.1", "/images/excursion-family.webp"),alt:"",width:1254,height:1254,decoding:"async",sources:cms.has("copy.home-excursion.1") ? undefined : [{media:"(max-width: 1023px)",srcSet:cms.text("copy.home-excursion.2", "/images/excursion-family-900.webp")}]}} intro={<>
            <h2 id="home-excursion-title">
              {variant === "about" ? <><span className={styles.aboutWide}>{cms.text("copy.home-excursion.3", "Каким")}<br />{cms.text("copy.home-excursion.4", "вы представляете")}<br /><em>{cms.text("copy.home-excursion.5", "своё место за городом?")}</em></span><span className={styles.aboutCompact}>{cms.text("copy.home-excursion.6", "Увидеть всё ")}<em>{cms.text("copy.home-excursion.7", "своими глазами")}</em></span></> : <>{cms.text("copy.home-excursion.8", "Увидеть всё ")}<em>{cms.text("copy.home-excursion.9", "своими глазами")}</em></>}
            </h2>
            <p data-reveal>
              {variant === "about" && <span className={styles.aboutWide}>{cms.text("copy.home-excursion.10", "Расскажите о своих планах. Подберём участки")}<br />{cms.text("copy.home-excursion.11", "под ваш бюджет и пригласим на просмотр.")}</span>}
              <span className={variant === "about" ? styles.aboutCompact : undefined}>{cms.text("copy.home-excursion.12", "Запишитесь на экскурсию")}<br className={styles.mobileDescriptionBreak} />{" "}
              {cms.text("copy.home-excursion.13", "и познакомьтесь")}<br className={styles.descriptionBreak} />{" "}
              {cms.text("copy.home-excursion.14", "с нашими посёлками.")}</span>
            </p>
      </>}>
          <InlineRequestForm definition={leadForms.excursion} submitLabel={cms.text("copy.home-excursion.15", "Записаться на экскурсию")} />
      </PhotoFormPanel>
    </section>
  );
}
