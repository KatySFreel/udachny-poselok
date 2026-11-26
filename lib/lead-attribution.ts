/** Shared contract for form payloads, button attribution and future analytics adapters. */
export type LeadFormDefinition = {
  id: string;
  name: string;
  requestType: string;
  settlementSlug?: string;
  settlementName?: string;
};
export type LeadButton = {
  buttonId: string;
  buttonLabel: string;
  placement: string;
  plotId?: string;
  plotNumber?: string;
};
export type LeadAttribution = LeadFormDefinition & LeadButton & {
  pagePath: string;
  pageTitle: string;
};
export type LeadEventName = 'form_open' | 'form_start' | 'form_validation_error' | 'form_submit' | 'form_success' | 'form_error';
export type LeadEvent = {
  event: 'lead_form';
  action: LeadEventName;
  mode: 'test' | 'live';
  attribution: LeadAttribution;
};
export const leadForms = {
  contactsCallback: {id:'contacts-callback',name:'Обратный звонок — Контакты',requestType:'callback'},
  contactsExcursion: {id:'contacts-excursion',name:'Запись на экскурсию — Контакты',requestType:'excursion'},
  construction: {id:'construction-calculation',name:'Расчёт стоимости строительства дома',requestType:'construction'},
  consultation: {id:'consultation',name:'Консультация',requestType:'consultation'},
  excursion: {id:'excursion',name:'Запись на экскурсию',requestType:'excursion'},
  certificate: {id:'land-certificate',name:'Консультация по земельному сертификату',requestType:'land-certificate'},
  installment: {id:'installment-calculation',name:'Расчёт рассрочки',requestType:'installment'},
  mortgage: {id:'mortgage-calculation',name:'Расчёт ипотеки',requestType:'mortgage'},
  investors: {id:'investor-meeting',name:'Обсуждение условий инвестирования',requestType:'investment'},
  partners: {id:'partner-link',name:'Персональная ссылка партнёра',requestType:'partnership'},
  quiz: {id:'plot-quiz',name:'Подбор участка — квиз',requestType:'quiz'},
} satisfies Record<string,LeadFormDefinition>;
export function settlementLeadForm(kind: 'visit' | 'online-visit' | 'presentation', slug: string, name: string): LeadFormDefinition {
  return {id:`${slug}-${kind}`,name:{visit:'Запись на просмотр','online-visit':'Просмотр по видеосвязи',presentation:'Презентация посёлка'}[kind],requestType:kind,settlementSlug:slug,settlementName:name};
}
export function leadTrigger(formId: string, button: LeadButton, continuation?: {deferTo?: string; continueFrom?: string}) {
  return {'data-lead-form':formId,'data-lead-button':JSON.stringify(button),'data-lead-defer-to':continuation?.deferTo,'data-lead-continue-from':continuation?.continueFrom};
}

/** Allowlist and bound client metadata before including it in a server payload. */
export function readLeadAttribution(form: FormData): LeadAttribution | undefined {
  const raw = form.get('attribution');
  if (typeof raw !== 'string' || raw.length > 6000) return;
  try {
    const input = JSON.parse(raw);
    if (!input || typeof input !== 'object' || Array.isArray(input)) return;
    const required = ['id','name','requestType','buttonId','buttonLabel','placement','pagePath','pageTitle'] as const;
    const optional = ['settlementSlug','settlementName','plotId','plotNumber'] as const;
    const result: Record<string,string> = {};
    for (const key of required) {
      if (typeof input[key] !== 'string' || !input[key].trim()) return;
      result[key] = input[key].slice(0,500);
    }
    if (!result.pagePath.startsWith('/')) return;
    // Keep only the pathname. Query parameters may contain personal information.
    result.pagePath = result.pagePath.split(/[?#]/)[0];
    for (const key of optional) if (typeof input[key] === 'string') result[key] = input[key].slice(0,200);
    return result as LeadAttribution;
  } catch { return; }
}
