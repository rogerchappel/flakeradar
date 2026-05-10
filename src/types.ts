export type FlakeClassification =
  | "stable-pass"
  | "stable-fail"
  | "intermittent-exit"
  | "output-drift"
  | "mixed-flake";

export type FailGate = "never" | "any" | "flake" | "failure";

export interface CommandSpec {
  command: string;
  args: string[];
  cwd: string;
}

export interface RunOptions {
  command: string;
  args: string[];
  cwd?: string;
  repeat: number;
  redact: boolean;
}

export interface RunResult {
  index: number;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
  stdoutHash: string;
  stderrHash: string;
}

export interface ClassificationSummary {
  classification: FlakeClassification;
  flaky: boolean;
  passed: number;
  failed: number;
  uniqueExitCodes: number[];
  uniqueStdoutHashes: string[];
  uniqueStderrHashes: string[];
  reasons: string[];
}

export interface FlakeReport {
  schemaVersion: 1;
  tool: "flakeradar";
  command: CommandSpec;
  repeat: number;
  redacted: boolean;
  summary: ClassificationSummary;
  runs: RunResult[];
}

export interface CompareInput {
  path: string;
  report: FlakeReport;
}

export interface CompareReport {
  schemaVersion: 1;
  tool: "flakeradar";
  comparedReports: string[];
  summary: {
    totalReports: number;
    flakyReports: number;
    classifications: Record<FlakeClassification, number>;
  };
}
