#!/usr/bin/env node

import { Command } from "commander";
import { handleSearchDocs } from "./tools/search-docs.js";
import { handleGetDoc } from "./tools/get-doc.js";
import { handleGetExample } from "./tools/get-example.js";
import { handleGetSdkReference } from "./tools/get-sdk-reference.js";
import { handleSearchCommunity } from "./tools/search-community.js";
import { startMcpServer } from "./index.js";
import type { Platform, Chain } from "./content/platform-matrix.js";
import type { ToolResult } from "./tools/types.js";

const PLATFORMS = ["react", "vue", "js", "react-native", "android", "ios", "flutter", "unity", "unreal", "node"] as const;
const CHAINS = ["evm", "solana", "other"] as const;
const CATEGORIES = ["quick-start", "custom-auth", "blockchain", "feature", "playground"] as const;
const SDK_FOCUSES = ["types", "hooks", "main-class", "errors", "all"] as const;

type Category = "quick-start" | "custom-auth" | "blockchain" | "feature" | "playground";

function output(text: string, json: boolean): void {
  if (json) {
    process.stdout.write(JSON.stringify({ result: text }) + "\n");
  } else {
    process.stdout.write(text + "\n");
  }
}

function run(fn: () => Promise<ToolResult>, json: boolean): void {
  fn().then((result) => {
    if (result.isError) {
      if (json) {
        process.stderr.write(JSON.stringify({ error: result.text }) + "\n");
      } else {
        process.stderr.write(result.text + "\n");
      }
      process.exit(1);
    } else {
      output(result.text, json);
    }
  }).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    if (json) {
      process.stderr.write(JSON.stringify({ error: msg }) + "\n");
    } else {
      process.stderr.write(`Error: ${msg}\n`);
    }
    process.exit(1);
  });
}

// ── Detect backward-compat invocation as `web3auth-mcp` ──────────────────
const invokedAsMcp = process.argv[1]?.endsWith("web3auth-mcp") ||
  process.argv[1]?.endsWith("web3auth-mcp.js");

if (invokedAsMcp) {
  startMcpServer().catch((err: unknown) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
} else {
  const program = new Command();

  program
    .name("web3auth")
    .description("MetaMask Embedded Wallets (Web3Auth) — docs, examples, SDK reference, community")
    .version("2.0.0")
    .option("--json", "output as JSON { result: '...' }", false);

  // ── search ──────────────────────────────────────────────────────────────
  program
    .command("search <query>")
    .description("Search documentation and examples")
    .option("--platform <platform>", `Platform filter: ${PLATFORMS.join(", ")}`)
    .option("--chain <chain>", `Chain filter: ${CHAINS.join(", ")}`)
    .option("--category <category>", `Category filter: ${CATEGORIES.join(", ")}`)
    .action((query: string, opts: { platform?: string; chain?: string; category?: string }) => {
      const json = (program.opts() as { json: boolean }).json;
      run(() => handleSearchDocs({
        query,
        platform: opts.platform as Platform | undefined,
        chain: opts.chain as Chain | undefined,
        category: opts.category as Category | undefined,
      }), json);
    });

  // ── doc ─────────────────────────────────────────────────────────────────
  program
    .command("doc <url>")
    .description("Fetch full content of a docs.metamask.io documentation page")
    .action((url: string) => {
      const json = (program.opts() as { json: boolean }).json;
      run(() => handleGetDoc({ url }), json);
    });

  // ── example ─────────────────────────────────────────────────────────────
  program
    .command("example [name]")
    .description("Fetch full source code of a Web3Auth integration example")
    .option("--platform <platform>", `Platform filter: ${PLATFORMS.join(", ")}`)
    .option("--chain <chain>", `Chain filter: ${CHAINS.join(", ")}`)
    .option("--category <category>", `Category filter: ${CATEGORIES.join(", ")}`)
    .option("--auth-method <authMethod>", "Auth method filter, e.g. firebase, auth0, google, grouped")
    .action((name: string | undefined, opts: { platform?: string; chain?: string; category?: string; authMethod?: string }) => {
      const json = (program.opts() as { json: boolean }).json;
      run(() => handleGetExample({
        name,
        platform: opts.platform as Platform | undefined,
        chain: opts.chain as Chain | undefined,
        category: opts.category as Category | undefined,
        auth_method: opts.authMethod,
      }), json);
    });

  // ── sdk ─────────────────────────────────────────────────────────────────
  program
    .command("sdk <platform>")
    .description("Fetch SDK source code (types, hooks, interfaces) for a platform")
    .option("--module <module>", "Specific SDK module, e.g. core-types, react-hooks, modal-types")
    .option("--focus <focus>", `What to focus on: ${SDK_FOCUSES.join(", ")} (default: types)`)
    .action((platform: string, opts: { module?: string; focus?: string }) => {
      const json = (program.opts() as { json: boolean }).json;
      run(() => handleGetSdkReference({
        platform: platform as Platform,
        module: opts.module,
        focus: opts.focus,
      }), json);
    });

  // ── community ───────────────────────────────────────────────────────────
  program
    .command("community [query]")
    .description("Search or fetch posts from the MetaMask Builder Hub community forum")
    .option("--topic <id>", "Fetch a full discussion thread by Discourse topic ID", parseInt)
    .action((query: string | undefined, opts: { topic?: number }) => {
      const json = (program.opts() as { json: boolean }).json;
      if (!query && !opts.topic) {
        process.stderr.write("Error: provide a search query or --topic <id>\n");
        process.exit(1);
      }
      run(() => handleSearchCommunity({ query, topic_id: opts.topic }), json);
    });

  // ── mcp ─────────────────────────────────────────────────────────────────
  program
    .command("mcp")
    .description("Start the stdio MCP server (for use with Cursor, Claude Desktop, etc.)")
    .action(() => {
      startMcpServer().catch((err: unknown) => {
        console.error("Fatal error:", err);
        process.exit(1);
      });
    });

  program.parse(process.argv);
}
