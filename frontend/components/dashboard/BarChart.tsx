import type { CSSProperties } from "react";
import EmptyState from "@/components/common/EmptyState";
import { cx } from "@/lib/cx";
import { formatCurrency, formatNumber, formatValue } from "@/lib/format";
import type { ChartPoint, ValueFormat } from "@/types/dashboard";

interface BarChartProps {
  data: ChartPoint[];
  format: ValueFormat;
  /** Describes the chart for screen readers, e.g. "Bookings per month" */
  caption: string;
  categoryLabel?: string;
  valueLabel: string;
}

const TICK_COUNT = 4;

/**
 * Rounds the axis up to a readable maximum (1, 2, 2.5 or 5 × 10ⁿ per step).
 * Count data gets whole-number steps only, so there is never a "2.5 bookings" tick.
 */
function getNiceScale(maxValue: number, wholeSteps: boolean): { max: number; ticks: number[] } {
  if (maxValue <= 0) return { max: 1, ticks: [0] };

  const roughStep = maxValue / TICK_COUNT;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const multipliers = wholeSteps ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10];
  const niceStep = multipliers.map((m) => m * magnitude).find((s) => s >= roughStep) ?? roughStep;
  const step = wholeSteps ? Math.max(1, niceStep) : niceStep;

  return {
    max: step * TICK_COUNT,
    ticks: Array.from({ length: TICK_COUNT + 1 }, (_, index) => index * step),
  };
}

/**
 * Single-series bar chart built with plain HTML/CSS.
 * Each column shows a tooltip on hover; screen readers get an equivalent hidden table.
 */
export default function BarChart({ data, format, caption, categoryLabel = "Month", valueLabel }: BarChartProps) {
  if (data.length === 0) {
    return <EmptyState icon="bi-bar-chart" title="No data yet" message="Figures will appear here once there is activity." />;
  }

  const { max, ticks } = getNiceScale(Math.max(...data.map((point) => point.value)), format === "number");
  const toPercent = (value: number) => `${(value / max) * 100}%`;
  const formatTick = (value: number) => (format === "currency" ? formatCurrency(value, { compact: true }) : formatNumber(value));

  return (
    <figure className="bar-chart">
      <div className="bar-chart__y-axis" aria-hidden="true">
        {ticks.map((tick) => (
          <span key={tick} className="bar-chart__tick-label" style={{ bottom: toPercent(tick) }}>
            {formatTick(tick)}
          </span>
        ))}
      </div>

      <div className="bar-chart__plot" aria-hidden="true">
        {ticks.map((tick) => (
          <span
            key={tick}
            className={cx("bar-chart__gridline", tick === 0 && "bar-chart__gridline--baseline")}
            style={{ bottom: toPercent(tick) }}
          />
        ))}
        <div className="bar-chart__bars">
          {data.map((point) => (
            <div key={point.label} className="bar-chart__col" style={{ "--bar-height": toPercent(point.value) } as CSSProperties}>
              <span className="bar-chart__tooltip">
                {point.label}: {formatValue(point.value, format)}
              </span>
              <span className="bar-chart__bar" />
            </div>
          ))}
        </div>
      </div>

      <div className="bar-chart__labels" aria-hidden="true">
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>

      <table className="visually-hidden">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{categoryLabel}</th>
            <th scope="col">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.label}</th>
              <td>{formatValue(point.value, format)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
