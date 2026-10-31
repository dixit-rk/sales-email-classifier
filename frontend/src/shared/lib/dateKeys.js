const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONDAY_INDEX = 1;
const DAYS_IN_WEEK = 7;

const toUtcMs = (key) => Date.parse(`${key}T00:00:00Z`);
const toKey = (ms) => new Date(ms).toISOString().slice(0, 10);

/** True for a real calendar date written as YYYY-MM-DD. */
export const isDateKey = (value) => DATE_KEY_PATTERN.test(value) && toKey(toUtcMs(value)) === value;

export const addDays = (key, days) => toKey(toUtcMs(key) + days * DAY_MS);

/** Inclusive number of days from `from` to `to`. */
export const countDays = (from, to) => Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS) + 1;

/** Moves by whole months, keeping the day of month where the target month has it and clamping otherwise. */
export function addMonths(key, months) {
  const [year, month, day] = key.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month + months, 0)).getUTCDate();

  return toKey(Date.UTC(year, month - 1 + months, Math.min(day, lastDay)));
}

export const mondayOf = (key) => addDays(key, -((new Date(toUtcMs(key)).getUTCDay() - MONDAY_INDEX + DAYS_IN_WEEK) % DAYS_IN_WEEK));

/** Today's calendar date in the viewer's time zone. */
export const todayKey = (now = new Date()) => new Intl.DateTimeFormat("en-CA").format(now);

/** Formats a date key in the viewer's locale; the key is a calendar date, so no time zone shift applies. */
export const formatDateKey = (key, options) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString(undefined, { ...options, timeZone: "UTC" });
