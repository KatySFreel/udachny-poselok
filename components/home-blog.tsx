"use client";
import { useCmsCopy } from "./cms-provider";


import { blogPosts } from "../content/blog";
import { BlogFilter } from "./blog-filter";
import { BlogCard } from "./blog-card";
import { CatalogCard } from "./catalog-card";
import styles from "./home-blog.module.css";
import shared from "./settlements.module.css";

const imageDirectory = "/images/blog";
const catalogPattern = "/images/settlements/catalog-pattern.svg";

export function HomeBlog() {
  const cms = useCmsCopy();
  const blogPosts = cms.data("data.blogPosts", _cmsSource_blogPosts);

  return (
    <section className={`shell ${shared.section} ${styles.section}`} id="home-blog" aria-labelledby="home-blog-title">
      <div className={shared.sectionLabel}>{cms.text("copy.home-blog.1", "Блог")}</div>
      <h2 className={`${shared.heading} ${styles.heading}`} id="home-blog-title">
        {cms.text("copy.home-blog.2", "Полезное для будущих ")}<em>{cms.text("copy.home-blog.3", "домовладельцев")}</em>
      </h2>
      <BlogFilter
        cards={blogPosts.map(post => ({
          id: post.slug,
          category: post.category,
          card: <BlogCard post={post} />,
        }))}
        catalog={(
          <CatalogCard
            href="/blog"
            label={cms.text("copy.home-blog.4", "Смотреть все публикации")}
            title={cms.text("copy.home-blog.5", "Посмотрите, что ещё мы подготовили для вас")}
            imageDirectory={imageDirectory}
            pattern={{ src: catalogPattern, tablet: catalogPattern, width: 445 }}
            className={styles.catalog}
          />
        )}
      />
    </section>
  );
}

const _cmsSource_blogPosts = blogPosts;
