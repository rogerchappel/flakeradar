#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMPDIR="${TMPDIR:-/tmp}/flakeradar-smoke-$$"
mkdir -p "$TMPDIR/runs"
trap 'rm -rf "$TMPDIR"' EXIT

node "$ROOT/dist/src/cli.js" --version >/dev/null
node "$ROOT/dist/src/cli.js" run --repeat 2 --out "$TMPDIR/stable.md" --json "$TMPDIR/runs/stable.json" -- node "$ROOT/examples/fixtures/stable-pass.mjs"

touch "$TMPDIR/state"
set +e
node "$ROOT/dist/src/cli.js" run --repeat 4 --out "$TMPDIR/flaky.md" --json "$TMPDIR/runs/flaky.json" --fail-on flake -- node "$ROOT/examples/fixtures/flaky-output.mjs" --state "$TMPDIR/state"
status=$?
set -e
if [[ "$status" -ne 1 ]]; then
  echo "expected flake gate to exit 1, got $status" >&2
  exit 1
fi

grep -q "mixed-flake\|intermittent-exit" "$TMPDIR/flaky.md"
node "$ROOT/dist/src/cli.js" compare "$TMPDIR/runs" --format json --out "$TMPDIR/compare.json"
grep -q '"flakyReports": 1' "$TMPDIR/compare.json"

echo "FlakeRadar smoke passed"
