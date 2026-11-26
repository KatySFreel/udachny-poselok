"use server";

import { currentAdmin, loginAdminAccount, logoutAdminAccount, ownerPassword } from "../lib/admin-auth";
import { canEditPlans } from "../lib/admin-types";
import { loadPlanDocument, persistPlanDocument } from "../lib/plan-store";
import type { PlanResult } from "../lib/plan-contract";
export async function planAdminAccess() {
  const user = await currentAdmin();
  return { configured: !!ownerPassword(), authenticated: !!user && (canEditPlans(user.role) || user.role === 'viewer'), staticPreview: false };
}
export async function loginPlanAdmin(password: string) { return loginAdminAccount('admin', password); }
export async function logoutPlanAdmin() { return logoutAdminAccount(); }
export async function readPublicPlan(slug: string) {
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,100}$/.test(slug)) return null;
  return loadPlanDocument(slug);
}
export async function savePlan(
  slug: string,
  revision: number,
  plans: unknown,
): Promise<PlanResult> {
  const actor = await currentAdmin();
  if (!actor || !canEditPlans(actor.role))
    return { ok: false, message: "Недостаточно прав. Сохранять генпланы может администратор или менеджер участков." };
  if (
    typeof slug !== "string" ||
    !/^[a-z0-9-]{1,100}$/.test(slug) ||
    !Number.isSafeInteger(revision)
  )
    return { ok: false, message: "Неверный запрос." };
  try {
    return await persistPlanDocument(slug, revision, plans);
  } catch {
    return {
      ok: false,
      message:
        "Не удалось сохранить генплан. Правки остались в редакторе — повторите сохранение.",
    };
  }
}
