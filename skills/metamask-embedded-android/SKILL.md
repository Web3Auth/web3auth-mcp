---
name: metamask-embedded-android
description: Integrate MetaMask Embedded Wallets (Web3Auth) Android SDK with correct deep linking, key export, and provider setup. Use when building Android apps with Web3Auth embedded wallets or social login.
---

# MetaMask Embedded Wallets — Android SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in Android (Kotlin) applications. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Social login only**: No external wallet support.

**No built-in providers**: After login, export the private key and use it with platform-specific libraries for EVM or Solana.

**Wallet Services UI**: Webview-based for transaction signing and balance display. Optional; not a native modal.

**Dashboard chains**: Chain configuration is not supported in the dashboard. Copy RPC endpoints manually.

**Primary language**: Kotlin.

---

## Framework Considerations

### Deep Linking
- Configure deep link scheme and activity in AndroidManifest.xml.
- Bundle identifier must be registered in the Web3Auth dashboard allowlist.
- OAuth callback uses the deep link to return to the app.

### Key Export Flow
- Login returns a session that can export the private key.
- Use the exported key with your chosen EVM or Solana library for signing and transaction building.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Built-in provider | There is NONE. You MUST export the private key and create your own provider using platform libraries. |
| Wallet Services | Optional and webview-based, not a native UI component. |
| Key consistency | Client ID + network + connection must match across platforms for the same wallet address. |
| Dashboard chains | Copy RPC endpoints manually; dashboard chain config is not supported. |

---

## Patterns

1. **Login → Export key**: Authenticate via social login, then export the private key for use with platform-specific EVM or Solana libraries.
2. **Deep linking**: Register scheme in AndroidManifest.xml and whitelist bundle ID in the dashboard.
3. **Provider creation**: Build your own EVM or Solana provider using the exported key and platform libraries.
4. **Wallet Services**: Use the webview-based UI optionally for signing and balances; do not expect native UI.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/android/
- Dashboard: Client ID, redirect URLs, bundle ID allowlist.
- EVM/Solana libraries: Look up current recommended platform libraries from the docs.
