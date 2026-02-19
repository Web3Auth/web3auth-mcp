export type Platform =
  | "react"
  | "vue"
  | "js"
  | "react-native"
  | "android"
  | "ios"
  | "flutter"
  | "unity"
  | "unreal"
  | "node";

export type Chain = "evm" | "solana" | "other";

export interface PlatformCapabilities {
  platform: Platform;
  displayName: string;
  language: string;
  socialLogin: boolean;
  externalWallets: boolean;
  modalUI: boolean;
  walletServicesUI: boolean;
  builtInProviderEVM: boolean;
  builtInProviderSolana: boolean;
  privateKeyExport: boolean;
  wagmiSupport: boolean;
  smartAccounts: boolean;
  mfa: boolean;
  sessionManagement: boolean;
  dashboardChainConfig: boolean;
  notes: string[];
  docUrl: string;
  sdkRepo: string;
  examplesRepo: string;
}

export const PLATFORM_MATRIX: Record<Platform, PlatformCapabilities> = {
  react: {
    platform: "react",
    displayName: "React",
    language: "TypeScript/JavaScript",
    socialLogin: true,
    externalWallets: true,
    modalUI: true,
    walletServicesUI: true,
    builtInProviderEVM: true,
    builtInProviderSolana: true,
    privateKeyExport: true,
    wagmiSupport: true,
    smartAccounts: true,
    mfa: true,
    sessionManagement: true,
    dashboardChainConfig: true,
    notes: [
      "Full-featured SDK with hooks-based API",
      "Modal and No-Modal integration modes available",
      "Dedicated Wagmi hooks for EVM chains",
      "Custom hooks for Solana wallet state",
      "Supports external wallet aggregation (MetaMask, WalletConnect, Coinbase)",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/react/",
    sdkRepo: "https://github.com/Web3Auth/web3auth-web",
    examplesRepo: "https://github.com/Web3Auth/web3auth-examples",
  },
  vue: {
    platform: "vue",
    displayName: "Vue",
    language: "TypeScript/JavaScript",
    socialLogin: true,
    externalWallets: true,
    modalUI: true,
    walletServicesUI: true,
    builtInProviderEVM: true,
    builtInProviderSolana: true,
    privateKeyExport: true,
    wagmiSupport: false,
    smartAccounts: true,
    mfa: true,
    sessionManagement: true,
    dashboardChainConfig: true,
    notes: [
      "Composables-based API similar to React hooks",
      "Custom composables for Solana wallet state",
      "Supports external wallet aggregation",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/vue/",
    sdkRepo: "https://github.com/Web3Auth/web3auth-web",
    examplesRepo: "https://github.com/Web3Auth/web3auth-examples",
  },
  js: {
    platform: "js",
    displayName: "JavaScript (Vanilla / Any Framework)",
    language: "TypeScript/JavaScript",
    socialLogin: true,
    externalWallets: true,
    modalUI: true,
    walletServicesUI: true,
    builtInProviderEVM: true,
    builtInProviderSolana: true,
    privateKeyExport: true,
    wagmiSupport: false,
    smartAccounts: true,
    mfa: true,
    sessionManagement: true,
    dashboardChainConfig: true,
    notes: [
      "Framework-agnostic, works with Angular, Svelte, vanilla JS, etc.",
      "Same core SDK as React/Vue but without framework-specific wrappers",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/js/",
    sdkRepo: "https://github.com/Web3Auth/web3auth-web",
    examplesRepo: "https://github.com/Web3Auth/web3auth-examples",
  },
  "react-native": {
    platform: "react-native",
    displayName: "React Native",
    language: "TypeScript/JavaScript",
    socialLogin: true,
    externalWallets: false,
    modalUI: false,
    walletServicesUI: true,
    builtInProviderEVM: true,
    builtInProviderSolana: true,
    privateKeyExport: true,
    wagmiSupport: false,
    smartAccounts: false,
    mfa: true,
    sessionManagement: true,
    dashboardChainConfig: false,
    notes: [
      "Has EVM and Solana providers like web SDK",
      "Wallet Services UI is webview-based (not native modal)",
      "No external wallet aggregation",
      "Requires Metro bundler polyfills (buffer, process, crypto, stream)",
      "Supports both bare React Native and Expo (Expo requires prebuild, not Expo Go)",
      "Deep linking configuration required for OAuth flows",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/react-native/",
    sdkRepo: "https://github.com/Web3Auth/web3auth-react-native-sdk",
    examplesRepo: "https://github.com/Web3Auth/web3auth-react-native-examples",
  },
  android: {
    platform: "android",
    displayName: "Android",
    language: "Kotlin",
    socialLogin: true,
    externalWallets: false,
    modalUI: false,
    walletServicesUI: true,
    builtInProviderEVM: false,
    builtInProviderSolana: false,
    privateKeyExport: true,
    wagmiSupport: false,
    smartAccounts: false,
    mfa: true,
    sessionManagement: true,
    dashboardChainConfig: false,
    notes: [
      "Social login only -- no external wallet support",
      "No built-in providers: export private key and use platform-specific libraries",
      "Wallet Services UI is webview-based",
      "Deep link scheme and bundle identifier must be allowlisted in dashboard",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/android/",
    sdkRepo: "https://github.com/Web3Auth/web3auth-android-sdk",
    examplesRepo: "https://github.com/Web3Auth/web3auth-android-examples",
  },
  ios: {
    platform: "ios",
    displayName: "iOS",
    language: "Swift",
    socialLogin: true,
    externalWallets: false,
    modalUI: false,
    walletServicesUI: true,
    builtInProviderEVM: false,
    builtInProviderSolana: false,
    privateKeyExport: true,
    wagmiSupport: false,
    smartAccounts: false,
    mfa: true,
    sessionManagement: true,
    dashboardChainConfig: false,
    notes: [
      "Social login only -- no external wallet support",
      "No built-in providers: export private key and use platform-specific libraries",
      "Wallet Services UI is webview-based",
      "Deep link scheme and bundle identifier must be allowlisted in dashboard",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/ios/",
    sdkRepo: "https://github.com/Web3Auth/web3auth-swift-sdk",
    examplesRepo: "https://github.com/Web3Auth/web3auth-ios-examples",
  },
  flutter: {
    platform: "flutter",
    displayName: "Flutter",
    language: "Dart",
    socialLogin: true,
    externalWallets: false,
    modalUI: false,
    walletServicesUI: true,
    builtInProviderEVM: false,
    builtInProviderSolana: false,
    privateKeyExport: true,
    wagmiSupport: false,
    smartAccounts: false,
    mfa: true,
    sessionManagement: true,
    dashboardChainConfig: false,
    notes: [
      "Social login only -- no external wallet support",
      "No built-in providers: export private key and use platform-specific libraries",
      "Wallet Services UI is webview-based",
      "Deep link scheme must be configured for OAuth flows",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/flutter/",
    sdkRepo: "https://github.com/Web3Auth/web3auth-flutter-sdk",
    examplesRepo: "https://github.com/Web3Auth/web3auth-flutter-examples",
  },
  unity: {
    platform: "unity",
    displayName: "Unity",
    language: "C#",
    socialLogin: true,
    externalWallets: false,
    modalUI: false,
    walletServicesUI: true,
    builtInProviderEVM: false,
    builtInProviderSolana: false,
    privateKeyExport: true,
    wagmiSupport: false,
    smartAccounts: false,
    mfa: true,
    sessionManagement: true,
    dashboardChainConfig: false,
    notes: [
      "Social login only -- no external wallet support",
      "No built-in providers: export private key and use platform-specific libraries",
      "Wallet Services UI is webview-based",
      "Deep link scheme required for OAuth",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/unity/",
    sdkRepo: "https://github.com/Web3Auth/web3auth-unity-sdk",
    examplesRepo: "https://github.com/Web3Auth/web3auth-unity-examples",
  },
  unreal: {
    platform: "unreal",
    displayName: "Unreal Engine",
    language: "C++/Blueprints",
    socialLogin: true,
    externalWallets: false,
    modalUI: false,
    walletServicesUI: true,
    builtInProviderEVM: false,
    builtInProviderSolana: false,
    privateKeyExport: true,
    wagmiSupport: false,
    smartAccounts: false,
    mfa: true,
    sessionManagement: true,
    dashboardChainConfig: false,
    notes: [
      "Social login only -- no external wallet support",
      "No built-in providers: export private key and use platform-specific libraries",
      "Wallet Services UI is webview-based",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/unreal/",
    sdkRepo: "https://github.com/MetaMask/web3auth-unreal-sdk",
    examplesRepo: "https://github.com/MetaMask/web3auth-unreal-example",
  },
  node: {
    platform: "node",
    displayName: "Node.js",
    language: "TypeScript/JavaScript",
    socialLogin: false,
    externalWallets: false,
    modalUI: false,
    walletServicesUI: false,
    builtInProviderEVM: true,
    builtInProviderSolana: true,
    privateKeyExport: true,
    wagmiSupport: false,
    smartAccounts: false,
    mfa: false,
    sessionManagement: false,
    dashboardChainConfig: true,
    notes: [
      "Server-side / backend SDK -- stateless, no UI",
      "Custom authentication only (no social login UI)",
      "Niche use case: AI agents, server-side custody, backend wallet operations",
      "Built-in EVM and Solana providers with signer access",
      "Private key export for other chains",
    ],
    docUrl: "https://docs.metamask.io/embedded-wallets/sdk/node/",
    sdkRepo: "https://github.com/Web3Auth/web3auth-web",
    examplesRepo: "https://github.com/Web3Auth/web3auth-node-examples",
  },
};

export function getPlatformRecommendation(
  platform: Platform,
  chain: Chain,
): { capabilities: PlatformCapabilities; warnings: string[] } {
  const caps = PLATFORM_MATRIX[platform];
  const warnings: string[] = [];

  if (chain === "other" && !caps.builtInProviderEVM) {
    warnings.push(
      "This platform requires private key export for all chains. You'll need to use a platform-specific library to create a provider/signer.",
    );
  } else if (chain === "other") {
    warnings.push(
      "For chains beyond EVM and Solana, you'll need to export the private key and use a chain-specific library.",
    );
  }

  if (!caps.externalWallets) {
    warnings.push(
      "External wallet aggregation (MetaMask, WalletConnect, etc.) is only available on web SDKs.",
    );
  }

  if (!caps.modalUI && platform !== "node") {
    warnings.push(
      "No pre-built login modal on this platform. You'll build your own login UI and call the SDK methods directly.",
    );
  }

  if (!caps.dashboardChainConfig) {
    warnings.push(
      "Dashboard chain configuration is not supported on this platform. Copy RPC endpoints from the dashboard manually.",
    );
  }

  if (!caps.builtInProviderEVM && !caps.builtInProviderSolana && platform !== "node") {
    warnings.push(
      "No built-in EVM/Solana provider. After login, export the private key and use it with a platform-native provider library.",
    );
  }

  return { capabilities: caps, warnings };
}
