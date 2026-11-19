import { sitePath } from "../lib/site-path";
import { navigation, site } from "../content/site";
import { ConsultationDialog } from "./contact-dialog";
import { consultationId, consultationTitle } from "../content/home";
import { CoverHeader } from "./cover-header";
import { SiteLogo } from "./site-logo";

const openConsultation = { commandfor: consultationId, command: "show-modal" };

function Navigation({ label, mobile = false }: { label: string; mobile?: boolean }) {
  return (
    <nav aria-label={label}>
      <ul className="nav-list">
        {navigation.map((item) => (
          <li key={item.label}>
            {"children" in item ? (
              <NavigationGroup label={item.label} links={item.children} mobile={mobile} />
            ) : (
              <a href={sitePath(item.href)}>{item.label}</a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NavigationGroup({
  label,
  links,
  mobile,
}: {
  label: string;
  links: readonly { label: string; href: string }[];
  mobile: boolean;
}) {
  const submenu = (
    <ul className="nav-group__links">
      {links.map((link) => (
        <li key={link.href}><a href={sitePath(link.href)}>{link.label}</a></li>
      ))}
    </ul>
  );

  return mobile ? (
    <details className="nav-group">
      <summary className="nav-group__trigger">{label}</summary>
      {submenu}
    </details>
  ) : (
    <div className="nav-group">
      <button className="nav-group__trigger" type="button">{label}</button>
      {submenu}
    </div>
  );
}

export function SiteHeader({ coverId }: { coverId: string }) {
  return (
    <>
      <CoverHeader coverId={coverId}>
        <SiteLogo />
        <div className="header-nav"><Navigation label="Основная навигация" /></div>
        <div className="header-contact">
          <a className="header-phone" href={site.phoneHref} aria-label={site.phone}>
            <span className="header-phone__number">{site.phone}</span>
            <span className="header-phone__icon">
              <img src={sitePath("/icons/header-phone.svg")} width={28.5328} height={28.7058} alt="" />
            </span>
          </a>
          <button
            className="header-consultation"
            type="button"
            {...openConsultation}
          >
            {consultationTitle}
          </button>
          <details className="mobile-menu">
            <summary aria-label="Меню">
              <img src={sitePath("/icons/mobile-menu/hamburger.svg")} alt="" width={16} height={14} />
            </summary>
            <div className="mobile-menu__panel">
              <Navigation label="Мобильная навигация" mobile />
              <button type="button" {...openConsultation}>
                {consultationTitle}
              </button>
            </div>
          </details>
        </div>
      </CoverHeader>
      <ConsultationDialog />
    </>
  );
}
