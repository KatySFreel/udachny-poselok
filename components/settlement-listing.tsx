"use client";
import { useCmsCopy } from "./cms-provider";


import type { ReactNode } from 'react';
import { settlements } from '../content/settlements';
import { SettlementCard } from './settlement-card';
import { SettlementFilterGrid } from './settlement-filter-grid';

/** Both the home page and catalogue list the same settlements and districts. */
export function SettlementListing({catalogCard,resultsId,wrapOnTablet}: {catalogCard?:ReactNode;resultsId?:string;wrapOnTablet?:boolean}) {
  const cms = useCmsCopy();
  const settlements = cms.data("data.settlements", _cmsSource_settlements);

  return <SettlementFilterGrid catalogCard={catalogCard} resultsId={resultsId} wrapOnTablet={wrapOnTablet}
    cards={settlements.map(settlement => ({id:settlement.slug,districtId:settlement.districtId,content:<SettlementCard settlement={settlement} />}))} />;
}

const _cmsSource_settlements = settlements;
