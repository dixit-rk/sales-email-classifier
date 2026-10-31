const TARGET_INTERVALS = 4;
const STEPS = [1, 2, 5];

/** Whole-number y-axis ticks from 0 up to a round maximum that fits `max`. */
export function niceScale(max) {
  const raw = Math.max(max / TARGET_INTERVALS, 1);
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [...STEPS, 10].map((factor) => factor * magnitude).find((candidate) => candidate >= raw);
  const top = step * Math.ceil(Math.max(max, 1) / step);

  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, index) => index * step) };
}

const keyToDate = (key) => new Date(`${key.length === 7 ? `${key}-01` : key}T00:00:00Z`);
const format = (key, options) => keyToDate(key).toLocaleDateString(undefined, { ...options, timeZone: "UTC" });

/** Short x-axis label for a bucket; months show the year when the range spans several. */
export function bucketLabel(key, granularity, { weekdays, spansYears }) {
  if (granularity === "month") return format(key, spansYears ? { month: "short", year: "2-digit" } : { month: "short" });
  if (granularity === "day" && weekdays) return format(key, { weekday: "short" });

  return format(key, { day: "numeric", month: "short" });
}

/** Full description of a bucket for tooltips and screen readers. */
export function bucketTitle(key, granularity) {
  if (granularity === "month") return format(key, { month: "long", year: "numeric" });
  if (granularity === "week") return `Week of ${format(key, { day: "numeric", month: "short", year: "numeric" })}`;

  return format(key, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/** Show every Nth x-axis label so they never overlap. */
export const labelStride = (count, maxLabels) => Math.max(1, Math.ceil(count / maxLabels));

/** Human-readable date for range summaries. */
export const formatDateKey = (key) => format(key, { day: "numeric", month: "short", year: "numeric" });
