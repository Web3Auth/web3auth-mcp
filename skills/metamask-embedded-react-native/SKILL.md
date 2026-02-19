---
name: metamask-embedded-react-native
description: Integrate MetaMask Embedded Wallets (Web3Auth) React Native SDK with correct polyfill setup, deep linking, and provider usage. Use when building React Native or Expo apps with Web3Auth embedded wallets or social login.
---

# MetaMask Embedded Wallets — React Native SDK

Integrate MetaMask Embedded Wallets (Web3Auth) in React Native and Expo applications. Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Architecture

**Built-in providers**: EVM and Solana providers are included (unlike Android, iOS, or Flutter SDKs).

**Wallet Services UI**: Webview-based, not a native modal.

**Integration scope**: Social login only. No external wallet aggregation.

**Two project types**: Bare React Native and Expo. Expo requires prebuild—Expo Go is not supported.

---

## Framework Considerations

### Bare React Native
- Configure Metro bundler with polyfills for buffer, process, crypto, and streams.
- Use shims for unused Node modules as documented.
- Create a globals file to set global.Buffer, global.process, and global.location.
- Import order is critical: globals and the required random-values polyfill must be imported before any app code in the entry point.

### Expo
- Must use Custom Dev Client or EAS builds. Expo Go does NOT support polyfills.
- Create metro.config.js with polyfill configuration.
- Same globals file and import order rules apply as bare RN.

### Deep Linking
- URL scheme must be registered in the app config.
- The same scheme must be whitelisted in the Web3Auth dashboard.
- Redirect URL must match exactly between app config and dashboard allowlist.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| Expo Go | Does NOT support polyfills. Must use expo prebuild with Custom Dev Client or EAS. |
| Metro polyfills | Polyfill config differs from Vite/Webpack—uses extraNodeModules in resolver. |
| Client ID | Different client IDs yield different wallets. Same devnet/mainnet rules apply as web SDKs. |
| Login modal | No pre-built login modal like web. Build your own UI around the SDK. |
| Deep link | Redirect URL must match exactly between app config and dashboard allowlist. |

---

## Patterns

1. **Import order**: Globals and the required random-values polyfill must be first in the entry point, before any app code.
2. **Polyfills**: Use the correct Metro resolver config; do not copy Vite or Webpack polyfill patterns.
3. **Deep linking**: Register scheme in app config and whitelist in dashboard; both must align.
4. **Providers**: Use built-in EVM and Solana providers for signing; no need to export keys for basic flows.
5. **Wallet Services**: Optional webview-based UI for transactions and balances; not a native modal.

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/sdk/react-native/
- Dashboard: Client ID, redirect URLs, chain configuration.
- Troubleshooting: Metro polyfills, Expo prebuild, deep link failures.
