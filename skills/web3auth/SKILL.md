---
name: web3auth
description: Complete knowledge for integrating MetaMask Embedded Wallets (Web3Auth). Covers SDK selection, platform capabilities, authentication setup, key rules, and troubleshooting. Use when the user mentions Web3Auth, MetaMask Embedded Wallets, social login wallets, embedded wallet, DynamicContextProvider, wallet connection, wagmi web3auth, or is building with blockchain wallet integration.
---

# MetaMask Embedded Wallets (Web3Auth) — Complete Guide

Before writing any code, always use the MCP tools to fetch live docs and real examples. Do not guess package names, API signatures, or configuration.

---

## MCP Tool Usage

Use these tools in this order:

1. **`search_docs`** — Find relevant documentation pages and example projects.
   - SDK questions → `search_docs query="react SDK quick start"`
   - Feature questions → `search_docs query="grouped connections custom auth"`
   - With filters → `search_docs query="solana" platform="react" chain="solana"`

2. **`get_doc`** — Read the full content of a doc page returned by `search_docs`.
   - Always read the SDK doc for the user's platform before generating code.
   - Read troubleshooting pages when a user reports an error.

3. **`get_example`** — Fetch complete source code of the best matching example.
   - Always fetch a quick-start example before generating integration code.
   - Fetch the exact auth-method example when custom auth is involved.
   - Example: `get_example platform="react" category="quick-start"`
   - Example: `get_example name="React Firebase" auth_method="firebase"`

4. **`search_community`** — Search the MetaMask Builder Hub for real user issues.
   - Always search the community when the user reports an error or unexpected behavior.
   - Use `topic_id` to read the full thread when you find a relevant topic.
   - Example: `search_community query="popup blocked safari iOS"`
   - Example: `search_community topic_id=2751`

### Decision workflow

```
User asks "which SDK?" or "how do I integrate?"
  -> Check Platform Capability Matrix below
  -> search_docs for the SDK doc page
  -> get_doc to read the full SDK page
  -> get_example for the matching quick-start
  -> Build from the example, guided by the doc

User asks about a specific feature (custom auth, Wagmi, Solana, etc.)
  -> search_docs with feature keywords
  -> get_doc for the feature page
  -> get_example with matching auth_method or category

User reports an error or unexpected behavior
  -> search_community with the error message / symptom
  -> Read relevant topics with topic_id
  -> search_docs for troubleshooting pages
  -> get_doc for the specific troubleshooting page
```

---

## Product Overview

MetaMask Embedded Wallets (formerly Web3Auth Plug and Play) provides **non-custodial social login wallets** using Shamir Secret Sharing (SSS).

- Users authenticate with OAuth (Google, Facebook, etc.) or custom JWT. Their private key is derived from multiple key shares — one held by the user's device, one by Web3Auth nodes, and optionally a third.
- No single party (including Web3Auth / MetaMask) holds the full key. It is fully non-custodial.
- The wallet address is deterministic: same user + same config = same wallet every time.
- Old product names (PnP, Core Kit, Torus) are deprecated. Everything is now "Embedded Wallets."

Dashboard: https://dashboard.web3auth.io  
Docs: https://docs.metamask.io/embedded-wallets/  
Community: https://builder.metamask.io/c/embedded-wallets/5

---

## Key Derivation Rules (CRITICAL — memorise these)

**Same wallet address requires ALL of:**
- Same Client ID
- Same Sapphire network (devnet OR mainnet — not both)
- Same connection configuration (same verifier / connection)

**Different any of these = different wallet address forever.**

- NEVER change the Client ID or Sapphire network in production.
- Sapphire Devnet allows localhost. Sapphire Mainnet does NOT allow localhost.
- Always use Devnet for local development. Switch to Mainnet only when deploying.

---

## Authentication Concepts

**Connections** (formerly "verifiers"): Configured on the dashboard. Each connection has an Auth Connection ID, a JWT user identifier field (e.g. `sub`, `email`), a JWKS endpoint, and optional validation fields.

**Social logins**: Pre-configured connections for Google, Facebook, Discord, Twitch, Apple, etc. Add your OAuth app credentials.

**Custom connections**: For Auth0, Firebase, AWS Cognito, or any JWT provider with a JWKS endpoint. You bring the JWT; Web3Auth validates it.

**Grouped connections** (CRITICAL): Link multiple login methods so the same user gets the **same wallet address** regardless of how they sign in. Without this, `Google login` and `Email passwordless` produce **different wallets**. Requires compatible user identifier fields across sub-connections.

