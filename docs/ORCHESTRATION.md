# FlakeRadar Orchestration

FlakeRadar is intentionally boring to orchestrate: agents and humans run the same local commands, keep outputs in the workspace, and review deterministic reports.

## Operating rules

1. Stay local by default. No telemetry, SaaS calls, hidden uploads, or background daemons.
2. Prefer checked-in fixtures for examples and smoke tests.
3. Treat generated reports as review artifacts: stable ordering, redacted secrets, and explicit exit behavior.
4. Fail CI only when the caller requests a gate with `--fail-on`.
5. Keep repeated command execution transparent: command, repeat count, and classifications are always shown.

## Release evidence

Before publishing a release or calling the repo ready, run:

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
node dist/cli.js run --repeat 4 --out /tmp/flakeradar-smoke.md --json /tmp/flakeradar-smoke.json -- node examples/fixtures/flaky-output.mjs --mode alternating
```

Record the command results in the handoff or release notes.

## Agent handoff contract

- If a command is flaky, include the Markdown report and JSON report path.
- If a command is stable, keep the report anyway when it supports a release or PR decision.
- Never paste unredacted command output into issues or PRs unless `--no-redact` was intentionally used and reviewed.
