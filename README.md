# MetaMask Embedded Wallets MCP Server

Build MetaMask Embedded Wallets integrations faster by giving your AI coding assistant live access to the
documentation and deep knowledge of the SDK.

There are two things to set up:

1. **Skill** — Teaches your AI assistant _how to think_ about the SDK: architecture, framework quirks, key derivation rules, and common mistakes. No code in the skill; the MCP provides that.
2. **MCP server** — Gives your AI assistant real-time access to search docs, fetch examples, and look up SDK types.

---

## MCP Tools

| Tool                | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `search_docs`       | Search documentation and example projects            |
| `get_doc`           | Fetch the full content of any doc page               |
| `get_example`       | Fetch complete source code of an integration example |
| `get_sdk_reference` | Fetch SDK types and hooks from the open-source repos |
| `search_community`  | Search the MetaMask Builder Hub for real user issues |

---

## Skill

The skill teaches your AI assistant the mental model for MetaMask Embedded Wallets. It includes SDK selection
logic, key derivation rules, authentication concepts, platform quirks, and common mistakes that aren't obvious
from the docs alone.

> **Tip:** For the best experience, use the MCP server alongside the skill so that your LLM can fetch live docs
> and examples rather than relying on static text.

### Cursor

```bash
npx degit Web3Auth/web3auth-mcp/skills/web3auth .cursor/skills/web3auth
```

Cursor picks up any `SKILL.md` inside `.cursor/skills/` automatically and activates it when relevant.

### Claude Code CLI

```bash
npx degit Web3Auth/web3auth-mcp/skills/web3auth /tmp/web3auth-skill
cat /tmp/web3auth-skill/SKILL.md >> CLAUDE.md
```

### Claude Desktop

Open **Claude Desktop → Settings → Custom Instructions** and paste the contents of [`skills/web3auth/SKILL.md`](./skills/web3auth/SKILL.md) directly.

### Antigravity

```bash
npx degit Web3Auth/web3auth-mcp/skills/web3auth .agent/skills/web3auth
```

Antigravity picks up skills inside `.agent/skills/` automatically. For global installation across all
projects, use `~/.gemini/antigravity/skills/` instead.

### Other tools

For any LLM tool with a system prompt or custom instructions field, paste the contents of
[`skills/web3auth/SKILL.md`](./skills/web3auth/SKILL.md) directly.

---

## MCP Server Setup

### Cursor

The fastest way is one click:

[![Add MetaMask Embedded Wallets MCP to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=web3auth&config=eyJ1cmwiOiJodHRwczovL21jcC53ZWIzYXV0aC5pbyJ9)

Or add it manually. Open **Cursor Settings → Tools & Integrations → MCP** and add:

```json
{
  "mcpServers": {
    "web3auth": {
      "url": "https://mcp.web3auth.io"
    }
  }
}
```

### Claude Code CLI

```bash
claude mcp add --transport http web3auth https://mcp.web3auth.io
```

Or add manually to your project's `claude.json`:

```json
{
  "mcpServers": {
    "web3auth": {
      "url": "https://mcp.web3auth.io"
    }
  }
}
```

### Claude Desktop

Open your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the server to the `mcpServers` section:

```json
{
  "mcpServers": {
    "web3auth": {
      "url": "https://mcp.web3auth.io"
    }
  }
}
```

Restart Claude Desktop and ask: _"Search MetaMask Embedded Wallets docs for React quick start"_ to verify the connection.

### Antigravity

Open your MCP configuration file:

- **macOS/Linux**: `~/.config/antigravity/mcp.json`
- **Windows**: `%APPDATA%\antigravity\mcp.json`

Add the server to the `mcpServers` section:

```json
{
  "mcpServers": {
    "web3auth": {
      "url": "https://mcp.web3auth.io"
    }
  }
}
```

Antigravity hot-reloads MCP config changes — no restart required.

### Codex CLI

For Codex CLI or any stdio-only agent, use [mcp-remote](https://github.com/modelcontextprotocol/mcp-remote) to bridge the HTTP endpoint:

```bash
npm install -g mcp-remote
```

Then add to your agent's configuration:

```json
{
  "mcpServers": {
    "web3auth": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.web3auth.io"]
    }
  }
}
```

---

## Static docs (llms.txt)

If your AI tool doesn't support MCP yet, use the static documentation file instead:

```
https://docs.metamask.io/llms-full.txt
```

For tools that support the [llms.txt spec](https://llmstxt.org/) and can index docs automatically:

```
https://docs.metamask.io/llms.txt
```

> **Warning:** The static file is a snapshot and may not include the latest updates. Use the MCP server when possible for always-current docs.

---

## Start building

Once the skill and MCP are set up, ask your AI assistant directly. Good starting prompts:

- _"Add MetaMask Embedded Wallets to my React app with Google login."_
- _"Set up social login wallets in my Next.js app using Wagmi."_
- _"Integrate embedded wallets in my Flutter app."_
- _"Why are my users getting different wallet addresses after I changed the login method?"_

> **Tip:** Use planning mode (where available) for your initial prompt. Review the plan before generating code — this
> catches architecture mistakes early and avoids config errors that would change wallet addresses in production.

---

## Environment Variables

| Variable       | Required | Description                                                                                                                  |
| -------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN` | No       | GitHub personal access token. Optional but recommended to avoid rate limits when fetching SDK source code via `get_sdk_reference` |

---

## Development

```bash
npm install
npm run build
npm start          # Run via stdio
npm run dev        # Watch mode
```

## Updating Content

When a product update ships, only a few files need changing:

| What changed                     | File to update                    |
| -------------------------------- | --------------------------------- |
| SDK architecture / new gotchas   | `skills/web3auth/SKILL.md`        |
| New doc pages or URL changes     | `src/content/registry.ts`         |
| Platform capabilities changed    | `src/content/platform-matrix.ts`  |
| SDK repo structure changed       | `src/content/sdk-registry.ts`     |
| New tool category needed         | `src/tools/register.ts`           |
| Doc page content changed         | Nothing (fetched live)            |

## License

MIT
