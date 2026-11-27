"use client";
import { useEffect, useRef } from "react";
import { useCmsCopy } from "./cms-provider";


import { siteSrcSet, sitePath } from "../lib/site-path";
import { homeAdvantages } from "../content/home";
import styles from "./home-advantages.module.css";

function AdvantageFacts({
  facts,
}: {
  facts: readonly { value: readonly string[]; label: string }[];
}) {
  return (
    <ul className={styles.facts}>
      {facts.map(({ value, label }) => (
        <li className={styles.fact} key={label}>
          <p className={styles.value}>
            {value.map((line) => <span key={line}>{line}{" "}</span>)}
          </p>
          <p className={styles.label}>{label}</p>
        </li>
      ))}
    </ul>
  );
}

export function HomeAdvantages() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const updatePlayback = () => {
      if (visible && !motion.matches && !document.hidden) {
        if (!video.getAttribute("src")) video.src = sitePath("/videos/advantages-family.mp4");
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(video);
    motion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, []);

  const cms = useCmsCopy();
  const homeAdvantages = cms.data("data.homeAdvantages", _cmsSource_homeAdvantages);

  const { title, emphasis, description, firstFacts, secondFacts } = homeAdvantages;

  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-advantages-title">
      <h2 className={styles.heading} id="home-advantages-title">
        {title} <em>{emphasis}</em>
      </h2>
      <p className={styles.description} data-reveal>{description}</p>
      <div className={styles.composition} data-reveal>
        <AdvantageFacts facts={firstFacts} />
        <div className={styles.photo}>
          <picture className={styles.ring}>
            <source media="(width > 1280px)" srcSet={cms.imageSet("copy.home-advantages.3", siteSrcSet(cms.text("copy.home-advantages.1", "/images/advantages-ring-wide.webp")))} />
            <source media="(width < 768px)" srcSet={cms.imageSet("copy.home-advantages.3", siteSrcSet(cms.text("copy.home-advantages.2", "/images/advantages-ring-mobile.webp")))} />
            <img src={sitePath(cms.text("copy.home-advantages.3", "/images/advantages-ring-desktop.webp"))} alt="" width={748} height={748} loading="lazy" />
          </picture>
          <video
            ref={videoRef}
            className={styles.family}
            poster={sitePath("/images/advantages-video-poster.webp")}
            width={1200}
            height={1200}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        </div>
        <AdvantageFacts facts={secondFacts} />
      </div>
    </section>
  );
}

const _cmsSource_homeAdvantages = homeAdvantages;
