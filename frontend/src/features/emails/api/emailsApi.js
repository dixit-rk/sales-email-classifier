import { apiRequest } from "../../../shared/api/client";

const BASE = "/api/emails";

/** One page of emails for a view with server-side filters, sorting and pagination. */
export const fetchEmails = (query, signal) => apiRequest(BASE, { params: query, signal });

/** One email including its full body. */
export const fetchEmail = (id, signal) => apiRequest(`${BASE}/${id}`, { signal }).then((body) => body.data);

/** Sidebar counters: `{ inbox, unreadInbox, review }`. */
export const fetchCounts = (signal) => apiRequest(`${BASE}/counts`, { signal }).then((body) => body.data);

/** Marks a selection read or unread. */
export const setRead = (selection, read) =>
  apiRequest(`${BASE}/bulk/read`, { method: "POST", body: { selection, read } }).then((body) => body.data);

/** Approves or dismisses a selection of emails waiting for review. */
export const decideReview = (selection, decision) =>
  apiRequest(`${BASE}/bulk/review`, { method: "POST", body: { selection, decision } }).then((body) => body.data);
