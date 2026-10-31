# Features

| ID | Feature | Status | Where |
|---|---|---|---|
| F-001 | Google sign-in with Gmail permission | done | `controllers/authController.js` |
| F-002 | Encrypted refresh-token storage | done | `utils/encryption.js` |
| F-003 | Gmail watch via Pub/Sub | backend done, no UI trigger | `services/gmailService.js` |
| F-004 | Webhook ingest with OIDC verification | done | `routes/webhookRoutes.js` |
| F-005 | Gemini pricing/product classification | done | `services/geminiService.js` |
| F-006 | Auto-label `pricing query` threads in Gmail | done | `services/gmailLabelService.js` |
| F-007 | Pricing threads list API | done | `services/pricingThreadsService.js` |
| F-008 | Login, shell, Pricing inbox, Needs review (server-side filter/sort/pagination, cross-page select all) | done | `frontend/src/` |
| F-010 | Live push + notification bell | done | `services/realtimeService.js`, `features/notifications/` |
| F-011 | Overview, Analytics (date range presets + custom range up to 2 years, adaptive chart, CSV export), Settings | done | `frontend/src/pages/`, `services/statsService.js` |
| F-014 | Product catalog in MongoDB: search, pagination, add, delete, Excel template + upload with item code and aliases; used by classification | done | `features/catalog/`, `services/catalogService.js` |
| F-015 | Settings: live Gmail connection check on every visit (expired -> Manage connection) and a replaceable Gmail label | done | `features/gmail/`, `services/gmailSettingsService.js` |
| F-016 | Help & support guide page: how-it-works steps and a card per page with an animated mini preview (plays on hover, focus or tap; still for reduced motion) | done | `features/guide/`, `pages/GuidePage.jsx` |
| F-017 | Public AI playground (no sign-in): 1-6 sample products + a sample email, AI result, 15 free requests per device/network (hashed counters, daily cap) | done | `features/playground/`, `services/playgroundService.js`, `services/playgroundQuotaService.js` |
| F-012 | Apply Gmail label on approve | not started | — |
| F-013 | Profile menu and editable display name (used in the greeting) | done | `features/auth/components/ProfileMenu.jsx` |
| F-009 | Watch renewal | not started | — |

## Demo data
58 sample inbox emails exist in Atlas with `gmailMessageId` starting `demo-product-` (11 products, spread over the last 80 days; fake `threadId`, so "Open in Gmail" does not resolve). Remove with `db.emails.deleteMany({ gmailMessageId: /^demo-product-/ })`.

A sample workbook with 25 products is in `docs/samples/catalog-sample.xlsx` (upload it on the Product catalog page).
