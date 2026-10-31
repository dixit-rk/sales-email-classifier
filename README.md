# ChemQuote AI

ChemQuote AI watches a chemical manufacturer's sales inbox, finds the emails where a customer asks for a price, works out which
product and how much they want, and labels those emails in Gmail. Sales teams get one clean list of real opportunities instead of
reading every email.

It was built for a hackathon. A public **AI playground** lets anyone see what the AI does without signing in with Google.

## What it does

- **Reads new emails as they arrive.** Gmail sends a push notification, the app fetches the email and classifies it with Gemini.
- **Finds the product and amount.** The AI extracts product names, corrects spelling, and returns the quantity ("200 kg").
- **Matches against your own product catalog.** A product counts as "in the catalog" only when its name, item code, alias or
  formula matches exactly. The catalog, not the AI, makes that decision.
- **Labels price requests in Gmail** (default label: `pricing query`, changeable in Settings).
- **Asks a person when unsure.** Unclear emails ("I need some acid") go to a Needs review queue instead of being guessed.
- **Updates the browser live.** New emails appear through a WebSocket with a popup and a notification bell, with no refresh.

## Pages

| Page | What it is for |
|---|---|
| Overview | Headline numbers, recent inquiries, 7-day activity and top products |
| Pricing inbox | Server-side search, filters, sorting and pagination; select all works across pages; mark read or unread |
| Needs review | Approve or dismiss unclear emails, one at a time or in bulk |
| Analytics | Presets and custom date ranges up to two years, an adaptive chart with a y-axis, top 10 products, CSV export |
| Product catalog | Search, add, delete; Excel template and upload with item codes and aliases |
| Settings | Live Gmail connection check on every visit, and the Gmail label |
| Help & support | A guide with an animated preview of each page |
| Playground (public) | Try the AI on sample products and a sample email, no sign-in |

## How it works

```
Gmail inbox
   |  push notification
   v
Google Pub/Sub  -->  POST /webhooks/gmail   (verifies the Google-signed token)
                          |
                          v
              fetch the new emails (Gmail API)
                          |
                          v
        Gemini reads each email: price request? products? quantity?
                          |
                          v
        match the products against the user's catalog (MongoDB)
                          |
        +-----------------+------------------+
        v                 v                  v
  save in MongoDB   label in Gmail     push to the browser (Socket.IO)
```

The React app talks to the same API for lists, filters, bulk actions, stats, the catalog and settings.

## Tech stack

- **Backend:** Node.js 20+, Express 5, MongoDB with Mongoose, Socket.IO, Google APIs (Gmail, OAuth, Pub/Sub tokens),
  Google Gemini (`@google/genai`), ExcelJS and multer for catalog uploads
- **Frontend:** React 19, Vite, React Router, lucide-react, socket.io-client
- **Security:** Google refresh tokens are encrypted at rest (AES-256-GCM); sessions are stored in MongoDB; the Pub/Sub webhook
  verifies the Google-signed token; every query is scoped to the signed-in user

## Project structure

```
backend/
  server.js              app setup, sessions, routes, Socket.IO
  routes/ controllers/   HTTP layer
  services/              Gmail, Gemini, catalog, stats, playground, realtime
  models/                User, Email, Product, PlaygroundUsage
  utils/ constants/ config/
frontend/
  src/app/               providers, routes, layout
  src/features/          auth, emails, stats, catalog, gmail, notifications, guide, playground
  src/shared/            ui components, hooks, api client, helpers
  src/pages/             one file per route
docs/                    architecture notes, feature list, sample catalog workbook
```

More detail: [docs/architecture.md](docs/architecture.md) (endpoints, data flow, design decisions) and
[docs/features.md](docs/features.md).

## Getting started

### Prerequisites

- Node.js 20 or newer
- A MongoDB database (a free MongoDB Atlas cluster works)
- A Google Cloud project with the **Gmail API** and **Cloud Pub/Sub API** enabled
- A Gemini API key from Google AI Studio

### 1. Install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure

```bash
cp backend/.env.example backend/.env
```

Fill in `backend/.env`; every variable is explained in [backend/.env.example](backend/.env.example). `backend/.env` is ignored by git.
The frontend needs no configuration for local development. To point it at a different API, create `frontend/.env` with
`VITE_API_URL=https://your-api.example.com`.

