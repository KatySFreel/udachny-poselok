export type House = {
  slug: string;
  name: string;
  price: number;
  imageWidth: number;
  image?: string;
  tags: readonly { icon: "size" | "bed" | "finish" | "heat"; label: string }[];
};

export const houseProjects: readonly House[] = [
  { slug: "uyutnyy", name: "Уютный", price: 2810000, imageWidth: 1181, tags: [{ icon: "size", label: "6 × 8 м" }] },
  { slug: "skandi", name: "Сканди", price: 4550000, imageWidth: 1206, tags: [{ icon: "size", label: "6 × 11 м" }] },
  { slug: "smayl", name: "Смайл", price: 4700000, imageWidth: 1672, tags: [{ icon: "size", label: "9 × 6 м" }] },
  { slug: "panorama", name: "Панорама", price: 5800000, imageWidth: 1280, tags: [{ icon: "size", label: "12 × 8,5 м" }] },
  { slug: "norman", name: "Норман", price: 6550000, imageWidth: 1672, tags: [{ icon: "size", label: "11 × 8 м" }] },
];

export const readyHouses: readonly House[] = [
  {
    slug: "resten",
    name: "Рестен",
    price: 11000000,
    imageWidth: 1280,
    tags: [
      { icon: "size", label: "87 м²" },
      { icon: "bed", label: "2 спальни" },
      { icon: "finish", label: "Чистовая отделка" },
    ],
  },
  {
    slug: "resten-2",
    name: "Рестен 2",
    price: 8000000,
    imageWidth: 1361,
    tags: [
      { icon: "size", label: "87 м²" },
      { icon: "bed", label: "2 спальни" },
      { icon: "heat", label: "Тёплый контур" },
    ],
  },
];

/** The home page keeps its five featured projects. */
export const constructionProjects: readonly House[] = [
  ...houseProjects,
  { slug: "bjerk", name: "Бьерк", price: 7500000, imageWidth: 1672, image: "/images/construction/bjerk.webp", tags: [{ icon: "size", label: "11 × 7,7 м" }] },
  { slug: "family", name: "Фэмили", price: 7800000, imageWidth: 1672, image: "/images/construction/family.webp", tags: [{ icon: "size", label: "11,2 × 8 м" }] },
  { slug: "fjord", name: "Фьёрд", price: 7950000, imageWidth: 1672, image: "/images/construction/fjord.webp", tags: [{ icon: "size", label: "12 × 8 м" }] },
  { slug: "viking", name: "Викинг", price: 8500000, imageWidth: 1672, image: "/images/construction/viking.webp", tags: [{ icon: "size", label: "14 × 7 м" }] },
  { slug: "simo", name: "Симо", price: 10100000, imageWidth: 1280, image: "/images/construction/simo.webp", tags: [{ icon: "size", label: "12,8 × 13 м" }] },
];
