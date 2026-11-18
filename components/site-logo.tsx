import { sitePath } from "../lib/site-path";
import { site } from "../content/site";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <a href={sitePath("/")} className={className ? `site-logo ${className}` : "site-logo"} aria-label={site.name}>
      <img src={sitePath("/icons/logo-symbol.svg")} alt="" width={39.4248} height={45.4902} />
      <span className="site-logo__wordmark">
        <img src={sitePath("/icons/logo-wordmark.svg")} alt="" width={68.2351} height={29.5683} />
      </span>
    </a>
  );
}