### 3. Set up Google

1. **OAuth client.** In Google Cloud Console create an OAuth client of type *Web application*. Add
   `http://localhost:5000/auth/google/callback` as an authorized redirect URI and put the client id and secret in `.env`.
2. **Consent screen.** Add the scope `https://www.googleapis.com/auth/gmail.modify`. While the app is in *Testing* mode only
   the test users you list can sign in; a public release needs Google's verification for this restricted scope. That is why
   the playground exists.
3. **Pub/Sub.** Create a topic and give `gmail-api-push@system.gserviceaccount.com` the *Pub/Sub Publisher* role on it. Create a
   push subscription that targets `https://<your-api>/webhooks/gmail` with an OIDC token (choose a service account and an
   audience). Put the topic name, the audience and the service account email in `.env`. The webhook needs a public HTTPS
   address; for local work use a tunnel.

### 4. Run

```bash
# terminal 1
cd backend && npm run dev        # http://localhost:5000

# terminal 2
cd frontend && npm run dev       # http://localhost:5173
```

Open http://localhost:5173. Without signing in you can already open `/playground`.

### Useful commands

```bash
cd frontend && npm run lint      # lint the frontend
cd frontend && npm run build     # production build
cd backend && node testGemini.js # run the AI step once on a sample email
```

## Deploying

Set these on the API host (the full list with explanations is in [backend/.env.example](backend/.env.example)):

- `NODE_ENV=production` and `TRUST_PROXY_HOPS=1`. Both are needed: production uses secure cross-site cookies, and those are
  only sent when the server knows it is behind an HTTPS proxy.
- `FRONTEND_URL` is the exact address of the deployed frontend (https, no trailing slash). `GOOGLE_CALLBACK_URL` is
  `https://<your-api>/auth/google/callback`, and the same address must be added as an authorized redirect URI in Google Cloud.
- `PUBSUB_AUDIENCE` and the push subscription's endpoint must point at `https://<your-api>/webhooks/gmail`.
- Allow the API host in MongoDB Atlas under Network Access.
- On the frontend host set `VITE_API_URL=https://<your-api>` before building.

## The public playground

`/playground` runs the same AI and matching on products and an email the visitor types, with no sign-in and no inbox access.
To keep a free demo fair and protect the AI bill:

- Each visitor gets **15 free requests**. The count is kept per **device** and per **network address**, so the same device on
  another network, or another device on the same network, shares one allowance. A browser cannot read a MAC address, so the
  device is identified by a hash of hardware traits computed in the browser.
- Both identifiers are stored only as keyed hashes. Nothing the visitor types is stored.
- A global daily cap (default 300) applies across all visitors.
- **Deployment note:** set `TRUST_PROXY_HOPS` to the number of proxies in front of the API (usually `1`). At `0` the server
  ignores `X-Forwarded-For`, which behind a proxy makes every visitor look like one network.
- The limits can be changed with `PLAYGROUND_LIMIT_PER_DEVICE`, `PLAYGROUND_LIMIT_PER_IP` and `PLAYGROUND_DAILY_CAP`. To reset
  a visitor, delete their documents from the `playgroundusages` collection.

## The product catalog

Download the Excel template from the Product catalog page, or use the ready-made
[docs/samples/catalog-sample.xlsx](docs/samples/catalog-sample.xlsx) (25 products). Columns: **Product name**, **Item Code**,
**Formula**, **Aliases** (other names customers use, separated by commas). Up to 500 rows and 1 MB per upload; existing products
are updated rather than duplicated.

## Known limitations

- The Gmail watch is not started or renewed automatically. It must be started once per user (`POST /api/gmail/watch` while
  signed in) and Gmail expires it after about seven days.
- Approving a message in Needs review does not yet apply the Gmail label.
- Sign-in uses a cross-site cookie when the frontend and API are on different domains (for example Vercel and Render).
  Chrome, Edge and Firefox allow it; Safari and some privacy settings block it. Hosting both under one domain avoids that.
- CORS allows a single origin (`FRONTEND_URL`).
- There is no rate limiting on search or catalog upload.
- There are no automated tests; the project was verified by hand and with scripted browser checks during development.
- Playground identity is best effort: identical machines can share a device fingerprint, and one office network shares one address.
