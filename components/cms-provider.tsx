'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createCopy, type CmsValues } from '../lib/cms-contract';
const Context = createContext<CmsValues>({});
export function CmsProvider({ values, children }: { values: CmsValues; children: ReactNode }) { return <Context.Provider value={values}>{children}</Context.Provider>; }
export function useCmsCopy() { const values = useContext(Context); return useMemo(() => createCopy(values), [values]); }
