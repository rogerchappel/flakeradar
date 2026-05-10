import { uniqueSorted } from "./hash.js";
import type { ClassificationSummary, RunResult } from "./types.js";

export function classifyRuns(runs: RunResult[]): ClassificationSummary {
  if (runs.length === 0) {
    throw new Error("Cannot classify an empty run set");
  }

  const failed = runs.filter((run) => run.exitCode !== 0).length;
  const passed = runs.length - failed;
  const uniqueExitCodes = uniqueSorted(runs.map((run) => run.exitCode ?? -1));
  const uniqueStdoutHashes = uniqueSorted(runs.map((run) => run.stdoutHash));
  const uniqueStderrHashes = uniqueSorted(runs.map((run) => run.stderrHash));
  const exitVaries = uniqueExitCodes.length > 1;
  const outputVaries = uniqueStdoutHashes.length > 1 || uniqueStderrHashes.length > 1;
  const mixedPassFail = passed > 0 && failed > 0;
  const reasons: string[] = [];

  if (mixedPassFail) reasons.push("some runs passed and some failed");
  if (exitVaries) reasons.push("exit codes changed across runs");
  if (outputVaries) reasons.push("stdout or stderr changed across runs");
  if (passed === runs.length) reasons.push("all runs exited 0");
  if (failed === runs.length) reasons.push("all runs exited non-zero");

  let classification: ClassificationSummary["classification"];
  if (mixedPassFail && outputVaries) classification = "mixed-flake";
  else if (mixedPassFail || exitVaries) classification = "intermittent-exit";
  else if (outputVaries) classification = "output-drift";
  else if (failed === runs.length) classification = "stable-fail";
  else classification = "stable-pass";

  return {
    classification,
    flaky: classification === "intermittent-exit" || classification === "output-drift" || classification === "mixed-flake",
    passed,
    failed,
    uniqueExitCodes,
    uniqueStdoutHashes,
    uniqueStderrHashes,
    reasons
  };
}
