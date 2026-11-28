"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  loginPlanAdmin,
  planAdminAccess,
  readPublicPlan,
  savePlan,
} from "@plan-actions";
import type { PlanDocument } from "../lib/plan-contract";
import { plotStatusLabels, validatePlans } from "../lib/plan-contract";
import type { Plot, SettlementPlanData } from "../content/settlement-pages";
import { sitePath } from "../lib/site-path";
import { PlanDrawing } from "./plan-drawing";
import { useAdminIdentity, useAdminUnsaved } from "./admin-shell";
import { canEditPlans } from "../lib/admin-types";
import styles from "./plan-admin.module.css";

type Settlement = { slug: string; name: string; assets: string };
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
export function PlanAdmin({ settlements }: { settlements: Settlement[] }) {
  const editable = canEditPlans(useAdminIdentity().role);
  const [access, setAccess] = useState<{
      configured: boolean;
      authenticated: boolean;
      staticPreview: boolean;
    } | null>(null),
    [password, setPassword] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const [slug, setSlug] = useState(settlements[0].slug),
    [document, setDocument] = useState<PlanDocument | null>(null),
    [saved, setSaved] = useState<PlanDocument | null>(null),
    [planIndex, setPlanIndex] = useState(0),
    [selectedId, setSelectedId] = useState(""),
    [search, setSearch] = useState(""),
    [dirty, setDirty] = useState(false);
  useAdminUnsaved(dirty);
  const importInput = useRef<HTMLInputElement>(null),
    canvas = useRef<HTMLDivElement>(null),
    loadSequence = useRef(0);
  const settlement = settlements.find((s) => s.slug === slug)!,
    plan = document?.plans[planIndex],
    selected = plan?.plots.find((p) => p.id === selectedId);
  useEffect(() => {
    planAdminAccess()
      .then(setAccess)
      .catch(() =>
        setMessage("Не удалось проверить доступ. Обновите страницу."),
      );
  }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      element.scrollLeft = Math.max(
        0,
        (element.scrollWidth - element.clientWidth) / 2,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [document?.slug, planIndex]);
  async function load(nextSlug: string) {
    const sequence = ++loadSequence.current;
    setBusy(true);
    setMessage("");
    try {
      const result = await readPublicPlan(nextSlug);
      if (sequence !== loadSequence.current) return;
      if (!result) throw new Error();
      setDocument(clone(result));
      setSaved(clone(result));
      setDirty(false);
      setPlanIndex(0);
      setSelectedId("");

      setSearch("");
    } catch {
      setMessage("Не удалось загрузить генплан. Повторите попытку.");
    } finally {
      if (sequence === loadSequence.current) setBusy(false);
    }
  }
  useEffect(() => {
    if (access?.authenticated) void load(slug);
  }, [access?.authenticated, slug]);
  function updatePlan(next: SettlementPlanData) {
    if (!editable || !document) return;
    setDocument({
      ...document,
      plans: document.plans.map((p, i) => (i === planIndex ? next : p)),
    });
    setDirty(true);
    setMessage("");
  }
  function updatePlot(update: Partial<Plot>) {
    if (!plan || !selected) return;
    updatePlan({
      ...plan,
      plots: plan.plots.map((p) =>
        p.id === selected.id ? { ...p, ...update } : p,
      ),
    });
  }
  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await loginPlanAdmin(password);
      if (result.ok) {
        setPassword("");
        setAccess(await planAdminAccess());
        setMessage("");
      } else setMessage(result.message);
    } catch {
      setMessage("Не удалось войти. Повторите попытку.");
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!document) return;
    setBusy(true);
    try {
      const result = await savePlan(slug, document.revision, document.plans);
      if (result.ok) {
        setDocument(clone(result.document));
        setSaved(clone(result.document));
        setDirty(false);
        setMessage("Изменения сохранены. Генплан на сайте обновлён.");
      } else setMessage(result.message);
    } catch {
      setMessage("Не удалось сохранить. Правки остались в редакторе.");
    } finally {
      setBusy(false);
    }
  }
  function exportJson() {
    if (!document) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(document, null, 2)], {
        type: "application/json",
      }),
    );
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}-genplan.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  async function importJson(file: File) {
    if (!editable) return;
    try {
      if (file.size > 2_000_000) throw new Error();
      const imported = JSON.parse(await file.text());
      if (
        imported.version !== 1 ||
        imported.slug !== slug ||
        !validatePlans(imported.plans)
      )
        throw new Error();
      if (document) {
        setDocument({ ...document, plans: imported.plans });
        setDirty(true);
        setPlanIndex(0);
        setSelectedId("");
        setMessage(
          "Данные импортированы. Проверьте генплан и сохраните изменения.",
        );
      }
    } catch {
      setMessage(
        "Файл не подходит: нужен экспорт этого посёлка с корректными данными участков.",
      );
    }
  }
  function changeSettlement(nextSlug: string) {
    if (dirty && !window.confirm("Перейти к другому посёлку без сохранения?"))
      return;
    setSlug(nextSlug);
  }
  if (!access?.authenticated)
    return (
      <main className={styles.login}>
        <a href={sitePath("/")}>Удачный посёлок</a>
        <h1>Управление генпланами</h1>
        {!access ? (
          <p>Проверяем доступ…</p>
        ) : access.staticPreview ? (
          <p>Админка доступна в серверной версии сайта.</p>
        ) : !access.configured ? (
          <p>Доступ к редактированию ещё не настроен.</p>
        ) : (
          <form onSubmit={login}>
            <label>
              Пароль
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit" disabled={busy}>
              Войти
            </button>
          </form>
        )}
        {message && <p role="status">{message}</p>}
      </main>
    );
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <a href={sitePath("/")}>Удачный посёлок</a>
          <h1>Генпланы</h1>
        </div>
      </header>
      {!editable && <p>Ваша роль разрешает только просмотр генпланов.</p>}
      <div className={styles.toolbar}>
        <label>
          Посёлок
          <select
            value={slug}
            disabled={busy}
            onChange={(e) => changeSettlement(e.target.value)}
          >
            {settlements.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <a
          href={sitePath(`/poselki/${slug}#settlement-plan`)}
          target="_blank"
          rel="noreferrer"
        >
          Открыть на сайте ↗
        </a>
        <div className={styles.saveGroup}>
          <span role="status">
            {busy
              ? "Подождите…"
              : dirty
                ? "Есть несохранённые изменения"
                : "Все изменения сохранены"}
          </span>
          <button
            type="button"
            className={styles.primary}
            disabled={!editable || busy || !document || !dirty}
            onClick={save}
          >
            Сохранить
          </button>
        </div>
      </div>
      {message && (
        <p className={styles.message} role="status">
          {message}
        </p>
      )}
      {document && plan && (
        <>
          <div className={styles.tools}>
            <select
              aria-label="Генплан"
              value={planIndex}
              onChange={(e) => {
                setPlanIndex(Number(e.target.value));
                setSelectedId("");
              }}
            >
              {document.plans.map((p, i) => (
                <option key={i} value={i}>
                  {p.label ?? `Генплан ${i + 1}`}
                </option>
              ))}
            </select>
            <button type="button" onClick={exportJson}>
              Экспорт JSON
            </button>
            <button
              type="button"
              disabled={!editable || busy}
              onClick={() => importInput.current?.click()}
            >
              Импорт JSON
            </button>
            <input
              ref={importInput}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void importJson(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={!dirty || busy}
              onClick={() => {
                if (
                  saved &&
                  window.confirm("Отменить все несохранённые изменения?")
                ) {
                  setDocument(clone(saved));
                  setDirty(false);
                  setSelectedId("");

                  setMessage("Правки отменены.");
                }
              }}
            >
              Отменить правки
            </button>
          </div>
          <div className={styles.layout}>
            <section
              className={styles.canvasPanel}
              aria-label="Редактор генплана"
            >
              <div className={styles.canvas} ref={canvas}>
                <PlanDrawing
                  plan={plan}
                  assets={settlement.assets}
                  selectedId={selectedId}
                  onSelect={(p) => {
                    setSelectedId(p.id);
                  }}
                />
              </div>
              <fieldset className={styles.editing} disabled={!editable}><details className={styles.settings}>
                <summary>Настройки генплана и очередей</summary>
                <label>
                  Название генплана
                  <input
                    value={plan.label ?? ""}
                    onChange={(e) =>
                      updatePlan({ ...plan, label: e.target.value })
                    }
                  />
                </label>
                <label>
                  Вид
                  <select
                    value={plan.appearance ?? "diagram"}
                    onChange={(e) =>
                      updatePlan({
                        ...plan,
                        appearance:
                          e.target.value === "aerial" ? "aerial" : undefined,
                      })
                    }
                  >
                    <option value="aerial">Фото с контурами</option>
                    <option value="diagram">Схема</option>
                  </select>
                </label>
                {(plan.phases ?? []).map((phase) => (
                  <div className={styles.phaseSettings} key={phase.id}>
                    <label>
                      Название очереди
                      <input
                        value={phase.label}
                        onChange={(e) =>
                          updatePlan({
                            ...plan,
                            phases: plan.phases?.map((p) =>
                              p.id === phase.id
                                ? { ...p, label: e.target.value }
                                : p,
                            ),
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      disabled={plan.plots.some((p) => p.phaseId === phase.id)}
                      onClick={() =>
                        updatePlan({
                          ...plan,
                          phases: plan.phases?.filter((p) => p.id !== phase.id),
                        })
                      }
                    >
                      Удалить
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updatePlan({
                      ...plan,
                      phases: [
                        ...(plan.phases ?? []),
                        {
                          id: crypto.randomUUID(),
                          label: `Очередь ${(plan.phases?.length ?? 0) + 1}`,
                        },
                      ],
                    })
                  }
                >
                  Добавить очередь
                </button>
              </details></fieldset>
            </section>
            <aside className={styles.sidebar}>
              <h2>
                {selected ? `Участок ${selected.number}` : "Выберите участок"}
              </h2>
              {selected ? (
                <form
                  className={styles.properties}
                  onSubmit={(e) => e.preventDefault()}
                ><fieldset className={styles.editing} disabled={!editable}>
                  <label>
                    Номер
                    <input
                      value={selected.number}
                      onChange={(e) => updatePlot({ number: e.target.value })}
                      maxLength={40}
                    />
                  </label>
                  <label>
                    Площадь, сотки
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={selected.area ?? ""}
                      onChange={(e) =>
                        updatePlot({
                          area: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </label>
                  <label>
                    Стоимость, ₽
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={selected.price ?? ""}
                      onChange={(e) =>
                        updatePlot({
                          price: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </label>
                  <label>
                    Статус
                    <select
                      value={selected.status}
                      onChange={(e) =>
                        updatePlot({ status: e.target.value as Plot["status"] })
                      }
                    >
                      {Object.entries(plotStatusLabels).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <label>
                    Очередь
                    <select
                      value={selected.phaseId ?? ""}
                      onChange={(e) =>
                        updatePlot({ phaseId: e.target.value || undefined })
                      }
                    >
                      <option value="">Без очереди</option>
                      {plan.phases?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={!!selected.certificateEligible}
                      onChange={(e) =>
                        updatePlot({ certificateEligible: e.target.checked })
                      }
                    />
                    В сумму сертификата
                  </label>
                  <p className={styles.hint}>ID: {selected.id}</p>
                  <button
                    type="button"
                    className={styles.danger}
                    onClick={() => {
                      if (
                        window.confirm(`Удалить участок ${selected.number}?`)
                      ) {
                        updatePlan({
                          ...plan,
                          plots: plan.plots.filter((p) => p.id !== selected.id),
                        });
                        setSelectedId("");
                      }
                    }}
                  >
                    Удалить участок
                  </button>
                </fieldset></form>
              ) : (
                <p>Нажмите на контур на фото или выберите участок из списка.</p>
              )}
              <label className={styles.search}>
                Поиск участка
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Номер участка"
                />
              </label>
              <p className={styles.hint}>Всего участков: {plan.plots.length}</p>
              <div className={styles.plotList}>
                {plan.plots
                  .filter((p) =>
                    p.number
                      .toLocaleLowerCase("ru")
                      .includes(search.toLocaleLowerCase("ru")),
                  )
                  .map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      aria-pressed={p.id === selectedId}
                      onClick={() => {
                        setSelectedId(p.id);
                      }}
                    >
                      Участок {p.number}
                      <span>{plotStatusLabels[p.status]}</span>
                    </button>
                  ))}
              </div>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
