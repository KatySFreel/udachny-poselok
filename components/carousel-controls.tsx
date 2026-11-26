"use client";
import styles from "./carousel-controls.module.css";

type CarouselButtonProps = {
  viewportId: string;
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};
/** Shared button semantics, also used by the bounded gallery's distinct styling. */
export function CarouselButtons({viewportId,previousLabel,nextLabel,onPrevious,onNext,previousDisabled,nextDisabled}:CarouselButtonProps) {
  return <>
    <button type="button" className="carousel-arrow" aria-controls={viewportId} aria-label={previousLabel} aria-disabled={previousDisabled} tabIndex={previousDisabled ? -1 : undefined} onClick={() => { if (!previousDisabled) onPrevious(); }} />
    <button type="button" className="carousel-arrow" aria-controls={viewportId} aria-label={nextLabel} aria-disabled={nextDisabled} tabIndex={nextDisabled ? -1 : undefined} onClick={() => { if (!nextDisabled) onNext(); }} />
  </>;
}
export function CarouselControls({label,className,...buttons}: CarouselButtonProps & {label:string;className?:string}) {
  return <div className={`${styles.controls}${className ? ` ${className}` : ""}`} role="group" aria-label={label}><CarouselButtons {...buttons} /></div>;
}
