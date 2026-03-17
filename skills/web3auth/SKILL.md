---
name: web3auth
description: Complete knowledge for integrating MetaMask Embedded Wallets (Web3Auth SDK). Covers SDK selection, platform capabilities (React, Vue, React Native, Android, iOS, Flutter, Unity, Unreal, Node.js), authentication setup (social login, custom JWT, grouped connections), key derivation rules, and troubleshooting. Use whenever the user mentions @web3auth/modal, Web3Auth, MetaMask Embedded Wallets, social login wallets, useWeb3AuthConnect, Sapphire network, embedded wallet integration, or is building an app where users get a crypto wallet through OAuth/social login. Also use for Web3Auth dashboard configuration, client IDs, verifiers/connections, or migrating from PnP/CoreKit/Torus. Do NOT trigger for MetaMask browser extension usage, standalone RainbowKit/ConnectKit setups without Web3Auth, or general blockchain development unrelated to embedded wallet authentication.
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

5. **`get_sdk_reference`** — Fetch SDK source code (types, interfaces, hooks) from the open-source repos.
   - Use for verifying exact type shapes when adapting example code.
   - Use for debugging errors by checking what the SDK actually expects.
   - Use only the released versions on GitHub, or the version you are currently integrating according to the example. Since active development goes on the SDK code on main branch can be related to a future unreleased version.
   - Use for confirming parameter types when docs are ambiguous.
   - **Do NOT use to discover new features or flags.** Many SDK options are internal, legacy, or unnecessary. Examples (`get_example`) show what to actually use.
   - Default call returns type definitions: `get_sdk_reference platform="react"`
   - Targeted: `get_sdk_reference platform="react" module="react-hooks"`
   - Call without `module` first to see available modules for a platform.

### Decision workflow

```
For ALL workflows: first review Key Derivation Rules, Authentication Concepts,
Platform Capability, and Platform Quick Reference for the user's platform.

User asks "which SDK?" or "how do I integrate?"
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
  -> get_doc for the specific pages

User needs to verify a type signature or debug an SDK error
  -> get_sdk_reference for the platform's type definitions
  -> Use a specific module if you know what you need (e.g., "react-hooks")
  -> NEVER use SDK source to discover features — use examples instead
```

---

## Product Overview

MetaMask Embedded Wallets (formerly Web3Auth Plug and Play) provides **non-custodial social login wallets** using Shamir Secret Sharing (SSS).

- Users authenticate with OAuth (Google, Facebook, etc.) or custom JWT. Their private key is derived from multiple key shares — one held by the user's device, one by Web3Auth nodes (further divided by another SSS into a network of nodes distributed globally), and optionally a third or more depending on MFA factors. 
- If no MFA is there, one share is held by Web3Auth nodes, another is stored encrypted on Web3Auth Metadata store via user's unique auth id.
- It is a 2 step shamir secret sharing. No single party (including Web3Auth / MetaMask) holds the full key. It is fully non-custodial.
- The wallet address is deterministic: same user + same config = same wallet every time. Configurations can change keys, better to refer to docs if changing anything.
- Old product names (PnP, Core Kit, Torus) are deprecated. Everything is now "MetaMask Embedded Wallets."

Dashboard: https://dashboard.web3auth.io  
Docs: https://docs.metamask.io/embedded-wallets/  
Community: https://builder.metamask.io/c/embedded-wallets/5

---

## Key Derivation Rules (CRITICAL — memorise these)

**Same wallet address requires ALL of:**
- Same Client ID
- Same Sapphire network (devnet OR mainnet — not both)
- Same connection configuration (same verifier id/ connection id)

**Different any of these = different wallet address forever.**

- NEVER change the Client ID or Sapphire network in production.
- Sapphire Devnet/Mainnet are Web3Auth key-reconstruction networks — completely separate from blockchain devnet/mainnet. Do not confuse them.
- Sapphire Devnet allows localhost. Sapphire Mainnet does NOT allow localhost.
- Always use Devnet for local development. Switch to Mainnet only when deploying.
- Do not use Devnet for production ever, it can cause loss in user wallets.
- Do not use extra flags randomly across integrations, like useSFAKey (earlier useCoreKitKey). This flag was introduced for compatibility with Wallet Pregeneration, causes change in address.

