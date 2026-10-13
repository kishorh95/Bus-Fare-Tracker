# Local mock bus fare data

This milestone is deliberately offline and uses fictional demonstration values only. It does not call redBus, Pay2All, any other external API, or Supabase.

## What is included

- Three fictional sample bus services on the Bengaluru → Pune route.
- Seven timestamped sample fare observations per service.
- Current fare, previous observation, percentage variation, mean, lowest and highest observed fare.
- A history table and chart.
- An “Add demo observation” button that appends the next predefined fictional fare for the selected service in React state. These additions disappear when the page is reloaded.
- A clearly labelled demonstration estimate calculated as the arithmetic average of the last three sample observations. This is not a trained prediction model and must not be represented as a real-world forecast.
- A target-fare form that only displays a demo confirmation. No real alerts are sent.

## Run on Windows / VS Code

From the repository root (`busfare-tracker-starter`):

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

To run the existing core package tests:

```powershell
npm.cmd test
```

To run a production build:

```powershell
npm.cmd run build
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` as shown above. No `.env` file, API key, Supabase project, or external service is needed for this milestone.
