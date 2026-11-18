type BlogPost = {
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
