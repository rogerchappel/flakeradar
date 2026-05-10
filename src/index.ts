export { classifyRuns } from "./classify.js";
export { compareReports, renderCompareMarkdown } from "./compare.js";
export { runRepeated } from "./execute.js";
export { shouldFail } from "./gates.js";
export { renderMarkdown } from "./markdown.js";
export { createReport, stableJson } from "./report.js";
export type {
  ClassificationSummary,
  CompareReport,
  FailGate,
  FlakeClassification,
  FlakeReport,
  RunOptions,
  RunResult
} from "./types.js";
