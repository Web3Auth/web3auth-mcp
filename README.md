# MetaMask Embedded Wallets MCP Server

MCP server + per-platform skills for [MetaMask Embedded Wallets](https://docs.metamask.io/embedded-wallets/) (Web3Auth). Helps AI coding agents recommend SDKs, generate integration code, and troubleshoot issues.

## Tools

| Tool | Description |
|------|-------------|
| `search_docs` | Search documentation and examples. Returns doc page links with snippets and matching examples |
| `get_doc` | Fetch full content of a doc page. Uses Algolia → llms.txt → GitHub raw MDX fallback |
| `get_example` | Fetch complete source code of an integration example from GitHub. **Primary reference for integration patterns** |
| `get_sdk_reference` | Fetch SDK source code (types, interfaces, hooks) from open-source repos. For reference and debugging only |
| `search_community` | Search the MetaMask Builder Hub forum for real user issues and workarounds |

## Setup

### Cursor (MCP)

Add to your Cursor MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "web3auth": {
      "command": "node",
      "args": ["/path/to/web3auth-mcp/dist/index.js"]
    }
  }
}
```

Or with npx (after publishing):

```json
{
  "mcpServers": {
    "web3auth": {
      "command": "npx",
      "args": ["@web3auth/mcp-server"]
    }
  }
}
```

### Remote URL (Vercel)

You can run the MCP over HTTP by deploying to Vercel:

```bash
npm i -g vercel
vercel deploy
```

Then in Cursor MCP settings use the deployed URL:

```json
{
  "mcpServers": {
    "web3auth": {
      "url": "https://your-project.vercel.app/api/mcp"
    }
  }
}
```

For clients that only support stdio, use [mcp-remote](https://github.com/modelcontextprotocol/mcp-remote) to bridge the HTTP endpoint:

```json
{
  "mcpServers": {
    "web3auth": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://your-project.vercel.app/api/mcp"]
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | GitHub personal access token. Optional but recommended to avoid rate limits when fetching SDK source code via `get_sdk_reference` |

### Skills

Skills teach your AI assistant *how to think* about each SDK -- architecture, framework quirks, and common misunderstandings. They contain no code (the MCP provides that).

Copy the relevant skill folder to your project's `.cursor/skills/` directory:

```bash
# Example: copy the React skill
cp -r skills/metamask-embedded-react .cursor/skills/

# Or copy the general skill (recommended for all projects)
cp -r skills/metamask-embedded-general .cursor/skills/
```

Available skills:

| Skill | Use when building with... |
|-------|--------------------------|
| `web3auth` | Unified skill — all platforms, SDK selection, integration patterns |

## Development

```bash
npm install
npm run build
npm start          # Run via stdio
npm run dev        # Watch mode
```

## Updating Content

When a product update ships, only a few files need changing:

| What changed | File to update |
|---|---|
| SDK architecture / new gotchas | `skills/web3auth/SKILL.md` |
| New doc pages or URL changes | `src/content/registry.ts` |
| Platform capabilities changed | `src/content/platform-matrix.ts` |
| SDK repo structure changed | `src/content/sdk-registry.ts` |
| New tool category needed | `src/tools/register.ts` |
| Doc page content changed | Nothing (fetched live) |

## License

MIT
