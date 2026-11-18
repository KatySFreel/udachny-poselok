import { sitePath } from "../lib/site-path";
import type { CSSProperties } from "react";
import { stepLineGuides } from "../content/step-line-guides";
import { ScrollSteps } from "./scroll-steps";
import shared from "./settlements.module.css";
import styles from "./home-steps.module.css";

const steps = [
  { lines: ["Выбор посёлка", "и участка"], x: 253, y: 377, width: 241, mobileNumber: [83, 53] },
  { lines: ["Экскурсия и знакомство", "с территорией"], x: 747, y: 153, width: 381, mobileNumber: [94, 51] },
  { lines: ["Бронирование участка"], x: 1207, y: 377, width: 381, mobileNumber: [93, 65] },
  { lines: ["Согласование способа", "и условий оплаты"], x: 1684, y: 153, width: 381, mobileNumber: [95, 63] },
  { lines: ["Подписание договора и оформление участка в собственность"], x: 2349, y: 377, width: 569 },
  { lines: ["Выбор проекта дома, согласование сметы и договора на строительство"], x: 2828, y: 153, width: 565, mobile: { x: 2918, y: 210 } },
  { lines: ["Строительство", "и передача готового дома"], x: 3285, y: 377, width: 438, mobile: { x: 3465 } },
] as const;

const photos = [
  { name: "field-winter", x: 425, y: 411, width: 126, height: 168, angle: 78.78, fade: 47 },
  { name: "field", x: 349, y: 432, width: 98, height: 131, angle: 90, fade: 86 },
  { name: "visit", x: 933, y: 17, width: 200, height: 150, angle: -10.77, fade: 0 },
  { name: "reservation", x: 1421, y: 403, width: 148, height: 111, angle: -12.8, fade: 180 },
  { name: "payment", x: 1821, y: 32, width: 182, height: 137, angle: -10.77, fade: 0 },
  { name: "contract", x: 2486, y: 423, width: 161, height: 120, angle: 5.07, fade: 180, mobile: { x: 2510, y: 566 } },
  { name: "modern-house", x: 3288, y: -9, width: 200, height: 150, angle: 3.77, fade: 0, mobile: { x: 3200 } },
  { name: "project-house", x: 3171, y: 17, width: 200, height: 150, angle: -10.76, fade: 0, mobile: { x: 3083 } },
  { name: "construction", x: 3749, y: 419, width: 201, height: 150, angle: 5.07, fade: 180, mobile: { x: 3649, y: 585 } },
  { name: "keys", x: 3870, y: 327, width: 166, height: 124, angle: -16.75, fade: 90, mobile: { x: 3715, y: 593 } },
] as const;

type RouteLine = {
  name: Exclude<keyof typeof stepLineGuides, `${string}-mobile`>;
  x: number;
  y: number;
  width: number;
  height: number;
  angle?: number;
  mobile: { name: "start" | "field" | "visit" | "reservation"; size: readonly [width: number, height: number]; x?: number; y?: number; width?: number; angle?: number };
};

const risingLineSize = [106.825, 111.076] as const;
const fallingLineSize = [187.333, 147.167] as const;

const lines: readonly RouteLine[] = [
  { name: "start", x: 0, y: 519, width: 302.366, height: 145.947, mobile: { name: "start", size: [162.866, 79.1584] } },
  { name: "field", x: 321, y: 102, width: 196.169, height: 203.071, angle: 18.59, mobile: { name: "field", size: risingLineSize } },
  { name: "visit", x: 790, y: 295, width: 346.333, height: 273.96, mobile: { name: "visit", size: fallingLineSize } },
  { name: "reservation", x: 1264, y: 102, width: 195.121, height: 203.071, angle: 18.59, mobile: { name: "reservation", size: risingLineSize } },
  { name: "payment", x: 1759, y: 279, width: 414.333, height: 279.249, mobile: { name: "visit", size: fallingLineSize, x: 1980, y: 295, width: 346.333 } },
  { name: "contract", x: 2358, y: 78, width: 246.834, height: 199.878, mobile: { name: "field", size: risingLineSize, x: 2640, y: 130, width: 196.169, angle: 18.59 } },
  { name: "project", x: 2970, y: 251, width: 142.333, height: 123.248, mobile: { name: "visit", size: fallingLineSize, x: 3095, y: 440, width: 346.333 } },
];

