#!/usr/bin/env node
/**
 * verify-deploy.mjs — controleert de ECHTE deploy-state. Verplichte stap
 * vóór elke "klaar/opgeleverd"-claim. Lost het stille-Vercel-fail-probleem op.
 *
 * Gebruik:
 *   node scripts/verify-deploy.mjs --jarvis
 *   node scripts/verify-deploy.mjs --vercel --project <naam> [--target production|preview] [--commit <sha>]
 *
 * Env (voor --vercel): VERCEL_TOKEN (verplicht), VERCEL_TEAM_ID (optioneel).
 * Exit 0 = READY/healthy. Exit 1 = ERROR/timeout/onbereikbaar.
 */

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => {
  const i = args.indexOf(f);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : undefined;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function verifyJarvis() {
  const url = "https://jarvis.bykick.nl/api/health";
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.status === "ok") {
        console.log(`[verify-deploy] jarvis OK (uptime ${Math.round(body.uptime || 0)}s)`);
        return 0;
      }
      console.log(`[verify-deploy] poging ${attempt}: status ${res.status} body=${JSON.stringify(body)}`);
    } catch (err) {
      console.log(`[verify-deploy] poging ${attempt}: ${err.message}`);
    }
    await sleep(6000);
  }
  console.error("[verify-deploy] jarvis healthcheck NIET groen na 10 pogingen.");
  return 1;
}

function vercelHeaders() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error("[verify-deploy] VERCEL_TOKEN ontbreekt in env.");
    process.exit(1);
  }
  return { Authorization: `Bearer ${token}` };
}

function teamQuery() {
  const t = process.env.VERCEL_TEAM_ID;
  return t ? `&teamId=${encodeURIComponent(t)}` : "";
}

async function listDeployments(project, target) {
  const url = `https://api.vercel.com/v6/deployments?app=${encodeURIComponent(project)}&limit=20&target=${target}${teamQuery()}`;
  const res = await fetch(url, { headers: vercelHeaders(), signal: AbortSignal.timeout(10000) });
  if (!res.ok) {
    throw new Error(`Vercel API ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.deployments || [];
}

function pick(deployments, commit) {
  if (commit) {
    const m = deployments.find((d) => d.meta && d.meta.githubCommitSha === commit);
    if (m) return m;
  }
  return deployments[0];
}

async function dumpErrorLogs(uid) {
  try {
    const url = `https://api.vercel.com/v3/deployments/${uid}/events?limit=80${teamQuery()}`;
    const res = await fetch(url, { headers: vercelHeaders(), signal: AbortSignal.timeout(10000) });
    const events = await res.json().catch(() => []);
    const lines = (Array.isArray(events) ? events : [])
      .map((e) => (e.payload && e.payload.text) || e.text)
      .filter(Boolean)
      .slice(-25);
    if (lines.length) {
      console.error("[verify-deploy] laatste build-log-regels:");
      for (const l of lines) console.error("  " + String(l).trimEnd());
    }
  } catch {
    // best-effort
  }
}

async function verifyVercel(project, target, commit) {
  // ~5 min polling (40 x 8s) — Vercel-builds van deze sites duren typisch < 3 min.
  for (let attempt = 1; attempt <= 40; attempt++) {
    let deployments;
    try {
      deployments = await listDeployments(project, target);
    } catch (err) {
      console.log(`[verify-deploy] poging ${attempt}: ${err.message}`);
      await sleep(8000);
      continue;
    }
    const d = pick(deployments, commit);
    if (!d) {
      console.log(`[verify-deploy] poging ${attempt}: nog geen deployment gevonden voor ${project}/${target}`);
      await sleep(8000);
      continue;
    }
    const state = d.state || d.readyState;
    console.log(`[verify-deploy] poging ${attempt}: ${project}/${target} state=${state} (${d.url})`);
    if (state === "READY") {
      console.log(`[verify-deploy] Vercel READY: https://${d.url}`);
      return 0;
    }
    if (state === "ERROR" || state === "CANCELED") {
      console.error(`[verify-deploy] Vercel ${state} voor ${project}/${target} (deployment ${d.uid}, url ${d.url}).`);
      await dumpErrorLogs(d.uid);
      return 1;
    }
    await sleep(8000);
  }
  console.error("[verify-deploy] timeout: geen READY-state binnen ~5 min.");
  return 1;
}

async function main() {
  if (has("--jarvis")) {
    process.exit(await verifyJarvis());
  }
  if (has("--vercel")) {
    const project = val("--project");
    if (!project) {
      console.error("[verify-deploy] --project <naam> is verplicht bij --vercel.");
      process.exit(1);
    }
    const target = val("--target") || "production";
    const commit = val("--commit");
    process.exit(await verifyVercel(project, target, commit));
  }
  console.error("Gebruik: node scripts/verify-deploy.mjs --jarvis | --vercel --project <naam> [--target production|preview] [--commit <sha>]");
  process.exit(1);
}

main();
