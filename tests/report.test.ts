import test from "node:test";
import assert from "node:assert/strict";
import { createReport, stableJson } from "../src/report.js";
import type { RunResult } from "../src/types.js";

const runs: RunResult[] = [
  { index: 1, exitCode: 0, signal: null, stdout: "ok", stderr: "", stdoutHash: "a", stderrHash: "z" }
];

test("creates report with command metadata", () => {
  const report = createReport({ command: "node", args: ["fixture.mjs"], cwd: "/tmp/project", repeat: 1, redact: true }, runs);
  assert.equal(report.command.command, "node");
  assert.equal(report.summary.classification, "stable-pass");
});

test("stableJson sorts object keys", () => {
  assert.equal(stableJson({ z: 1, a: 2 }), '{\n  "a": 2,\n  "z": 1\n}\n');
});
