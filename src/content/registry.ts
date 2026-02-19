import type { Platform, Chain } from "./platform-matrix.js";

export interface DocEntry {
  title: string;
  url: string;
  category: string;
  keywords: string[];
}

export interface ExampleEntry {
  name: string;
  repo: string;
  owner: string;
  path: string;
  platform: Platform;
  category: "quick-start" | "custom-auth" | "blockchain" | "feature" | "playground";
  chain?: Chain;
  authMethod?: string;
  description: string;
  priority: number; // lower = recommended first
}

// ── Documentation Registry ──────────────────────────────────────────────

export const DOC_REGISTRY: DocEntry[] = [
  // Overview
  { title: "What are Embedded Wallets?", url: "https://docs.metamask.io/embedded-wallets/", category: "overview", keywords: ["overview", "introduction", "what", "embedded wallets", "web3auth"] },
  { title: "How it Works (SSS, Key Management)", url: "https://docs.metamask.io/embedded-wallets/how-it-works/", category: "overview", keywords: ["how", "sss", "shamir", "key", "non-custodial", "architecture"] },

  // SDK Docs
  { title: "React SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/react/", category: "sdk", keywords: ["react", "hooks", "web", "wagmi", "modal", "no-modal"] },
  { title: "Vue SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/vue/", category: "sdk", keywords: ["vue", "composables", "web", "nuxt"] },
  { title: "JavaScript SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/js/", category: "sdk", keywords: ["javascript", "js", "vanilla", "angular", "svelte", "web"] },
  { title: "Node.js SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/node/", category: "sdk", keywords: ["node", "nodejs", "server", "backend", "server-side"] },
  { title: "Android SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/android/", category: "sdk", keywords: ["android", "kotlin", "mobile"] },
  { title: "iOS SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/ios/", category: "sdk", keywords: ["ios", "swift", "apple", "mobile"] },
  { title: "React Native SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/react-native/", category: "sdk", keywords: ["react native", "rn", "expo", "mobile"] },
  { title: "Flutter SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/flutter/", category: "sdk", keywords: ["flutter", "dart", "mobile", "cross-platform"] },
  { title: "Unity SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/unity/", category: "sdk", keywords: ["unity", "game", "c#", "csharp"] },
  { title: "Unreal Engine SDK", url: "https://docs.metamask.io/embedded-wallets/sdk/unreal/", category: "sdk", keywords: ["unreal", "game", "c++", "blueprints"] },

  // Dashboard
  { title: "Dashboard Overview", url: "https://docs.metamask.io/embedded-wallets/dashboard/", category: "dashboard", keywords: ["dashboard", "setup", "project", "client id"] },
  { title: "Project Settings", url: "https://docs.metamask.io/embedded-wallets/dashboard/project-settings/", category: "dashboard", keywords: ["project", "settings", "client id", "client secret", "environment", "sapphire", "devnet", "mainnet"] },
  { title: "Allowlist", url: "https://docs.metamask.io/embedded-wallets/dashboard/allowlist/", category: "dashboard", keywords: ["allowlist", "domain", "whitelist", "cors", "bundle identifier", "deep link"] },
  { title: "Session Management", url: "https://docs.metamask.io/embedded-wallets/dashboard/advanced/session-management/", category: "dashboard", keywords: ["session", "duration", "persist", "login"] },
  { title: "Test Accounts", url: "https://docs.metamask.io/embedded-wallets/dashboard/advanced/test-accounts/", category: "dashboard", keywords: ["test", "otp", "testing", "static otp"] },
  { title: "User Details in ID Token", url: "https://docs.metamask.io/embedded-wallets/dashboard/advanced/user-details/", category: "dashboard", keywords: ["user", "details", "id token", "pii", "jwt"] },
  { title: "Key Export Settings", url: "https://docs.metamask.io/embedded-wallets/dashboard/advanced/key-export/", category: "dashboard", keywords: ["key export", "private key", "enable", "disable"] },
  { title: "Chains and Networks", url: "https://docs.metamask.io/embedded-wallets/dashboard/chains-and-networks/", category: "dashboard", keywords: ["chains", "networks", "rpc", "evm", "solana", "infura"] },
  { title: "Authentication Settings", url: "https://docs.metamask.io/embedded-wallets/dashboard/authentication/", category: "dashboard", keywords: ["authentication", "connections", "verifier", "custom auth"] },
  { title: "Wallet Services", url: "https://docs.metamask.io/embedded-wallets/dashboard/wallet-services/", category: "dashboard", keywords: ["wallet", "services", "ui", "portfolio", "buy", "swap", "send"] },
  { title: "Customization & Branding", url: "https://docs.metamask.io/embedded-wallets/dashboard/customization/", category: "dashboard", keywords: ["customization", "branding", "whitelabel", "logo", "theme", "colors"] },
  { title: "Analytics", url: "https://docs.metamask.io/embedded-wallets/dashboard/analytics/", category: "dashboard", keywords: ["analytics", "usage", "metrics", "users"] },

  // Authentication
  { title: "Authentication Overview", url: "https://docs.metamask.io/embedded-wallets/authentication/", category: "auth", keywords: ["authentication", "login", "social", "custom"] },
  { title: "Grouped Connections", url: "https://docs.metamask.io/embedded-wallets/authentication/group-connections/", category: "auth", keywords: ["grouped", "connections", "aggregate", "verifier", "same wallet", "multiple logins"] },
  { title: "Custom JWT", url: "https://docs.metamask.io/embedded-wallets/authentication/custom-connections/custom-jwt/", category: "auth", keywords: ["custom jwt", "jwks", "jwt", "custom auth", "connection"] },
  { title: "Google Login", url: "https://docs.metamask.io/embedded-wallets/authentication/social-logins/google/", category: "auth", keywords: ["google", "social", "oauth"] },
  { title: "Facebook Login", url: "https://docs.metamask.io/embedded-wallets/authentication/social-logins/facebook/", category: "auth", keywords: ["facebook", "social", "oauth"] },
  { title: "Twitch Login", url: "https://docs.metamask.io/embedded-wallets/authentication/social-logins/twitch/", category: "auth", keywords: ["twitch", "social", "oauth"] },
  { title: "Discord Login", url: "https://docs.metamask.io/embedded-wallets/authentication/social-logins/discord/", category: "auth", keywords: ["discord", "social", "oauth"] },
  { title: "Auth0 Integration", url: "https://docs.metamask.io/embedded-wallets/authentication/custom-connections/auth0/", category: "auth", keywords: ["auth0", "custom", "oauth", "idp"] },
  { title: "AWS Cognito Integration", url: "https://docs.metamask.io/embedded-wallets/authentication/custom-connections/aws-cognito/", category: "auth", keywords: ["aws", "cognito", "custom", "idp"] },
  { title: "Firebase Integration", url: "https://docs.metamask.io/embedded-wallets/authentication/custom-connections/firebase/", category: "auth", keywords: ["firebase", "custom", "google", "idp"] },

  // Blockchain Guides
  { title: "EVM Blockchain Integration", url: "https://docs.metamask.io/embedded-wallets/connect-blockchain/evm/", category: "blockchain", keywords: ["evm", "ethereum", "polygon", "bsc", "arbitrum", "optimism", "transaction", "provider"] },
  { title: "Solana Integration", url: "https://docs.metamask.io/embedded-wallets/connect-blockchain/solana/", category: "blockchain", keywords: ["solana", "sol", "spl", "transaction"] },
  { title: "Other Blockchains", url: "https://docs.metamask.io/embedded-wallets/connect-blockchain/other/", category: "blockchain", keywords: ["other", "chain", "private key", "export"] },

  // Features
  { title: "External Wallet Aggregator", url: "https://docs.metamask.io/embedded-wallets/features/external-wallets/", category: "feature", keywords: ["external", "wallet", "metamask", "walletconnect", "coinbase", "aggregator"] },
  { title: "Smart Accounts", url: "https://docs.metamask.io/embedded-wallets/features/smart-accounts/", category: "feature", keywords: ["smart", "accounts", "account abstraction", "aa", "gasless", "bundler"] },
  { title: "Funding (Fiat On-Ramp)", url: "https://docs.metamask.io/embedded-wallets/features/funding/", category: "feature", keywords: ["funding", "fiat", "on-ramp", "buy", "crypto"] },
  { title: "User Account Dashboard", url: "https://docs.metamask.io/embedded-wallets/features/user-account-dashboard/", category: "feature", keywords: ["user", "account", "dashboard", "mfa", "recovery", "devices"] },
  { title: "Server-Side Verification", url: "https://docs.metamask.io/embedded-wallets/features/server-side-verification/", category: "feature", keywords: ["server", "verification", "id token", "jwt", "backend"] },
  { title: "Prebuilt Wallet UI / Whitelabel", url: "https://docs.metamask.io/embedded-wallets/features/whitelabel/", category: "feature", keywords: ["wallet", "ui", "whitelabel", "prebuilt", "branding"] },
  { title: "Wallet Pregeneration", url: "https://docs.metamask.io/embedded-wallets/features/wallet-pregeneration/", category: "feature", keywords: ["pregeneration", "airdrop", "pre-generate", "core kit", "legacy"] },
  { title: "MFA (Multi-Factor Authentication)", url: "https://docs.metamask.io/embedded-wallets/sdk/react/advanced/mfa/", category: "feature", keywords: ["mfa", "multi-factor", "2fa", "recovery", "factor"] },

  // Troubleshooting
  { title: "Troubleshooting: Different Private Keys", url: "https://docs.metamask.io/embedded-wallets/troubleshooting/different-private-key/", category: "troubleshooting", keywords: ["different", "private key", "wallet address", "changed", "mismatch"] },
  { title: "Troubleshooting: JWT Errors", url: "https://docs.metamask.io/embedded-wallets/troubleshooting/jwt-errors/", category: "troubleshooting", keywords: ["jwt", "error", "verify", "signature", "expired", "duplicate", "kid", "jwks"] },
  { title: "Troubleshooting: React Native Metro Polyfills", url: "https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/", category: "troubleshooting", keywords: ["react native", "metro", "polyfill", "buffer", "process", "crypto"] },
  { title: "Troubleshooting: Nuxt Polyfills", url: "https://docs.metamask.io/embedded-wallets/troubleshooting/nuxt-issues/", category: "troubleshooting", keywords: ["nuxt", "polyfill", "buffer", "process", "ssr"] },
  { title: "Troubleshooting: Svelte/Vite Polyfills", url: "https://docs.metamask.io/embedded-wallets/troubleshooting/svelte-issues/", category: "troubleshooting", keywords: ["svelte", "vite", "polyfill", "buffer", "process"] },
  { title: "Troubleshooting: Vite Polyfills", url: "https://docs.metamask.io/embedded-wallets/troubleshooting/vite-issues/", category: "troubleshooting", keywords: ["vite", "polyfill", "buffer", "process", "global"] },
  { title: "Troubleshooting: Webpack 5 Polyfills", url: "https://docs.metamask.io/embedded-wallets/troubleshooting/webpack-issues/", category: "troubleshooting", keywords: ["webpack", "polyfill", "cra", "create react app", "angular", "vue", "gatsby"] },
  { title: "Troubleshooting: Popup Blocked", url: "https://docs.metamask.io/embedded-wallets/troubleshooting/popup-blocked-issue/", category: "troubleshooting", keywords: ["popup", "blocked", "safari", "ios", "browser"] },
  { title: "Supported Browsers", url: "https://docs.metamask.io/embedded-wallets/troubleshooting/supported-browsers/", category: "troubleshooting", keywords: ["browser", "support", "bigint", "compatibility"] },
];