---

## Authentication Concepts

**Connections** (formerly "verifiers"): Configured on the dashboard. Each connection has an Auth Connection ID, a JWT user identifier field (e.g. `sub`, `email`), a JWKS endpoint, and optional validation fields.

**Social logins**: Pre-configured connections for Google, Facebook, Discord, Twitch, Apple, etc. Default are configured for all which use Web3Auth's own social provider. You can add your OAuth app credentials for Google, Facebook, Discord and Twitch. Others are configured via Auth0. Auth0 can be easily configured as well for every social login directly as well. Users using Web3Auth own social providers can access their account on https://accounts.web3auth.io as well.

**Custom connections**: For Firebase, AWS Cognito, or any JWT provider with a JWKS endpoint, compatible with OAuth2. You bring the JWT; Web3Auth validates it.

**Grouped connections** (CRITICAL): Link multiple social login methods so the same user gets the **same wallet address** regardless of how they sign in. Without this, `Google login` and `Email passwordless` produce **different wallets**. Requires compatible user identifier fields across sub-connections. Ideally works in the case of Google + Email Passwordless + Auth0, or grouping 2 separate connections of same social logins, like Google + Google, Discord + Discord etc. It can also work for Custom but you need to make sure the user id is always the same across both individual providers.

**JWT `iat` constraint**: Custom JWT must have an `iat` (issued-at) claim within 60 seconds of current time, regardless of `exp`. Issue a fresh JWT on every login attempt.

---

## Platform Capability

**Shared across all SDKs:** Private key can be reconstructed for EVM (secp256k1) and Solana (ed25519). The curve can be changed for any other blockchain, making integration chain-agnostic — use any standard library for blockchain calls.

### Web SDK (@web3auth/modal)
- Supports social login, external wallets (MetaMask Extension, WalletConnect, Coinbase, etc.), modal UI (can be used without modal as well, with web3auth completely hidden), smart accounts, multi-factor authentication (MFA), session management. Additionally has extra features like wallet UI, funding, walletconnect interoperability (your dapp wallet connected into other dapps supporting walletconnect), server side verification for users etc.
- Everything is done with an iframe embedded within the user's web app. All frontend key management to be totally non custodial.
- Built-in EVM and Solana providers. Chain config via dashboard.
- Most feature-complete SDK. Works in any web framework and vanilla JS. Has sub-SDKs for React and Vue:

#### React Hooks (@web3auth/modal/react)
- Provider built in hooks for easier integration for React, Next.js etc. It has native wagmi integration, helping make calls for EVM chains seamlessly. It also has native Solana Hooks, which help easy implementation for Solana integrations as well.

#### Vue Composables (@web3auth/modal/vue)
- Very similar to React with support for wagmi vue composables and built in solana composables as well. It is the only SDK in the market with such native Vue support for embedded wallets.

### React Native SDK (@web3auth/react-native-sdk) 
- Invisible SDK for Social logins in React Native environment. Generates private key using socials within the frontend itself. No external wallets supported, user has to create their own UI as well. 
- Smart accounts, server side verification and session management are available. Features like MFA, Wallet UI, Funding, Wallet Connect Interoperability, etc are supported via in app browser for security. 
- Dashboard chain configuration is not supported. Built-in EVM and Solana providers included.


### Mobile & Game Engine SDKs (Android, iOS, Flutter, Unity, Unreal Engine)

All mobile and game engine SDKs share a common pattern:

- Invisible SDK for social logins. Generates private key using socials within the frontend. No external wallets supported; developers must create their own UI.
- Server-side verification and session management are available. Features like MFA, Wallet UI, Funding, and WalletConnect Interoperability are supported via in-app browser. Smart accounts are supported via browser transaction functions.
- Dashboard chain configuration is not supported. No built-in providers — must export private key and use platform-native libraries.

