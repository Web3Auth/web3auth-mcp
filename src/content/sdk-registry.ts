import type { Platform } from "./platform-matrix.js";

// ── Types ────────────────────────────────────────────────────────────────

export type FilePurpose = "types" | "hooks" | "main-class" | "errors" | "config" | "state";

export interface SdkSourceFile {
  /** Path relative to repo root */
  path: string;
  /** What this file provides */
  purpose: FilePurpose;
  /** Human-readable description */
  description: string;
}

export interface SdkModule {
  /** Module identifier (e.g., "core-types", "react-hooks") */
  id: string;
  /** Human label */
  label: string;
  /** Description for tool output */
  description: string;
  /** Files that make up this module */
  files: SdkSourceFile[];
  /** Priority: lower = more important = fetched first. 1 = types, 2 = hooks/errors, 3 = implementation */
  priority: number;
}

export interface SdkRepoConfig {
  owner: string;
  repo: string;
  branch: string;
  language: string;
  modules: SdkModule[];
}

// ── Registry ─────────────────────────────────────────────────────────────

export const SDK_SOURCE_REGISTRY: Record<string, SdkRepoConfig> = {

  // ── Web SDK (Modal + No-Modal, shared by React/Vue/JS/Node) ────────────

  "web": {
    owner: "Web3Auth",
    repo: "web3auth-web",
    branch: "master",
    language: "TypeScript",
    modules: [
      {
        id: "core-types",
        label: "Core Types & Interfaces (shared by all web SDKs)",
        description: "IWeb3Auth, Web3AuthOptions, LoginParams, UserInfo, chain config, connector interfaces — the foundation types used by React, Vue, JS, and Node SDKs",
        priority: 1,
        files: [
          { path: "packages/no-modal/src/base/interfaces.ts", purpose: "types", description: "Core shared interfaces (Web3AuthOptions, LoginParams, UserInfo, etc.)" },
          { path: "packages/no-modal/src/base/core/IWeb3Auth.ts", purpose: "types", description: "IWeb3Auth interface — the main SDK contract" },
          { path: "packages/no-modal/src/base/chain/IChainInterface.ts", purpose: "types", description: "Chain configuration interface" },
          { path: "packages/no-modal/src/base/connector/interfaces.ts", purpose: "types", description: "Connector interfaces (IConnector, ConnectorEvents)" },
          { path: "packages/no-modal/src/base/constants.ts", purpose: "config", description: "SDK constants (CONNECTOR_EVENTS, WALLET_CONNECTOR_TYPE)" },
        ],
      },
      {
        id: "modal-types",
        label: "Modal SDK Types",
        description: "Modal-specific interfaces and default configuration for Web3Auth modal UI",
        priority: 1,
        files: [
          { path: "packages/modal/src/interface.ts", purpose: "types", description: "Modal-specific interfaces (Web3AuthModalOptions, ModalConfig)" },
          { path: "packages/modal/src/config.ts", purpose: "config", description: "Default configuration constants for modal SDK" },
        ],
      },
      {
        id: "react-hooks",
        label: "React Hooks API",
        description: "All React hooks: useWeb3Auth, useWeb3AuthConnect, useWeb3AuthUser, useIdentityToken, useEnableMFA, useSwitchChain, etc.",
        priority: 2,
        files: [
          { path: "packages/modal/src/react/hooks/index.ts", purpose: "hooks", description: "Hook exports — shows all available hooks" },
          { path: "packages/modal/src/react/hooks/useWeb3Auth.ts", purpose: "hooks", description: "Main useWeb3Auth hook" },
          { path: "packages/modal/src/react/hooks/useWeb3AuthConnect.ts", purpose: "hooks", description: "Connection hook with login params" },
          { path: "packages/modal/src/react/hooks/useWeb3AuthUser.ts", purpose: "hooks", description: "User info hook" },
          { path: "packages/modal/src/react/hooks/useWeb3AuthDisconnect.ts", purpose: "hooks", description: "Disconnect hook" },
          { path: "packages/modal/src/react/hooks/useIdentityToken.ts", purpose: "hooks", description: "Identity token hook for server-side verification" },
          { path: "packages/modal/src/react/hooks/useEnableMFA.ts", purpose: "hooks", description: "MFA enable hook" },
          { path: "packages/modal/src/react/hooks/useSwitchChain.ts", purpose: "hooks", description: "Chain switching hook" },
          { path: "packages/modal/src/react/interfaces.ts", purpose: "types", description: "React-specific interface types" },
          { path: "packages/modal/src/react/Web3AuthProvider.ts", purpose: "hooks", description: "React provider component" },
        ],
      },
      {
        id: "no-modal-class",
        label: "No-Modal Core (headless SDK)",
        description: "Web3AuthNoModal class — constructor, init, connectTo, logout, provider management. The headless SDK used when building custom login UI.",
        priority: 3,
        files: [
          { path: "packages/no-modal/src/noModal.ts", purpose: "main-class", description: "Web3AuthNoModal class — full headless SDK" },
        ],
      },
      {
        id: "modal-class",
        label: "Modal Core (UI SDK)",
        description: "ModalManager class — extends no-modal with pre-built login UI management",
        priority: 3,
        files: [
          { path: "packages/modal/src/modalManager.ts", purpose: "main-class", description: "ModalManager — modal UI orchestration" },
        ],
      },
    ],
  },

  // ── React Native SDK ───────────────────────────────────────────────────

  "react-native": {
    owner: "Web3Auth",
    repo: "web3auth-react-native-sdk",
    branch: "master",
    language: "TypeScript",
    modules: [
      {
        id: "core-types",
        label: "Core Types & Interfaces",
        description: "TypeScript interfaces: Web3AuthOptions, LoginParams, UserInfo, provider types, storage interfaces",
        priority: 1,
        files: [
          { path: "src/types/interface.ts", purpose: "types", description: "Core interfaces (Web3AuthOptions, LoginParams, etc.)" },
          { path: "src/types/IWebBrowser.ts", purpose: "types", description: "WebBrowser interface for OAuth flow" },
          { path: "src/types/IEncryptedStorage.ts", purpose: "types", description: "Encrypted storage interface" },
          { path: "src/types/IExpoSecureStore.ts", purpose: "types", description: "Expo SecureStore interface" },
          { path: "src/constants.ts", purpose: "config", description: "SDK constants" },
          { path: "src/errors.ts", purpose: "errors", description: "Error types and codes" },
        ],
      },
      {
        id: "main-class",
        label: "Web3Auth Class",
        description: "Main Web3Auth class — constructor, login, logout, session management",
        priority: 3,
        files: [
          { path: "src/Web3Auth.ts", purpose: "main-class", description: "Web3Auth class — full SDK" },
        ],
      },
    ],
  },

  // ── Android SDK ────────────────────────────────────────────────────────

  "android": {
    owner: "Web3Auth",
    repo: "web3auth-android-sdk",
    branch: "master",
    language: "Kotlin",
    modules: [
      {
        id: "core-types",
        label: "Core Types (Kotlin)",
        description: "Kotlin data classes: Web3AuthOptions, LoginParams, ChainConfig, UserInfo, AuthConnection, MFA settings, WhiteLabelData",
        priority: 1,
        files: [
          { path: "core/src/main/java/com/web3auth/core/types/Web3AuthOptions.kt", purpose: "types", description: "SDK configuration options" },
          { path: "core/src/main/java/com/web3auth/core/types/LoginParams.kt", purpose: "types", description: "Login parameters" },
          { path: "core/src/main/java/com/web3auth/core/types/ChainConfig.kt", purpose: "types", description: "Chain configuration" },
          { path: "core/src/main/java/com/web3auth/core/types/UserInfo.kt", purpose: "types", description: "User information model" },
          { path: "core/src/main/java/com/web3auth/core/types/AuthConnection.kt", purpose: "types", description: "Auth connection enum" },
          { path: "core/src/main/java/com/web3auth/core/types/AuthConnectionConfig.kt", purpose: "types", description: "Auth connection config" },
          { path: "core/src/main/java/com/web3auth/core/types/ExtraLoginOptions.kt", purpose: "types", description: "Extra login options" },
          { path: "core/src/main/java/com/web3auth/core/types/WhiteLabelData.kt", purpose: "types", description: "Whitelabel branding config" },
          { path: "core/src/main/java/com/web3auth/core/types/MFALevel.kt", purpose: "types", description: "MFA level enum" },
          { path: "core/src/main/java/com/web3auth/core/types/MfaSetting.kt", purpose: "types", description: "MFA setting" },
          { path: "core/src/main/java/com/web3auth/core/types/MfaSettings.kt", purpose: "types", description: "MFA settings collection" },
          { path: "core/src/main/java/com/web3auth/core/types/Web3AuthError.kt", purpose: "errors", description: "Error types" },
          { path: "core/src/main/java/com/web3auth/core/types/Web3AuthResponse.kt", purpose: "types", description: "SDK response wrapper" },
          { path: "core/src/main/java/com/web3auth/core/types/SignResponse.kt", purpose: "types", description: "Sign response" },
        ],
      },
      {
        id: "main-class",
        label: "Web3Auth Main Class",
        description: "Web3Auth class — initialize, login, logout, getPrivateKey, launchWalletServices",
        priority: 3,
        files: [
          { path: "core/src/main/java/com/web3auth/core/Web3Auth.kt", purpose: "main-class", description: "Web3Auth class — full SDK" },
        ],
      },
    ],
  },

  // ── iOS SDK ────────────────────────────────────────────────────────────

  "ios": {
    owner: "Web3Auth",
    repo: "web3auth-swift-sdk",
    branch: "master",
    language: "Swift",
    modules: [
      {
        id: "core-types",
        label: "Core Types (Swift)",
        description: "Swift types: W3AInitParams, W3ALoginParams, ChainConfig, UserInfo, enums, error types",
        priority: 1,
        files: [
          { path: "Sources/Web3Auth/Types.swift", purpose: "types", description: "All type definitions (W3AInitParams, W3ALoginParams, ChainConfig, enums)" },
          { path: "Sources/Web3Auth/Web3AuthState.swift", purpose: "state", description: "SDK state management types" },
          { path: "Sources/Web3Auth/Web3AuthUserInfo.swift", purpose: "types", description: "User info model" },
          { path: "Sources/Web3Auth/Web3AuthError.swift", purpose: "errors", description: "Error types" },
        ],
      },
      {
        id: "main-class",
        label: "Web3Auth Class",
        description: "Web3Auth class — initialize, login, logout, getPrivateKey",
        priority: 3,
        files: [
          { path: "Sources/Web3Auth/Web3Auth.swift", purpose: "main-class", description: "Web3Auth class — full SDK" },
        ],
      },
    ],
  },

  // ── Flutter SDK ────────────────────────────────────────────────────────

  "flutter": {
    owner: "Web3Auth",
    repo: "web3auth-flutter-sdk",
    branch: "master",
    language: "Dart",
    modules: [
      {
        id: "core-types",
        label: "Core Types (Dart)",
        description: "Dart types: enums (Network, ChainNamespace, MFALevel), input models (Web3AuthOptions, LoginParams), output models (UserInfo, Web3AuthResponse)",
        priority: 1,
        files: [
          { path: "lib/enums.dart", purpose: "types", description: "Enums (Network, ChainNamespace, Language, ThemeMode, MFALevel, etc.)" },
          { path: "lib/input.dart", purpose: "types", description: "Input types (Web3AuthOptions, LoginParams, ChainConfig, WhiteLabelData)" },
          { path: "lib/output.dart", purpose: "types", description: "Output types (UserInfo, Web3AuthResponse, TorusKey)" },
        ],
      },
      {
        id: "main-class",
        label: "Web3AuthFlutter Class",
        description: "Main SDK class — init, login, logout, getPrivateKey, launchWalletServices",
        priority: 3,
        files: [
          { path: "lib/web3auth_flutter.dart", purpose: "main-class", description: "Web3AuthFlutter class — full SDK" },
        ],
      },
    ],
  },

  // ── Unity SDK ──────────────────────────────────────────────────────────

  "unity": {
    owner: "Web3Auth",
    repo: "web3auth-unity-sdk",
    branch: "master",
    language: "C#",
    modules: [
      {
        id: "core-types",
        label: "Core Types (C#)",
        description: "C# types: Web3AuthOptions, LoginParams, ChainConfig, UserInfo, MFA settings, WhiteLabelData, Provider enums",
        priority: 1,
        files: [
          { path: "Assets/Plugins/Web3AuthSDK/Types/Web3AuthOptions.cs", purpose: "types", description: "SDK configuration options" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/LoginParams.cs", purpose: "types", description: "Login parameters" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/ChainConfig.cs", purpose: "types", description: "Chain configuration" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/UserInfo.cs", purpose: "types", description: "User info model" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/TypeOfLogin.cs", purpose: "types", description: "Login type enum" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/Provider.cs", purpose: "types", description: "Provider definitions" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/WhiteLabelData.cs", purpose: "types", description: "Whitelabel branding config" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/ExtraLoginOptions.cs", purpose: "types", description: "Extra login options" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/MFALevel.cs", purpose: "types", description: "MFA level enum" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/MfaSetting.cs", purpose: "types", description: "MFA setting" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/MfaSettings.cs", purpose: "types", description: "MFA settings collection" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/Web3AuthError.cs", purpose: "errors", description: "Error types" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/Web3AuthResponse.cs", purpose: "types", description: "Response wrapper" },
          { path: "Assets/Plugins/Web3AuthSDK/Types/SignResponse.cs", purpose: "types", description: "Sign response" },
        ],
      },
    ],
  },

  // ── Unreal SDK ─────────────────────────────────────────────────────────

  "unreal": {
    owner: "MetaMask",
    repo: "web3auth-unreal-sdk",
    branch: "main",
    language: "C++",
    modules: [
      // Unreal SDK is the least-used platform; module mapping deferred.
      // The tool will fall back to fetching the repo's README for guidance.
    ],
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────

/** Map a platform to its SDK registry key(s). */
export function getSdkRegistryKeys(platform: Platform): string[] {
  switch (platform) {
    case "react":
    case "vue":
    case "js":
    case "node":
      return ["web"];
    case "react-native":
      return ["react-native"];
    case "android":
      return ["android"];
    case "ios":
      return ["ios"];
    case "flutter":
      return ["flutter"];
    case "unity":
      return ["unity"];
    case "unreal":
      return ["unreal"];
    default:
      return [];
  }
}

/** Get the language identifier for syntax highlighting. */
export function getSdkLanguageId(language: string): string {
  const map: Record<string, string> = {
    TypeScript: "typescript",
    Kotlin: "kotlin",
    Swift: "swift",
    Dart: "dart",
    "C#": "csharp",
    "C++": "cpp",
  };
  return map[language] ?? language.toLowerCase();
}
