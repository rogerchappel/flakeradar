# Security Policy

FlakeRadar is offline-first and does not intentionally make network calls in its V1 execution path.

## Reporting a vulnerability

Please open a private security advisory on GitHub or contact the maintainer privately. Do not include live secrets in public issues.

## Secret handling

Redaction is enabled by default for common token, key, password, authorization, and long-token patterns. It is best-effort, not a guarantee. Treat reports as potentially sensitive when the repeated command prints environment variables, logs, credentials, or private paths.

## Supported versions

The current `0.x` line receives security fixes while the project is active.

## Design boundaries

- No telemetry.
- No hosted dashboard.
- No hidden output files.
- No command mutation beyond the local command the user explicitly passes after `--`.
