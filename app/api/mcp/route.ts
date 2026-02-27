import { createMcpHandler } from "mcp-handler";
import { registerTools } from "@/tools/register";

const handler = createMcpHandler(
  (server) => {
    registerTools(server);
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
