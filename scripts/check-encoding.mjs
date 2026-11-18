#!/usr/bin/env node
/* eslint-disable no-console -- CLI script reports results on the console. */
/**
 * Fails when tracked text files contain a UTF-8 byte-order mark or mojibake
 * (UTF-8 text mis-decoded as Windows-1252, e.g. a curly apostrophe turning into three junk characters).
 *
 * Usage: node scripts/check-encoding.mjs [files...]   (defaults to all tracked files)
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.css',
  '.html',
  '.md',
  '.yml',
  '.yaml',
  '.svg',
]);

// Built from char codes so neither this file nor the formatter turns them into literal characters.
const char = (code) => String.fromCharCode(code);
const BOM = char(0xfeff);
const MOJIBAKE_MARKERS = [
  char(0xe2) + char(0x20ac), // start of a mis-decoded curly quote, dash or ellipsis
  char(0xc3) + char(0xa9), // mis-decoded "e acute"
  char(0xc2) + char(0xb7), // mis-decoded middle dot
  char(0xc2) + char(0xa9), // mis-decoded copyright sign
];

const args = process.argv.slice(2);
const files = (
  args.length > 0
    ? args
    : execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean)
).filter((file) => TEXT_EXTENSIONS.has(extname(file)) && !file.endsWith('package-lock.json'));

const problems = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (text.startsWith(BOM)) problems.push(`${file}: starts with a UTF-8 BOM`);
  text.split('\n').forEach((line, index) => {
    if (MOJIBAKE_MARKERS.some((marker) => line.includes(marker))) {
      problems.push(`${file}:${index + 1}: corrupted characters`);
    }
  });
}

if (problems.length > 0) {
  console.error(`Encoding check failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  process.exit(1);
}
console.log(`Encoding check passed (${files.length} files).`);
