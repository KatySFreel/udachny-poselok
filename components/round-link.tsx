import { ActionIcon } from "./action";
import type { ComponentPropsWithoutRef } from "react";
import { sitePath } from "../lib/site-path";
import styles from "./round-link.module.css";

type RoundLinkProps = ComponentPropsWithoutRef<"a"> & { label: string; mobileLabel?: string; variant?: "default" | "not-found" };

export function RoundLink({ label, mobileLabel, variant = "default", className, ...props }: RoundLinkProps) {
  return (
    <a {...props} className={`${styles.link}${className ? ` ${className}` : ""}`}>
      <picture className={styles.seal}>
        <source media="(width < 768px)" srcSet={sitePath("/images/about/seal-mobile.svg")} width={165} height={172} />
        <img src={sitePath(variant === "not-found" ? "/images/not-found/seal.svg" : "/images/about/seal.svg")} width={variant === "not-found" ? 255 : 255.41} height={variant === "not-found" ? 266 : 267.243} alt="" loading={variant === "not-found" ? "eager" : "lazy"} />
      </picture>
      <span className={styles.content}>
        <span className={styles.label}>{mobileLabel ? <><span className={styles.desktopLabel}>{label}</span><span className={styles.mobileLabel}>{mobileLabel}</span></> : label}</span>
        <ActionIcon responsive hidden />
      </span>
    </a>
  );
}
