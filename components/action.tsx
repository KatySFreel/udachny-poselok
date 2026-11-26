import { sitePath } from "../lib/site-path";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ActionAppearance = {
  children: ReactNode;
  variant?: "primary" | "light";
  arrow?: boolean;
};
export function ActionIcon({src = '/icons/arrow.svg',responsive = false,hidden}: {src?:string;responsive?:boolean;hidden?:boolean}) {
  const icon = <img src={sitePath(src)} alt="" width={24.513} height={24.513} />;
  return <span className="action__icon" aria-hidden={hidden}>
    {responsive ? <picture><source media="(width < 768px)" srcSet={sitePath('/icons/settlement-arrow-mobile.svg')} width={18.3848} height={18.3848} />{icon}</picture> : icon}
  </span>;
}
function ActionContent({children,arrow,iconSrc}: Pick<ActionAppearance,'children' | 'arrow'> & {iconSrc?:string}) {
  return <><span>{children}</span>{arrow && <ActionIcon src={iconSrc} />}</>;
}
function actionClassName(variant: NonNullable<ActionAppearance['variant']>,arrow?:boolean,className = '') {
  return `action action--${variant} action--${arrow ? 'with-arrow' : 'text'}${className ? ` ${className}` : ''}`;
}
export function ActionLink({children,variant = 'primary',arrow,className,...props}: ActionAppearance & ComponentPropsWithoutRef<'a'>) {
  return <a {...props} className={actionClassName(variant,arrow,className)}><ActionContent arrow={arrow}>{children}</ActionContent></a>;
}
export function ActionButton({children,variant = 'primary',arrow,className,...props}: ActionAppearance & ComponentPropsWithoutRef<'button'>) {
  return <button type="button" {...props} className={actionClassName(variant,arrow,className)}><ActionContent arrow={arrow}>{children}</ActionContent></button>;
}
/** Visual button inside an existing link: no nested interactive element. */
export function ActionLabel({children,variant = 'primary',arrow,iconSrc}: ActionAppearance & {iconSrc?:string}) {
  return <span className={actionClassName(variant,arrow)}><ActionContent arrow={arrow} iconSrc={iconSrc}>{children}</ActionContent></span>;
}
