#!/usr/bin/env node
/**
 * Installs git hooks for the Jarvis monorepo door `core.hooksPath` te wijzen
 * naar `scripts/git-hooks/`. Idempotent — kan elke npm install opnieuw draaien.
 *
 * Aangeroepen door root `package.json` postinstall. Skipt stilletjes wanneer:
 *  - We niet in een git repo zitten (bv. CI build van npm tarball)
 *  - JARVIS_SKIP_HOOK_INSTALL=1 is gezet (escape hatch voor agents/CI)
 */
import { execSync } from "node:child_process";
import { existsSync, chmodSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const hooksDir = "scripts/git-hooks";

if (process.env.JARVIS_SKIP_HOOK_INSTALL === "1") {
  process.exit(0);
}

if (!existsSync(resolve(repoRoot, ".git"))) {
  // Not a git checkout (e.g. installed as dependency tarball). Silently skip.
  process.exit(0);
}

const hookNames = ["pre-commit", "post-commit", "pre-push"];
const hookPaths = hookNames.map((n) => resolve(repoRoot, hooksDir, n));

const missing = hookPaths.filter((p) => !existsSync(p));
if (missing.length === hookPaths.length) {
  console.warn(`[install-git-hooks] geen hooks gevonden in ${hooksDir}/, skipping`);
  process.exit(0);
}

for (const p of hookPaths) {
  if (!existsSync(p)) continue;
  try {
    chmodSync(p, 0o755);
  } catch {
    // Best-effort (Windows checkout-modes).
  }
}

try {
  const current = execSync("git config --get core.hooksPath", {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "ignore"],
  })
    .toString()
    .trim();
  if (current === hooksDir) {
    process.exit(0);
  }
} catch {
  // No value set yet, prima.
}

execSync(`git config core.hooksPath ${hooksDir}`, { cwd: repoRoot, stdio: "ignore" });
console.log(`[install-git-hooks] core.hooksPath -> ${hooksDir}`);
