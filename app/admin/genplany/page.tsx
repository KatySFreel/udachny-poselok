import type { Metadata } from "next";
import { PlanAdmin } from "../../../components/plan-admin";
import { settlementPages } from "../../../content/settlement-pages";

export const metadata: Metadata = {
  title: "Генпланы — управление",
  robots: { index: false, follow: false },
};
export default function PlanAdminPage() {
  return (
    <PlanAdmin
      settlements={settlementPages.map((p) => ({
        slug: p.slug,
        name: p.name,
        assets: p.assets,
      }))}
    />
  );
}
