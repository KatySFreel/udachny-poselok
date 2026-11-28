
import { getCmsCopy } from "../../lib/cms-store";
import { LegalDocument } from "../../components/legal-document";
import { newsletterConsentSections } from "../../content/newsletter-consent";
import { createPageMetadata, localizePageMetadata } from "../../lib/site-metadata";

const baseMetadata = createPageMetadata({
  title: "Согласие на рассылку | Удачный посёлок",
  description: "Согласие на получение информационных и рекламно-маркетинговых рассылок проекта «Удачный посёлок».",
  path: "/newsletter-consent",
});

export default async function NewsletterConsentPage() {
  const cms = await getCmsCopy();
  const newsletterConsentSections = cms.data("data.newsletterConsentSections", _cmsSource_newsletterConsentSections);

  return <LegalDocument id="newsletter-consent"
    title={cms.text("copy.newsletter-consent.1", "Согласие\nна получение информационных и рекламно-маркетинговых рассылок")}
    sections={newsletterConsentSections} />;
}

const _cmsSource_newsletterConsentSections = newsletterConsentSections;

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "newsletter-consent");
}
