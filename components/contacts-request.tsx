"use client";
import { useCmsCopy } from "./cms-provider";


import { InlineRequestForm } from './contact-dialog';
import { useMediaQuery } from './use-media-query';
import { leadForms } from '../lib/lead-attribution';
import styles from './contacts-page.module.css';

export function ContactsRequest() {
  const cms = useCmsCopy();

  const mobile = useMediaQuery('(width < 768px)');
  return <div className={styles.request}>
    <div className={styles.requestIntro}>
      <h2 id="contacts-request-title">{mobile ? <>{cms.text("copy.contacts-request.1", "Увидеть всё ")}<em>{cms.text("copy.contacts-request.2", "своими глазами")}</em></> : <>{cms.text("copy.contacts-request.3", "Заказать ")}<em>{cms.text("copy.contacts-request.4", "обратный звонок")}</em></>}</h2>
      <p>{mobile ? cms.text("copy.contacts-request.5", 'Запишитесь на экскурсию и познакомьтесь с нашими посёлками.') : cms.text("copy.contacts-request.6", 'Оставьте имя и телефон. Мы перезвоним и ответим на ваши вопросы.')}</p>
    </div>
    <InlineRequestForm key={mobile ? 'excursion' : 'callback'} definition={mobile ? leadForms.contactsExcursion : leadForms.contactsCallback} submitLabel={mobile ? cms.text("copy.contacts-request.7", 'Записаться на экскурсию') : cms.text("copy.contacts-request.8", 'Перезвоните мне')} />
  </div>;
}
