import { ResponsiveImage } from "../../components/responsive-image";

import { getCmsCopy } from "../../lib/cms-store";
import { SitePage } from '../../components/site-page';
import { BlogCard } from '../../components/blog-card';
import { BlogFilter } from '../../components/blog-filter';
import { blogListingPosts } from '../../content/blog';
import { createPageMetadata, localizePageMetadata } from '../../lib/site-metadata';
import styles from '../../components/blog-page.module.css';
import shared from '../../components/settlements.module.css';

const baseMetadata = createPageMetadata({title:'Блог — Удачный посёлок',description:'Полезные статьи о выборе участка, покупке земли и строительстве загородного дома в Ленинградской области. Новости компании «Удачный посёлок».',path:'/blog',image:{src:'/images/blog/cover.webp',alt:'Загородный пейзаж'}});

export default async function BlogPage() {
  const cms = await getCmsCopy();
  const blogListingPosts = cms.data("data.blogListingPosts", _cmsSource_blogListingPosts);

  return <SitePage className={styles.page} coverId="blog-cover" mainId="blog-main">
    <section className={`shell ${styles.cover}`} id="blog-cover" aria-labelledby="blog-title" data-cover-motion>
      <picture data-cover-parallax><ResponsiveImage src={cms.text("copy.blog.1", '/images/blog/cover.webp')} sizes="100vw" width={2400} height={1800} alt="" fetchPriority="high" /></picture>
      <h1 id="blog-title"><em>{cms.text("copy.blog.2", "Блог")}</em></h1>
    </section>
    <section className={`${shared.section} ${styles.listing}`} aria-label={cms.text("copy.blog.3", "Публикации блога")}>
      <BlogFilter variant="listing" cards={blogListingPosts.map(({id,post}) => ({id,category:post.category,card:<BlogCard post={post} variant="listing" idPrefix={id} />}))} />
    </section>
  </SitePage>;
}

const _cmsSource_blogListingPosts = blogListingPosts;

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "blog");
}
