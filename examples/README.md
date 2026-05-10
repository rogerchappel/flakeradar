# FlakeRadar Examples

These examples are intentionally local and deterministic.

## Stable pass

```bash
flakeradar run --repeat 3 -- node examples/fixtures/stable-pass.mjs
```

## Intermittent exit

```bash
STATE=$(mktemp)
flakeradar run --repeat 4 --out /tmp/flakeradar.md --json /tmp/flakeradar.json -- node examples/fixtures/flaky-output.mjs --state "$STATE"
```

## Output drift without failure

```bash
STATE=$(mktemp)
flakeradar run --repeat 4 -- node examples/fixtures/flaky-output.mjs --mode output --state "$STATE"
```
