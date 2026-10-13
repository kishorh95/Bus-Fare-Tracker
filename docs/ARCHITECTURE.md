# Architecture and scope

## Components

- `apps/web`: Next.js App Router website; currently a static demo dashboard.
- `apps/extension`: Chrome Manifest V3 popup for manual fare capture.
- `packages/core`: reusable fare validation and comparison functions.
- `supabase/migrations`: PostgreSQL schema and RLS policies.

## MVP flow

1. User manually observes a fare on a booking platform.
2. User enters origin, destination, travel date, operator/service description, bus type and displayed total price in the extension or website.
3. The observation is saved with a timestamp and source/method metadata.
4. Website groups observations by comparable service and travel date and displays changes.
5. Alerts can be added after authentication and notification delivery are implemented.

## Important comparison rules

Do not compare different bus types, operators/services, travel dates, fare conditions or totals with different fees as though they were the same product. Keep the observation method and timestamp. Mark old observations stale in the UI.

## Prediction approach

Version 1: no predictive claims. Show observed change, observed range, and recent average only where enough observations exist.

Version 2: evaluate a simple baseline on chronological holdout data. Any model must be compared with that baseline and report the forecast horizon, coverage, and measured performance. Do not train/test on randomly mixed rows from the same fare history.
