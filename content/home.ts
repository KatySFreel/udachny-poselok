export const consultationId = "consultation";
export const consultationTitle = "Получить консультацию";

export const home = {
  heading: {
    start: "Дома и участки",
    emphasis: "в часе езды",
    end: "от Санкт-Петербурга",
  },
  description:
    "Выберите участок в коттеджном посёлке или постройте дом в Ленинградской области.",
  actions: [
    { label: "Выбрать участок", href: "/poselki", variant: "primary" },
    { label: "Построить дом", href: "/doma", variant: "light" },
  ],
  offers: [
    {
      id: "land-certificate",
      title: "Участок по Земельному сертификату",
      titleLines: ["Участок", "по Земельному сертификату"],
      href: "/pokupatelyam/zemelnyy-sertifikat",
      image: "/images/land-certificate.webp",
      width: 534,
      height: 356,
    },
    {
      id: "installment",
      title: "Участок в рассрочку без %",
      titleLines: ["Участок в рассрочку без %"],
      href: "/pokupatelyam/rassrochka",
      image: "/images/installment.webp",
      width: 400,
      height: 499,
    },
  ],
} as const;

export const homeAdvantages = {
  title: "Всё для загородной жизни —",
  emphasis: "в одном месте",
  description:
    "Подбираем участки для разных жизненных сценариев и помогаем пройти путь от выбора земли до строительства дома.",
  firstFacts: [
    { value: ["С 2018", "года"], label: "развиваем коттеджные посёлки" },
    { value: ["17"], label: "завершённых посёлков" },
  ],
  secondFacts: [
    { value: ["1 500+"], label: "довольных собственников" },
    { value: ["Участки", "+ дома"], label: "выбор земли и строительство в одной компании" },
  ],
} as const;
