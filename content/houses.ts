export type House = {
  slug: string;
  name: string;
  price: number;
  imageWidth: number;
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