**JWT `iat` constraint**: Custom JWT must have an `iat` (issued-at) claim within 60 seconds of current time, regardless of `exp`. Issue a fresh JWT on every login attempt.

---

## Platform Capability Matrix

| Platform | Social Login | External Wallets | Modal UI | Built-in EVM Provider | Built-in Solana Provider | Wagmi Support | Smart Accounts | MFA | Session Mgmt | Dashboard Chain Config |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **React** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Vue** | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| **JavaScript** | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| **React Native** | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| **Android** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| **iOS** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| **Flutter** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| **Unity** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| **Unreal** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| **Node.js** | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |

### SDK Recommendation Logic

**Choose React** when: Building React / Next.js / Vite web apps. Best DX, Wagmi support, full feature set.

**Choose Vue** when: Building Vue / Nuxt apps. Same feature set as React via composables.

**Choose JavaScript** when: Building Angular, Svelte, vanilla JS, or any web framework without a dedicated SDK. Same core, no wrappers.

**Choose React Native** when: Building cross-platform mobile with Expo or bare React Native. Has built-in EVM/Solana providers unlike native mobile SDKs.

**Choose Android / iOS / Flutter** when: Building native mobile. No built-in blockchain provider — you must export the private key and use a platform-specific library (web3j, ethers-swift, web3dart, etc.).

**Choose Unity** when: Building a game with C#. No built-in provider; export private key and use a Unity-compatible blockchain library.

**Choose Unreal** when: Building a game with C++/Blueprints. SDK is under the MetaMask org (not Web3Auth). Same pattern: export key, use Unreal library.

**Choose Node.js** when: Server-side wallet operations, AI agents, backend custody. Custom auth only (no social login UI). Stateless per-request key derivation.

### Warnings to always raise

- If platform has no built-in provider (Android, iOS, Flutter, Unity, Unreal): *"This platform has no built-in EVM/Solana provider. After login, export the private key and use a platform-native library to interact with the blockchain."*
- If platform lacks external wallets (everything except web): *"External wallet aggregation (MetaMask extension, WalletConnect, Coinbase) is only available on web SDK platforms."*
- If platform lacks dashboard chain config (Android, iOS, Flutter, Unity, Unreal, React Native): *"Dashboard chain configuration is not supported on this platform. You must copy RPC endpoint URLs manually."*
- If `chain = "other"` (non-EVM, non-Solana): *"For chains beyond EVM and Solana, always export the private key and use a chain-specific library."*

---

## Dashboard Setup Flow

1. Create project at dashboard.web3auth.io → get Client ID.
2. Choose environment: **Sapphire Devnet** (testing, localhost allowed) or **Sapphire Mainnet** (production, no localhost).
3. Allowlist domains/URLs for web; bundle identifiers + deep link schemes for mobile.
4. Configure chains (EVM/Solana) with RPC endpoints (free Infura available for supported chains). Android and mobile non-web platforms: copy RPC URLs manually.
5. Set up authentication: default social logins or custom connections.
6. Optional: session management duration, test accounts, key export toggle, whitelabel/branding.

---

## Common Misunderstandings

| Issue | Reality |
|-------|---------|
| "Different client IDs are fine for same user" | Different client IDs = different wallet address forever. Use the same client ID across all environments. |
| "Devnet and Mainnet share wallets" | Devnet and Mainnet wallets are completely separate. Never mix them. |
| "I can use localhost with Mainnet" | Mainnet does NOT allow localhost. Use Devnet for local development. |
| "Google login and email passwordless give same wallet" | They produce DIFFERENT wallets unless Grouped Connections are configured on the dashboard. |
| "Use generic Wagmi hooks for Web3Auth state" | Use the dedicated Web3Auth Wagmi hooks for `isConnected`, `address`, etc. Generic Wagmi hooks miss Web3Auth-specific state. |
| "JWT `exp` controls when it can be used" | The `iat` (issued-at) must be within 60 seconds of current time, regardless of `exp`. Issue fresh JWTs on every login. |
| "Session management stores keys server-side" | The SDK encrypts and stores the key locally (device storage). Duration is configurable in the dashboard. |
| "Expo Go supports Web3Auth" | Expo Go does NOT support the required polyfills. Use a Custom Dev Client or EAS build. |
| "React Native uses Webpack/Vite polyfills" | React Native uses Metro bundler. Its polyfill config is completely different from Vite or Webpack. |
| "Mobile/game SDKs have built-in providers" | Android, iOS, Flutter, Unity, and Unreal have NO built-in EVM/Solana provider. You must export the private key. |
| "Android supports dashboard chain config" | Android SDK does NOT support dashboard chain configuration. Copy RPC endpoints manually. |
| "Unreal SDK is under Web3Auth org" | The Unreal SDK repo is under the MetaMask org on GitHub, not Web3Auth. |
| "Node.js SDK supports social login" | Node.js SDK only supports custom authentication. No social login UI. |
| "toggling useCoreKitKey/useSFAKey is safe in production" | Toggling this flag changes ALL existing user wallet addresses. Never do this in production. |

