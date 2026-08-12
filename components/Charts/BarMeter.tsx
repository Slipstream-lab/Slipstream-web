export interface BarMeterDatum {
  label: string;
  value: number;
  /** Optional right-aligned value caption; defaults to the numeric value. */
  caption?: string;
}

export interface BarMeterProps {
  data: BarMeterDatum[];
  /** Accessible name for the chart. */
  title: string;
  /** Max value for the scale; defaults to the largest datum. */
  max?: number;
}

/**
 * A small, accessible horizontal bar meter. Brand-neutral single-hue encoding:
 * length encodes magnitude (the accurate channel), with a text value for exact
 * readout. No color-only information.
 */
export function BarMeter({ data, title, max }: BarMeterProps) {
  const scaleMax = max ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <figure className="flex flex-col gap-2" role="img" aria-label={title}>
      <figcaption className="sr-only">{title}</figcaption>
      {data.map((d) => {
        const pct = scaleMax > 0 ? (d.value / scaleMax) * 100 : 0;
        return (
          <div key={d.label} className="flex items-center gap-3 text-sm">
            <span
              className="w-32 shrink-0 truncate text-slate-300"
              title={d.label}
            >
              {d.label}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <span className="w-16 shrink-0 text-right font-mono text-xs text-slate-400">
              {d.caption ?? d.value}
            </span>
          </div>
        );
      })}
    </figure>
  );
}
