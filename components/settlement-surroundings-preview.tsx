"use client";
import { useCmsCopy } from "./cms-provider";


import { useState } from "react";
import { sitePath } from "../lib/site-path";
import { FilterChips } from "./filter-chips";
import styles from "./settlement-page.module.css";

const categories = [
  {id:'all',label:'Все'},
  {id:'medicine',label:'Медицина'},
  {id:'education',label:'Образование'},
  {id:'shops',label:'Магазины'},
  {id:'parks',label:'Парки'},
];

export function SettlementSurroundingsPreview({slug,name,image,includePickup = false}: {
  slug:string; name:string; image:string; includePickup?:boolean;
}) {
  const cms = useCmsCopy();
  const categories = cms.data("local.settlement-surroundings-preview.categories", _cmsSource_categories);

  const [category,setCategory] = useState('all');
  const imageId = `${slug}-surroundings-preview`;
  const items = includePickup ? [...categories,{id:'pickup',label:cms.text("copy.settlement-surroundings-preview.1", 'ПВЗ')}] : categories;
  return <>
    <FilterChips className={styles.surroundingsFilters} items={items} value={category} onChange={setCategory}
      label={cms.text("copy.settlement-surroundings-preview.2", "Категории окружения")} controls={imageId} />
    <div className={`shell ${styles.locationMap}`}>
      <img id={imageId} className={styles.staticLocationMap} src={sitePath(image)} width={1840} height={700}
        alt={`Расположение и окружение посёлка ${name}`} loading="lazy" />
    </div>
  </>;
}

const _cmsSource_categories = categories;
