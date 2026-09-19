# Surfaces (MCP / CLI / API abilities)

Append a section here for any MCP, CLI or API ability your issue adds
(brief rule 10). One section per issue, oldest first.

## PAP-91: `pnpm linear:configure`

* **CLI**: `pnpm linear:configure --check|--apply [--team PAP]` —
  `ops/linear/configure-workspace.ts`. Diffs team PAP's live Linear
  configuration against `src/linear/desired.ts` and, on `--apply`, creates
  the `Character` label group (9 children) and the six round-4 amendment
  labels, and rewrites the `PaperOS Spec` template body to the eleven-
  section issue contract. Never deletes, archives, renames, or retypes
  anything.
* **API**: reads/writes Linear team PAP over the GraphQL API
  (`https://api.linear.app/graphql`) via `@linear/sdk`'s `LinearClient`,
  using `LINEAR_API_KEY` with no `Bearer` prefix (the PaperOS proxy injects
  the real key).
* **Output**: `linear-workspace.json` (committed), typed as `WorkspaceIds`
  in `src/linear/workspace.ts`. Consumers: PAP-93 (label/state ids), PAP-96
  (state ids for claims), PAP-99 (Character routing), PAP-22 (`paperos
  create` reuses the script).
