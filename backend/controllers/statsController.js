const { parseTimeZone, parseAnalyticsQuery } = require("../utils/statsQuery");
const { getStats } = require("../services/statsService");
const { getAnalytics } = require("../services/analyticsService");

exports.get = async (req, res) => {
    const timeZone = parseTimeZone(req.query.tz);

    res.json({ data: await getStats(req.session.userId, timeZone) });
};

exports.analytics = async (req, res) => {
    const { timeZone, from, to } = parseAnalyticsQuery(req.query);

    res.json({ data: await getAnalytics(req.session.userId, timeZone, from, to) });
};
