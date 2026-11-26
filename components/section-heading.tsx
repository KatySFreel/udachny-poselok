import type { ReactNode } from "react";
import shared from "./settlements.module.css";
import styles from "./section-heading.module.css";

export function SectionHeading({ label, children, id, className, headingClassName, accent = "inherit", inverse = false }: {
  label?: string;
  children: ReactNode;
  id?: string;
  className?: string;
  headingClassName?: string;
  accent?: "inherit" | "red";
  inverse?: boolean;
}) {
  return (
    <div className={`${styles.wrapper}${className ? ` ${className}` : ""}`} data-accent={accent} data-inverse={inverse || undefined} data-reveal>
      {label && <div className={shared.sectionLabel}>{label}</div>}
      <h2 id={id} className={`${shared.heading} ${styles.heading}${headingClassName ? ` ${headingClassName}` : ""}`}>{children}</h2>
    </div>
  );
}
