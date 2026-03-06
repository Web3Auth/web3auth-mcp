# Platform Quick Reference

Platform-specific notes for Web3Auth / MetaMask Embedded Wallets integration. Read this when you need platform-specific configuration details, gotchas, or setup steps.

---

## React / Next.js / Vite

- Provider-based architecture. All hooks must be within the provider tree. Never put the provider in a Next.js server component.
- Two modes: Modal (pre-built UI) and No-Modal (headless, build your own), the useWeb3AuthConnect hook can define that.
- Vite: needs `buffer` and `process` polyfills + `define: { global: globalThis }` in `vite.config.ts`. Before integration make sure to read the troubleshooting for Vite issues and refer to example to configure it properly.
- Next.js App Router: provider must be in a `"use client"` component.
- Env var prefix: `VITE_` for Vite, `NEXT_PUBLIC_` for Next.js.
- Do not use generic Wagmi hooks for Web3Auth state. Use the dedicated Web3Auth Wagmi hooks for `isConnected`, `address`, etc., since generic Wagmi hooks miss Web3Auth-specific state.

## Vue / Nuxt

- Composables-based API. Must be called inside `setup()` or `<script setup>`.
- Two modes: Modal (pre-built UI) and No-Modal (headless, build your own), the useWeb3AuthConnect composable can define that.
- Needs `buffer` and `process` polyfills in `vue.config.js`. Before integration make sure to read the troubleshooting for Vue issues and refer to example to configure it properly.
- Nuxt: add `ssr: false` to the plugin. Load a client-only plugin to polyfill Buffer/process.
- Do not use generic Wagmi composables for Web3Auth state. Use the dedicated Web3Auth Wagmi composables for `isConnected`, `address`, etc., since generic Wagmi composables miss Web3Auth-specific state.

## JavaScript (Angular / Svelte / Vanilla)

- Direct instantiation, no hooks/composables. Initialize before calling connect.
- Angular: polyfill in `tsconfig` paths + dedicated `polyfills.ts`.
- Every bundler needs `define global` set correctly.
- Before integration make sure to read the troubleshooting for polyfill issues and refer to example to configure it properly.

## React Native (Bare / Expo)

- Deep link URL scheme must match exactly between app config and dashboard allowlist.
- Has built-in EVM and Solana providers (unlike native mobile SDKs).
- Configure deep links in both `Info.plist` (iOS) and `AndroidManifest.xml` (Android).
- Allowlist both bundle identifier (iOS) and package name (Android) in dashboard.
- Expo Go does not support the required Web3Auth polyfills. Use a Custom Dev Client or EAS build.
- Import order is critical: polyfills and `react-native-get-random-values` must come before any app code in the entry point.
- React Native uses Metro bundler and its polyfill configuration is entirely different from Vite or Webpack. Before integration make sure to read the troubleshooting for React Native metro bundler and refer to example to configure it properly.

## Android (Kotlin)

- No built-in providers. After login: `web3Auth.getPrivKey()`, then use web3j or similar.
- Configure deep link in `AndroidManifest.xml`. Allowlist package name in dashboard.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

## iOS (Swift)

- No built-in providers. After login: `web3Auth.getPrivKey()`, then use web3swift or similar.
- Configure URL scheme in `Info.plist`. Set up `onOpenURL` handler for OAuth callback.
- Allowlist bundle identifier in dashboard.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

## Flutter (Dart)

- No built-in providers. After login: `web3auth.getPrivKey()`, then use web3dart or similar.
- Configure deep links in both `Info.plist` (iOS) and `AndroidManifest.xml` (Android).
- Allowlist both bundle identifier (iOS) and package name (Android) in dashboard.
- Install via `flutter pub add`, not npm.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

## Unity (C#)

- No built-in providers. Export private key after login, use a Unity-compatible EVM library.
- Configure deep link scheme for OAuth. Allowlist bundle ID and scheme in dashboard.
- Wallet Services UI is webview-based, not a native Unity component.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

## Unreal Engine (C++/Blueprints)

- SDK is under **MetaMask** org on GitHub (not Web3Auth).
- No built-in providers. Export private key after login, use Unreal-compatible library.
- Configure deep link. Allowlist bundle ID and scheme in dashboard.
- Wallet Services UI is webview-based, not a native Unreal component.
- Dashboard chain configuration NOT supported. Copy RPC URLs manually.

## Node.js

- Server-side only. No UI. Custom auth only (no social login).
- Each request reconstructs the key from the JWT — stateless by design.
- Use built-in EVM and Solana providers for signing. Export key for other chains. By default key export function is not directly exposed and can be turned off from dashboard.
- Ideally one should create a totally separate project on dashboard for this so that user keys are not compromised in any way.
- Best for: AI agents, server-side custody, automated transactions.
