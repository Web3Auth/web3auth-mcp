import { PLATFORM_MATRIX, getPlatformRecommendation, type Platform, type Chain } from "../content/platform-matrix.js";
import { findExamples, getExampleGitHubUrl } from "../content/registry.js";

export const RECOMMEND_SDK_SCHEMA = {
  name: "recommend_sdk",
  description:
    "Recommend the right MetaMask Embedded Wallets (Web3Auth) SDK based on platform, desired features, and target blockchain. Use this when a developer is starting a new integration or unsure which SDK to use.",
  inputSchema: {
    type: "object" as const,
    properties: {
      platform: {
        type: "string",
        enum: ["react", "vue", "js", "react-native", "android", "ios", "flutter", "unity", "unreal", "node"],
        description: "Target platform or framework",
      },
      chain: {
        type: "string",
        enum: ["evm", "solana", "other"],
        description: "Target blockchain family. Use 'other' for chains like Bitcoin, Cosmos, Aptos, etc.",
        default: "evm",
      },
      features: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "social-login",
            "external-wallets",
            "modal-ui",
            "wallet-ui",
            "smart-accounts",
            "mfa",
            "custom-auth",
            "server-side-verification",
            "private-key-export",
          ],
        },
        description: "Desired features for the integration",
      },
    },
    required: ["platform"],
  },
};

export function handleRecommendSdk(args: {
  platform: Platform;
  chain?: Chain;
  features?: string[];
}): string {
  const chain: Chain = args.chain || "evm";
  const features = args.features || [];
  const { capabilities, warnings } = getPlatformRecommendation(args.platform, chain);

  const featureWarnings: string[] = [];
  for (const feat of features) {
    switch (feat) {
      case "external-wallets":
        if (!capabilities.externalWallets)
          featureWarnings.push(`External wallet aggregation is NOT available on ${capabilities.displayName}. It's only available on web SDKs (React, Vue, JS).`);
        break;
      case "modal-ui":
        if (!capabilities.modalUI)
          featureWarnings.push(`Pre-built login modal is NOT available on ${capabilities.displayName}. You'll need to build your own login UI.`);
        break;
      case "smart-accounts":
        if (!capabilities.smartAccounts)
          featureWarnings.push(`Smart accounts integration is currently only available on web SDKs.`);
        break;
      case "custom-auth":
        if (args.platform === "node")
          featureWarnings.push(`Node.js SDK only supports custom authentication (no social login UI). This is the expected behavior.`);
        break;
    }
  }

  const quickStarts = findExamples({
    platform: args.platform,
    category: "quick-start",
    chain: chain !== "other" ? chain : undefined,
  });

  const allWarnings = [...warnings, ...featureWarnings];

  const sections: string[] = [
    `# SDK Recommendation: ${capabilities.displayName}`,
    "",
    `**Documentation:** ${capabilities.docUrl}`,
    `**SDK Repository:** ${capabilities.sdkRepo}`,
    `**Examples:** ${capabilities.examplesRepo}`,
    `**Language:** ${capabilities.language}`,
    "",
    "## Capabilities",
    `- Social Login: ${capabilities.socialLogin ? "Yes" : "No"}`,
    `- External Wallet Aggregation: ${capabilities.externalWallets ? "Yes" : "No"}`,
    `- Pre-built Modal UI: ${capabilities.modalUI ? "Yes" : "No"}`,
    `- Wallet Services UI: ${capabilities.walletServicesUI ? "Yes (webview-based)" : "No"}`,
    `- Built-in EVM Provider: ${capabilities.builtInProviderEVM ? "Yes" : "No"}`,
    `- Built-in Solana Provider: ${capabilities.builtInProviderSolana ? "Yes" : "No"}`,
    `- Wagmi Support: ${capabilities.wagmiSupport ? "Yes" : "No"}`,
    `- Private Key Export: ${capabilities.privateKeyExport ? "Yes (if enabled in dashboard)" : "No"}`,
    `- Smart Accounts: ${capabilities.smartAccounts ? "Yes" : "No"}`,
    `- MFA: ${capabilities.mfa ? "Yes" : "No"}`,
    `- Dashboard Chain Config: ${capabilities.dashboardChainConfig ? "Yes" : "No (copy RPC manually)"}`,
    "",
  ];

  if (capabilities.notes.length > 0) {
    sections.push("## Key Notes");
    capabilities.notes.forEach((n) => sections.push(`- ${n}`));
    sections.push("");
  }

  if (allWarnings.length > 0) {
    sections.push("## Warnings");
    allWarnings.forEach((w) => sections.push(`- ⚠️ ${w}`));
    sections.push("");
  }

  if (quickStarts.length > 0) {
    sections.push("## Recommended Quick Start Examples");
    quickStarts.forEach((qs) => {
      sections.push(`- **${qs.name}**: ${qs.description}`);
      sections.push(`  ${getExampleGitHubUrl(qs)}`);
    });
    sections.push("");
  }

  sections.push("## Next Steps");
  sections.push("1. Create a project on the Web3Auth Dashboard: https://dashboard.web3auth.io");
  sections.push("2. Grab your Client ID from Project Settings");
  sections.push("3. Allowlist your domain/bundle identifier");
  sections.push(`4. Follow the quick start guide: ${capabilities.docUrl}`);
  sections.push("5. Use the `get_integration_guide` tool for detailed code walkthroughs");

  return sections.join("\n");
}
