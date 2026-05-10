#!/usr/bin/env node
import { compareReports, renderCompareMarkdown } from "./compare.js";
import { runRepeated } from "./execute.js";
import { shouldFail } from "./gates.js";
import { listJsonFiles, readJsonReport, writeTextFile } from "./io.js";
import { renderMarkdown } from "./markdown.js";
import { parseCompareArgs, parseRunArgs } from "./options.js";
import { createReport, stableJson } from "./report.js";

const VERSION = "0.1.0";

export async function main(argv = process.argv.slice(2)): Promise<number> {
  try {
    const command = argv[0];
    if (!command || command === "help" || command === "--help" || command === "-h") {
      console.log(helpText());
      return 0;
    }
    if (command === "--version" || command === "-v") {
      console.log(VERSION);
      return 0;
    }
    if (command === "run") return await runCommand(argv.slice(1));
    if (command === "compare") return await compareCommand(argv.slice(1));
    throw new Error(`Unknown command: ${command}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 2;
  }
}

async function runCommand(args: string[]): Promise<number> {
  const options = parseRunArgs(args);
  const runOptions = {
    command: options.command,
    args: options.commandArgs,
    cwd: process.cwd(),
    repeat: options.repeat,
    redact: options.redact
  };
  const report = createReport(runOptions, runRepeated(runOptions));
  const markdown = renderMarkdown(report);
  const json = stableJson(report);
  const primary = options.format === "json" ? json : markdown;

  if (options.out) await writeTextFile(options.out, primary);
  else process.stdout.write(primary);
  if (options.json) await writeTextFile(options.json, json);

  return shouldFail(report, options.failOn) ? 1 : 0;
}

async function compareCommand(args: string[]): Promise<number> {
  const options = parseCompareArgs(args);
  const files = await listJsonFiles(options.dir);
  const inputs = await Promise.all(files.map(async (path) => ({ path, report: await readJsonReport(path) })));
  const report = compareReports(inputs);
  const output = options.format === "json" ? stableJson(report) : renderCompareMarkdown(report);
  if (options.out) await writeTextFile(options.out, output);
  else process.stdout.write(output);
  return 0;
}

function helpText(): string {
  return `FlakeRadar — catch local command flakes before they catch you.\n\nUsage:\n  flakeradar run [--repeat n] [--out report.md] [--json report.json] [--format markdown|json] [--fail-on never|any|flake|failure] [--no-redact] -- <command> [args...]\n  flakeradar compare <dir> [--format markdown|json] [--out path]\n\nExamples:\n  flakeradar run --repeat 5 --out flake-report.md --json flake-report.json -- npm test\n  flakeradar compare ./runs --format json\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((code) => {
    process.exitCode = code;
  });
}
