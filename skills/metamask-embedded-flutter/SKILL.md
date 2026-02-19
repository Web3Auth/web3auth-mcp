---
name: metamask-embedded-flutter
description: Integrate MetaMask Embedded Wallets (Web3Auth) Flutter SDK with correct deep linking, key export, and platform setup. Use when building Flutter apps with Web3Auth embedded wallets or social login.
---

# MetaMask Embedded Wallets — Flutter SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in Flutter applications. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Social login only**: No external wallet support.

**No built-in providers**: After login, export the private key and use platform-specific Dart libraries for EVM or Solana.

**Wallet Services UI**: Webview-based. Optional; not a native modal.

**Cross-platform**: Single Dart codebase for iOS and Android.

**Installation**: Use Flutter pub add, not npm or yarn.

---

## Framework Considerations

### Deep Linking
- Deep link scheme must be configured for both platforms:
  - iOS: Info.plist
  - Android: AndroidManifest.xml
- Both bundle identifier (iOS) and package name (Android) must be allowlisted in the Web3Auth dashboard.
- Deep link URL must be whitelisted in the dashboard for OAuth to work.

### Key Export Flow
- Login returns a session that can export the private key.
- Use the exported key with Dart-based EVM or Solana libraries for signing and transaction building.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Built-in provider | There is NONE. You MUST export the private key and create your own provider using Dart libraries. |
| Key consistency | Client ID + network + connection must match across platforms for the same wallet address. |
| Deep link allowlist | Deep link URL must be whitelisted in the dashboard for OAuth to succeed. |
| Installation | Use flutter pub add; this is a Dart package, not an npm package. |
| Wallet Services | Webview-based; not a native UI component. |

---

## Patterns

1. **Login → Export key**: Authenticate via social login, then export the private key for use with Dart EVM/Solana libraries.
2. **Dual platform config**: Configure deep links in both Info.plist (iOS) and AndroidManifest.xml (Android).
3. **Dashboard allowlist**: Add both bundle ID and package name, plus the deep link URL.
4. **Provider creation**: Build your own EVM or Solana provider using the exported key and Dart libraries.
5. **Wallet Services**: Use the webview-based UI optionally for signing and balances; do not expect native UI.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/flutter/
- Dashboard: Client ID, redirect URLs, bundle ID and package name allowlist.
- EVM/Solana libraries: Look up current recommended platform libraries from the docs.
