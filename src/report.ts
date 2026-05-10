import type { FlakeReport, RunOptions, RunResult } from "./types.js";
import { classifyRuns } from "./classify.js";

export function createReport(options: RunOptions, runs: RunResult[]): FlakeReport {
  return {
    schemaVersion: 1,
    tool: "flakeradar",
    command: {
      command: options.command,
      args: [...options.args],
      cwd: options.cwd ?? process.cwd()
    },
    repeat: options.repeat,
    redacted: options.redact,
    summary: classifyRuns(runs),
    runs
  };
}

export function stableJson(value: unknown): string {
  return `${JSON.stringify(sortJson(value), null, 2)}\n`;
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, sortJson(child)])
    );
  }
  return value;
}
