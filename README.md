# FlakeRadar

FlakeRadar is a tiny offline command harness for catching flaky local checks before they trick you, your CI, or your coding agent into trusting one lucky pass.

It runs a command repeatedly, redacts obvious secrets, compares exit codes and output hashes, then emits deterministic Markdown and JSON reports you can paste into a PR or hand to an agent.

## Why this exists

Agent loops are especially vulnerable to flakes. A model sees `npm test` pass once and happily moves on, even when the next run would have failed. FlakeRadar is the little radar dish on the desk: boring, local, reviewable, and suspicious in exactly the right way.

## Install

```bash
npm install -g flakeradar
```

For local development in this repo:

```bash
npm install
npm run build
node dist/src/cli.js --help
```

## Quick start

```bash
flakeradar run --repeat 5 --out flake-report.md --json flake-report.json -- npm test
```

Use a quality gate when CI should fail:

```bash
flakeradar run --repeat 5 --fail-on flake -- npm test
flakeradar run --repeat 5 --fail-on any -- npm test
```

`--fail-on` accepts:

- `never` — always exit 0 unless the CLI itself fails (default)
- `flake` — exit 1 for intermittent exits or output drift
- `failure` — exit 1 when any run exits non-zero
- `any` — exit 1 for flakes or failures

## Examples

Stable fixture:

```bash
node dist/src/cli.js run --repeat 3 -- node examples/fixtures/stable-pass.mjs
```

Deterministic flake fixture:

```bash
STATE=$(mktemp)
node dist/src/cli.js run \
  --repeat 4 \
  --out /tmp/flakeradar.md \
  --json /tmp/flakeradar.json \
  -- node examples/fixtures/flaky-output.mjs --state "$STATE"
```

Compare saved JSON reports:

```bash
node dist/src/cli.js compare /tmp/runs --format json
```

## What FlakeRadar detects

- `stable-pass` — every run exits 0 and output hashes match
- `stable-fail` — every run exits non-zero and output hashes match
- `intermittent-exit` — pass/fail or exit codes change across repeats
- `output-drift` — command succeeds consistently but stdout/stderr changes
- `mixed-flake` — exit behavior and output both drift

## Safety model

- Offline by default; no telemetry and no network calls in the V1 path.
- Redaction is enabled by default for common token, key, password, and long-token patterns.
- FlakeRadar only writes files you request with `--out` or `--json`.
- It runs exactly the local command you pass after `--`; review commands the same way you would review a shell script.
- Reports avoid timestamps and durations so repeated fixture runs stay deterministic.

Disable redaction only when you have reviewed where the report will go:

```bash
flakeradar run --no-redact --repeat 2 -- printenv
```

## Development

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Contributing

Issues and PRs are welcome. Please include:

- the command you ran,
- the repeat count,
- the Markdown or JSON report when safe,
- whether redaction was enabled.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

## Limitations

- V1 focuses on local commands, not hosted dashboards.
- Output comparison uses hashes, not semantic diffs.
- Commands that mutate shared state may need a fixture-specific state path.
- Redaction is best-effort and should not replace secret hygiene.

## License

MIT
