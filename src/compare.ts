import type { CompareReport, FlakeClassification, FlakeReport } from "./types.js";

const CLASSIFICATIONS: FlakeClassification[] = [
  "stable-pass",
  "stable-fail",
  "intermittent-exit",
  "output-drift",
  "mixed-flake"
];

export function compareReports(inputs: Array<{ path: string; report: FlakeReport }>): CompareReport {
  const classifications = Object.fromEntries(CLASSIFICATIONS.map((key) => [key, 0])) as Record<FlakeClassification, number>;

  for (const input of inputs) {
    classifications[input.report.summary.classification] += 1;
  }

  return {
    schemaVersion: 1,
    tool: "flakeradar",
    comparedReports: inputs.map((input) => input.path).sort((a, b) => a.localeCompare(b)),
    summary: {
      totalReports: inputs.length,
      flakyReports: inputs.filter((input) => input.report.summary.flaky).length,
      classifications
    }
  };
}

export function renderCompareMarkdown(report: CompareReport): string {
  const rows = Object.entries(report.summary.classifications)
    .map(([classification, count]) => `| ${classification} | ${count} |`)
    .join("\n");
  const files = report.comparedReports.map((path) => `- \`${path}\``).join("\n");

  return `# FlakeRadar Compare\n\n` +
    `- Total reports: ${report.summary.totalReports}\n` +
    `- Flaky reports: ${report.summary.flakyReports}\n\n` +
    `| Classification | Count |\n| --- | ---: |\n${rows}\n\n` +
    `## Reports\n\n${files}\n`;
}
