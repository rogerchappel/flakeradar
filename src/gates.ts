import type { FailGate, FlakeReport } from "./types.js";

export function shouldFail(report: FlakeReport, gate: FailGate): boolean {
  switch (gate) {
    case "never":
      return false;
    case "any":
      return report.summary.flaky || report.summary.failed > 0;
    case "flake":
      return report.summary.flaky;
    case "failure":
      return report.summary.failed > 0;
    default: {
      const exhaustive: never = gate;
      return exhaustive;
    }
  }
}

export function parseFailGate(value: string): FailGate {
  if (value === "never" || value === "any" || value === "flake" || value === "failure") {
    return value;
  }
  throw new Error(`Invalid --fail-on value: ${value}. Use never, any, flake, or failure.`);
}
