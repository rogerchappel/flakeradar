import type { FlakeReport } from "./types.js";

export function renderMarkdown(report: FlakeReport): string {
  const commandLine = [report.command.command, ...report.command.args].map(shellQuote).join(" ");
  const reasons = report.summary.reasons.map((reason) => `- ${reason}`).join("\n");
  const runs = report.runs
    .map(
      (run) =>
        `| ${run.index} | ${run.exitCode ?? "signal"} | ${run.signal ?? ""} | ${run.stdoutHash} | ${run.stderrHash} |`
    )
    .join("\n");

  return `# FlakeRadar Report\n\n` +
    `## Summary\n\n` +
    `- Classification: **${report.summary.classification}**\n` +
    `- Flaky: **${report.summary.flaky ? "yes" : "no"}**\n` +
    `- Passed: ${report.summary.passed}\n` +
    `- Failed: ${report.summary.failed}\n` +
    `- Repeat: ${report.repeat}\n` +
    `- Redacted: ${report.redacted ? "yes" : "no"}\n\n` +
    `## Command\n\n` +
    `\`${commandLine}\`\n\n` +
    `Working directory: \`${report.command.cwd}\`\n\n` +
    `## Reasons\n\n${reasons}\n\n` +
    `## Runs\n\n` +
    `| Run | Exit | Signal | stdout hash | stderr hash |\n` +
    `| ---: | ---: | --- | --- | --- |\n` +
    `${runs}\n`;
}

function shellQuote(value: string): string {
  if (/^[A-Za-z0-9_./:=+-]+$/.test(value)) {
    return value;
  }
  return `'${value.replaceAll("'", "'\\''")}'`;
}
