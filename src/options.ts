import type { FailGate } from "./types.js";
import { parseFailGate } from "./gates.js";

export interface RunCliOptions {
  repeat: number;
  out?: string;
  json?: string;
  format: "markdown" | "json";
  failOn: FailGate;
  redact: boolean;
  command: string;
  commandArgs: string[];
}

export interface CompareCliOptions {
  dir: string;
  out?: string;
  format: "markdown" | "json";
}

export function parseRunArgs(args: string[]): RunCliOptions {
  const delimiter = args.indexOf("--");
  const optionArgs = delimiter >= 0 ? args.slice(0, delimiter) : args;
  const commandArgs = delimiter >= 0 ? args.slice(delimiter + 1) : [];
  const options: RunCliOptions = {
    repeat: 5,
    format: "markdown",
    failOn: "never",
    redact: true,
    command: "",
    commandArgs: []
  };

  for (let index = 0; index < optionArgs.length; index += 1) {
    const arg = optionArgs[index];
    if (arg === "--repeat") options.repeat = positiveInt(takeValue(optionArgs, ++index, arg), arg);
    else if (arg === "--out") options.out = takeValue(optionArgs, ++index, arg);
    else if (arg === "--json") options.json = takeValue(optionArgs, ++index, arg);
    else if (arg === "--format") options.format = parseFormat(takeValue(optionArgs, ++index, arg));
    else if (arg === "--fail-on") options.failOn = parseFailGate(takeValue(optionArgs, ++index, arg));
    else if (arg === "--no-redact") options.redact = false;
    else throw new Error(`Unknown run option: ${arg}`);
  }

  if (commandArgs.length === 0) throw new Error("Usage: flakeradar run [options] -- <command> [args...]");
  options.command = commandArgs[0];
  options.commandArgs = commandArgs.slice(1);
  return options;
}

export function parseCompareArgs(args: string[]): CompareCliOptions {
  const options: CompareCliOptions = { dir: "", format: "markdown" };
  const positional: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--out") options.out = takeValue(args, ++index, arg);
    else if (arg === "--format") options.format = parseFormat(takeValue(args, ++index, arg));
    else if (arg.startsWith("--")) throw new Error(`Unknown compare option: ${arg}`);
    else positional.push(arg);
  }
  options.dir = positional[0] ?? "";
  if (!options.dir) throw new Error("Usage: flakeradar compare <dir> [--format markdown|json] [--out path]");
  return options;
}

function takeValue(args: string[], index: number, flag: string): string {
  const value = args[index];
  if (!value) throw new Error(`${flag} requires a value`);
  return value;
}

function positiveInt(value: string, flag: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${flag} must be a positive integer`);
  return parsed;
}

function parseFormat(value: string): "markdown" | "json" {
  if (value === "markdown" || value === "json") return value;
  throw new Error("--format must be markdown or json");
}
