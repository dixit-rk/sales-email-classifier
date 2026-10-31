# Architecture

## Flow
1. `GET /auth/google` -> Google OAuth (scopes: openid, email, profile, `gmail.modify`; offline, consent). State stored in session.
2. `GET /auth/google/callback` -> verifies state and id token, upserts `User`, stores AES-encrypted refresh token, regenerates session, redirects to `FRONTEND_URL`.
3. `POST /api/gmail/watch` -> Gmail `users.watch` on INBOX to the Pub/Sub topic; saves `gmailHistoryId` and `gmailWatchExpiration` on the user.
4. Gmail -> Pub/Sub push -> `POST /webhooks/gmail`. Verifies the Google OIDC bearer token (audience + service-account email), decodes `{emailAddress, historyId}`, finds the user, runs `processGmailHistory`. Responds 204 on success, 503 on failure (Pub/Sub retries).
5. `historyService` lists `messageAdded` history since the stored cursor (INBOX only), then per message `emailService.fetchAndSaveEmail`: fetch full message, upsert `Email` (idempotent on `userId + gmailMessageId`), classify, label.
6. `classificationService` claims the email (`pending|failed` -> `processing`), calls `geminiService.classifyEmail`, saves the result or marks `failed`.
7. `gmailLabelService` adds the user's one configured label (default `pricing query`) to the thread only if `isPricingQuery && !needsReview && any product in_catalog`. Missing labels are created in Gmail (`gmail.modify` allows `labels.create`/`delete`, verified); matching is case-insensitive like Gmail's. The configured label is also created at sign-in. Replacing the label does not touch threads that already carry the old one.
8. After classification, `emailService` pushes the email to the owner's browser over Socket.IO (event `email:classified`, room `user:<id>`) when it is a pricing query or needs review. The socket shares the Express session cookie; unauthenticated sockets are refused. The frontend shows a toast and a bell notification, and refetches lists and counters.
9. The app's lists read MongoDB, not Gmail: `GET /api/emails` (view `inbox` or `review`, `search`, `read`, `sort`, `order`, `page`, `limit`).
10. `GET /api/gmail/pricing-threads` (live Gmail threads) still exists but the UI no longer uses it.

## Endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | none | health message |
| GET | `/auth/google` | none | start OAuth |
| GET | `/auth/google/callback` | state | finish OAuth |
| GET | `/auth/me` | session | current user `{name, googleName, email, picture, gmailConnected}`; `name` is the display name or the Google name |
| PATCH | `/auth/me` | session | set `displayName` (max 60; empty resets to the Google name) |
| POST | `/auth/logout` | session | destroy session |
| POST | `/api/gmail/watch` | session | start Gmail watch |
| GET | `/api/gmail/pricing-threads` | session | labelled threads, paginated |
| POST | `/webhooks/gmail` | Pub/Sub OIDC | Gmail push |
| GET | `/api/emails` | session | paginated, filtered, sorted list for `inbox` / `review` |
| GET | `/api/emails/counts` | session | sidebar counters |
| GET | `/api/emails/:id` | session | one email with body |
| POST | `/api/emails/bulk/read` | session | mark selection read/unread |
| POST | `/api/emails/bulk/review` | session | approve/dismiss selection (review queue only; approve needs an identified product) |
| GET | `/api/stats?tz=` | session | dashboard cards, 7-day activity (bucketed in `tz`), top products |
| GET | `/api/stats/analytics?from=&to=&tz=` | session | range analytics: cards, series bucketed by day (≤31 days), week (≤183) or month, top-10 products. `from`/`to` are inclusive `YYYY-MM-DD` dates, max 731 days |
| GET | `/api/gmail/connection` | session | asks Google right now whether the stored token works (`connected` / `expired` / `unavailable`, never cached); updates `gmailConnected` |
| GET | `/api/gmail/label` | session | the Gmail label put on pricing threads (default `pricing query`) |
| PUT | `/api/gmail/label` | session | replace the label `{name}`; created in Gmail if missing (matched ignoring case); 409 if the connection expired, 400 reserved or invalid name |
| GET | `/api/playground/usage` | none (public) | free requests left for this device + network (`X-Device-Id` header required) |
| POST | `/api/playground/analyze` | none (public) | runs the AI on a sample email against up to 6 sample products; uses one free request |
| WS | `/socket.io` | session | server push `email:classified` |

