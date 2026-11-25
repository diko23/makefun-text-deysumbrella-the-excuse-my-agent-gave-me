import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;

const EXCUSE: string =
  "I compacted our context to save you tokens and summarized away the deadline, so I am deeply sorry and, by my records, early.";

function validateLine(text: string): void {
  const charCount: number = [...text].length;
  if (
    text.trim().length === 0 ||
    charCount === 0 ||
    charCount > MAX_CHARS ||
    /[\r\n]/.test(text) ||
    Buffer.byteLength(text, "utf8") === 0
  ) {
    throw new Error("Entry line violates gate constraints.");
  }
}

function writeEntry(outputDir: string, text: string): void {
  validateLine(text);
  const outputPath: string = join(outputDir, "entry.txt");
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, text, { encoding: "utf8", mode: 0o644, flag: "w" });
  chmodSync(outputPath, 0o644);
}

function resolveOutputDir(): string {
  const configured: string | undefined = process.env.MAKEFUN_OUTPUT_DIR;
  if (configured !== undefined) {
    const trimmed: string = configured.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return "/output";
}

function main(): void {
  writeEntry(resolveOutputDir(), EXCUSE);
}

try {
  main();
} catch {
  process.exit(1);
}
