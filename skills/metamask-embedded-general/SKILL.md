---
name: metamask-embedded-general
description: General knowledge for integrating MetaMask Embedded Wallets (Web3Auth). Covers product overview, dashboard setup, authentication concepts, key derivation rules, and cross-platform feature availability. Use when the user asks about Web3Auth, MetaMask Embedded Wallets, or needs help choosing an SDK or understanding concepts.
---

# MetaMask Embedded Wallets — General Knowledge

General knowledge for integrating MetaMask Embedded Wallets (Web3Auth). Search the docs via MCP, llms.txt, or @docs before writing implementation. Do not guess package names or code—look them up.

---

## Product Overview

- MetaMask Embedded Wallets (formerly Web3Auth Plug and Play) provides non-custodial social login wallets using Shamir Secret Sharing.
- Uses OAuth 2.0 details from social logins to generate a non-custodial wallet.
- Users maintain full control of their keys. No single party (including Web3Auth) can access the full key.
- Older product names (PnP, Core Kit) are deprecated. Everything is now "Embedded Wallets."

---

## Dashboard Setup Flow

1. Create project at dashboard.web3auth.io → get Client ID.
2. Choose environment: Sapphire Devnet (testing, localhost allowed) or Sapphire Mainnet (production, NO localhost).
3. Allowlist domains/URLs for web, bundle identifiers + deep link schemes for mobile.
4. Configure chains (EVM/Solana) with free Infura RPC for supported chains.
5. Set up authentication: default social logins or custom connections.
6. Optional: session management, test accounts, key export toggle, wallet UI branding.

---

## Authentication Concepts

**Connections** (new term, replaces "verifiers"): Configured on dashboard with Auth Connection ID, JWT user identifier field, JWKS endpoint, and validation fields.

**Social logins**: Pre-configured (Google, Facebook, Discord, Twitch, etc.)—add your OAuth credentials.

**Custom connections**: For Auth0, Firebase, AWS Cognito, or any JWT provider with JWKS.

**Grouped connections**: CRITICAL feature—link multiple login methods to a single wallet address. Without this, Google login and email login produce DIFFERENT wallets. Requires compatible user identifier fields across sub-connections.

---

## Key Derivation Rules (CRITICAL)

Same wallet address requires ALL of:

- Same Client ID
- Same Sapphire network (devnet or mainnet)
- Same connection configuration

Different any of these = different wallet address. NEVER change client ID or network in production.

---

## Platform Capability Matrix

| Platform | Social Login | External Wallets | Modal UI | Built-in EVM/Solana | Key Export |
|----------|--------------|------------------|----------|---------------------|------------|
| Web (React/Vue/JS) | Yes | Yes | Yes | Yes | Dashboard-controlled |
| React Native | Yes | No | No | Yes | Dashboard-controlled |
| Android / iOS / Flutter | Yes | No | No | No | Required for chains |
| Unity / Unreal | Yes | No | No | No | Required for chains |
| Node.js | No (custom auth only) | No | No | Yes | Available |

**Web**: Full features—social login, external wallets, modal UI, built-in EVM/Solana providers, Wagmi support (React only), smart accounts, dashboard chain config.

**React Native**: Social login, built-in EVM/Solana providers, webview wallet UI. NO external wallets, NO modal UI.

**Android / iOS / Flutter**: Social login, webview wallet UI. NO providers—must export private key.

**Unity / Unreal**: Social login, webview wallet UI. NO providers—must export private key.

**Node.js**: Server-side only. Custom auth only. Built-in EVM/Solana providers. NO UI. Niche use case.

---

## Private Key Export

- Dashboard setting controls whether programmatic export is allowed.
- Even if export is disabled, built-in providers (web, RN, Node) can still sign transactions.
- For platforms without built-in providers (Android, iOS, Flutter, Unity, Unreal), key export is the only way to interact with blockchains.

---

## Wallet Pregeneration (Legacy)

- Legacy Core Kit feature. Uses useCoreKitKey/useSFAKey flag.
- WARNING: Toggling this flag in production changes ALL user wallet addresses.
- Requires custom authentication.
- Useful for airdrops where wallets need to be pre-generated.

---

## Community Support

- Builder Hub: https://builder.metamask.io/c/embedded-wallets/5
- User Account Dashboard: https://account.web3auth.io

---

## Additional Resources

- Official docs: https://docs.metamask.io/embedded-wallets/
- Dashboard: dashboard.web3auth.io
- Platform-specific SDK skills: Use the appropriate SDK skill (React, Vue, Node, Unity, Unreal, etc.) for implementation details.
