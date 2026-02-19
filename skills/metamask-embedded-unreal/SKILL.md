---
name: metamask-embedded-unreal
description: Integrate MetaMask Embedded Wallets (Web3Auth) Unreal Engine SDK for game development. Use when building Unreal Engine games with Web3Auth embedded wallets or social login.
---

# MetaMask Embedded Wallets — Unreal Engine SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in Unreal Engine games and applications. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Social login only**: No external wallet support.

**No built-in providers**: Export private key for blockchain operations. Use Unreal-compatible libraries for EVM or Solana.

**Wallet Services UI**: Webview-based.

**Primary language**: C++ and Blueprints.

**SDK ownership**: SDK repo is under MetaMask org, not Web3Auth.

---

## Framework Considerations

### Deep Linking
- Deep link scheme must be configured for the app.
- Bundle identifier and deep link scheme must be allowlisted in the Web3Auth dashboard.
- OAuth redirects depend on the deep link; without it, social login fails.

### Key Export Flow
- Login returns a session that can export the private key.
- Use the exported key with Unreal-compatible EVM or Solana libraries for signing and transaction building.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Built-in provider | There is NONE. You MUST export the private key and create your own provider using Unreal-compatible blockchain libraries. |
| External wallets | Unreal SDK does not support external wallet connections. |
| Key consistency | Client ID + network + connection must match across platforms for the same wallet address. |
| Installation | Look up the correct Unreal plugin or module installation from the docs. SDK is under MetaMask org. |
| Wallet Services | Webview-based; not a native UI component. |

---

## Patterns

1. **Login → Export key**: Authenticate via social login, then export the private key for use with Unreal EVM/Solana libraries.
2. **Deep link config**: Configure the deep link scheme required for OAuth flows.
3. **Dashboard allowlist**: Add bundle identifier and deep link scheme.
4. **Provider creation**: Build your own EVM or Solana provider using the exported key and Unreal-compatible libraries.
5. **Wallet Services**: Use the webview-based UI optionally; do not expect native Unreal UI components.
6. **Repo location**: When searching for the SDK, look under the MetaMask organization, not Web3Auth.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/unreal/
- Dashboard: Client ID, redirect URLs, bundle identifier and deep link allowlist.
- EVM/Solana libraries: Look up current recommended Unreal-compatible libraries from the docs.
- SDK source: MetaMask organization on GitHub.
