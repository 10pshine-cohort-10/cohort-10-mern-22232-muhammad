#!/usr/bin/env node
// @ts-check
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

/** @type {ReadonlySet<string>} */
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

/**
 * Builds a one-character string from a UTF-16 code unit. Using char codes keeps both this file
 * and the formatter from turning the markers below into literal (and self-matching) characters.
 * @param {number} code
 * @returns {string}
 */
function char(code) {
  return String.fromCharCode(code);
}

/** @type {string} */
const BOM = char(0xfeff);

/** @type {readonly string[]} */
const MOJIBAKE_MARKERS = [
  char(0xe2) + char(0x20ac), // start of a mis-decoded curly quote, dash or ellipsis
  char(0xc3) + char(0xa9), // mis-decoded "e acute"
  char(0xc2) + char(0xb7), // mis-decoded middle dot
  char(0xc2) + char(0xa9), // mis-decoded copyright sign
];

/**
 * Lists tracked files. `-z` makes Git emit raw, NUL-separated paths, so names that Git would
 * otherwise quote (spaces, non-ASCII characters) reach the checks intact.
 * @returns {string[]}
 */
function listTrackedFiles() {
  return execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
}

/**
 * @param {string} file
 * @returns {boolean}
 */
function isCheckedTextFile(file) {
  return TEXT_EXTENSIONS.has(extname(file)) && !file.endsWith('package-lock.json');
}

/**
 * Returns a human-readable problem for every BOM or corrupted line in the given files.
 * @param {readonly string[]} files
 * @returns {string[]}
 */
function findEncodingProblems(files) {
  /** @type {string[]} */
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
  return problems;
}

const args = process.argv.slice(2);
const files = (args.length > 0 ? args : listTrackedFiles()).filter(isCheckedTextFile);
const problems = findEncodingProblems(files);

if (problems.length > 0) {
  console.error(`Encoding check failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  process.exit(1);
}
console.log(`Encoding check passed (${files.length} files).`);
