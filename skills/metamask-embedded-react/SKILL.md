---
name: metamask-embedded-react
description: Integrate MetaMask Embedded Wallets (Web3Auth) React SDK with correct provider setup, framework considerations, and common pitfalls. Use when building React, Next.js, or Vite apps with Web3Auth embedded wallets, social login, or wallet integration, or when the user mentions Web3Auth, MetaMask Embedded Wallets, DynamicContextProvider, wallet connection, or social login wallets.
---

# MetaMask Embedded Wallets — React SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in React, Next.js, and Vite applications. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Provider-based**: The root provider wraps the app. All hooks must be descendants of this provider.

**Two integration modes**:
- **Modal**: Pre-built login UI.
- **No-Modal**: Headless; build your own UI.

**Built-in providers**:
- EVM: Dedicated Wagmi connector and hooks for best DX.
- Solana: Custom hooks exposing wallet state.
- External wallet aggregation: Extension, WalletConnect, Coinbase, others.

**Wallet Services UI**: Rendered in an iframe for transaction signing and portfolio view.

---

## Framework Considerations

### Next.js (App Router)
- Provider uses client-side APIs; must live in a client component.
- Do not put the provider in layout server components.
- Use the appropriate environment variable prefix for client IDs.

### Vite
- Requires buffer and process polyfills.
- Set the global alias to the correct value in the config.
- Use the correct environment variable prefix for client IDs.

### Webpack 5 / CRA (deprecated)
- Use a rewire-based setup with buffer and process polyfills.
- Refer to the Webpack troubleshooting guide.

### Environment variables
- Vite: one prefix for client-side vars.
- Next.js: different prefix for public vars.
- Use env vars for client IDs; never hardcode.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Client ID | Different client IDs produce different wallet addresses for the same user. Keep client ID consistent across environments. |
| Sapphire networks | Devnet allows localhost; Mainnet does not. Use devnet for local development. |
| Popup blocked | Minimize delay between user click and connect call. Or use redirect mode. |
| Wagmi | Use the dedicated Web3Auth Wagmi hooks for Web3Auth-specific state, not generic Wagmi hooks. |
| Multiple login methods | Google + email (or similar) yield different wallets unless Grouped Connections are used. |
| Custom auth JWT | The `iat` claim must be within 60 seconds of current time, regardless of `exp`. |
| Session management | SDK encrypts and persists the private key in local storage. Duration is configurable in the dashboard. |

---

## Patterns

1. **Initialization**: Initialize the SDK before calling connect; avoid calling connect from cold state.
2. **Session management**: Use session management for persistent login across page refreshes.
3. **Custom auth**: Configure the connection on the dashboard first; then wire it in your code.
4. **EVM chains**: Prefer the Wagmi connector for integration.
5. **Solana**: Use the dedicated Solana hooks for wallet state.
6. **Private key export**: Controlled in the dashboard. When disabled, the built-in provider can still sign transactions.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/react/
- Dashboard setup: https://docs.metamask.io/embedded-wallets/dashboard/
- Advanced configuration: wallet services, MFA, whitelabel, custom auth, smart accounts.
- Troubleshooting: Vite, Webpack, JWT errors, bundler polyfills.
