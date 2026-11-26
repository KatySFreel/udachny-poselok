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
    price: 600000,
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
    price: 1330000,
    highlights: ["Общественная зона", "Река по границе", "30 минут от Выборга"],
    widePhoto: "/images/settlements/severnyy-bereg-wide.webp",
  },
  {
    slug: "zelenyy-les",
    name: "«Зелёный лес»",
    districtId: "kirovskiy",
    location: "Кировский район",
    price: 1320000,
    highlights: ["Остался один участок"],
  },
  {
    slug: "simo",
    name: "Загородный клуб «Симо»",
    districtId: "lomonosovskiy",
    location: "Ломоносовский район",
    price: 2475000,
    highlights: ["Асфальтированные дороги", "Общественные зоны 1,3 га", "5 минут от КАД"],
  },
];

export type CompletedSettlement = Pick<Settlement, "slug" | "name" | "location"> & {
  year: number;
  route: string;
  direction?: string;
};

export const completedSettlements: readonly CompletedSettlement[] = [
  {
    slug: "zelenyy-bereg", name: "«Зелёный берег»", location: "Кировский район", year: 2018,
    route: "~60 км по Киевскому шоссе (трасса М10)", direction: "Юг, в сторону Пушкина",
  },
  {
    slug: "gostilitskoe", name: "«Гостилицкое»", location: "Ломоносовский район", year: 2019,
    route: "~40–50 км через Гостилицкое шоссе", direction: "Юго-запад, в сторону Гостилиц",
  },
  {
    slug: "gribnoe", name: "«Грибное»", location: "Выборгский район", year: 2019,
    route: "~70–80 км по Приозёрскому шоссе (трасса А121)", direction: "Северо-запад, в сторону Приозёрска",
  },
  {
    slug: "verkhnie-ruditsy", name: "«Верхние Рудицы»", location: "Ломоносовский район", year: 2020,
    route: "~60–70 км через Волхонское шоссе", direction: "Юго-запад, в сторону Волосово",
  },
  {
    slug: "mamontovka", name: "«Мамонтовка»", location: "Выборгский район", year: 2021,
    route: "~50–60 км через Светогорское шоссе", direction: "Север, в районе пос. Цвелодубово",
  },
  {
    slug: "staraya-burya", name: "«Старая буря»", location: "Ломоносовский район", year: 2022,
    route: "~55–65 км через Копорское шоссе", direction: "Юго-запад, ориентир — Копорье",
  },
  {
    slug: "divenskoe", name: "«Дивенское»", location: "Лужский район", year: 2022,
    route: "~100–110 км по Киевскому шоссе (трасса М20)", direction: "Юг, в сторону Луги",
  },
  {
    slug: "privetnyy", name: "«Приветный»", location: "Выборгский район", year: 2023,
    route: "~45–55 км через Выборгское ш. (трасса Скандинавия)", direction: "Северо-запад, в р-не п. Кирилловское",
  },
  {
    slug: "neskuchnaya-dacha", name: "«Нескучная дача»", location: "Ломоносовский район", year: 2023,
    route: "~65 км по Гостилицкому шоссе", direction: "Юго-запад, в сторону Красного Села",
  },
  {
    slug: "khochu-v-les", name: "«Хочу в лес»", location: "Выборгский район", year: 2024,
    route: "~60–70 км по Приморскому шоссе", direction: "Север, ориентир — Зеленогорск",
  },
  {
    slug: "sokolkino", name: "«Соколкино»", location: "Волосовский район", year: 2024,
    route: "~85 км через Гатчинское шоссе", direction: "Юг, в сторону Волосово",
  },
  {
    slug: "lesnoe-podvore", name: "«Лесное подворье»", location: "Ломоносовский район", year: 2025,
    route: "~25 км по Гостилицкому шоссе",
  },
];
