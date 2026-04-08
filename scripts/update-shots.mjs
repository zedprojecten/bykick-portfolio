#!/usr/bin/env node
/**
 * Portfolio screenshots updater
 *
 * Draait 1x per week via een Claude scheduled task. Schiet dark-mode
 * screenshots van de 5 portfolio sites, resized naar 1200x750 en
 * geconverteerd naar WebP q82. Overschrijft de bestaande bestanden in
 * public/shots/ en laat het committen aan de caller over.
 *
 * Deps: playwright + sharp (installeer via `npm install` in deze repo).
 *
 * Usage:
 *   node scripts/update-shots.mjs
 */

import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, stat, unlink } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const shotsDir = join(__dirname, "..", "public", "shots");

// Lijst moet synchroon blijven met src/App.tsx projects array.
const sites = [
  { name: "webdesign", url: "https://webdesign.bykick.nl" },
  { name: "aisolutions", url: "https://aisolutions.bykick.nl" },
  { name: "jarvis", url: "https://jarvis.bykick.nl" },
  { name: "puntify", url: "https://puntify.nl" },
  { name: "compliance", url: "https://compliance-checker.nl" },
  { name: "mvd", url: "https://mvdmanagement.nl" },
];

async function main() {
  await mkdir(shotsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  ctx.setDefaultTimeout(30000);

  const results = [];
  for (const { name, url } of sites) {
    console.log(`→ ${name} (${url})`);
    const page = await ctx.newPage();
    const pngPath = join(shotsDir, `${name}.png`);
    const webpPath = join(shotsDir, `${name}.webp`);
    try {
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(2500);
      await page.screenshot({
        path: pngPath,
        clip: { x: 0, y: 0, width: 1440, height: 900 },
      });

      const { size: pngSize } = await stat(pngPath);
      await sharp(pngPath)
        .resize(1200, 750, { fit: "cover", position: "top" })
        .webp({ quality: 82 })
        .toFile(webpPath);
      const { size: webpSize } = await stat(webpPath);
      await unlink(pngPath);

      console.log(
        `  ✓ ${(pngSize / 1024).toFixed(0)}KB → ${(webpSize / 1024).toFixed(0)}KB`,
      );
      results.push({ name, ok: true, webpSize });
    } catch (e) {
      console.log(`  ✗ ${name}: ${e.message}`);
      results.push({ name, ok: false, error: e.message });
    } finally {
      await page.close();
    }
  }
  await browser.close();

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length}/${sites.length} faalden — check hierboven`);
    process.exit(1);
  }
  const total = results.reduce((sum, r) => sum + (r.webpSize ?? 0), 0);
  console.log(`\n✓ alle ${sites.length} screenshots up-to-date (${(total / 1024).toFixed(0)}KB totaal)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
