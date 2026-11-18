import { sitePath, siteSrcSet } from "../lib/site-path";
import { blogCategories, blogPosts } from "../content/blog";
import { BlogFilter } from "./blog-filter";
import { CatalogCard } from "./catalog-card";
import styles from "./home-blog.module.css";
import shared from "./settlements.module.css";

const imageDirectory = "/images/blog";
const catalogPattern = "/images/settlements/catalog-pattern.svg";
const photoSizes = "(width < 768px) calc(100vw - 40px), (width < 1024px) calc((100vw - 50px) / 2), (width <= 1280px) calc((95.83vw - 40px) / 3), (width <= 1920px) calc((95.83vw - 60px) / 4), 445px";

export function HomeBlog() {
  return (
    <section className={`shell ${shared.section} ${styles.section}`} id="home-blog" aria-labelledby="home-blog-title">
      <div className={shared.sectionLabel}>Блог</div>
      <h2 className={`${shared.heading} ${styles.heading}`} id="home-blog-title">
        Полезное для будущих <em>домовладельцев</em>
      </h2>
      <BlogFilter
        cards={blogPosts.map(({ slug, category, title }) => ({
          id: slug,
          category,
          card: (
            <a className={shared.card} href={sitePath(`/blog/${slug}`)} aria-labelledby={`blog-${slug}`}>
              <div className={`${shared.photoBox} ${styles.photo}`}>
                <picture className={shared.photo}>
                  <img
                    src={sitePath(`${imageDirectory}/${slug}.webp`)}
                    srcSet={siteSrcSet(`${imageDirectory}/${slug}-480.webp 480w, ${imageDirectory}/${slug}.webp 890w`)}
                    sizes={photoSizes}
                    width={890}
                    height={1200}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <ul className={shared.tags}><li>{blogCategories[category].cardLabel}</li></ul>
              </div>
              <h3 className={shared.cardTitle} id={`blog-${slug}`}>{title}</h3>
              <span className={shared.arrow} aria-hidden="true" />
            </a>
          ),
        }))}
        catalog={(
          <CatalogCard
            href={sitePath("/blog")}
            label="Смотреть все публикации"
            title="Посмотрите, что ещё мы подготовили для вас"
            imageDirectory={imageDirectory}
            pattern={{ src: catalogPattern, tablet: catalogPattern, width: 445 }}
            className={styles.catalog}
          />
        )}
      />
    </section>
  );
}
