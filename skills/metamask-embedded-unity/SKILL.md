---
name: metamask-embedded-unity
description: Integrate MetaMask Embedded Wallets (Web3Auth) Unity SDK for game development. Use when building Unity games or apps with Web3Auth embedded wallets or social login.
---

# MetaMask Embedded Wallets — Unity SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in Unity games and applications. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Social login only**: No external wallet support.

**No built-in EVM/Solana providers**: Export private key and use Unity-compatible blockchain libraries for EVM or Solana.

**Wallet Services UI**: Webview-based.

**Primary language**: C#.

**Deep link scheme**: Required for OAuth flows.

---

## Framework Considerations

### Deep Linking
- Deep link scheme must be configured for the app.
- Bundle identifier and deep link scheme must be allowlisted in the Web3Auth dashboard.
- OAuth redirects depend on the deep link; without it, social login fails.

### Key Export Flow
- Login returns a session that can export the private key.
- Use the exported key with Unity-compatible EVM or Solana libraries for signing and transaction building.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Built-in provider | There is NONE. You MUST export the private key and create your own provider using Unity-compatible blockchain libraries. |
| External wallets | Unity SDK does not support external wallet connections. |
| Key consistency | Client ID + network + connection must match across platforms for the same wallet address. |
| Installation | Look up the correct Unity package installation method from the docs. |
| Wallet Services | Webview-based; not a native UI component. |

---

## Patterns

1. **Login → Export key**: Authenticate via social login, then export the private key for use with Unity EVM/Solana libraries.
2. **Deep link config**: Configure the deep link scheme required for OAuth flows.
3. **Dashboard allowlist**: Add bundle identifier and deep link scheme.
4. **Provider creation**: Build your own EVM or Solana provider using the exported key and Unity-compatible libraries.
5. **Wallet Services**: Use the webview-based UI optionally; do not expect native Unity UI components.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/unity/
- Dashboard: Client ID, redirect URLs, bundle identifier and deep link allowlist.
- EVM/Solana libraries: Look up current recommended Unity-compatible libraries from the docs.
