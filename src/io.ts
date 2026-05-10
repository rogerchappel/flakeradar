import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { FlakeReport } from "./types.js";

export async function writeTextFile(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
}

export async function readJsonReport(path: string): Promise<FlakeReport> {
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw) as FlakeReport;
  if (parsed.schemaVersion !== 1 || parsed.tool !== "flakeradar") {
    throw new Error(`${path} is not a FlakeRadar v1 report`);
  }
  return parsed;
}

export async function listJsonFiles(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(path, entry.name))
    .sort((a, b) => a.localeCompare(b));
}