## Models (`backend/models/`)
- `User`: googleId, name (from Google, refreshed on login), labelName (Gmail label for pricing threads; unset = default), displayName (user-chosen, never overwritten by login), email, picture, encryptedRefreshToken, gmailConnected, gmailHistoryId, gmailWatchExpiration, timestamps.
- `Email` (also quantity, isRead, reviewDecision, reviewedAt): userId, gmailMessageId, threadId, from, subject, body, receivedAt, classificationStatus, isPricingQuery, products[{mentioned_name, normalized_name, in_catalog}], needsReview, classificationReason, classifiedAt, timestamps. Unique index `userId + gmailMessageId`; index `userId + receivedAt`. Inbox = pricing query and (no review needed or approved). Review queue = needsReview and no decision yet.

## Classification
`classificationService` -> `catalogService.buildCatalogPrompt` -> `geminiService.classifyEmail` -> `catalogService.applyCatalog`.
- The catalog lives in the `products` collection per user (name, itemCode, formula, aliases; `normalizedTerms` holds the normalized name, item code (also without separators, so PCFG-228 = PCFG 228 = PCFG228), aliases and formula).
- The prompt lists the whole catalog with aliases up to 100 products; beyond that only the products whose names, item codes or aliases appear in the email (n-gram lookup on `normalizedTerms`).
- The AI extracts and normalizes product names; the **catalog decides `in_catalog`** by exact normalized name/item code/alias/formula match (`utils/catalogMatcher.js`). No fuzzy matching on purpose: chemical names differ by one letter (nitric vs citric). Common misspellings belong in aliases.
- A wording shared by two products forces `needs_review`. Structured JSON output, temperature 0, response validated by hand. An out-of-catalog product alone does not need review.
- Deleting or editing a product does not change emails already classified.

## Public playground (no sign-in)
`/playground` lets anyone try the AI on made-up data. It reuses the real pipeline (`geminiService` + pure `matchAgainstCatalog`) against products sent in the request; nothing is stored except usage counters.
- **Identity:** a browser cannot read a MAC address, so the device is identified by `X-Device-Id`, a SHA-256 of hardware traits computed in the browser (`shared/lib/deviceId.js`), and the network by the request IP (`req.ip`; IPv6 reduced to its /64). Neither is kept in a cookie.
- **Limits:** a request is allowed only if the device counter, the network counter and a global daily cap are all below their limits (default 15 / 15 / 300; the first two shared across devices and networks, so the same device on a new network, or a new device on the same network, is the same visitor). Counters live in `playgroundusages` as HMAC hashes (`utils/clientIdentity.js`), are incremented atomically, and are handed back if the AI call fails.
- **Deploying:** set `TRUST_PROXY_HOPS` to the number of proxies in front of the API (usually 1). At 0 the server ignores `X-Forwarded-For`; behind a proxy that would make every visitor look like one network. To reset a visitor or lift limits for judging, delete documents in `playgroundusages` or raise the env limits.
- **Known weakness:** identical machines (same hardware traits and time zone) share one device fingerprint, and one office or venue network shares one IP, so those visitors share a quota.

## Env var names (values in `backend/.env`, never read it)
PORT, TRUST_PROXY_HOPS, PLAYGROUND_LIMIT_PER_DEVICE, PLAYGROUND_LIMIT_PER_IP, PLAYGROUND_DAILY_CAP, PLAYGROUND_HASH_SECRET (optional, falls back to SESSION_SECRET), MONGODB_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, FRONTEND_URL, SESSION_SECRET, TOKEN_ENCRYPTION_KEY, GOOGLE_CLOUD_PROJECT_ID, GMAIL_PUBSUB_TOPIC, PUBSUB_AUDIENCE, PUBSUB_SERVICE_ACCOUNT_EMAIL, GEMINI_API_KEY, GEMINI_MODEL.

## Known gaps (as of first read)
- No rate limiting on the catalog import route.
- Stats are computed on request from MongoDB, not cached. Overview shows the top 10 products for the last 7 days (the same window as its activity chart), Analytics the top 10 for the selected range (by mentions). Days, weeks (Monday start) and months are calendar buckets in the viewer's time zone.
- Approving a review email does not yet apply the Gmail label.
- No rate limiting on `/api/emails` search.
- Nothing calls `/api/gmail/watch` automatically; the Gmail watch expires after about 7 days and is never renewed.
- Session cookie has `secure: false`; set it true behind HTTPS (Vercel/production) along with `sameSite: "none"` if frontend and API are on different domains. CORS uses the single `FRONTEND_URL`.
- `google-auth-library` is required in `webhookRoutes.js` but not listed in `backend/package.json` (comes in through `googleapis`).
- `config/db.js` is unused; `server.js` connects itself. `backend/testGemini.js` is a manual script.
- No rate limiting on routes.
- `Email.body` stores only the text/plain part.
