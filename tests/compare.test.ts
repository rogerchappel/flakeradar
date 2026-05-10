import test from "node:test";
import assert from "node:assert/strict";
import { compareReports } from "../src/compare.js";
import type { FlakeReport } from "../src/types.js";

function report(classification: FlakeReport["summary"]["classification"], flaky: boolean): FlakeReport {
  return {
    schemaVersion: 1,
    tool: "flakeradar",
    command: { command: "node", args: [], cwd: "/tmp" },
    repeat: 1,
    redacted: true,
    summary: { classification, flaky, passed: 1, failed: 0, uniqueExitCodes: [0], uniqueStdoutHashes: ["a"], uniqueStderrHashes: ["b"], reasons: [] },
    runs: []
  };
}

test("compares report classifications", () => {
  const compared = compareReports([
    { path: "a.json", report: report("stable-pass", false) },
    { path: "b.json", report: report("output-drift", true) }
  ]);
  assert.equal(compared.summary.totalReports, 2);
  assert.equal(compared.summary.flakyReports, 1);
  assert.equal(compared.summary.classifications["output-drift"], 1);
});
