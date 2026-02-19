# MetaMask Embedded Wallets MCP Server

MCP server + per-platform skills for [MetaMask Embedded Wallets](https://docs.metamask.io/embedded-wallets/) (Web3Auth). Helps AI coding agents recommend SDKs, generate integration code, and troubleshoot issues.

## Tools

| Tool | Description |
|------|-------------|
| `recommend_sdk` | Recommend the right SDK based on platform, features, and target chain |
| `get_integration_guide` | Get live documentation + example code for a specific SDK and feature |
| `search_docs` | Search across all Embedded Wallets documentation and examples |
| `troubleshoot` | Diagnose common integration issues from error messages or symptoms |

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
| `metamask-embedded-general` | Any platform (start here) |
| `metamask-embedded-react` | React, Next.js, Vite |
| `metamask-embedded-vue` | Vue, Nuxt |
| `metamask-embedded-js` | Angular, Svelte, vanilla JS |
| `metamask-embedded-react-native` | React Native, Expo |
| `metamask-embedded-android` | Android (Kotlin) |
| `metamask-embedded-ios` | iOS (Swift) |
| `metamask-embedded-flutter` | Flutter (Dart) |
| `metamask-embedded-unity` | Unity (C#) |
| `metamask-embedded-unreal` | Unreal Engine (C++) |
| `metamask-embedded-node` | Node.js backend |

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
| SDK architecture / new gotchas | Relevant `skills/*/SKILL.md` |
| New doc pages or URL changes | `src/content/registry.ts` |
| Platform capabilities changed | `src/content/platform-matrix.ts` |
| New tool category needed | `src/tools/*.ts` (rare) |
| Doc page content changed | Nothing (fetched live) |

## License

MIT