const photoSteps = {
  "field-winter": 1, field: 1, visit: 2, reservation: 3, payment: 4, contract: 5,
  "modern-house": 6, "project-house": 6, construction: 7, keys: 7,
} as const;

function RouteGraphic({ maskId, guide, width, height, className }: {
  maskId: string;
  guide: keyof typeof stepLineGuides;
  width: number;
  height: number;
  className: string;
}) {
  const filename = guide.endsWith("-mobile") ? guide.replace("-mobile", "-line-mobile") : guide + "-line";
  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          <path className={styles.lineGuide} d={stepLineGuides[guide]} pathLength={100}
            fill="none" stroke="white" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </mask>
      </defs>
      <image href={sitePath(`/images/steps/${filename}.svg`)} width={width} height={height}
        style={{ "--route-mask": `url(#${maskId})` } as CSSProperties} />
    </svg>
  );
}

function position(
  { x, y, width, height }: { x: number; y: number; width: number; height?: number },
  mobile?: { x?: number; y?: number },
) {
  return {
    "--art-x": x,
    "--art-y": y,
    "--art-width": width,
    "--art-height": height,
    "--mobile-art-x": mobile?.x,
    "--mobile-art-y": mobile?.y,
  } as CSSProperties;
}

export function HomeSteps() {
  return (
    <section className={styles.section} aria-labelledby="home-steps-title">
      <div className={`shell ${styles.intro}`}>
        <div className={shared.sectionLabel}>Как мы работаем</div>
        <h2 className={shared.heading} id="home-steps-title">
          Путь к загородной жизни — <em>шаг за шагом</em>
        </h2>
        <p className={styles.description} data-reveal>
          Сопровождаем вас от выбора подходящего участка до оформления покупки и строительства дома.
          Объясняем каждый этап и помогаем разобраться в деталях.
        </p>
      </div>
      <ScrollSteps>
        <div className={styles.canvas}>
          {lines.map((line) => (
            <div
              key={line.name}
              className={styles.line}
              data-route-line
              style={{
                ...position(line, line.mobile),
                "--art-angle": `${line.angle ?? 0}deg`,
                "--mobile-art-angle": `${line.mobile.angle ?? line.angle ?? 0}deg`,
                "--mobile-line-width": line.mobile.width,
              } as CSSProperties}
            >
              <RouteGraphic maskId={`steps-${line.name}`} guide={line.name}
                width={line.width} height={line.height} className={styles.desktopLine} />
              <RouteGraphic maskId={`steps-${line.name}-mobile`} guide={`${line.mobile.name}-mobile`}
                width={line.mobile.size[0]} height={line.mobile.size[1]} className={styles.mobileLine} />
            </div>
          ))}
          {photos.map((photo) => (
            <div key={photo.name} className={styles.photo} data-route-step={photoSteps[photo.name]} style={{
              ...position(photo, "mobile" in photo ? photo.mobile : undefined),
              "--art-angle": `${photo.angle}deg`,
              "--art-fade": `${photo.fade}deg`,
            } as CSSProperties}>
              <img src={sitePath(`/images/steps/${photo.name}.webp`)} alt="" loading="lazy" />
            </div>
          ))}
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.x} className={styles.step} data-route-step={index + 1} style={position(step, "mobile" in step ? step.mobile : undefined)}>
                <span className={`${styles.number} ${"mobileNumber" in step ? styles.hasMobileNumber : ""}`} aria-hidden="true">
                  0{index + 1}
                </span>
                {"mobileNumber" in step && (
                  <img className={styles.mobileNumber} src={sitePath(`/images/steps/step-${index + 1}.svg`)}
                    alt="" width={step.mobileNumber[0]} height={step.mobileNumber[1]} />
                )}
                <span className={styles.caption}>{step.lines.map((line) => <span key={line}>{line}</span>)}</span>
              </li>
            ))}
          </ol>
        </div>
      </ScrollSteps>
    </section>
  );
}
