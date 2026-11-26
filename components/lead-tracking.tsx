"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { type LeadAttribution, type LeadButton, type LeadEvent, type LeadEventName, type LeadFormDefinition } from '../lib/lead-attribution';
import { FormTest } from './form-simulation';

type ButtonSource = LeadButton & {pagePath:string};
const Sources = createContext<Map<string,ButtonSource> | null>(null);

export function LeadTracking({children}: {children:ReactNode}) {
  const sources = useRef(new Map<string,ButtonSource>());
  const deferredPlot = useRef<{scope:string;pagePath:string;plotId:string;plotNumber:string} | null>(null);
  useEffect(() => {
    function capture(event: MouseEvent) {
      const trigger = (event.target as Element)?.closest<HTMLElement>('[data-lead-form][data-lead-button]');
      if (!trigger || (trigger instanceof HTMLButtonElement && trigger.disabled)) return;
      try {
        let button: LeadButton = JSON.parse(trigger.dataset.leadButton!);
        if (trigger.dataset.leadDeferTo && button.plotId && button.plotNumber) {
          deferredPlot.current = {scope:trigger.dataset.leadDeferTo,pagePath:location.pathname,plotId:button.plotId,plotNumber:button.plotNumber};
          return;
        }
        const pending = deferredPlot.current;
        if (pending && pending.pagePath === location.pathname && trigger.dataset.leadContinueFrom === pending.scope) {
          button = {...button,plotId:pending.plotId,plotNumber:pending.plotNumber};
        } else {
          deferredPlot.current = null;
        }
        sources.current.set(trigger.dataset.leadForm!, {...button,pagePath:location.pathname});
      } catch { /* Ignore unrelated or malformed markup. */ }
    }
    document.addEventListener('click',capture,true);
    return () => document.removeEventListener('click',capture,true);
  },[]);
  return <Sources.Provider value={sources.current}>{children}</Sources.Provider>;
}

export function useLeadTracking(definition: LeadFormDefinition, submitLabel: string, simulationOnly = false) {
  const sources = useContext(Sources);
  const {enabled} = useContext(FormTest);
  const started = useRef(false);
  const fallback: LeadButton = {buttonId:`${definition.id}-submit`,buttonLabel:submitLabel,placement:'form'};
  function attribution(): LeadAttribution {
    const source = sources?.get(definition.id);
    return {...definition,...(source?.pagePath === location.pathname ? source : fallback),pagePath:location.pathname,pageTitle:document.title};
  }
  function track(action: LeadEventName, source = attribution(), mode: LeadEvent['mode'] = enabled || simulationOnly ? 'test' : 'live') {
    const detail: LeadEvent = {event:'lead_form',action,mode,attribution:source};
    // No contact values are exposed here. Connecting an analytics service is a separate step.
    const target = window as Window & {dataLayer?: LeadEvent[]};
    (target.dataLayer ??= []).push(detail);
    window.dispatchEvent(new CustomEvent<LeadEvent>('site:lead',{detail}));
  }
  function start() { if (!started.current) { started.current=true; track('form_start'); } }
  function prepare(form: HTMLFormElement, data: FormData) {
    const source = attribution();
    data.set('attribution',JSON.stringify(source));
    // Keep the payload reviewable in the local preview and available to future transports.
    const field = form.elements.namedItem('attribution');
    if (field instanceof HTMLInputElement) field.value=JSON.stringify(source);
    return source;
  }
  function reset() { started.current=false; }
  function open() { reset(); track('form_open'); }
  return {track,start,prepare,reset,open};
}
