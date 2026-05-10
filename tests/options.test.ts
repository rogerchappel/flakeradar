import test from "node:test";
import assert from "node:assert/strict";
import { parseCompareArgs, parseRunArgs } from "../src/options.js";

test("parses run options before delimiter", () => {
  const parsed = parseRunArgs(["--repeat", "3", "--out", "report.md", "--json", "report.json", "--fail-on", "flake", "--", "npm", "test"]);
  assert.equal(parsed.repeat, 3);
  assert.equal(parsed.out, "report.md");
  assert.equal(parsed.json, "report.json");
  assert.equal(parsed.failOn, "flake");
  assert.equal(parsed.command, "npm");
  assert.deepEqual(parsed.commandArgs, ["test"]);
});

test("parses PRD-style run options after command delimiter", () => {
  const parsed = parseRunArgs(["--", "npm", "test", "--repeat", "5", "--out", "flake-report.md"]);
  assert.equal(parsed.repeat, 5);
  assert.equal(parsed.out, "flake-report.md");
  assert.equal(parsed.command, "npm");
  assert.deepEqual(parsed.commandArgs, ["test"]);
});

test("parses compare options", () => {
  const parsed = parseCompareArgs(["runs", "--format", "json"]);
  assert.equal(parsed.dir, "runs");
  assert.equal(parsed.format, "json");
});
