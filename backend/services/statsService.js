const Email = require("../models/Email");
const { VIEWS } = require("../constants/email");
const { buildFilter } = require("./emailQueryService");
const { zonedStartOfDay } = require("../utils/dateKeys");

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVITY_DAYS = 7;
const LOOKBACK_DAYS = ACTIVITY_DAYS * 2 + 1;
const TOP_PRODUCTS = 10;
const DAY_KEY_LOCALE = "en-CA";

const inboxFilter = (userId, ...extra) => {
    const filter = buildFilter(userId, { view: VIEWS.INBOX, read: "all", search: "" });

    return { $and: [...filter.$and, ...extra] };
};

const toDayKey = (timeZone, time) =>
    new Intl.DateTimeFormat(DAY_KEY_LOCALE, { timeZone }).format(new Date(time));

const dayKeys = (timeZone, now) =>
    Array.from({ length: ACTIVITY_DAYS }, (_, index) =>
        toDayKey(timeZone, now - (ACTIVITY_DAYS - 1 - index) * DAY_MS)
    );

const sumDays = (countsByDay, from, to) =>
    Object.entries(countsByDay)
        .filter(([day]) => day >= from && day <= to)
        .reduce((sum, [, count]) => sum + count, 0);

async function countByDay(userId, timeZone, now) {
    const since = new Date(now - LOOKBACK_DAYS * DAY_MS);

    const rows = await Email.aggregate([
        { $match: inboxFilter(userId, { receivedAt: { $gte: since } }) },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$receivedAt", timezone: timeZone } },
                count: { $sum: 1 }
            }
        }
    ]);

    return Object.fromEntries(rows.map((row) => [row._id, row.count]));
}

/** Most mentioned products across inbox inquiries, optionally limited by an extra match such as a date range. */
async function topProducts(userId, { limit, extra }) {
    const [result] = await Email.aggregate([
        { $match: inboxFilter(userId, ...(extra ? [extra] : [])) },
        { $unwind: "$products" },
        {
            $facet: {
                top: [
                    {
                        $group: {
                            _id: "$products.normalized_name",
                            count: { $sum: 1 },
                            inCatalog: { $max: "$products.in_catalog" }
                        }
                    },
                    { $sort: { count: -1, _id: 1 } },
                    { $limit: limit }
                ],
                total: [{ $count: "mentions" }]
            }
        }
    ]);

    const mentions = result.total[0]?.mentions ?? 0;

    return result.top.map((item) => ({
        name: item._id,
        count: item.count,
        inCatalog: item.inCatalog,
        percent: Math.round((item.count / mentions) * 100)
    }));
}

/** Dashboard numbers for the Overview page: the last 7 days of activity and the top 10 products in the same window, in the caller's time zone. */
async function getStats(userId, timeZone, now = Date.now()) {
    const days = dayKeys(timeZone, now);
    const activityStart = { receivedAt: { $gte: zonedStartOfDay(days[0], timeZone) } };

    const [total, unread, matched, review, byDay, products] = await Promise.all([
        Email.countDocuments(inboxFilter(userId)),
        Email.countDocuments(buildFilter(userId, { view: VIEWS.INBOX, read: "unread", search: "" })),
        Email.countDocuments(inboxFilter(userId, { products: { $elemMatch: { in_catalog: true } } })),
        Email.countDocuments(buildFilter(userId, { view: VIEWS.REVIEW, read: "all", search: "" })),
        countByDay(userId, timeZone, now),
        topProducts(userId, { limit: TOP_PRODUCTS, extra: activityStart })
    ]);

    const previousEnd = toDayKey(timeZone, now - ACTIVITY_DAYS * DAY_MS);
    const previousStart = toDayKey(timeZone, now - (ACTIVITY_DAYS * 2 - 1) * DAY_MS);

    return {
        cards: {
            total,
            current: sumDays(byDay, days[0], days[days.length - 1]),
            previous: sumDays(byDay, previousStart, previousEnd),
            unread,
            matched,
            review
        },
        activity: days.map((date) => ({ date, count: byDay[date] ?? 0 })),
        products
    };
}

module.exports = { getStats, inboxFilter, topProducts };
