const pad = (value) => String(value).padStart(2, "0");

export const WEEKLY_PERIOD = { versus: "last week", current: "this week", previous: "the week before" };
export const RANGE_PERIOD = { versus: "previous period", current: "this period", previous: "before" };

const periodChange = (current, previous, period) => {
  if (previous === 0) return current === 0 ? `No inquiries ${period.current}` : `${current} ${period.current}, none ${period.previous}`;

  const change = Math.round(((current - previous) / previous) * 100);

  return `${change >= 0 ? "+" : ""}${change}% vs ${period.versus}`;
};

/** The four headline cards: label, value, note and icon name. */
export function toStatCards({ total, current, previous, unread, matched, review }, period = WEEKLY_PERIOD) {
  const matchRate = total === 0 ? "No inquiries yet" : `${Math.round((matched / total) * 1000) / 10}% catalog match`;

  return [
    { label: "Total inquiries", value: pad(total), note: periodChange(current, previous, period), icon: "mail" },
    { label: "New inquiries", value: pad(unread), note: "Awaiting your attention", icon: "inbox" },
    { label: "AI matched", value: pad(matched), note: matchRate, icon: "sparkles" },
    { label: "Needs review", value: pad(review), note: "Requires a quick check", icon: "alert-circle" },
  ];
}