---

## Platform Quick Reference

### React / Next.js / Vite
- Provider-based architecture. All hooks must be within the provider tree. Never put the provider in a Next.js server component.
- Two modes: Modal (pre-built UI) and No-Modal (headless, build your own).
- Vite: needs `buffer` and `process` polyfills + `define: { global: globalThis }` in `vite.config.ts`.
- Next.js App Router: provider must be in a `"use client"` component.
- Env var prefix: `VITE_` for Vite, `NEXT_PUBLIC_` for Next.js.

### Vue / Nuxt
- Composables-based API. Must be called inside `setup()` or `<script setup>`.
- Nuxt: add `ssr: false` to the plugin. Load a client-only plugin to polyfill Buffer/process.

### JavaScript (Angular / Svelte / Vanilla)
- Direct instantiation, no hooks/composables. Initialize before calling connect.
- Angular: polyfill in `tsconfig` paths + dedicated `polyfills.ts`.
- Every bundler needs `define global` set correctly.

### React Native (Bare / Expo)
- **Expo Go will not work.** Must use Custom Dev Client or EAS build.
- Metro polyfills differ entirely from Vite/Webpack: configure `extraNodeModules` in `metro.config.js`.
- Import order is critical: polyfills and `react-native-get-random-values` must come before any app code in the entry point.
- Deep link URL scheme must match exactly between app config and dashboard allowlist.
- Has built-in EVM and Solana providers (unlike native mobile SDKs).

### Android (Kotlin)
- No built-in providers. After login: `web3Auth.getPrivKey()`, then use web3j or similar.
- Configure deep link in `AndroidManifest.xml`. Allowlist package name in dashboard.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

### iOS (Swift)
- No built-in providers. After login: `web3Auth.getPrivKey()`, then use web3swift or similar.
- Configure URL scheme in `Info.plist`. Set up `onOpenURL` handler for OAuth callback.
- Allowlist bundle identifier in dashboard.

### Flutter (Dart)
- No built-in providers. After login: `web3auth.getPrivKey()`, then use web3dart or similar.
- Configure deep links in both `Info.plist` (iOS) and `AndroidManifest.xml` (Android).
- Allowlist both bundle identifier (iOS) and package name (Android) in dashboard.
- Install via `flutter pub add`, not npm.

### Unity (C#)
- No built-in providers. Export private key after login, use a Unity-compatible EVM library.
- Configure deep link scheme for OAuth. Allowlist bundle ID and scheme in dashboard.
- Wallet Services UI is webview-based, not a native Unity component.

### Unreal Engine (C++/Blueprints)
- SDK is under **MetaMask** org on GitHub (not Web3Auth).
- No built-in providers. Export private key after login, use Unreal-compatible library.
- Configure deep link. Allowlist bundle ID and scheme in dashboard.

### Node.js
- Server-side only. No UI. Custom auth only (no social login).
- Each request reconstructs the key from the JWT — stateless by design.
- Use built-in EVM and Solana providers for signing. Export key for other chains.
- Best for: AI agents, server-side custody, automated transactions.

---

## Private Key Export

- Controlled by a dashboard toggle (Key Export Settings).
- Even when export is disabled, the built-in providers (web, React Native, Node.js) can still sign transactions.
- For platforms without built-in providers (Android, iOS, Flutter, Unity, Unreal), key export is the ONLY way to interact with blockchains.

## Wallet Pregeneration (Legacy)

- Uses `useCoreKitKey`/`useSFAKey` flag. Requires custom authentication.
- WARNING: Toggling this flag in production changes ALL user wallet addresses.
- Use case: airdrops, pre-generating wallets before users log in.

---

## Additional Resources

- Docs: https://docs.metamask.io/embedded-wallets/
- Dashboard: https://dashboard.web3auth.io
- User account portal: https://account.web3auth.io
- Community (Builder Hub): https://builder.metamask.io/c/embedded-wallets/5
- Examples: https://github.com/Web3Auth/web3auth-examples
