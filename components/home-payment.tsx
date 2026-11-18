import { sitePath } from "../lib/site-path";
import type { CSSProperties } from "react";
import shared from "./settlements.module.css";
import styles from "./home-payment.module.css";

const paymentOptions = [
  {
    href: "/pokupatelyam/zemelnyy-sertifikat",
    title: "Земельный сертификат",
    description: "Сертификат может покрыть всю стоимость участка. Подберём землю в Ленобласти и поможем оформить покупку.",
    number: { id: "01", width: 154.157, height: 97.402 },
  },
  {
    href: "/pokupatelyam/rassrochka",
    title: "Рассрочка от застройщика",
    description: "Оплачивайте участок частями без банка. Зафиксируем его цену на весь срок рассрочки.",
    number: { id: "02", width: 176.717, height: 97.402 },
  },
  {
    href: "/pokupatelyam/ipoteka",
    title: "Ипотека",
    description: "Поможем получить ипотеку на участок или дом. Подберём программу и покажем ежемесячный платёж.",
    number: { id: "03", width: 173.911, height: 122.11 },
  },
] as const;

export function HomePayment() {
  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-payment-title">
      <div className={shared.sectionLabel}>Способы покупки</div>
      <h2 className={`${shared.heading} ${styles.heading}`} id="home-payment-title">
        Выберите <em>удобный</em>{" "}<span>способ оплаты</span>
      </h2>
      <ul className={styles.cards}>
        {paymentOptions.map(({ href, title, description, number }) => (
          <li className={styles.item} key={href}>
            <a className={styles.card} href={sitePath(href)} aria-labelledby={`payment-option-${number.id}`}>
              <span className={`${shared.arrow} ${styles.arrow}`} aria-hidden="true" />
              <div className={styles.number} style={{ "--number-width": number.width } as CSSProperties}>
                <img src={sitePath(`/images/payment/${number.id}.svg`)} alt="" width={number.width} height={number.height} />
              </div>
              <div className={styles.body}>
                <h3 className={shared.cardTitle} id={`payment-option-${number.id}`}>{title}</h3>
                <p>{description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