### Node SDK (@web3auth/node-sdk) 
- Backend-only SDK. Custom auth only (JWT mandatory — no social login UI). Stateless per-request key derivation.
- Smart accounts and server side verification are available. MFA, Wallet UI, Funding, WalletConnect Interoperability are not supported (backend integration).
- Dashboard chain configuration supported. Built-in EVM and Solana providers included.
- Custodial to the dApp, non-custodial to Web3Auth — key reconstruction happens on dApp backend.

### SDK Recommendation Logic

**Choose React** when: Building React / Next.js / Vite web apps. Best DX, Wagmi support, full feature set.

**Choose Vue** when: Building Vue / Nuxt apps. Same feature set as React via composables.

**Choose JavaScript** when: Building Angular, Svelte, vanilla JS, or any web framework without a dedicated SDK. Same core, no wrappers.

**Choose React Native** when: Building cross-platform mobile with Expo or bare React Native. Has built-in EVM/Solana providers unlike native mobile SDKs.

**Choose Android / iOS / Flutter** when: Building native mobile. No built-in blockchain provider — you must export the private key and use a platform-specific library (web3j, ethers-swift, web3dart, etc.).

**Choose Unity** when: Building a game with C#. No built-in provider; export private key and use a Unity-compatible blockchain library.

**Choose Unreal** when: Building a game with C++/Blueprints. SDK is under the MetaMask org (not Web3Auth). Same pattern: export key, use Unreal library.

**Choose Node.js** when: Server-side wallet operations, AI agents, backend custody. Custom auth only (no social login UI). Stateless per-request key derivation.

---

## Setup Flow

1. Create project at dashboard.web3auth.io → get Client ID.
2. Choose environment: **Sapphire Devnet** (testing, localhost allowed) or **Sapphire Mainnet** (production, no localhost).
3. Allowlist domains/URLs for web; bundle identifiers + deep link schemes for mobile.
4. Configure chains (EVM/Solana) with RPC endpoints on dashboard itself (free Infura available for supported chains on dashboard). Android, iOS, React Native, Flutter, Unity, Unreal Engine: configure chain and RPC URLs manually in code.
5. Set up authentication: default social logins or custom connections.
6. Optional: session management duration, test accounts, key export toggle, whitelabel/branding.

---

## Platform Quick Reference

Platform-specific setup notes, gotchas, and configuration steps. Always read the relevant section before generating integration code — each platform has unique polyfill, deep-link, or provider requirements that cause failures if missed.

### React / Next.js / Vite

- Provider-based architecture. All hooks must be within the provider tree. Never put the provider in a Next.js server component.
- Two modes: Modal (pre-built UI) and No-Modal (headless). The `useWeb3AuthConnect` hook can define that.
- Vite: needs `buffer` and `process` polyfills + `define: { global: globalThis }` in `vite.config.ts`. Read the Vite troubleshooting doc and refer to the example before configuring.
- Next.js App Router: provider must be in a `"use client"` component.
- Env var prefix: `VITE_` for Vite, `NEXT_PUBLIC_` for Next.js.
- Do not use generic Wagmi hooks for Web3Auth state — use the dedicated Web3Auth Wagmi hooks for `isConnected`, `address`, etc.

### Vue / Nuxt

- Composables-based API. Must be called inside `setup()` or `<script setup>`.
- Two modes: Modal (pre-built UI) and No-Modal (headless). The `useWeb3AuthConnect` composable can define that.
- Needs `buffer` and `process` polyfills in `vue.config.js`. Read the Vue troubleshooting doc and refer to the example before configuring.
- Nuxt: add `ssr: false` to the plugin. Load a client-only plugin to polyfill Buffer/process.
- Do not use generic Wagmi composables for Web3Auth state — use the dedicated Web3Auth Wagmi composables.

### JavaScript (Angular / Svelte / Vanilla)

- Direct instantiation, no hooks/composables. Initialize before calling connect.
- Angular: polyfill in `tsconfig` paths + dedicated `polyfills.ts`.
- Every bundler needs `define global` set correctly.
- Read the polyfill troubleshooting doc and refer to the example before configuring.

