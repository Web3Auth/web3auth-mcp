/**
 * Shared tool registration — used by both stdio (index.ts) and HTTP (route.ts) entry points.
 * Keeps tool definitions DRY.
 */
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import { handleSearchDocs } from "./search-docs.js";
import { handleGetDoc } from "./get-doc.js";
import { handleGetExample } from "./get-example.js";
import { handleSearchCommunity } from "./search-community.js";
import { handleGetSdkReference } from "./get-sdk-reference.js";
import type { Platform, Chain } from "../content/platform-matrix.js";

const PLATFORMS = [
  "react", "vue", "js", "react-native", "android", "ios",
  "flutter", "unity", "unreal", "node",
] as const;

const CHAINS = ["evm", "solana", "other"] as const;
const CATEGORIES = ["quick-start", "custom-auth", "blockchain", "feature", "playground"] as const;
const SDK_FOCUSES = ["types", "hooks", "main-class", "errors", "all"] as const;

const READ_ONLY: ToolAnnotations = {
  readOnlyHint: true,
  // All tools are idempotent (same inputs produce equivalent results) and
  // interact with external services (Algolia, GitHub, Discourse).
  idempotentHint: true,
  openWorldHint: true,
};

/** Register all MCP tools on a server instance. */
export function registerTools(server: McpServer): void {

  // ── search_docs ──────────────────────────────────────────────────────────
  server.tool(
    "search_docs",
    "Search MetaMask Embedded Wallets (Web3Auth) documentation and examples. Use for SDK discovery, feature lookup, and finding relevant examples. Returns doc page links with snippets and matching example projects.",
    {
      query: z.string().describe("What you are looking for -- e.g. 'React custom auth', 'Android deep linking', 'JWT grouped connections'"),
      platform: z.enum(PLATFORMS).optional().describe("Filter examples by platform"),
      chain: z.enum(CHAINS).optional().describe("Filter examples by blockchain family"),
      category: z.enum(CATEGORIES).optional().describe("Filter examples by category"),
    },
    READ_ONLY,
    async (args: { query: string; platform?: string; chain?: string; category?: string }) => {
      const result = await handleSearchDocs({
        query: args.query,
        platform: args.platform as Platform | undefined,
        chain: args.chain as Chain | undefined,
        category: args.category as "quick-start" | "custom-auth" | "blockchain" | "feature" | "playground" | undefined,
      });
      return { isError: result.isError, content: [{ type: "text" as const, text: result.text }] };
    },
  );

  // ── get_doc ──────────────────────────────────────────────────────────────
  server.tool(
    "get_doc",
    "Fetch the full content of a MetaMask Embedded Wallets documentation page. Use after search_docs to read the actual doc. Tries Algolia, then llms.txt, then GitHub raw MDX as fallbacks.",
    {
      url: z.string().describe("A docs.metamask.io URL, e.g. https://docs.metamask.io/embedded-wallets/sdk/react/"),
    },
    READ_ONLY,
    async (args: { url: string }) => {
      const result = await handleGetDoc({ url: args.url });
      return { isError: result.isError, content: [{ type: "text" as const, text: result.text }] };
    },
  );

  // ── get_example ──────────────────────────────────────────────────────────
  server.tool(
    "get_example",
    "Fetch the complete source code of a Web3Auth integration example from GitHub. Returns all source files needed to understand how the integration works. Examples are the PRIMARY reference for integration patterns — always prefer example code over raw SDK source.",
    {
      name: z.string().optional().describe("Example name, e.g. 'React Quick Start' or 'Android Firebase'"),
      platform: z.enum(PLATFORMS).optional().describe("Filter by platform"),
      chain: z.enum(CHAINS).optional().describe("Filter by blockchain family"),
      category: z.enum(CATEGORIES).optional().describe("Filter by category"),
      auth_method: z.string().optional().describe("Filter by auth method, e.g. 'auth0', 'firebase', 'google', 'grouped'"),
    },
    READ_ONLY,
    async (args: { name?: string; platform?: string; chain?: string; category?: string; auth_method?: string }) => {
      const result = await handleGetExample({
        name: args.name,
        platform: args.platform as Platform | undefined,
        chain: args.chain as Chain | undefined,
        category: args.category as "quick-start" | "custom-auth" | "blockchain" | "feature" | "playground" | undefined,
        auth_method: args.auth_method,
      });
      return { isError: result.isError, content: [{ type: "text" as const, text: result.text }] };
    },
  );

  // ── get_sdk_reference ────────────────────────────────────────────────────
  server.tool(
    "get_sdk_reference",
    "Fetch SDK source code (type definitions, interfaces, hooks) from the open-source Web3Auth SDK repos. Use for REFERENCE and DEBUGGING only — to verify exact type shapes, constructor signatures, available hooks, and error types. Do NOT use this to discover features; many SDK options are internal or legacy. Always use get_example first for integration patterns.",
    {
      platform: z.enum(PLATFORMS).describe("Target platform SDK to fetch source for"),
      module: z.string().optional().describe(
        "Specific SDK module to fetch, e.g. 'core-types', 'react-hooks', 'modal-types', 'main-class'. " +
        "Omit to get default type definitions. Call without module first to see available modules.",
      ),
      focus: z.enum(SDK_FOCUSES).default("types").describe(
        "What kind of source to focus on. 'types' = interfaces/types (default, most useful). " +
        "'hooks' = React hooks / Vue composables. 'errors' = error types. " +
        "'main-class' = SDK implementation. 'all' = everything.",
      ),
    },
    READ_ONLY,
    async (args: { platform: string; module?: string; focus?: string }) => {
      const result = await handleGetSdkReference({
        platform: args.platform as Platform,
        module: args.module,
        focus: args.focus,
      });
      return { isError: result.isError, content: [{ type: "text" as const, text: result.text }] };
    },
  );

  // ── search_community ─────────────────────────────────────────────────────
  server.tool(
    "search_community",
    "Search or fetch posts from the MetaMask Embedded Wallets community forum (builder.metamask.io). Use for troubleshooting real user issues, finding workarounds, and checking if an issue is known. Provide a query to search or a topic_id to read the full discussion.",
    {
      query: z.string().optional().describe("Search query, e.g. 'popup blocked safari', 'JWT error', 'Android unstable connection'"),
      topic_id: z.number().int().optional().describe("Discourse topic ID to fetch the full discussion thread"),
    },
    READ_ONLY,
    async (args: { query?: string; topic_id?: number }) => {
      const result = await handleSearchCommunity({
        query: args.query,
        topic_id: args.topic_id,
      });
      return { isError: result.isError, content: [{ type: "text" as const, text: result.text }] };
    },
  );
}
