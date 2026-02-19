---
name: metamask-embedded-js
description: Integrate MetaMask Embedded Wallets (Web3Auth) JavaScript SDK for any web framework or vanilla JS. Use when building Angular, Svelte, vanilla JS, or any non-React/Vue web app with Web3Auth.
---

# MetaMask Embedded Wallets — JavaScript SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in any web framework or vanilla JavaScript. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Framework-agnostic**: Works with Angular, Svelte, vanilla JS, and any web framework.

**Same core SDK** as React and Vue, but without framework-specific wrappers. Direct instantiation and method calls instead of hooks or composables.

**Two integration modes**:
- **Modal**: Pre-built login UI.
- **No-Modal**: Headless; build your own UI.

**Built-in providers**: EVM and Solana providers included.

---

## Framework Considerations

### Angular
- Uses Webpack; polyfills are more involved than with Vite.
- Configure polyfills in tsconfig paths and a dedicated polyfills file.
- Set the global alias in the bundler config.

### Svelte + Vite
- Use the node polyfills plugin with buffer, process, and global.
- Set the global alias in the config.

### Vanilla JS
- Add buffer and process via script tag in index.html and in the bundler config.
- All bundlers need the global alias defined.

### Universal
- Every framework needs `define global` set to the correct value in the bundler config.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Client ID | Different client IDs produce different wallet addresses for the same user. |
| Sapphire networks | Devnet allows localhost; Mainnet does not. Use devnet for local development. |
| Popup blocked | Minimize delay between user click and connect call, or use redirect mode. |
| Grouped connections | Multiple login methods yield different wallets unless Grouped Connections are used. |
| Polyfills | Angular, CRA, and Webpack 5 projects require more involved polyfill configuration than Vite. |

---

## Patterns

1. **Direct API**: Instantiate the SDK directly; call methods instead of using hooks or composables.
2. **Initialization**: Initialize before calling connect.
3. **Session management**: Use session management for persistent login.
4. **Custom auth**: Configure the connection on the dashboard first.
5. **Polyfills**: For each framework, follow its specific bundler and polyfill guide.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/js/
- Troubleshooting: Angular, Svelte, Vite, Webpack, vanilla JS.
- Same core concepts as React/Vue—reference those SDK docs for architecture and flows when needed.
