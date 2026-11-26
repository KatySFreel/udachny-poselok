"use client";
import { useCmsCopy } from "./cms-provider";


import { sitePath } from "../lib/site-path";
import { navigation, site } from "../content/site";
import { SiteLogo } from "./site-logo";
import styles from "./site-footer.module.css";


function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string; smallScreenOnly?: boolean }[];
}) {
  return (
    <nav aria-label={title}>
      <h2 className={styles.label}>{title}</h2>
      <ul className={styles.links}>
        {links.map(({ label, href, smallScreenOnly }) => (
          <li key={href} className={smallScreenOnly ? styles.smallScreenOnly : undefined}><a href={sitePath(href)}>{label}</a></li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const cms = useCmsCopy();
  const navigation = cms.data("data.navigation", _cmsSource_navigation);
  const site = cms.data("data.site", _cmsSource_site);

  const [settlements, houses, buyers, company, contacts] = navigation;
  const footerNavigation = [
    settlements,
    houses,
    { label: company.label, href: company.children[0].href, smallScreenOnly: true },
    { ...buyers.children[3], smallScreenOnly: true },
    { ...company.children[1], smallScreenOnly: true },
    contacts,
  ];

  return (
    <footer className={`shell ${styles.footer}`} id="contacts">
      <a className={styles.map} href={site.office.mapHref} target="_blank" rel="noopener noreferrer"
        aria-label={`${site.office.city}, ${site.office.street} — открыть в Яндекс Картах`}>
        <img className={styles.mapImage} src={sitePath(cms.text("copy.site-footer.1", "/images/footer/office-map-styled.webp"))} alt="" width={2172} height={724} loading="lazy" decoding="async" />
        <img className={styles.marker} src={sitePath("/icons/logo-symbol.svg")} alt="" width={52} height={60} />
        <div className={styles.mapLabel}>
          <p><img src={sitePath("/icons/footer/location.svg")} alt="" width={14.5833} height={18.7546} />{cms.text("copy.site-footer.2", "Адрес офиса")}</p>
          <p className={styles.address}><span>{site.office.city},</span>{site.office.street}</p>
        </div>
      </a>

      <div className={styles.panel} data-header-theme="light">
        <img className={styles.watermark} src={sitePath(cms.text("copy.site-footer.3", "/images/footer/watermark.svg"))} width={514.8} height={594} alt="" loading="lazy" />
        <SiteLogo className={styles.logo} />
        <div className={styles.navigation}>
          <FooterLinks title={cms.text("copy.site-footer.4", "Навигация")} links={footerNavigation} />
          <FooterLinks title={company.label} links={company.children} />
          <FooterLinks title={buyers.label} links={buyers.children} />
        </div>
        <div className={styles.contact}>
          <h2 className={styles.label}>{cms.text("copy.site-footer.5", "Контакты")}</h2>
          <div className={styles.contactBody}>
            <address className={styles.addressLinks}>
              <a href={site.phoneHref}>{site.phone}</a>
              <a href={site.emailHref}>{site.email}</a>
            </address>
            <ul className={styles.socials}>
              {site.socials.map(({ id, label, href }) => (
                <li key={id}>
                  <a href={sitePath(href)} aria-label={label}>
                    {id === "rutube" ? (
                      <span className={styles.rutube}>
                        <img src={sitePath("/icons/footer/rutube-art.svg")} alt="" width={60.5} height={60.5} />
                      </span>
                    ) : (
                      <img src={sitePath("/icons/footer/vk.svg")} alt="" width={24} height={24} />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.legal}>
          <a href={site.newsletterConsentHref}>{cms.text("copy.site-footer.6", "Согласие на рассылку")}</a>
          <a href={site.dataConsentHref}>{cms.text("copy.site-footer.7", "Согласие на обработку персональных данных")}</a>
        </div>
      </div>
    </footer>
  );
}

const _cmsSource_navigation = navigation;
const _cmsSource_site = site;
