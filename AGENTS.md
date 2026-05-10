# AGENTS.md

Guidance for agents working on FlakeRadar.

## Mission

Keep FlakeRadar local, deterministic, and easy to review. It exists to make flaky command evidence visible, not to become a platform.

## Commands

Run these before claiming readiness:

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Boundaries

- Do not add telemetry, hosted services, or hidden network calls.
- Do not write files unless the user explicitly requested an output path.
- Keep Markdown and JSON reports stable across identical inputs.
- Keep redaction enabled by default.
- Prefer small fixtures in `examples/fixtures` and `node:test` tests in `tests/`.

## Release notes

Record the exact smoke command and branch-protection status in handoffs.
