import type { SettlementPlanData } from "../content/settlement-pages";

export type PlanDocument = {
  version: 1;
  slug: string;
  revision: number;
  updatedAt?: string;
  plans: SettlementPlanData[];
};
export type PlanResult =
  | { ok: true; document: PlanDocument }
  | { ok: false; message: string; conflict?: boolean };
export const plotStatusLabels = {
  available: "В продаже",
  reserved: "Забронирован",
  sold: "Продан",
  unknown: "Уточнить наличие",
  construction: "С подрядным строительством",
  unavailable: "Недоступен",
} as const;

/** Validate the complete write, including imports. Coordinates always belong to the source image. */
export function validatePlans(value: unknown): value is SettlementPlanData[] {
  if (!Array.isArray(value) || !value.length || value.length > 10) return false;
  return value.every((plan) => {
    if (
      !plan ||
      typeof plan !== "object" ||
      !Number.isFinite(plan.width) ||
      !Number.isFinite(plan.height) ||
      plan.width < 100 ||
      plan.height < 100 ||
      plan.width > 20000 ||
      plan.height > 20000
    )
      return false;
    if (
      typeof plan.image !== "string" ||
      !/^[a-zA-Z0-9_-]{1,120}$/.test(plan.image) ||
      !["webp", "png", "jpg"].includes(plan.imageExtension ?? "webp")
    )
      return false;
    if (plan.appearance !== undefined && plan.appearance !== "aerial")
      return false;
    if (plan.filterKind !== undefined && plan.filterKind !== "construction")
      return false;
    if (
      plan.overlays !== undefined &&
      (!Array.isArray(plan.overlays) ||
        plan.overlays.length > 30 ||
        plan.overlays.some(
          (o: Record<string, unknown>) =>
            !o ||
            typeof o.image !== "string" ||
            !/^[a-zA-Z0-9_-]{1,120}$/.test(o.image) ||
            typeof o.label !== "string" ||
            o.label.length > 120 ||
            !["x", "y", "width", "height"].every(
              (key) => typeof o[key] === "number" && Number.isFinite(o[key]),
            ) ||
            Number(o.x) < 0 ||
            Number(o.y) < 0 ||
            Number(o.width) <= 0 ||
            Number(o.height) <= 0 ||
            Number(o.x) + Number(o.width) > plan.width ||
            Number(o.y) + Number(o.height) > plan.height,
        ))
    )
      return false;
    if (
      plan.backgroundDataUrl !== undefined &&
      (typeof plan.backgroundDataUrl !== "string" ||
        plan.backgroundDataUrl.length > 1_500_000 ||
        !/^data:image\/webp;base64,[A-Za-z0-9+/]+=*$/.test(
          plan.backgroundDataUrl,
        ))
    )
      return false;
    if (
      plan.label !== undefined &&
      (typeof plan.label !== "string" || plan.label.length > 120)
    )
      return false;
    const phases = plan.phases ?? [];
    const validPoints = (points: unknown) =>
      Array.isArray(points) &&
      points.length >= 3 &&
      points.length <= 600 &&
      points.every(
        (xy: unknown) =>
          Array.isArray(xy) &&
          xy.length === 2 &&
          xy.every(Number.isFinite) &&
          xy[0] >= 0 &&
          xy[1] >= 0 &&
          xy[0] <= plan.width &&
          xy[1] <= plan.height,
      );
    if (
      Array.isArray(phases) &&
      phases.some((p) => p?.outline !== undefined && !validPoints(p.outline))
    )
      return false;
    if (
      !Array.isArray(phases) ||
      phases.length > 20 ||
      phases.some(
        (p: { id: string; label: string }) =>
          !p ||
          typeof p.id !== "string" ||
          !/^[a-zA-Z0-9_-]{1,40}$/.test(p.id) ||
          typeof p.label !== "string" ||
          !p.label.trim() ||
          p.label.length > 80,
      ) ||
      new Set(phases.map((p: { id: string }) => p.id)).size !== phases.length
    )
      return false;
    if (
      !Array.isArray(plan.plots) ||
      plan.plots.length > 3000 ||
      new Set(plan.plots.map((p: { id: string }) => p?.id)).size !==
        plan.plots.length
    )
      return false;
    return plan.plots.every((p: Record<string, unknown>) => {
      if (!p || typeof p !== "object") return false;
      if (
        p.paths !== undefined &&
        (!Array.isArray(p.paths) ||
          p.paths.length > 8 ||
          p.paths.some(
            (path: Record<string, unknown>) =>
              !path ||
              typeof path.d !== "string" ||
              path.d.length > 100_000 ||
              !/^[MLCZQAHVSmlczqahvs0-9eE., +\-]+$/.test(path.d) ||
              !Array.isArray(path.transform) ||
              path.transform.length !== 6 ||
              !path.transform.every(
                (n: unknown) =>
                  typeof n === "number" &&
                  Number.isFinite(n) &&
                  Math.abs(n) <= 20000,
              ),
          ))
      )
        return false;
      if (
        ["labelOnly", "hideLabel"].some(
          (key) => p[key] !== undefined && typeof p[key] !== "boolean",
        )
      )
        return false;
      if (
        !p ||
        typeof p.id !== "string" ||
        !/^[a-zA-Z0-9_-]{1,120}$/.test(p.id) ||
        typeof p.number !== "string" ||
        !p.number.trim() ||
        p.number.length > 40 ||
        !Object.hasOwn(plotStatusLabels, String(p.status))
      )
        return false;
      if (
        p.phaseId !== undefined &&
        !phases.some((phase: { id: string }) => phase.id === p.phaseId)
      )
        return false;
      if (
        p.certificateEligible !== undefined &&
        typeof p.certificateEligible !== "boolean"
      )
        return false;
      for (const key of ["area", "price"])
        if (
          p[key] !== undefined &&
          (typeof p[key] !== "number" ||
            !Number.isFinite(p[key]) ||
            Number(p[key]) <= 0 ||
            Number(p[key]) > (key === "area" ? 10000 : 1e11))
        )
          return false;
      if (
        !Array.isArray(p.points) ||
        p.points.length < 3 ||
        p.points.length > 600 ||
        !p.points.every(
          (xy: unknown) =>
            Array.isArray(xy) &&
            xy.length === 2 &&
            xy.every(Number.isFinite) &&
            xy[0] >= 0 &&
            xy[1] >= 0 &&
            xy[0] <= plan.width &&
            xy[1] <= plan.height,
        )
      )
        return false;
      const label = p.label as
        | { x: number; y: number; rotation?: number; fontSize?: number }
        | undefined;
      return (
        !label ||
        (Number.isFinite(label.x) &&
          Number.isFinite(label.y) &&
          label.x >= 0 &&
          label.y >= 0 &&
          label.x <= plan.width &&
          label.y <= plan.height &&
          (label.fontSize === undefined ||
            (Number.isFinite(label.fontSize) &&
              label.fontSize >= 8 &&
              label.fontSize <= 72)) &&
          (label.rotation === undefined ||
            (Number.isFinite(label.rotation) &&
              Math.abs(label.rotation) <= 360)))
      );
    });
  });
}
