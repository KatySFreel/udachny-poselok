import { siteSrcSet, sitePath } from "../lib/site-path";
import { FormSimulation } from "../components/form-simulation";
import { ActionLink } from "../components/action";
import { HomeAbout } from "../components/home-about";
import { HomeAdvantages } from "../components/home-advantages";
import { HomeBlog } from "../components/home-blog";
import { HomeExcursion } from "../components/home-excursion";
import { HomeFaq } from "../components/home-faq";
import { HomeHouses } from "../components/home-houses";
import { HomeMotion } from "../components/home-motion";
import { HomePayment } from "../components/home-payment";
import { HomeQuiz } from "../components/home-quiz";
import { HomeReviews } from "../components/home-reviews";
import { HomeSettlements } from "../components/home-settlements";
import { HomeSettlementsMap } from "../components/home-settlements-map";
import { HomeSteps } from "../components/home-steps";
import { OfferCard } from "../components/offer-card";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { home } from "../content/home";

const desktopCover = siteSrcSet("/images/home-aerial-1440.webp 1440w, /images/home-aerial-1920.webp 1920w, /images/home-aerial-2880.webp 2880w");
const mobileCover = sitePath("/images/home-mobile.webp");
const tabletCover = sitePath("/images/home-tablet.webp");

export default function HomePage() {
  return (
    <div className="home">
      <link rel="preload" as="image" media="(width < 768px)" href={mobileCover} fetchPriority="high" />
      <link rel="preload" as="image" media="(768px <= width < 1024px)" href={tabletCover} fetchPriority="high" />
      <link rel="preload" as="image" media="(width >= 1024px)" imageSrcSet={desktopCover} imageSizes="100vw" fetchPriority="high" />
      <FormSimulation>
        <SiteHeader coverId="home-cover" />
        <main id="home-main">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero__screen" id="home-cover">
              <picture className="hero__background">
                <source media="(width < 768px)" srcSet={mobileCover} />
                <source media="(width < 1024px)" srcSet={tabletCover} />
                <img
                  src={sitePath("/images/home-aerial-1440.webp")}
                  srcSet={desktopCover}
                  sizes="100vw"
                  alt=""
                  width={1920}
                  height={1080}
                  fetchPriority="high"
                />
              </picture>
              <div className="hero__content shell">
                <h1 id="hero-title">
                  <span>{home.heading.start}</span>{" "}
                  <em>{home.heading.emphasis}</em>{" "}
                  <span className="hero__last-line">{home.heading.end}</span>
                </h1>
                <p>{home.description}</p>
                <div className="hero__actions">
                  {home.actions.map(({ href, label, variant }) => (
                    <ActionLink key={href} href={sitePath(href)} variant={variant} arrow>{label}</ActionLink>
                  ))}
                </div>
              </div>
            </div>
            <div className="hero__offers" aria-label="Способы покупки">
              {home.offers.map(({ id, ...offer }) => (
                <OfferCard key={id} {...offer} crop={id === "land-certificate" ? "certificate" : "installment"} />
              ))}
            </div>
          </section>
          <HomeAdvantages />
          <HomeSettlements />
          <HomeSettlementsMap />
          <HomeExcursion />
          <HomeHouses />
          <HomeAbout />
          <HomeSteps />
          <HomePayment />
          <HomeReviews />
          <HomeQuiz />
          <HomeFaq />
          <HomeBlog />
        </main>
        <HomeMotion />
        <SiteFooter />
      </FormSimulation>
    </div>
  );
}
