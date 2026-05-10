import { spawnSync } from "node:child_process";
import { stableHash } from "./hash.js";
import { redactText } from "./redact.js";
import type { RunOptions, RunResult } from "./types.js";

export function runRepeated(options: RunOptions): RunResult[] {
  if (!Number.isInteger(options.repeat) || options.repeat < 1) {
    throw new Error("--repeat must be a positive integer");
  }
  if (options.command.trim() === "") {
    throw new Error("A command is required after --");
  }

  const cwd = options.cwd ?? process.cwd();
  const results: RunResult[] = [];

  for (let index = 1; index <= options.repeat; index += 1) {
    const result = spawnSync(options.command, options.args, {
      cwd,
      encoding: "utf8",
      env: process.env,
      shell: false,
      maxBuffer: 10 * 1024 * 1024
    });

    const stdout = redactText(result.stdout ?? "", options.redact);
    const stderr = redactText(result.stderr ?? "", options.redact);

    results.push({
      index,
      exitCode: typeof result.status === "number" ? result.status : null,
      signal: result.signal,
      stdout,
      stderr,
      stdoutHash: stableHash(stdout),
      stderrHash: stableHash(stderr)
    });
  }

  return results;
}
