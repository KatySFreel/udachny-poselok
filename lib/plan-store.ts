import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getSettlementPage } from "../content/settlement-pages";
import {
  validatePlans,
  type PlanDocument,
  type PlanResult,
} from "./plan-contract";

const directory = () =>
  process.env.PLAN_DATA_DIR ?? path.join(process.cwd(), ".data", "plans");
export function initialPlanDocument(slug: string): PlanDocument | null {
  const page = getSettlementPage(slug);
  return page
    ? {
        version: 1,
        slug,
        revision: 0,
        plans: [page.plan, ...(page.additionalPlans ?? [])],
      }
    : null;
}
export async function loadPlanDocument(
  slug: string,
): Promise<PlanDocument | null> {
  const initial = initialPlanDocument(slug);
  if (!initial) return null;
  try {
    const saved = JSON.parse(
      await readFile(path.join(directory(), `${slug}.json`), "utf8"),
    );
    if (
      saved.version !== 1 ||
      saved.slug !== slug ||
      !Number.isSafeInteger(saved.revision) ||
      !validatePlans(saved.plans)
    )
      throw new Error("Invalid saved plan");
    return saved;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return initial;
    throw error;
  }
}
// Serialise writes in this server process; revisions prevent another editor overwriting an older copy.
let queue: Promise<unknown> = Promise.resolve();
export async function persistPlanDocument(
  slug: string,
  revision: number,
  plans: unknown,
): Promise<PlanResult> {
  if (!validatePlans(plans) || JSON.stringify(plans).length > 2_000_000)
    return {
      ok: false,
      message: "Проверьте данные участков, контуры и размеры изображения.",
    };
  const operation = queue.then(async (): Promise<PlanResult> => {
    const current = await loadPlanDocument(slug);
    if (!current) return { ok: false, message: "Посёлок не найден." };
    if (current.revision !== revision)
      return {
        ok: false,
        conflict: true,
        message:
          "Генплан уже изменён в другой вкладке. Экспортируйте свои правки и загрузите свежую версию.",
      };
    const document: PlanDocument = {
      version: 1,
      slug,
      revision: revision + 1,
      updatedAt: new Date().toISOString(),
      plans,
    };
    await mkdir(directory(), { recursive: true });
    const target = path.join(directory(), `${slug}.json`),
      temporary = `${target}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(document, null, 2), {
      mode: 0o600,
    });
    await rename(temporary, target);
    return { ok: true, document };
  });
  queue = operation.catch(() => {});
  return operation;
}
