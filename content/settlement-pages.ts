import { settlements } from "./settlements";
import settlementDetails from "./settlement-page-details.json";
import type { House } from "./houses";
import troitskayaGeometry from "./troitskaya-plan-geometry.json";
import troitskayaPhases from "./troitskaya-plan-phases.json";
import newSettlementPlans from "./settlement-plans.json";
import plotPrices from "./settlement-plot-prices.json";

/** Serializable page content. A future CMS adapter can return this same contract. */
export type PlotStatus =
  | "available"
  | "reserved"
  | "sold"
  | "unknown"
  | "construction"
  | "unavailable";
export type Plot = {
  id: string;
  number: string;
  points: readonly (readonly [number, number])[];
  status: PlotStatus;
  area?: number;
  price?: number;
  phaseId?: string;
  certificateEligible?: boolean;
  label?: { x: number; y: number; rotation?: number; fontSize?: number };
  labelOnly?: boolean;
  hideLabel?: boolean;
  paths?: readonly {
    d: string;
    transform: readonly [number, number, number, number, number, number];
  }[];
};
export type SettlementPageData = {
  slug: string;
  name: string;
  heroTitleLines?: readonly string[];
  mobileLocation?: string;
  location: string;
  distance: string;
  startingPrice: number;
  description: string;
  kind?: string;
  surroundingsImage?: string;
  assets: string;
  advantages: readonly { title: string; description: string; image: string }[];
  gallery: readonly { image: string; alt: string }[];
  plan: SettlementPlanData;
  additionalPlans?: readonly SettlementPlanData[];
  readyHouses?: readonly House[];
  videoUrl?: string;
  presentationUrl?: string;
  related: readonly string[];
};
export type SettlementPlanData = {
  label?: string;
  width: number;
  height: number;
  image: string;
  imageExtension?: "webp" | "png" | "jpg";
  backgroundDataUrl?: string;
  appearance?: "aerial";
  filterKind?: "construction";
  overlays?: readonly {
    image: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  }[];
  phases?: readonly {
    id: string;
    label: string;
    outline?: readonly (readonly [number, number])[];
  }[];
  plots: readonly Plot[];
};

const updatedPlans = newSettlementPlans as unknown as Record<
  string,
  SettlementPlanData
>;

const knownAvailable: Record<string, readonly [number, number]> = {
  "2557": [8, 1330000],
  "2556": [8, 1330000],
  "2555": [8, 1330000],
  "2554": [8, 1330000],
  "2553": [8, 1330000],
  "2548": [8, 1330000],
  "2547": [8, 1330000],
  "2568": [6, 710000],
  "2539": [7, 1270000],
  "2550": [7, 1270000],
  "2572": [7, 1270000],
  "2583": [9, 1490000],
  "2594": [7, 1270000],
  "2602": [7, 1270000],
  "2542": [8.9, 1830000],
  "2541": [10, 2050000],
  "2540": [10.9, 2230000],
};
const troitskaya = settlements.find(
  (settlement) => settlement.slug === "troitskaya-sloboda",
)!;

const sourceSettlementPages: readonly SettlementPageData[] = [
  {
    slug: troitskaya.slug,
    name: troitskaya.name.replace(/[«»]/g, ""),
    heroTitleLines: ["Троицкая", "Слобода"],
    location: troitskaya.location,
    mobileLocation: "Ломоносовский р-н",
    distance: "30 минут от КАД",
    startingPrice: troitskaya.price,
    description:
      "— место для загородной жизни среди леса, где можно отдохнуть от городского ритма и обустроить семейную дачу с садом и уютным домом, а близость Лопухинки делает повседневные поездки за необходимым удобнее.",
    assets: "/images/settlements/troitskaya-sloboda",
    surroundingsImage: "surroundings",
    advantages: [
      {
        title: "Лес по границе",
        description:
          "Лес проходит вдоль границы посёлка, создавая природное окружение.",
        image: "forest",
      },
      {
        title: "30 минут от КАД",
        description: "Удобный маршрут из города по Гостилицкому шоссе.",
        image: "highway",
      },
      {
        title: "Лопухинка в 5 минутах",
        description: "Магазины, амбулатория, школа и детский сад поблизости.",
        image: "lopukhinka",
      },
      {
        title: "Подъезд к посёлку",
        description: "Асфальтированная дорога до въезда.",
        image: "access-road",
      },
      {
        title: "Дороги в посёлке",
        description: "Внутрипоселковые дороги шириной 6 метров.",
        image: "roads",
      },
      {
        title: "Электричество",
        description: "Подключение по прямому договору с Ленэнерго.",
        image: "electricity",
      },
    ],
    gallery: [
      "Прогулка по посёлку",
      "Дорога у посёлка",
      "Посёлок с высоты",
      "Летнее поле",
      "Окрестности посёлка",
      "Участки с высоты",
      "Дороги в посёлке",
      "Остановка рядом с посёлком",
    ].map((alt, index) => ({ image: `gallery-${index + 1}`, alt })),
    plan: {
      width: 1840,
      height: 1000,
      image: "plan-aerial",
      imageExtension: "webp",
      appearance: "aerial",
      phases: troitskayaPhases as {
        id: string;
        label: string;
        outline: [number, number][];
      }[],
      plots: troitskayaGeometry.map((item) => {
        const known = knownAvailable[item.number];
        return {
          id: `troitskaya-${item.id.replace("plot-", "")}`,
          number: item.number,
          points: item.points as [number, number][],
          label: item.label,
          phaseId: item.number.startsWith("У") ? "2" : "1",
          status: item.available ? "available" : "sold",
          ...(known ? { area: known[0], price: known[1] } : {}),
        };
      }),
    },
    related: ["divnyy", "simo", "istorii-severa"],
  },
  ...settlementDetails.map((page) => ({
    ...page,
    plan: updatedPlans[page.slug] ?? page.plan,
    additionalPlans:
      page.slug === "istorii-severa"
        ? [updatedPlans["istorii-severa-2"]]
        : undefined,
    ...(page.slug === "simo"
      ? {
          readyHouses: [
            {
              slug: "resten",
              name: "Рестен",
              price: 12500000,
              imageWidth: 1280,
              image: "/images/settlements/simo/house-resten.webp",
              tags: [
                { icon: "size" as const, label: "87 м²" },
                { icon: "bed" as const, label: "2 спальни" },
                { icon: "heat" as const, label: "Тёплый контур" },
              ],
            },
            {
              slug: "resten-2",
              name: "Рестен 2",
              price: 9500000,
              imageWidth: 1361,
              image: "/images/settlements/simo/house-resten-2.webp",
              tags: [
                { icon: "size" as const, label: "87 м²" },
                { icon: "bed" as const, label: "2 спальни" },
              ],
            },
          ],
        }
      : {}),
  })),
];

const priceBook: Record<string, Record<string, { area: number; price: number }>> = plotPrices;

function withPlotPrices(plan: SettlementPlanData, slug: string): SettlementPlanData {
  const prices = priceBook[slug] ?? {};
  return {
    ...plan,
    plots: plan.plots.map(plot => {
      const price = prices[plot.id];
      return price ? { ...plot, area: price.area, price: price.price } : plot;
    }),
  };
}

export const settlementPages: readonly SettlementPageData[] = sourceSettlementPages.map(page => ({
  ...page,
  plan: withPlotPrices(page.plan, page.slug),
  additionalPlans: page.additionalPlans?.map(plan => withPlotPrices(plan, page.slug)),
}));

export function getSettlementPage(slug: string) {
  return settlementPages.find((page) => page.slug === slug);
}

export { settlementPaymentOptions } from "./settlement-payment";
