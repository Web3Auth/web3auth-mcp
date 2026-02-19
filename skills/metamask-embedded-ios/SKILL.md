---
name: metamask-embedded-ios
description: Integrate MetaMask Embedded Wallets (Web3Auth) iOS SDK with correct deep linking, key export, and provider setup. Use when building iOS apps with Web3Auth embedded wallets or social login.
---

# MetaMask Embedded Wallets — iOS SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in iOS (Swift) applications. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Social login only**: No external wallet support.

**No built-in providers**: After login, export the private key and use it with platform-specific libraries for EVM or Solana.

**Wallet Services UI**: Webview-based. Optional; not a native modal.

**Primary language**: Swift.

**Package manager**: Installed via Swift Package Manager.

---

## Framework Considerations

### Deep Linking
- Deep link scheme must be configured in Info.plist.
- Bundle identifier must be registered in the Web3Auth dashboard allowlist.
- onOpenURL handler must be set up for OAuth callback flows.

### Key Export Flow
- Login returns a session that can export the private key.
- Use the exported key with your chosen EVM or Solana library for signing and transaction building.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Built-in provider | There is NONE. You MUST export the private key and create your own provider using platform libraries. |
| Key consistency | Client ID + network + connection must match across platforms for the same wallet address. |
| OAuth callback | onOpenURL handler is required for OAuth redirect flows to complete. |
| Wallet Services | Webview-based; not a native UI component. |

---

## Patterns

1. **Login → Export key**: Authenticate via social login, then export the private key for use with platform-specific EVM or Solana libraries.
2. **Deep linking**: Register scheme in Info.plist and whitelist bundle ID in the dashboard.
3. **onOpenURL**: Set up handler to receive OAuth callback and pass it to the SDK.
4. **Provider creation**: Build your own EVM or Solana provider using the exported key and platform libraries.
5. **Wallet Services**: Use the webview-based UI optionally for signing and balances; do not expect native UI.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/ios/
- Dashboard: Client ID, redirect URLs, bundle ID allowlist.
- EVM/Solana libraries: Look up current recommended platform libraries from the docs.
