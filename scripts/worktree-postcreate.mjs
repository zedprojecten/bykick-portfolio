#!/usr/bin/env node
/**
 * worktree-postcreate.mjs — maakt een verse worktree meteen bruikbaar:
 *  1) symlinkt node_modules vanuit de hoofd-checkout (instant deps, ~nul schijf);
 *  2) kopieert de gitignore'de files uit `.worktreeinclude` (bv. .env) mee, zodat
 *     dev-servers daadwerkelijk booten.
 *
 * Reden voor (2): onze claude-wrapper maakt de worktree zelf met `git worktree add`
 * (niet Claude Code's native `--worktree`), dus de native `.worktreeinclude`-afhandeling
 * draait niet. Dit script leest `.worktreeinclude` daarom zelf.
 *
 * Gebruik: node scripts/worktree-postcreate.mjs <pad-naar-hoofd-checkout> [<worktree-pad>]
 * Default worktree-pad = process.cwd().
 *
 * Veilig omdat de worktree dezelfde machine/platform/lockfile heeft als de bron.
 * Caveat: wijzig je dependencies in de worktree, draai dan een echte npm install.
 */
import {
  existsSync,
  lstatSync,
  symlinkSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import { resolve, dirname } from "node:path";

const source = process.argv[2];
const dest = process.argv[3] || process.cwd();

if (!source || !existsSync(source)) {
  console.error("[worktree-postcreate] bron-checkout ontbreekt of bestaat niet:", source);
  process.exit(1);
}

// Bestaat het pad (ook als het een dangling symlink is)? existsSync() volgt de link
// en geeft false bij een kapotte link, waardoor we 'm zouden proberen te overschrijven
// en een EEXIST krijgen. lstatSync kijkt naar de link zelf.
function pathPresent(p) {
  try {
    lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

// ─── 1. node_modules symlinken ──────────────────────────────────────────────
const candidates = [""];
let linked = 0;
for (const rel of candidates) {
  const srcNM = resolve(source, rel, "node_modules");
  const dstNM = resolve(dest, rel, "node_modules");
  if (!existsSync(srcNM)) continue;
  if (pathPresent(dstNM)) continue; // niet overschrijven (ook dangling link)
  try {
    symlinkSync(srcNM, dstNM, "dir");
    linked++;
    console.log(`[worktree-postcreate] symlink ${rel || "."}/node_modules`);
  } catch (err) {
    console.warn(`[worktree-postcreate] kon ${rel}/node_modules niet linken: ${err.message}`);
  }
}

// ─── 2. .worktreeinclude-files meekopiëren (bv. .env) ────────────────────────
let copied = 0;
const includeFile = resolve(source, ".worktreeinclude");
if (existsSync(includeFile)) {
  const entries = readFileSync(includeFile, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  for (const rel of entries) {
    const srcF = resolve(source, rel);
    const dstF = resolve(dest, rel);
    if (!existsSync(srcF)) continue; // bron-file bestaat niet, sla over
    if (pathPresent(dstF)) continue; // niet overschrijven
    try {
      mkdirSync(dirname(dstF), { recursive: true });
      copyFileSync(srcF, dstF);
      copied++;
      console.log(`[worktree-postcreate] kopie ${rel}`);
    } catch (err) {
      console.warn(`[worktree-postcreate] kon ${rel} niet kopiëren: ${err.message}`);
    }
  }
}

console.log(`[worktree-postcreate] klaar (${linked} symlinks, ${copied} files gekopieerd).`);
