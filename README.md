# BusFare Tracker — MVP starter

A starter monorepo for a fare-history website and a Chrome Manifest V3 extension, initially scoped to redBus and Bengaluru → Pune.

## Current status

- Website: demo dashboard with clearly labelled sample data.
- Shared core: fare-change calculations and validation.
- Extension: manual fare-entry popup; no redBus page reading or automated scraping.
- Database: initial Supabase/Postgres schema with row-level security policies.
- Prediction: deliberately not implemented yet; first collect comparable historical observations.

## Prerequisites

- Node.js 20.9+ recommended
- npm
- Git

## Run the website

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build and test shared fare logic

```bash
npm test
npm run build
```

## Build the extension

```bash
npm run build:extension
```

Then open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `apps/extension`.

The extension only accepts fare details entered by the user and saves them in extension-local storage. It does not inspect redBus pages, send data to a server, or require broad host permissions.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/migrations/001_initial_schema.sql`.
3. Configure authentication before enabling user-owned fare observations in a production deployment.
4. Copy `.env.example` to `apps/web/.env.local` and fill in the project URL and anon/publishable key.
5. Do not put service-role credentials in client-side code.

The current demo website intentionally does not connect to Supabase yet. Wire up authenticated reads/writes only after auth and RLS are tested.

## Data-access guardrail

redBus India terms restrict monitoring, scraping and automated screen capture/screen scraping without prior written permission. This starter therefore does not automate collection from redBus. Before adding a page-reading content script or scheduled collection, obtain written permission or confirm an approved API/data feed and its permitted uses. Manual entry is the prototype path, not a claim that automated collection is approved.

## Suggested next steps

1. Confirm whether redBus provides an approved API, affiliate feed or written permission for fare monitoring.
2. Add Supabase Auth and test row-level security.
3. Add authenticated manual fare entry to the website.
4. Connect the extension to the website through an explicit export/import or authenticated API flow.
5. Gather real, comparable fare observations.
6. Add baseline analytics; evaluate prediction only after sufficient data exists.
