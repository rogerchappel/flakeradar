# FlakeRadar Tasks

Generated locally because `taskbrief` was not available on PATH during scaffolding.

## Wave 1 — Repo shape

- [x] Scaffold StackForge `oss-cli` project.
- [x] Copy PRD into `docs/PRD.md`.
- [ ] Add orchestration notes and machine-readable orchestration metadata.

## Wave 2 — Core engine

- [ ] Model repeated command runs.
- [ ] Execute local commands without network calls.
- [ ] Normalize and redact stdout/stderr.
- [ ] Classify stable pass, stable fail, intermittent exit, output drift, and mixed flakes.

## Wave 3 — Reports

- [ ] Emit deterministic JSON.
- [ ] Emit deterministic Markdown.
- [ ] Compare saved run JSON files from a directory.

## Wave 4 — CLI

- [ ] Implement `flakeradar run`.
- [ ] Implement `flakeradar compare`.
- [ ] Add `--repeat`, `--out`, `--json`, `--format`, `--fail-on`, and `--no-redact` options.

## Wave 5 — Verification

- [ ] Add fixture commands under `examples/fixtures`.
- [ ] Add node:test coverage under `tests/`.
- [ ] Add smoke and validation scripts.
- [ ] Document test, check, build, smoke, and fixture commands.

## Wave 6 — Publish

- [ ] Create public GitHub repo `rogerchappel/flakeradar`.
- [ ] Push `main`.
- [ ] Configure description and topics.
- [ ] Apply best-effort branch protection.
