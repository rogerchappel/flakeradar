# Release Candidate Checklist

Use this checklist before publishing a FlakeRadar package or tagging a release.

## Verification

- Run `npm run release:check`.
- Confirm `npm run smoke` still classifies the example flaky, stable-pass, and stable-fail fixtures.
- Inspect `npm pack --dry-run` output and confirm it includes `dist/src`, `examples`, `README.md`, `LICENSE`, and `SECURITY.md`.

## Evidence

- Save the repeated-run command used for the smoke result.
- Include the generated report format in release notes when behavior changes.
- Note any intentional classifier threshold changes.

## Support Notes

- Keep examples synthetic and deterministic.
- Do not publish logs containing secrets or private CI output.
