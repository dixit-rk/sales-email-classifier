import { addDays, countDays, isDateKey, mondayOf, todayKey } from "../../../shared/lib/dateKeys";

export const MAX_RANGE_DAYS = 731;
export const DEFAULT_RANGE = "last-7";

export const RANGE_OPTIONS = [
  { value: "last-7", label: "Last 7 days" },
  { value: "last-week", label: "Last week" },
  { value: "current-week", label: "Current week" },
  { value: "last-30", label: "Last 30 days" },
  { value: "last-90", label: "Last 90 days" },
  { value: "this-year", label: "This year" },
  { value: "last-12-months", label: "Last 12 months" },
  { value: "last-2-years", label: "Last 2 years" },
  { value: "custom", label: "Custom range" },
];

const addYears = (key, years) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year + years, month - 1, day)).toISOString().slice(0, 10);
};

const PRESETS = {
  "last-7": (today) => [addDays(today, -6), today],
  "last-week": (today) => [addDays(mondayOf(today), -7), addDays(mondayOf(today), -1)],
  "current-week": (today) => [mondayOf(today), today],
  "last-30": (today) => [addDays(today, -29), today],
  "last-90": (today) => [addDays(today, -89), today],
  "this-year": (today) => [`${today.slice(0, 4)}-01-01`, today],
  "last-12-months": (today) => [addDays(addYears(today, -1), 1), today],
  "last-2-years": (today) => [addDays(addYears(today, -2), 1), today],
};

/** Turns `{ range, from, to }` from the URL into concrete dates; unknown or invalid input falls back to the last 7 days. */
export function resolveRange({ range, from, to }, today = todayKey()) {
  if (range === "custom" && isDateKey(from) && isDateKey(to) && from <= to) return { from, to };

  const [start, end] = (PRESETS[range] ?? PRESETS[DEFAULT_RANGE])(today);

  return { from: start, to: end };
}

/** Field-level message for an invalid custom range, or an empty string when it is valid. */
export function validateCustomRange({ from, to }) {
  if (!isDateKey(from)) return { field: "from", message: "Choose a start date" };
  if (!isDateKey(to)) return { field: "to", message: "Choose an end date" };
  if (from > to) return { field: "to", message: "End date can’t be before the start date" };
  if (countDays(from, to) > MAX_RANGE_DAYS) return { field: "to", message: "The range can be at most 2 years" };

  return null;
}
