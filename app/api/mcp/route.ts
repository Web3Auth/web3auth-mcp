import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { handleRecommendSdk } from "@/tools/recommend-sdk";
import { handleSearchDocs } from "@/tools/search-docs";
import { handleGetIntegrationGuide } from "@/tools/get-integration-guide";
import { handleTroubleshoot } from "@/tools/troubleshoot";
import type { Platform, Chain } from "@/content/platform-matrix";

const PLATFORMS = [
  "react",
  "vue",
  "js",
  "react-native",
  "android",
  "ios",
  "flutter",
  "unity",
  "unreal",
  "node",
] as const;
const CHAINS = ["evm", "solana", "other"] as const;

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "recommend_sdk",
      "Recommend the right MetaMask Embedded Wallets (Web3Auth) SDK based on platform, desired features, and target blockchain. Use this when a developer is starting a new integration or unsure which SDK to use.",
      {
        platform: z.enum(PLATFORMS).describe("Target platform or framework"),
        chain: z
          .enum(CHAINS)
          .default("evm")
          .describe(
            "Target blockchain family. Use 'other' for chains like Bitcoin, Cosmos, Aptos, etc."
          ),
        features: z
          .array(
            z.enum([
              "social-login",
              "external-wallets",
              "modal-ui",
              "wallet-ui",
              "smart-accounts",
              "mfa",
              "custom-auth",
              "server-side-verification",
              "private-key-export",
            ])
          )
          .optional()
          .describe("Desired features for the integration"),
      },
      async (args) => {
        const result = handleRecommendSdk({
          platform: args.platform as Platform,
          chain: args.chain as Chain,
          features: args.features,
        });
        return { content: [{ type: "text" as const, text: result }] };
      }
    );

    server.tool(
      "search_docs",
      "Search MetaMask Embedded Wallets (Web3Auth) documentation and examples. Returns matching doc pages with live content and relevant code examples.",
      {
        query: z
          .string()
          .describe(
            "Search query -- describe what you're looking for"
          ),
        fetch_content: z
          .boolean()
          .default(false)
          .describe(
            "If true, fetches and returns the full content of the top matching doc page"
          ),
      },
      async (args) => {
        const result = await handleSearchDocs(args);
        return { content: [{ type: "text" as const, text: result }] };
      }
    );

    server.tool(
      "get_integration_guide",
      "Get a detailed integration guide for a specific MetaMask Embedded Wallets (Web3Auth) SDK. Fetches live documentation and example code.",
      {
        sdk: z
          .enum(PLATFORMS)
          .describe("The SDK/platform to get the integration guide for"),
        feature: z
          .enum([
            "quick-start",
            "custom-auth-auth0",
            "custom-auth-firebase",
            "custom-auth-cognito",
            "custom-auth-jwt",
            "custom-auth-google",
            "grouped-connections",
            "evm-transactions",
            "solana-transactions",
            "other-chains",
            "smart-accounts",
            "wallet-ui",
            "server-side-verification",
            "mfa",
          ])
          .default("quick-start")
          .describe("Specific feature or topic to focus on"),
      },
      async (args) => {
        const result = await handleGetIntegrationGuide({
          sdk: args.sdk as Platform,
          feature: args.feature,
        });
        return { content: [{ type: "text" as const, text: result }] };
      }
    );

    server.tool(
      "troubleshoot",
      "Diagnose and troubleshoot common MetaMask Embedded Wallets (Web3Auth) integration issues. Provide an error message or describe the symptom.",
      {
        error_or_symptom: z
          .string()
          .describe(
            "The error message, stack trace snippet, or description of the problem"
          ),
        sdk: z
          .enum(PLATFORMS)
          .optional()
          .describe(
            "The SDK being used (helps narrow down platform-specific issues)"
          ),
        bundler: z
          .enum(["vite", "webpack", "metro", "nuxt", "svelte"])
          .optional()
          .describe(
            "The bundler being used (relevant for polyfill issues)"
          ),
      },
      async (args) => {
        const result = await handleTroubleshoot({
          error_or_symptom: args.error_or_symptom,
          sdk: args.sdk,
          bundler: args.bundler,
        });
        return { content: [{ type: "text" as const, text: result }] };
      }
    );
  },
  {
    serverInfo: {
      name: "web3auth-embedded-wallets",
      version: "1.0.0",
    },
  },
  {
    basePath: "/api",
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
