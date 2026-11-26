import type { ReactNode } from 'react';
import { PageMotion } from './page-motion';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

/** The shared page shell keeps the fixed header, motion and footer in one place. */
export function SitePage({children,className = '',coverId,mainId,preloads,motion,dialogs}: {
  children: ReactNode;
  className?: string;
  coverId: string;
  mainId: string;
  preloads?: ReactNode;
  motion?: ReactNode;
  dialogs?: ReactNode;
}) {
  return <div className={`${className} cover-header-page`}>
    {preloads}
    <SiteHeader coverId={coverId} />
    <main id={mainId}>{children}</main>
    {motion}
    <PageMotion mainId={mainId} />
    <SiteFooter />
    {dialogs}
  </div>;
}
