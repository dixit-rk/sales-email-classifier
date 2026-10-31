const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const DAY_MS = 24 * 60 * 60 * 1000;

/** Short list date in the viewer's locale and time zone: time today, "Yesterday", or "Oct 29". */
export function formatListDate(iso, now = new Date()) {
  if (!iso) return "";

  const date = new Date(iso);
  const daysAgo = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);

  if (daysAgo === 0) return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (daysAgo === 1) return "Yesterday";

  const showYear = date.getFullYear() !== now.getFullYear();

  return date.toLocaleDateString([], { month: "short", day: "numeric", year: showYear ? "numeric" : undefined });
}

/** Full date and time in the viewer's locale and time zone. */
export function formatFullDate(iso) {
  return iso ? new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";
}
