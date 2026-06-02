// Single source of truth voor de enige toegestane committer-identity.
// Gebruikt door de git-hooks (pre-commit auto-fix, pre-push backstop).
// Vercel team-policy accepteert ALLEEN deze geverifieerde noreply-identity;
// elke lokale git config user.email-override triggert een stille deploy-skip.
export const REQUIRED_EMAIL =
  "267702913+zedprojecten@users.noreply.github.com";

export function isAllowedIdentity(email) {
  if (!email || typeof email !== "string") return false;
  return email.trim().toLowerCase() === REQUIRED_EMAIL.toLowerCase();
}
