# Contributing to FlakeRadar

Thanks for helping make flaky local checks easier to spot.

## Local setup

```bash
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Good issues include

- the command being repeated,
- operating system and Node version,
- repeat count,
- report output with redaction enabled,
- whether the command mutates files or external state.

## Pull request expectations

- Keep the default path offline and deterministic.
- Add or update tests for classification, redaction, rendering, or CLI behavior.
- Add fixtures under `examples/fixtures` when demonstrating behavior.
- Avoid dependencies unless they materially improve the CLI.
- Do not add telemetry, account systems, or hidden writes.

## Report artifacts

Markdown and JSON reports are designed to be reviewable, but they may still contain command output. Leave redaction enabled unless there is a clear reason not to.
