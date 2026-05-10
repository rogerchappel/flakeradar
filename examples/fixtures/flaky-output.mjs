#!/usr/bin/env node
const modeIndex = process.argv.indexOf("--mode");
const mode = modeIndex >= 0 ? process.argv[modeIndex + 1] : "alternating";
const stateIndex = process.argv.indexOf("--state");
const statePath = stateIndex >= 0 ? process.argv[stateIndex + 1] : process.env.FLAKERADAR_FIXTURE_STATE;

let count = 0;
if (statePath) {
  const { readFileSync, writeFileSync, existsSync } = await import("node:fs");
  count = existsSync(statePath) ? Number(readFileSync(statePath, "utf8")) || 0 : 0;
  writeFileSync(statePath, String(count + 1));
}

if (mode === "output") {
  console.log(count % 2 === 0 ? "fixture: left" : "fixture: right");
  process.exit(0);
}

console.log(count % 2 === 0 ? "fixture: pass side" : "fixture: fail side");
process.exit(count % 2 === 0 ? 0 : 1);