// ── Examples Registry ────────────────────────────────────────────────────

export const EXAMPLE_REGISTRY: ExampleEntry[] = [
  // Web Quick Starts
  { name: "React Quick Start (Modal)", repo: "web3auth-examples", owner: "Web3Auth", path: "quick-starts/react-quick-start", platform: "react", category: "quick-start", chain: "evm", description: "React app with Web3Auth modal UI, Vite bundler, EVM chain", priority: 1 },
  { name: "React No-Modal Quick Start", repo: "web3auth-examples", owner: "Web3Auth", path: "quick-starts/react-no-modal-quick-start", platform: "react", category: "quick-start", chain: "evm", description: "React app without modal (headless), custom login UI, EVM chain", priority: 2 },
  { name: "React Solana Quick Start", repo: "web3auth-examples", owner: "Web3Auth", path: "quick-starts/react-solana-quick-start", platform: "react", category: "quick-start", chain: "solana", description: "React app with Solana chain integration", priority: 3 },
  { name: "Vue Quick Start", repo: "web3auth-examples", owner: "Web3Auth", path: "quick-starts/vue-quick-start", platform: "vue", category: "quick-start", chain: "evm", description: "Vue app with composables, EVM chain", priority: 1 },
  { name: "Vue Solana Quick Start", repo: "web3auth-examples", owner: "Web3Auth", path: "quick-starts/vue-solana-quick-start", platform: "vue", category: "quick-start", chain: "solana", description: "Vue app with Solana chain integration", priority: 3 },
  { name: "Vanilla JS Quick Start", repo: "web3auth-examples", owner: "Web3Auth", path: "quick-starts/vanillajs-quick-start", platform: "js", category: "quick-start", chain: "evm", description: "Plain JavaScript, no framework, EVM chain", priority: 1 },
  { name: "Next.js Quick Start", repo: "web3auth-examples", owner: "Web3Auth", path: "quick-starts/nextjs-quick-start", platform: "react", category: "quick-start", chain: "evm", description: "Next.js app with React hooks, EVM chain", priority: 2 },
  { name: "Angular Quick Start", repo: "web3auth-examples", owner: "Web3Auth", path: "quick-starts/angular-quick-start", platform: "js", category: "quick-start", chain: "evm", description: "Angular app using JS SDK, EVM chain", priority: 2 },

  // Web Custom Auth - Single Connection
  { name: "Google (Implicit)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/google-implicit-example", platform: "react", category: "custom-auth", authMethod: "google", description: "Custom Google OAuth login", priority: 5 },
  { name: "Google One Tap", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/google-one-tap-example", platform: "react", category: "custom-auth", authMethod: "google", description: "Google One Tap sign-in integration", priority: 5 },
  { name: "Facebook (Implicit)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/facebook-implicit-example", platform: "react", category: "custom-auth", authMethod: "facebook", description: "Custom Facebook OAuth login", priority: 5 },
  { name: "Discord (Implicit)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/discord-implicit-example", platform: "react", category: "custom-auth", authMethod: "discord", description: "Custom Discord OAuth login", priority: 5 },
  { name: "Twitch (Implicit)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/twitch-implicit-example", platform: "react", category: "custom-auth", authMethod: "twitch", description: "Custom Twitch OAuth login", priority: 5 },
  { name: "Worldcoin (Implicit)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/worldcoin-implicit-example", platform: "react", category: "custom-auth", authMethod: "worldcoin", description: "Worldcoin identity verification login", priority: 6 },
  { name: "Auth0 (Implicit)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/auth0-implicit-example", platform: "react", category: "custom-auth", authMethod: "auth0", description: "Auth0 implicit flow login", priority: 4 },
  { name: "Auth0 (JWT)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/auth0-jwt-example", platform: "react", category: "custom-auth", authMethod: "auth0", description: "Auth0 JWT flow login", priority: 4 },
  { name: "AWS Cognito (Implicit)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/cognito-implicit-example", platform: "react", category: "custom-auth", authMethod: "cognito", description: "AWS Cognito implicit flow login", priority: 5 },
  { name: "Firebase (JWT)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/firebase-jwt-example", platform: "react", category: "custom-auth", authMethod: "firebase", description: "Firebase JWT flow login", priority: 4 },
  { name: "Custom JWT", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/custom-jwt-example", platform: "react", category: "custom-auth", authMethod: "custom-jwt", description: "Custom JWT provider with your own JWKS", priority: 3 },
  { name: "Custom Auth with Modal", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/single-connection/modal-example", platform: "react", category: "custom-auth", authMethod: "modal", description: "Custom authentication integrated with Web3Auth modal", priority: 4 },

  // Web Custom Auth - Grouped Connection
  { name: "Auth0 + Google (Implicit Grouped)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/grouped-connection/auth0-google-implicit-grouped-example", platform: "react", category: "custom-auth", authMethod: "grouped", description: "Grouped connection: Auth0 + Google implicit for same wallet address", priority: 4 },
  { name: "Auth0 + Google (JWT Grouped)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/grouped-connection/auth0-google-jwt-grouped-example", platform: "react", category: "custom-auth", authMethod: "grouped", description: "Grouped connection: Auth0 + Google JWT for same wallet address", priority: 4 },
  { name: "Firebase + Google (JWT Grouped)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/grouped-connection/firebase-google-jwt-grouped-example", platform: "react", category: "custom-auth", authMethod: "grouped", description: "Grouped connection: Firebase + Google JWT for same wallet address", priority: 4 },
  { name: "Modal Google + Email Passwordless (Grouped)", repo: "web3auth-examples", owner: "Web3Auth", path: "custom-authentication/grouped-connection/modal-google-email-passwordless-grouped-example", platform: "react", category: "custom-auth", authMethod: "grouped", description: "Grouped connection: Google + Email passwordless with modal for same wallet", priority: 3 },

  // Web Other Blockchains
  { name: "Algorand Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/algorand-example", platform: "react", category: "blockchain", chain: "other", description: "Algorand chain integration via private key export", priority: 7 },
  { name: "Aptos Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/aptos-example", platform: "react", category: "blockchain", chain: "other", description: "Aptos chain integration via private key export", priority: 7 },
  { name: "Bitcoin Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/bitcoin-example", platform: "react", category: "blockchain", chain: "other", description: "Bitcoin integration via private key export", priority: 7 },
  { name: "Cosmos Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/cosmos-example", platform: "react", category: "blockchain", chain: "other", description: "Cosmos chain integration", priority: 7 },
  { name: "Polkadot Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/polkadot-example", platform: "react", category: "blockchain", chain: "other", description: "Polkadot chain integration", priority: 7 },
  { name: "Polymesh Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/polymesh-example", platform: "react", category: "blockchain", chain: "other", description: "Polymesh chain integration", priority: 8 },
  { name: "StarkNet Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/starknet-example", platform: "react", category: "blockchain", chain: "other", description: "StarkNet chain integration", priority: 7 },
  { name: "Sui Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/sui-example", platform: "react", category: "blockchain", chain: "other", description: "Sui chain integration", priority: 7 },
  { name: "Tezos Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/tezos-example", platform: "react", category: "blockchain", chain: "other", description: "Tezos chain integration", priority: 8 },
  { name: "TON Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/ton-example", platform: "react", category: "blockchain", chain: "other", description: "TON chain integration", priority: 7 },
  { name: "TRON Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/tron-example", platform: "react", category: "blockchain", chain: "other", description: "TRON chain integration", priority: 7 },
  { name: "XRPL Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/xrpl-example", platform: "react", category: "blockchain", chain: "other", description: "XRP Ledger integration", priority: 7 },
  { name: "Multi-Chain Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/multi-chain-example", platform: "react", category: "blockchain", chain: "other", description: "Multi-chain setup with multiple providers", priority: 6 },

  // Web Feature Examples
  { name: "Server-Side Verification", repo: "web3auth-examples", owner: "Web3Auth", path: "other/server-side-verification-example", platform: "react", category: "feature", description: "Verify Web3Auth id_token on your backend", priority: 5 },
  { name: "Smart Account Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/smart-account-example", platform: "react", category: "feature", description: "Smart account / account abstraction integration", priority: 5 },
  { name: "Solana Pay Example", repo: "web3auth-examples", owner: "Web3Auth", path: "other/solana-pay-example", platform: "react", category: "feature", chain: "solana", description: "Solana Pay integration", priority: 7 },
  { name: "SNS (Solana Name Service)", repo: "web3auth-examples", owner: "Web3Auth", path: "other/sns-example", platform: "react", category: "feature", chain: "solana", description: "Solana Name Service integration", priority: 8 },
  { name: "XMTP Messaging", repo: "web3auth-examples", owner: "Web3Auth", path: "other/xmtp-example", platform: "react", category: "feature", description: "XMTP messaging protocol integration", priority: 8 },
  { name: "Sign Protocol", repo: "web3auth-examples", owner: "Web3Auth", path: "other/sign-protocol-example", platform: "react", category: "feature", description: "Sign Protocol attestation integration", priority: 8 },

  // Web Playground
  { name: "React Playground (All Features)", repo: "web3auth-examples", owner: "Web3Auth", path: "react-playground", platform: "react", category: "playground", description: "Comprehensive React demo showcasing all Web3Auth features", priority: 3 },

  // Android
  { name: "Android Quick Start", repo: "web3auth-android-examples", owner: "Web3Auth", path: "android-quick-start", platform: "android", category: "quick-start", description: "Basic Android integration with social login", priority: 1 },
  { name: "Android Playground", repo: "web3auth-android-examples", owner: "Web3Auth", path: "android-playground", platform: "android", category: "playground", description: "Full Android playground with all features", priority: 3 },
  { name: "Android Auth0", repo: "web3auth-android-examples", owner: "Web3Auth", path: "android-auth0-example", platform: "android", category: "custom-auth", authMethod: "auth0", description: "Auth0 custom auth on Android", priority: 5 },
  { name: "Android Firebase", repo: "web3auth-android-examples", owner: "Web3Auth", path: "android-firebase-example", platform: "android", category: "custom-auth", authMethod: "firebase", description: "Firebase custom auth on Android", priority: 5 },
  { name: "Android Grouped Connection", repo: "web3auth-android-examples", owner: "Web3Auth", path: "android-aggregate-verifier-example", platform: "android", category: "custom-auth", authMethod: "grouped", description: "Grouped connections (aggregate verifier) on Android", priority: 5 },
  { name: "Android Solana", repo: "web3auth-android-examples", owner: "Web3Auth", path: "android-solana-example", platform: "android", category: "blockchain", chain: "solana", description: "Solana chain integration on Android", priority: 5 },

  // iOS
  { name: "iOS Quick Start", repo: "web3auth-ios-examples", owner: "Web3Auth", path: "ios-quick-start", platform: "ios", category: "quick-start", description: "Basic iOS integration with social login", priority: 1 },
  { name: "iOS Playground", repo: "web3auth-ios-examples", owner: "Web3Auth", path: "ios-playground", platform: "ios", category: "playground", description: "Full iOS playground with all features", priority: 3 },
  { name: "iOS Auth0", repo: "web3auth-ios-examples", owner: "Web3Auth", path: "ios-auth0-example", platform: "ios", category: "custom-auth", authMethod: "auth0", description: "Auth0 custom auth on iOS", priority: 5 },
  { name: "iOS Firebase", repo: "web3auth-ios-examples", owner: "Web3Auth", path: "ios-firebase-example", platform: "ios", category: "custom-auth", authMethod: "firebase", description: "Firebase custom auth on iOS", priority: 5 },
  { name: "iOS Grouped Connection", repo: "web3auth-ios-examples", owner: "Web3Auth", path: "ios-aggregate-verifier-example", platform: "ios", category: "custom-auth", authMethod: "grouped", description: "Grouped connections (aggregate verifier) on iOS", priority: 5 },
  { name: "iOS Solana", repo: "web3auth-ios-examples", owner: "Web3Auth", path: "ios-solana-example", platform: "ios", category: "blockchain", chain: "solana", description: "Solana chain integration on iOS", priority: 5 },
  { name: "iOS Aptos", repo: "web3auth-ios-examples", owner: "Web3Auth", path: "ios-aptos-example", platform: "ios", category: "blockchain", chain: "other", description: "Aptos chain integration on iOS", priority: 7 },

  // React Native
  { name: "React Native Bare Quick Start", repo: "web3auth-react-native-examples", owner: "Web3Auth", path: "rn-bare-quick-start", platform: "react-native", category: "quick-start", description: "Bare React Native quick start", priority: 1 },
  { name: "React Native Expo Example", repo: "web3auth-react-native-examples", owner: "Web3Auth", path: "rn-expo-example", platform: "react-native", category: "quick-start", description: "Expo-based React Native example", priority: 2 },
  { name: "React Native Auth0 (Bare)", repo: "web3auth-react-native-examples", owner: "Web3Auth", path: "rn-bare-auth0-example", platform: "react-native", category: "custom-auth", authMethod: "auth0", description: "Auth0 custom auth on bare React Native", priority: 5 },
  { name: "React Native Firebase (Bare)", repo: "web3auth-react-native-examples", owner: "Web3Auth", path: "rn-bare-firebase-example", platform: "react-native", category: "custom-auth", authMethod: "firebase", description: "Firebase custom auth on bare React Native", priority: 5 },
  { name: "React Native Grouped Connection", repo: "web3auth-react-native-examples", owner: "Web3Auth", path: "rn-bare-aggregate-verifier-example", platform: "react-native", category: "custom-auth", authMethod: "grouped", description: "Grouped connections on bare React Native", priority: 5 },
  { name: "React Native Solana (Bare)", repo: "web3auth-react-native-examples", owner: "Web3Auth", path: "rn-bare-solana-example", platform: "react-native", category: "blockchain", chain: "solana", description: "Solana chain integration on bare React Native", priority: 5 },

  // Flutter
  { name: "Flutter Quick Start", repo: "web3auth-flutter-examples", owner: "Web3Auth", path: "flutter-quick-start", platform: "flutter", category: "quick-start", description: "Basic Flutter integration", priority: 1 },
  { name: "Flutter Playground", repo: "web3auth-flutter-examples", owner: "Web3Auth", path: "flutter-playground", platform: "flutter", category: "playground", description: "Full Flutter playground with all features", priority: 3 },
  { name: "Flutter Auth0", repo: "web3auth-flutter-examples", owner: "Web3Auth", path: "flutter-auth0-example", platform: "flutter", category: "custom-auth", authMethod: "auth0", description: "Auth0 custom auth on Flutter", priority: 5 },
  { name: "Flutter Firebase", repo: "web3auth-flutter-examples", owner: "Web3Auth", path: "flutter-firebase-example", platform: "flutter", category: "custom-auth", authMethod: "firebase", description: "Firebase custom auth on Flutter", priority: 5 },
  { name: "Flutter Grouped Connection", repo: "web3auth-flutter-examples", owner: "Web3Auth", path: "flutter-aggregate-verifier-example", platform: "flutter", category: "custom-auth", authMethod: "grouped", description: "Grouped connections on Flutter", priority: 5 },
  { name: "Flutter Solana", repo: "web3auth-flutter-examples", owner: "Web3Auth", path: "flutter-solana-example", platform: "flutter", category: "blockchain", chain: "solana", description: "Solana chain integration on Flutter", priority: 5 },

  // Unity
  { name: "Unity Quick Start", repo: "web3auth-unity-examples", owner: "Web3Auth", path: "unity-quick-start", platform: "unity", category: "quick-start", description: "Basic Unity integration", priority: 1 },
  { name: "Unity Auth0", repo: "web3auth-unity-examples", owner: "Web3Auth", path: "unity-auth0-example", platform: "unity", category: "custom-auth", authMethod: "auth0", description: "Auth0 custom auth on Unity", priority: 5 },
  { name: "Unity Grouped Connection", repo: "web3auth-unity-examples", owner: "Web3Auth", path: "unity-aggregate-verifier-example", platform: "unity", category: "custom-auth", authMethod: "grouped", description: "Grouped connections on Unity", priority: 5 },

  // Unreal
  { name: "Unreal Engine Example", repo: "web3auth-unreal-example", owner: "MetaMask", path: "", platform: "unreal", category: "quick-start", description: "Unreal Engine integration example project", priority: 1 },

  // Node.js
  { name: "Node.js EVM Quick Start", repo: "web3auth-node-examples", owner: "Web3Auth", path: "evm-quick-start", platform: "node", category: "quick-start", chain: "evm", description: "Server-side EVM integration with Node.js", priority: 1 },
  { name: "Node.js Solana Quick Start", repo: "web3auth-node-examples", owner: "Web3Auth", path: "solana-quick-start", platform: "node", category: "quick-start", chain: "solana", description: "Server-side Solana integration with Node.js", priority: 2 },
  { name: "Node.js Firebase Quick Start", repo: "web3auth-node-examples", owner: "Web3Auth", path: "firebase-quick-start", platform: "node", category: "quick-start", authMethod: "firebase", description: "Server-side Firebase auth with Node.js", priority: 3 },
];

// ── Search Functions ─────────────────────────────────────────────────────

export function searchDocs(query: string): DocEntry[] {
  const terms = query.toLowerCase().split(/\s+/);
  return DOC_REGISTRY
    .map((entry) => {
      const score = terms.reduce((acc, term) => {
        const titleMatch = entry.title.toLowerCase().includes(term) ? 3 : 0;
        const keywordMatch = entry.keywords.some((k) => k.includes(term)) ? 2 : 0;
        const categoryMatch = entry.category.includes(term) ? 1 : 0;
        return acc + titleMatch + keywordMatch + categoryMatch;
      }, 0);
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry);
}

export function findExamples(filters: {
  platform?: Platform;
  chain?: Chain;
  category?: ExampleEntry["category"];
  authMethod?: string;
}): ExampleEntry[] {
  return EXAMPLE_REGISTRY
    .filter((e) => {
      if (filters.platform && e.platform !== filters.platform) return false;
      if (filters.chain && e.chain !== filters.chain) return false;
      if (filters.category && e.category !== filters.category) return false;
      if (filters.authMethod && e.authMethod !== filters.authMethod) return false;
      return true;
    })
    .sort((a, b) => a.priority - b.priority);
}

export function getExampleGitHubUrl(example: ExampleEntry): string {
  const base = `https://github.com/${example.owner}/${example.repo}`;
  return example.path ? `${base}/tree/main/${example.path}` : base;
}

export function getExampleRawUrl(example: ExampleEntry, filePath: string): string {
  const pathPrefix = example.path ? `${example.path}/` : "";
  return `https://raw.githubusercontent.com/${example.owner}/${example.repo}/main/${pathPrefix}${filePath}`;
}
