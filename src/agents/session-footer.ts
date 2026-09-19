/**
 * PaperOS session footer (PAP-92).
 *
 * Every Linear comment a session posts ends with a fenced ```paperos-session
 * block holding one JSON object of this shape. The JSON Schema in
 * ./session-footer.schema.json is the source of truth; this file mirrors it as
 * a TypeScript type and exports the helpers the orchestrator, the dry run and
 * the tests share. Keep the two in step: `pnpm footer:validate` fails when a
 * fixture here stops validating against the schema.
 */
import schema from "./session-footer.schema.json" with { type: "json" };

/** Bump only when a footer field is added, removed or renamed. */
export const PLAYBOOK_VERSION = 1 as const;

/** The fence language every footer block uses. */
export const FOOTER_FENCE = "paperos-session" as const;

export const CHARACTERS = [
  "atlas",
  "forge",
  "iris",
  "quill",
  "sentinel",
  "nova",
  "ledger",
  "beacon",
  "scout",
] as const;
export type Character = (typeof CHARACTERS)[number];

export const SESSION_STATUSES = [
  "started",
  "progress",
  "ended",
  "partial",
  "contract-failed",
  "handoff",
  "promoted",
] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

/** Owned by PAP-108 (HandoffSchema); mirrored here until handoff.schema.json lands. */
export interface Handoff {
  kind:
    | "build-to-review"
    | "review-to-build"
    | "spec-to-build"
    | "research-to-decision"
    | "split"
    | "escalate";
  to: Character | "justin";
  reason: string;
  artifacts: { type: "branch" | "pr" | "doc" | "spec" | "screenshot"; ref: string }[];
  nextSteps: string[];
  openQuestions: { q: string; default: string }[];
  contextFiles: string[];
}

export interface SessionFooter {
  playbookVersion: typeof PLAYBOOK_VERSION;
  /** `<yyyy-mm-dd>-PAP-<n>` with an optional `-<k>` re-run suffix. */
  sessionId: string;
  character: Character | "orchestrator";
  /** `PAP-<n>` */
  issue: string;
  status: SessionStatus;
  branch: string;
  /** Model id, e.g. `claude-fable-5-1`. */
  model?: string;
  costUsd?: number;
  turns?: number;
  /** Target (PR) mode only. */
  pr?: string;
  /** Build-loop mode: SHAs pushed to main, oldest first. */
  commits?: string[];
  /** Echo of `BASE_BRANCHES`; omitted when empty. */
  baseBranches?: string[];
  /** Why the session stopped early (duplicate-claim, needs-spec, base-branch-conflict, budget, ...). */
  reason?: string;
  handoff?: Handoff;
}

/** The schema object, for callers that compile it with ajv themselves. */
export const sessionFooterSchema = schema;

/** Render a footer as the fenced block that ends a comment. */
export function renderFooter(footer: SessionFooter): string {
  return `\`\`\`${FOOTER_FENCE}\n${JSON.stringify(footer)}\n\`\`\``;
}

const FENCE_RE = /```paperos-session[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/;

/**
 * Extract and parse the footer from a comment body. Returns `undefined` when
 * the comment has no trailing paperos-session fence or the JSON does not parse;
 * callers validate the result against the schema.
 */
export function parseFooter(commentBody: string): unknown {
  const m = FENCE_RE.exec(commentBody.trimEnd());
  if (!m) return undefined;
  const json = m[1];
  if (json === undefined) return undefined;
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
}
