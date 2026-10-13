# redBus data-access feasibility

The redBus India terms of service at https://www.redbus.in/ta/info/termscondition include restrictions on monitoring, scraping, and automated screen capture/screen scraping without prior written permission.

Therefore, this starter intentionally uses manual user-entered fares. It does not request redBus host permissions, inspect redBus page DOM, call undocumented endpoints, bypass access controls, or run a scheduled collector.

Before any automated redBus integration:

1. Contact redBus and request written confirmation of the permitted data source and use.
2. Ask whether API or affiliate feed access is available for this use case.
3. Confirm whether storing historical fares, displaying comparisons, sending alerts, and commercial use are permitted.
4. Implement only the approved interface and respect its rate limits and attribution requirements.

A user-assisted extension that reads redBus page content automatically may still be considered screen scraping, so do not assume it is permitted just because the user clicks a button.
