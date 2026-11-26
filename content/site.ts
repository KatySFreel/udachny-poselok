import { sitePath } from "../lib/site-path";

export const site = {
  name: "Удачный посёлок",
  phone: "+7 905 222-37-40",
  phoneHref: "tel:+79052223740",
  email: "info@удачныйпоселок.рф",
  emailHref: "mailto:info@xn--80ahepgfljcgxr8c1c.xn--p1ai",
  office: {
    city: "Санкт-Петербург",
    street: "Московский проспект, д. 91, офис 702",
    mapHref: "https://yandex.com/maps/org/udachniy_poselok/213104027028/",
    mapEmbedHref: "https://yandex.ru/map-widget/v1/?ll=30.318404%2C59.895461&z=16&pt=30.318404%2C59.895461%2Cpm2rdm&lang=ru_RU",
  },
  messengers: [
    {id: 'telegram', label: 'Telegram', href: ''},
    {id: 'max', label: 'MAX', href: ''},
  ],
  socials: [
    { id: "rutube", label: "RUTUBE", href: "https://rutube.ru/channel/42361286/" },
    { id: "vk", label: "ВКонтакте", href: "https://vk.com/udachnyjposelok" },
  ],
  dataConsentHref: sitePath("/approval"),
  newsletterConsentHref: sitePath("/newsletter-consent"),
};

export const navigation = [
  { label: "Посёлки", href: "/poselki" },
  { label: "Дома", href: "/doma" },
  {
    label: "Покупателям",
    children: [
      { label: "Ипотека", href: "/pokupatelyam/ipoteka" },
      { label: "Рассрочка", href: "/pokupatelyam/rassrochka" },
      { label: "Земельный сертификат", href: "/pokupatelyam/zemelnyy-sertifikat" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    label: "О компании",
    children: [
      { label: "О нас", href: "/o-kompanii" },
      { label: "Блог", href: "/blog" },
      { label: "Инвесторам", href: "/investoram" },
      { label: "Партнёрская программа", href: "/partneram" },
    ],
  },
  { label: "Контакты", href: "/kontakty" },
] as const;
