import { sitePath } from "../lib/site-path";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ActionAppearance = {
  children: ReactNode;
  variant?: "primary" | "light";
  arrow?: boolean;
};

function ActionContent({ children, arrow }: ActionAppearance) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="action__icon">
          <img src={sitePath("/icons/arrow.svg")} alt="" width={24.513} height={24.513} />
        </span>
      )}
    </>
  );
}

export function ActionLink({
  children,
  variant = "primary",
  arrow,
  ...props
}: ActionAppearance & ComponentPropsWithoutRef<"a">) {
  return (
    <a {...props} className={`action action--${variant} action--${arrow ? "with-arrow" : "text"}`}>
      <ActionContent arrow={arrow}>{children}</ActionContent>
    </a>
  );
}

export function ActionButton({
  children,
  variant = "primary",
  arrow,
  ...props
}: ActionAppearance & ComponentPropsWithoutRef<"button">) {
  return (
    <button type="button" {...props} className={`action action--${variant} action--${arrow ? "with-arrow" : "text"}`}>
      <ActionContent arrow={arrow}>{children}</ActionContent>
    </button>
  );
}
