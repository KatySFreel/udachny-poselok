"use client";
import styles from "./carousel-controls.module.css";

export function CarouselControls({ viewportId, label, previousLabel, nextLabel, onPrevious, onNext, className }: {
  viewportId: string;
  label: string;
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div className={`${styles.controls}${className ? ` ${className}` : ""}`} role="group" aria-label={label}>
      <button type="button" className="carousel-arrow" aria-controls={viewportId} aria-label={previousLabel} onClick={onPrevious} />
      <button type="button" className="carousel-arrow" aria-controls={viewportId} aria-label={nextLabel} onClick={onNext} />
    </div>
  );
}
