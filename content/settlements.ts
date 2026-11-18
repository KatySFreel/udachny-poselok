export const settlementDistricts = [
  { id: "lomonosovskiy", label: "Ломоносовский" },
  { id: "vyborgskiy", label: "Выборгский" },
  { id: "luzhskiy", label: "Лужский" },
  { id: "tosnenskiy", label: "Тосненский" },
  { id: "kirovskiy", label: "Кировский" },
] as const;

type DistrictId = (typeof settlementDistricts)[number]["id"];

export type Settlement = {
  slug: string;
  name: string;
  districtId: DistrictId;
  location: string;
  price: number;
  highlights: readonly (string | { label: string; shortLabel: string })[];
  photoWidth?: number;
  widePhoto?: string;
};

export const settlements: readonly Settlement[] = [
  {
    slug: "troitskaya-sloboda",
    name: "«Троицкая Слобода»",
    districtId: "lomonosovskiy",
    location: "Ломоносовский район",
    price: 598000,
    highlights: ["Лес по границе", "30 минут от КАД"],
  },
  {
    slug: "istorii-severa",
    name: "«Истории Севера»",
    districtId: "vyborgskiy",
    location: "Выборгский район",
    price: 528000,
    photoWidth: 535,
    highlights: [
      { label: "Рассрочка на 12 месяцев без %", shortLabel: "Рассрочка на 12 мес. без %" },
      "10 минут от Выборга",
    ],
  },
  {
    slug: "bereg-tigody",
    name: "«Берег Тигоды»",
    districtId: "tosnenskiy",
    location: "Тосненский район",
    price: 508000,
    highlights: [
      { label: "Рассрочка на 18 месяцев без %", shortLabel: "Рассрочка на 18 мес. без %" },
      "Рассрочка без ПВ",
      "Река по границе",
    ],
  },
  {
    slug: "divnyy",
    name: "«Дивный»",
    districtId: "luzhskiy",
    location: "Граница Гатчинского и Лужского р-нов.",
    price: 508000,
    highlights: ["Газ по границе"],
  },
  {
    slug: "severnyy-bereg",
    name: "«Северный Берег»",
    districtId: "vyborgskiy",
    location: "Выборгский район",
    price: 780000,
    highlights: ["Общественная зона", "Река по границе", "30 минут от Выборга"],
    widePhoto: "/images/settlements/severnyy-bereg-wide.webp",
  },
  {
    slug: "zelenyy-les",
    name: "«Зелёный лес»",
    districtId: "kirovskiy",
    location: "Кировский район",
    price: 498000,
    highlights: ["Остался один участок"],
  },
  {
    slug: "simo",
    name: "Загородный клуб «Симо»",
    districtId: "lomonosovskiy",
    location: "Ломоносовский район",
    price: 2500000,
    highlights: ["Асфальтированные дороги", "Общественные зоны 1,3 га", "5 минут от КАД"],
  },
];
