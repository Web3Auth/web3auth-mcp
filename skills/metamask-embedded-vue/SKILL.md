---
name: metamask-embedded-vue
description: Integrate MetaMask Embedded Wallets (Web3Auth) Vue SDK with correct composable setup, framework considerations, and common pitfalls. Use when building Vue or Nuxt apps with Web3Auth embedded wallets, social login, or wallet integration.
---

# MetaMask Embedded Wallets — Vue SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in Vue and Nuxt applications. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Composables-based API**: Similar to React hooks but uses Vue Composition API. Same underlying SDK.

**Two integration modes**:
- **Modal**: Pre-built login UI.
- **No-Modal**: Headless; build your own UI.

**Built-in providers**:
- EVM and Solana providers included.
- External wallet aggregation available.
- Wallet Services UI rendered in an iframe.

**Important**: Composables must be called within `setup()` or `<script setup>`. Do not confuse Vue composables with React hooks—different API surface, same underlying SDK.

---

## Framework Considerations

### Nuxt
- Requires `ssr: false` since Web3Auth is client-side only.
- Add buffer and process polyfills via a client plugin.
- Set the global alias in the config (within nuxt config).

### Vite
- Same polyfills as React: buffer, process, and global alias.
- Refer to the Vite troubleshooting guide.

### Polyfill setup (Nuxt)
- Create a client-only plugin that polyfills Buffer and process on global scope.
- Load the plugin before the app mounts.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Client ID | Different client IDs produce different wallet addresses for the same user. |
| Sapphire networks | Devnet allows localhost; Mainnet does not. Use devnet for local development. |
| Popup blocked | Minimize delay between user click and connect call, or use redirect mode. |
| Grouped connections | Multiple login methods (Google + email) yield different wallets unless Grouped Connections are used. |
| Vue vs React | Composables and hooks differ in API; use the correct patterns for Vue. |

---

## Patterns

1. **Composables scope**: Use composables only inside `setup()` or `<script setup>`.
2. **Initialization**: Initialize the SDK before calling connect.
3. **Session management**: Use session management for persistent login.
4. **Custom auth**: Configure the connection on the dashboard first.
5. **EVM / Solana**: Use the dedicated composables for each chain.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/vue/
- Nuxt troubleshooting: buffer, process, ssr considerations.
- Same core SDK as React—reference React docs for conceptual details when needed.
