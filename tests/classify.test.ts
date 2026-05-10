import test from "node:test";
import assert from "node:assert/strict";
import { classifyRuns } from "../src/classify.js";
import type { RunResult } from "../src/types.js";

function run(index: number, exitCode: number, stdoutHash = "out", stderrHash = "err"): RunResult {
  return { index, exitCode, signal: null, stdout: "", stderr: "", stdoutHash, stderrHash };
}

test("classifies stable pass", () => {
  const summary = classifyRuns([run(1, 0), run(2, 0)]);
  assert.equal(summary.classification, "stable-pass");
  assert.equal(summary.flaky, false);
});

test("classifies stable fail", () => {
  const summary = classifyRuns([run(1, 1), run(2, 1)]);
  assert.equal(summary.classification, "stable-fail");
  assert.equal(summary.flaky, false);
});

test("classifies intermittent exit", () => {
  const summary = classifyRuns([run(1, 0), run(2, 1)]);
  assert.equal(summary.classification, "intermittent-exit");
  assert.equal(summary.flaky, true);
});

test("classifies output drift", () => {
  const summary = classifyRuns([run(1, 0, "a"), run(2, 0, "b")]);
  assert.equal(summary.classification, "output-drift");
  assert.equal(summary.flaky, true);
});
