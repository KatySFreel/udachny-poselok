"use client";

import { useState, type ReactNode } from "react";
import { blogCategories } from "../content/blog";
import styles from "./home-blog.module.css";
import shared from "./settlements.module.css";

const categories = ["all", "news", "articles"] as const;
type Category = keyof typeof blogCategories;

export function BlogFilter({
  cards,
  catalog,
}: {
  cards: readonly { id: string; category: Category; card: ReactNode }[];
  catalog: ReactNode;
}) {
  const [selected, setSelected] = useState<Category | "all">("all");
  const visible = selected === "all" ? cards : cards.filter(({ category }) => category === selected);

  return (
    <>
      <div className={shared.filters} role="group" aria-label="Категория публикаций">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={shared.chip}
            aria-controls="home-blog-results"
            aria-pressed={selected === category}
            onClick={() => setSelected(category)}
          >
            {category === "all" ? "Все" : blogCategories[category].label}
          </button>
        ))}
      </div>
      <div id="home-blog-results">
        {visible.length > 0 ? (
          <ul className={`${shared.grid} ${styles.grid}`} data-category={selected}>
            {visible.map(({ id, card }) => <li key={id}>{card}</li>)}
            <li>{catalog}</li>
          </ul>
        ) : (
          <p className={styles.empty} role="status">В этой категории пока нет публикаций.</p>
        )}
      </div>
    </>
  );
}
