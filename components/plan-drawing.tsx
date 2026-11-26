"use client";

import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import { useRef } from "react";
import type { Plot, SettlementPlanData } from "../content/settlement-pages";
import { plotStatusLabels } from "../lib/plan-contract";
import { sitePath } from "../lib/site-path";
import styles from "./aerial-plan.module.css";

export function plotLabel(plot: Plot) {
  return (
    plot.label ?? {
      x: plot.points.reduce((n, p) => n + p[0], 0) / plot.points.length,
      y: plot.points.reduce((n, p) => n + p[1], 0) / plot.points.length,
    }
  );
}
export function PlanDrawing({
  plan,
  assets,
  selectedId,
  onSelect,
  matchingIds,
  phaseId,
  style,
  editPoints,
  onPointChange,
  onCanvasPoint,
  draftPoints = [],
}: {
  plan: SettlementPlanData;
  assets: string;
  selectedId?: string;
  onSelect: (plot: Plot) => void;
  matchingIds?: Set<string>;
  phaseId?: string;
  style?: CSSProperties;
  editPoints?: boolean;
  onPointChange?: (index: number, point: [number, number]) => void;
  onCanvasPoint?: (point: [number, number]) => void;
  draftPoints?: readonly (readonly [number, number])[];
}) {
  const svg = useRef<SVGSVGElement>(null);
  const moving = useRef<number | null>(null);
  function position(event: MouseEvent | PointerEvent): [number, number] {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return [0, 0];
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    return [
      Math.round(Math.max(0, Math.min(plan.width, p.x)) * 100) / 100,
      Math.round(Math.max(0, Math.min(plan.height, p.y)) * 100) / 100,
    ];
  }
  const selected = plan.plots.find((p) => p.id === selectedId);
  return (
    <svg
      ref={svg}
      className={styles.art}
      style={style}
      viewBox={`0 0 ${plan.width} ${plan.height}`}
      role="group"
      aria-label="Участки на генплане"
      onClick={(event) => {
        if (onCanvasPoint) onCanvasPoint(position(event));
      }}
    >
      <image
        href={
          plan.backgroundDataUrl ??
          sitePath(`${assets}/${plan.image}.${plan.imageExtension ?? "webp"}`)
        }
        width={plan.width}
        height={plan.height}
      />
      {plan.plots.map((plot) => {
        const label = plotLabel(plot),
          dimmed = !!matchingIds && !matchingIds.has(plot.id),
          outsidePhase = !!phaseId && plot.phaseId !== phaseId;
        return (
          <g
            key={plot.id}
            className={styles.plot}
            role="button"
            tabIndex={dimmed || onCanvasPoint ? -1 : 0}
            aria-label={`Участок ${plot.number}, ${plotStatusLabels[plot.status]}`}
            aria-pressed={selectedId === plot.id}
            data-status={plot.status}
            data-certificate={
              (plot.certificateEligible && plot.status === "available") ||
              undefined
            }
            data-label-only={plot.labelOnly || undefined}
            data-dimmed={dimmed || undefined}
            data-other-phase={outsidePhase || undefined}
            onClick={(event) => {
              if (onCanvasPoint) return;
              event.stopPropagation();
              onSelect(plot);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(plot);
              }
            }}
          >
            {plot.paths ? (
              plot.paths.map((path, index) => (
                <path
                  key={index}
                  d={path.d}
                  transform={`matrix(${path.transform.join(" ")})`}
                />
              ))
            ) : (
              <polygon points={plot.points.map((p) => p.join(",")).join(" ")} />
            )}
            {!plot.hideLabel && (
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="central"
                style={
                  plot.label?.fontSize
                    ? { fontSize: plot.label.fontSize }
                    : undefined
                }
                transform={
                  label.rotation
                    ? `rotate(${-label.rotation} ${label.x} ${label.y})`
                    : undefined
                }
              >
                {plot.number}
              </text>
            )}
          </g>
        );
      })}
      {plan.overlays?.map((overlay) => (
        <foreignObject
          key={overlay.image}
          x={overlay.x}
          y={overlay.y}
          width={overlay.width}
          height={overlay.height}
        >
          <div className={styles.overlay}>
            <img
              src={sitePath(`${assets}/${overlay.image}.svg`)}
              width={24}
              height={24}
              alt=""
            />
            <span>{overlay.label}</span>
          </div>
        </foreignObject>
      ))}
      {editPoints &&
        selected &&
        selected.points.map((p, index) => (
          <circle
            key={index}
            className={styles.vertex}
            cx={p[0]}
            cy={p[1]}
            r={5}
            tabIndex={0}
            role="button"
            aria-label={`Точка контура ${index + 1}`}
            onPointerDown={(event) => {
              event.stopPropagation();
              moving.current = index;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (moving.current === index) {
                event.stopPropagation();
                onPointChange?.(index, position(event));
              }
            }}
            onPointerUp={(event) => {
              moving.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={() => {
              moving.current = null;
            }}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              const deltas: Record<string, [number, number]> = {
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0],
                ArrowUp: [0, -1],
                ArrowDown: [0, 1],
              };
              const d = deltas[event.key];
              if (d) {
                event.preventDefault();
                onPointChange?.(index, [
                  Math.max(0, Math.min(plan.width, p[0] + d[0])),
                  Math.max(0, Math.min(plan.height, p[1] + d[1])),
                ]);
              }
            }}
          />
        ))}
      {phaseId &&
        plan.phases?.find((phase) => phase.id === phaseId)?.outline && (
          <polygon
            className={styles.phaseOutline}
            points={plan.phases
              .find((phase) => phase.id === phaseId)!
              .outline!.map((p) => p.join(","))
              .join(" ")}
          />
        )}
      {draftPoints.length > 0 && (
        <polyline
          className={styles.draft}
          points={draftPoints.map((p) => p.join(",")).join(" ")}
        />
      )}
    </svg>
  );
}
