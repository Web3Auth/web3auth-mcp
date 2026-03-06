#!/usr/bin/env node

import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/register.js";

export async function startMcpServer(): Promise<void> {
  const server = new McpServer({
    name: "web3auth-embedded-wallets",
    version: "2.0.0",
  });

  registerTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Web3Auth MCP Server v2.0 running on stdio");
}

// Only run when invoked directly (not when imported by cli.ts)
const isEntryPoint = process.argv[1] === fileURLToPath(import.meta.url);
if (isEntryPoint) {
  startMcpServer().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
