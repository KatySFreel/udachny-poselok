import type * as server from "../app/plan-actions";
export const planAdminAccess: typeof server.planAdminAccess = async () => ({
  configured: false,
  authenticated: false,
  staticPreview: true,
});
export const loginPlanAdmin: typeof server.loginPlanAdmin = async () => ({
  ok: false,
  message: "Редактирование доступно в серверной версии сайта.",
});
export const logoutPlanAdmin: typeof server.logoutPlanAdmin = async () => {};
export const readPublicPlan: typeof server.readPublicPlan = async () => null;
export const savePlan: typeof server.savePlan = async () => ({
  ok: false,
  message: "Редактирование доступно в серверной версии сайта.",
});
