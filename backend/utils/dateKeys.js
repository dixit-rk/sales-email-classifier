const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONDAY_INDEX = 1;
const DAYS_IN_WEEK = 7;

const toUtcMs = (key) => Date.parse(`${key}T00:00:00Z`);
const toKey = (ms) => new Date(ms).toISOString().slice(0, 10);

/** True for a real calendar date written as YYYY-MM-DD. */
const isDateKey = (value) =>
    typeof value === "string" && DATE_KEY_PATTERN.test(value) && toKey(toUtcMs(value)) === value;

const addDays = (key, days) => toKey(toUtcMs(key) + days * DAY_MS);

/** Number of calendar days from `from` to `to`, inclusive. */
const countDays = (from, to) => Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS) + 1;

const mondayOf = (key) => {
    const weekday = new Date(toUtcMs(key)).getUTCDay();

    return addDays(key, -((weekday - MONDAY_INDEX + DAYS_IN_WEEK) % DAYS_IN_WEEK));
};

const monthOf = (key) => key.slice(0, 7);

const nextMonth = (monthKey) => {
    const [year, month] = monthKey.split("-").map(Number);

    return toKey(Date.UTC(year, month, 1)).slice(0, 7);
};

const zoneOffsetMs = (ms, timeZone) => {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
            timeZone,
            hourCycle: "h23",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
            .formatToParts(new Date(ms))
            .map((part) => [part.type, part.value])
    );

    const asUtc = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second
    );

    return asUtc - ms;
};

/** The instant a calendar day starts in the given IANA time zone. */
const zonedStartOfDay = (key, timeZone) => {
    const localMidnight = toUtcMs(key);
    let guess = localMidnight;

    for (let attempt = 0; attempt < 2; attempt += 1) {
        guess = localMidnight - zoneOffsetMs(guess, timeZone);
    }

    return new Date(guess);
};

/** Today's calendar date in the time zone. */
const todayKey = (timeZone, now = Date.now()) =>
    new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date(now));

module.exports = {
    isDateKey,
    addDays,
    countDays,
    mondayOf,
    monthOf,
    nextMonth,
    zonedStartOfDay,
    todayKey
};
