"use client";
import { useCmsCopy } from "./cms-provider";


import type { SettlementPageData } from "../content/settlement-pages";
import { sitePath } from "../lib/site-path";
import { LoopingCarouselTrack } from "./looping-carousel-track";
import { CarouselControls } from "./carousel-controls";
import { useLoopingCarousel } from "./use-looping-carousel";
import styles from "./settlement-page.module.css";

export function SettlementGallery({ data }: { data: SettlementPageData }) {
  const cms = useCmsCopy();

  const { carousel, viewport, move, onKeyDown } = useLoopingCarousel({
    count: data.gallery.length,
    delay: 3000,
    pauseOnHover: false,
  });
  const viewportId = `${data.slug}-gallery`;

  return (
    <div ref={carousel} className={styles.galleryCarousel} data-reveal>
      <CarouselControls className={styles.galleryControls} viewportId={viewportId}
        label={cms.text("copy.settlement-gallery.1", "Навигация по фотографиям")} previousLabel="Предыдущие фотографии" nextLabel="Следующие фотографии"
        onPrevious={() => move.current(-1)} onNext={() => move.current(1)} />
      <div ref={viewport} id={viewportId} className={`carousel-viewport ${styles.galleryRail}`}
        role="group" aria-label={`Фотографии посёлка ${data.name}`} tabIndex={0} onKeyDown={onKeyDown}>
        <LoopingCarouselTrack>
          {original => data.gallery.map(photo => <figure key={photo.image} className={styles.gallerySlide}>
            <img src={sitePath(photo.image.startsWith("/") ? photo.image : `${data.assets}/${photo.image}.webp`)} alt={original ? photo.alt : ''} width={445} height={682} loading="lazy" decoding="async" />
          </figure>)}
        </LoopingCarouselTrack>
      </div>
    </div>
  );
}
