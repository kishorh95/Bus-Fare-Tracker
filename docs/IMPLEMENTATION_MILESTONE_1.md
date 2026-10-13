# Milestone 1 — foundation

## Included
- Next.js demo dashboard for Bengaluru → Pune.
- Historical chart using fictional sample data, explicitly labelled as demo.
- Target-price UI preview (not yet a real notification).
- Shared fare validation and percentage-change functions with Vitest tests.
- Chrome MV3 popup for manual fare entry, local history, and CSV export.
- Supabase SQL schema for routes, services, fare observations, watchlists, and alerts with RLS.
- Data-access guardrails for redBus.

## Not included yet
- Supabase Auth integration or production database writes from the website.
- Live redBus fares or automated page reading.
- Automated price refresh or email notifications.
- Predictive model.

## Acceptance criteria
1. Dashboard labels all sample values as fictional demo data.
2. Fare-change logic handles increases, decreases and invalid zero previous fares.
3. Extension validates positive fares and distinct origin/destination.
4. Extension saves entries to browser-local storage and exports CSV.
5. Database policies scope user-owned rows to `auth.uid()`.
6. No service-role secret is exposed to the browser.
7. No automated redBus access is implemented without prior written permission or an approved data feed.
