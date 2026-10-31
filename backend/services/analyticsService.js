const Email = require("../models/Email");
const { VIEWS } = require("../constants/email");
const { buildFilter } = require("./emailQueryService");
const { inboxFilter, topProducts } = require("./statsService");
const {
    addDays,
    countDays,
    mondayOf,
    monthOf,
    nextMonth,
    zonedStartOfDay
} = require("../utils/dateKeys");

const DAILY_MAX_DAYS = 31;
const WEEKLY_MAX_DAYS = 183;
const TOP_PRODUCTS = 10;
const GRANULARITY = { DAY: "day", WEEK: "week", MONTH: "month" };

const granularityFor = (days) => {
    if (days <= DAILY_MAX_DAYS) return GRANULARITY.DAY;

    return days <= WEEKLY_MAX_DAYS ? GRANULARITY.WEEK : GRANULARITY.MONTH;
};

const bucketKey = (day, granularity) => {
    if (granularity === GRANULARITY.WEEK) return mondayOf(day);

    return granularity === GRANULARITY.MONTH ? monthOf(day) : day;
};

const bucketKeys = (from, to, granularity) => {
    const keys = [];

    if (granularity === GRANULARITY.MONTH) {
        for (let key = monthOf(from); key <= monthOf(to); key = nextMonth(key)) keys.push(key);
        return keys;
    }

    const step = granularity === GRANULARITY.WEEK ? 7 : 1;

    for (let key = bucketKey(from, granularity); key <= to; key = addDays(key, step)) keys.push(key);

    return keys;
};

const sumDays = (countsByDay, from, to) =>
    Object.entries(countsByDay)
        .filter(([day]) => day >= from && day <= to)
        .reduce((sum, [, count]) => sum + count, 0);

async function countByDay(userId, timeZone, start, end) {
    const rows = await Email.aggregate([
        { $match: inboxFilter(userId, { receivedAt: { $gte: start, $lt: end } }) },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$receivedAt", timezone: timeZone } },
                count: { $sum: 1 }
            }
        }
    ]);

    return Object.fromEntries(rows.map((row) => [row._id, row.count]));
}

/** Inquiry numbers for an inclusive date range, bucketed by day, week or month depending on its length. */
async function getAnalytics(userId, timeZone, from, to) {
    const days = countDays(from, to);
    const granularity = granularityFor(days);
    const previousFrom = addDays(from, -days);
    const start = zonedStartOfDay(from, timeZone);
    const end = zonedStartOfDay(addDays(to, 1), timeZone);
    const inRange = { receivedAt: { $gte: start, $lt: end } };

    const [byDay, unread, matched, review, products] = await Promise.all([
        countByDay(userId, timeZone, zonedStartOfDay(previousFrom, timeZone), end),
        Email.countDocuments(inboxFilter(userId, inRange, { isRead: { $ne: true } })),
        Email.countDocuments(inboxFilter(userId, inRange, { products: { $elemMatch: { in_catalog: true } } })),
        Email.countDocuments({
            $and: [...buildFilter(userId, { view: VIEWS.REVIEW, read: "all", search: "" }).$and, inRange]
        }),
        topProducts(userId, { limit: TOP_PRODUCTS, extra: inRange })
    ]);

    const counts = {};

    for (const [day, count] of Object.entries(byDay)) {
        if (day >= from && day <= to) {
            const key = bucketKey(day, granularity);
            counts[key] = (counts[key] ?? 0) + count;
        }
    }

    return {
        range: { from, to, days, granularity },
        cards: {
            total: sumDays(byDay, from, to),
            current: sumDays(byDay, from, to),
            previous: sumDays(byDay, previousFrom, addDays(from, -1)),
            unread,
            matched,
            review
        },
        series: bucketKeys(from, to, granularity).map((key) => ({ key, count: counts[key] ?? 0 })),
        products
    };
}

module.exports = { getAnalytics };
