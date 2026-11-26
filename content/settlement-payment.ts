export const settlementPaymentOptions = [
  {
    title: "Покупка за собственные средства",
    number: { id: "01", width: 154.157, height: 97.402 },
  },
  {
    href: "/pokupatelyam/ipoteka",
    title: "Покупка в ипотеку",
    number: { id: "02", width: 176.717, height: 97.402 },
  },
  {
    href: "/pokupatelyam/rassrochka",
    title: "Рассрочка от застройщика",
    number: { id: "03", width: 173.911, height: 122.11 },
  },
  {
    href: "/pokupatelyam/zemelnyy-sertifikat",
    title: "Покупка с Земельным сертификатом",
    number: { id: "04", width: 177, height: 122 },
  },
] as const;
