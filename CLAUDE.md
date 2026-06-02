# bykick-portfolio

Astro/Vite portfolio voor het `bykick.nl` apex-domein. Overzicht van Kick's initiatieven. Nog niet live (apex nog niet gekoppeld).

## Multi-sessie guardrails (sinds 2026-06-02)

Deze repo heeft de bykick git-guardrails (zie jarvis `docs/ROLLOUT-guardrails.md`):
- `pre-commit`+`post-commit` forceren de geverifieerde committer-identity (`267702913+zedprojecten@users.noreply.github.com`); de `pre-push` hook blokkeert een verkeerde author of een faalende typecheck. Zet NOOIT zelf `git config user.email`.
- Werk in een worktree (automatisch via de `claude`-wrapper in `~/.zshrc`); zie global CLAUDE.md "Sessie-protocol (multi-sessie)".
- Track A (Vercel auto-deploy): merge naar `main` zet live. Verifieer de deploy-state vóór je "klaar" zegt.
