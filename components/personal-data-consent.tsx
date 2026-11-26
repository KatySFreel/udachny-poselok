import type { InputHTMLAttributes } from 'react';
import { site } from '../content/site';
import styles from './contact-form.module.css';

export function PersonalDataConsent({validation}: {validation:Pick<InputHTMLAttributes<HTMLInputElement>,'aria-invalid' | 'aria-describedby'>}) {
  return <label className={styles.consent}>
    <input type="checkbox" name="consent" required {...validation} />
    <span>Я даю согласие на обработку персональных данных и подтверждаю, что ознакомлен(а) с <a href={site.dataConsentHref} target="_blank" rel="noreferrer">Политикой обработки персональных данных</a></span>
  </label>;
}
