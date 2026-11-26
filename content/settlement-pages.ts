import { settlements } from "./settlements";
import settlementDetails from "./settlement-page-details.json";
import type { House } from "./houses";
import newSettlementPlans from "./settlement-plans.json";

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

export const settlementPages: readonly SettlementPageData[] = [
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

export function getSettlementPage(slug: string) {
  return settlementPages.find((page) => page.slug === slug);
}

export { settlementPaymentOptions } from "./settlement-payment";
