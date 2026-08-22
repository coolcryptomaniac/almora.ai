# GitHub Actions cost policy

Repository automation is intentionally conservative to avoid unnecessary GitHub Actions usage.

- No daily or hourly scheduled workflows.
- Heavy browser/smoke/deployment workflows are manual-only (`workflow_dispatch`).
- Data maintenance workflows run at most once per month and can also be run manually.
- Prefer Cloudflare/static runtime logic and local/manual checks over recurring CI.
- Re-enable higher-frequency automation only after an explicit owner decision.
