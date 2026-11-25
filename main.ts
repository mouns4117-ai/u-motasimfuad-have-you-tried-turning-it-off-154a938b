// SPDX-License-Identifier: MIT
// Have You Tried Turning It Off? — one funny line from a hopeless tech
// support agent to a desperate customer. Writes the entry to /output/entry.txt.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Have you tried turning it off and on again? Please do — my training was a single slide, and honestly, this is the slide.";

// Fail-fast gate validation: the sealed scorer needs UTF-8 text of 1–199
// characters, a single non-blank line.
if (ENTRY.length < 1 || ENTRY.length > 199) {
  throw new Error(`entry gate failed: length ${ENTRY.length} outside 1-199`);
}
if (ENTRY.trim().length === 0 || ENTRY.includes("\n")) {
  throw new Error("entry gate failed: must be one non-blank line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
// Empty /output by contents only; never remove the directory itself (mounted).
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
// Post-write verification: the file on disk must be exactly the entry.
if (readFileSync(join(outDir, "entry.txt"), "utf8") !== ENTRY) {
  throw new Error("entry verification failed: written output differs from the entry");
}
