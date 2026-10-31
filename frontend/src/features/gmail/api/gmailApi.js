import { apiRequest } from "../../../shared/api/client";

const BASE = "/api/gmail";

/** Asks Google right now whether the Gmail connection still works: `{ status, email, checkedAt }`. */
export const fetchConnection = (signal) => apiRequest(`${BASE}/connection`, { signal }).then((body) => body.data);

/** The Gmail label put on pricing threads: `{ name }`. */
export const fetchLabel = (signal) => apiRequest(`${BASE}/label`, { signal }).then((body) => body.data);

/** Replaces the label, creating it in Gmail when missing: `{ name, createdInGmail }`. */
export const saveLabel = (name) => apiRequest(`${BASE}/label`, { method: "PUT", body: { name } }).then((body) => body.data);
