const { HttpError } = require("./httpError");
const { isDateKey, countDays } = require("./dateKeys");

const BAD_REQUEST = 400;
const DEFAULT_TIME_ZONE = "UTC";
const MAX_RANGE_DAYS = 731;

/** Validates an IANA time zone name, defaulting to UTC. */
function parseTimeZone(value = DEFAULT_TIME_ZONE) {
    try {
        new Intl.DateTimeFormat("en", { timeZone: value });
        return value;
    } catch {
        throw new HttpError(BAD_REQUEST, "tz must be a valid IANA time zone");
    }
}

/** Validates the analytics query: a time zone and an inclusive from/to date range of at most two years. */
function parseAnalyticsQuery(query) {
    const { from, to } = query;

    if (!isDateKey(from) || !isDateKey(to)) {
        throw new HttpError(BAD_REQUEST, "from and to must be dates in YYYY-MM-DD format");
    }

    if (from > to) {
        throw new HttpError(BAD_REQUEST, "from must not be after to");
    }

    if (countDays(from, to) > MAX_RANGE_DAYS) {
        throw new HttpError(BAD_REQUEST, `The range must be at most ${MAX_RANGE_DAYS} days`);
    }

    return { timeZone: parseTimeZone(query.tz), from, to };
}

module.exports = { parseTimeZone, parseAnalyticsQuery };
