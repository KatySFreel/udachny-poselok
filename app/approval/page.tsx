
import { getCmsCopy } from "../../lib/cms-store";
import { LegalDocument } from "../../components/legal-document";
import { dataConsentParagraphs } from "../../content/legal";
import { createPageMetadata, localizePageMetadata } from "../../lib/site-metadata";

const baseMetadata = createPageMetadata({
  title: "Согласие на обработку персональных данных | Удачный посёлок",
  description: "Согласие на обработку персональных данных пользователей сайта «Удачный посёлок».",
  path: "/approval",
});

export default async function ApprovalPage() {
  const cms = await getCmsCopy();
  const dataConsentParagraphs = cms.data("data.dataConsentParagraphs", _cmsSource_dataConsentParagraphs);

  return <LegalDocument id="approval" variant="consent"
    title={cms.text("copy.approval.1", "Согласие на обработку персональных данных")}
    sections={dataConsentParagraphs.map(paragraph => ({paragraphs:[paragraph]}))}
    homeLabel={cms.text("copy.approval.2", "На главную страницу")} />;
}

const _cmsSource_dataConsentParagraphs = dataConsentParagraphs;

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "approval");
}
