"use client";
import { useCmsCopy } from "./cms-provider";


import { PaymentCard } from "./payment-card";
import { SectionHeading } from "./section-heading";
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
  const cms = useCmsCopy();
  const paymentOptions = cms.data("local.home-payment.paymentOptions", _cmsSource_paymentOptions);

  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-payment-title">
      <SectionHeading label={cms.text("copy.home-payment.1", "Способы покупки")} id="home-payment-title" headingClassName={styles.heading}>
        {cms.text("copy.home-payment.2", "Выберите ")}<em>{cms.text("copy.home-payment.3", "удобный")}</em>{" "}<span>{cms.text("copy.home-payment.4", "способ оплаты")}</span>
      </SectionHeading>
      <ul className={styles.cards}>
        {paymentOptions.map(option => (
          <li className={styles.item} key={option.href}>
            <PaymentCard option={option} headingId={`payment-option-${option.number.id}`} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const _cmsSource_paymentOptions = paymentOptions;