### React Native (Bare / Expo)

- Deep link URL scheme must match exactly between app config and dashboard allowlist.
- Has built-in EVM and Solana providers (unlike native mobile SDKs).
- Configure deep links in both `Info.plist` (iOS) and `AndroidManifest.xml` (Android).
- Allowlist both bundle identifier (iOS) and package name (Android) in dashboard.
- Expo Go does not support the required Web3Auth polyfills. Use a Custom Dev Client or EAS build.
- Import order is critical: polyfills and `react-native-get-random-values` must come before any app code in the entry point.
- Metro bundler polyfill configuration is entirely different from Vite or Webpack. Read the React Native Metro troubleshooting doc and refer to the example.

### Android (Kotlin)

- No built-in providers. After login: `web3Auth.getPrivKey()`, then use web3j or similar.
- Configure deep link in `AndroidManifest.xml`. Allowlist package name in dashboard.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

### iOS (Swift)

- No built-in providers. After login: `web3Auth.getPrivKey()`, then use web3swift or similar.
- Configure URL scheme in `Info.plist`. Set up `onOpenURL` handler for OAuth callback.
- Allowlist bundle identifier in dashboard.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

### Flutter (Dart)

- No built-in providers. After login: `web3auth.getPrivKey()`, then use web3dart or similar.
- Configure deep links in both `Info.plist` (iOS) and `AndroidManifest.xml` (Android).
- Allowlist both bundle identifier (iOS) and package name (Android) in dashboard.
- Install via `flutter pub add`, not npm.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

### Unity (C#)

- No built-in providers. Export private key after login; use a Unity-compatible EVM library.
- Configure deep link scheme for OAuth. Allowlist bundle ID and scheme in dashboard.
- Wallet Services UI is webview-based, not a native Unity component.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

### Unreal Engine (C++/Blueprints)

- SDK is under the **MetaMask** org on GitHub (not Web3Auth).
- No built-in providers. Export private key after login; use an Unreal-compatible library.
- Configure deep link. Allowlist bundle ID and scheme in dashboard.
- Wallet Services UI is webview-based, not a native Unreal component.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

### Node.js

- Server-side only. No UI. Custom auth only (no social login).
- Each request reconstructs the key from the JWT — stateless by design.
- Use built-in EVM and Solana providers for signing. Export key for other chains.
- Dashboard chain configuration is supported. Configure chains on dashboard as usual.
- Create a separate project on dashboard to avoid mixing server-side and client-side keys.
- Best for: AI agents, server-side custody, automated transactions.

---

## Private Key Export

- Controlled by a dashboard toggle (Key Export Settings).
- Even when export is disabled, the built-in providers (Web, React Native, Node.js) can still sign transactions, just not export keys.
- For platforms without built-in providers (Android, iOS, Flutter, Unity, Unreal), key export is the ONLY way to interact with blockchains, hence this function doesn't work in those platforms.

## Wallet Pregeneration

- Uses `useCoreKitKey`/`useSFAKey` flag. Requires custom authentication.
- WARNING: Toggling this flag in production changes ALL user wallet addresses.
- Use case: airdrops, pre-generating wallets before users log in.

## Server-Side Verification

Server-side verification enables developers to securely authenticate users on the backend by validating the ownership of a wallet address. This process involves the use of a JSON Web Token (JWT) issued upon user authentication, which contains claims about the end user, including proof of ownership over a wallet public address.

Upon a user's successful connection of their wallet, Web3Auth generates a JWT, signed with a private key using the ES256 algorithm, that is unique to your application. This token serves as a verifiable credential that you can use to authenticate the user on your backend.

---

## Additional Resources

- Docs: https://docs.metamask.io/embedded-wallets/
- Dashboard: https://dashboard.web3auth.io
- Community (Builder Hub): https://builder.metamask.io/c/embedded-wallets/5
- Examples: https://github.com/Web3Auth/web3auth-examples
