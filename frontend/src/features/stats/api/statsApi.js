import { apiRequest } from "../../../shared/api/client";

/** Dashboard numbers with days bucketed in the given IANA time zone. */
export const fetchStats = (timeZone, signal) =>
  apiRequest("/api/stats", { params: { tz: timeZone }, signal }).then((body) => body.data);

/** Inquiry numbers for an inclusive date range, bucketed by the server. */
export const fetchAnalytics = ({ from, to }, timeZone, signal) =>
  apiRequest("/api/stats/analytics", { params: { from, to, tz: timeZone }, signal }).then((body) => body.data);
