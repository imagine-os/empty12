/**
 * The PaperOS build-loop entrypoint (PAP-96): promotes Backlog issues to
 * Ready for Claude, claims issues, and spawns builder sessions.
 *
 * Stub only — PAP-96 implements this. Left in place so the repo layout
 * matches what PAP-96 and later issues expect (`src/linear/`, `src/cli/`,
 * `src/db/`, `src/session/`, `src/loop.ts`), and so `pnpm check` has
 * something to typecheck against once real code lands here.
 */

// TODO(PAP-96): promotion pass (read Backlog, run the issue contract from
// PAP-93, promote unblocked issues to Ready for Claude).
// TODO(PAP-96): claim loop (poll Ready for Claude, route by Character label
// via `src/linear/workspace.ts`, spawn a builder session per PAP-99).

export {};
