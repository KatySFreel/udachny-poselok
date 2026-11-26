export type BlogPost = {
  slug: string;
  title: string;
  category: "news" | "articles";
};

export const blogCategories = {
  news: { label: "Новости", cardLabel: "Новость" },
  articles: { label: "Статьи", cardLabel: "Статья" },
} as const;

export const blogPosts: readonly BlogPost[] = [
  {
    slug: "zemelnyy-sertifikat",
    title: "Земельный сертификат Санкт-Петербурга: как купить участок в Ленинградской области",
    category: "articles",
  },
  {
    slug: "kak-vybrat-uchastok",
    title: "Как выбрать участок в Ленинградской области для строительства дома",
    category: "articles",
  },
  {
    slug: "stoimost-karkasnogo-doma",
    title: "Сколько стоит построить каркасный дом в Ленинградской области: полный бюджет",
    category: "articles",
  },
];

// The supplied listing repeats the third publication in its remaining slots.
// Keep these slots separate from the three publications featured on the home page.
export const blogListingPosts = [
  ...blogPosts,
  ...Array.from({length: 5}, () => blogPosts[2]),
].map((post,index) => ({id: `publication-${index + 1}`,post}));
