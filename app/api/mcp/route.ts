import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { handleSearchDocs } from "@/tools/search-docs";
import { handleGetDoc } from "@/tools/get-doc";
import { handleGetExample } from "@/tools/get-example";
import { handleSearchCommunity } from "@/tools/search-community";
import type { Platform, Chain } from "@/content/platform-matrix";

const PLATFORMS = [
  "react", "vue", "js", "react-native", "android", "ios",
  "flutter", "unity", "unreal", "node",
] as const;

const CHAINS = ["evm", "solana", "other"] as const;
const CATEGORIES = ["quick-start", "custom-auth", "blockchain", "feature", "playground"] as const;

const handler = createMcpHandler(
  (server) => {
    // ── search_docs ────────────────────────────────────────────────────────
    server.tool(
      "search_docs",
      "Search MetaMask Embedded Wallets (Web3Auth) documentation and examples. Use for SDK discovery, feature lookup, and finding relevant examples. Returns doc page links with snippets and matching example projects.",
      {
        query: z.string().describe("What you are looking for -- e.g. 'React custom auth', 'Android deep linking', 'JWT grouped connections'"),
        platform: z.enum(PLATFORMS).optional().describe("Filter examples by platform"),
        chain: z.enum(CHAINS).optional().describe("Filter examples by blockchain family"),
        category: z.enum(CATEGORIES).optional().describe("Filter examples by category"),
      },
      async (args) => {
        const result = await handleSearchDocs({
          query: args.query,
          platform: args.platform as Platform | undefined,
          chain: args.chain as Chain | undefined,
          category: args.category,
        });
        return { content: [{ type: "text" as const, text: result }] };
      },
    );

    // ── get_doc ────────────────────────────────────────────────────────────
    server.tool(
      "get_doc",
      "Fetch the full content of a MetaMask Embedded Wallets documentation page. Use after search_docs to read the actual doc. Tries Algolia, then llms.txt, then GitHub raw MDX as fallbacks.",
      {
        url: z.string().describe("A docs.metamask.io URL, e.g. https://docs.metamask.io/embedded-wallets/sdk/react/"),
      },
      async (args) => {
        const result = await handleGetDoc({ url: args.url });
        return { content: [{ type: "text" as const, text: result }] };
      },
    );

    // ── get_example ────────────────────────────────────────────────────────
    server.tool(
      "get_example",
      "Fetch the complete source code of a Web3Auth integration example from GitHub. Returns all source files (TypeScript, Swift, Kotlin, Dart, etc.) needed to understand how the integration works. Use this to generate accurate implementation code.",
      {
        name: z.string().optional().describe("Example name, e.g. 'React Quick Start' or 'Android Firebase'"),
        platform: z.enum(PLATFORMS).optional().describe("Filter by platform"),
        chain: z.enum(CHAINS).optional().describe("Filter by blockchain family"),
        category: z.enum(CATEGORIES).optional().describe("Filter by category"),
        auth_method: z.string().optional().describe("Filter by auth method, e.g. 'auth0', 'firebase', 'google', 'grouped'"),
      },
      async (args) => {
        const result = await handleGetExample({
          name: args.name,
          platform: args.platform as Platform | undefined,
          chain: args.chain as Chain | undefined,
          category: args.category,
          auth_method: args.auth_method,
        });
        return { content: [{ type: "text" as const, text: result }] };
      },
    );

    // ── search_community ────────────────────────────────────────────────────
    server.tool(
      "search_community",
      "Search or fetch posts from the MetaMask Embedded Wallets community forum (builder.metamask.io). Use for troubleshooting real user issues, finding workarounds, and checking if an issue is known. Provide a query to search or a topic_id to read the full discussion.",
      {
        query: z.string().optional().describe("Search query, e.g. 'popup blocked safari', 'JWT error', 'Android unstable connection'"),
        topic_id: z.number().int().optional().describe("Discourse topic ID to fetch the full discussion thread"),
      },
      async (args) => {
        const result = await handleSearchCommunity({
          query: args.query,
          topic_id: args.topic_id,
        });
        return { content: [{ type: "text" as const, text: result }] };
      },
    );
  },
  {
    serverInfo: {
      name: "web3auth-embedded-wallets",
      version: "2.0.0",
    },
  },
  {
    basePath: "/api",
    maxDuration: 60,
  },
);

export { handler as GET, handler as POST, handler as DELETE };
