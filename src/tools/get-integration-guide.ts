import type { Platform } from "../content/platform-matrix.js";
import { PLATFORM_MATRIX } from "../content/platform-matrix.js";
import { findExamples, getExampleGitHubUrl, DOC_REGISTRY } from "../content/registry.js";
import { fetchDocPage } from "../fetcher/docs-fetcher.js";
import { fetchExampleReadme, fetchExamplePackageJson } from "../fetcher/github-fetcher.js";

export const GET_INTEGRATION_GUIDE_SCHEMA = {
  name: "get_integration_guide",
  description:
    "Get a detailed integration guide for a specific MetaMask Embedded Wallets (Web3Auth) SDK. Fetches live documentation and example code. Use after recommend_sdk to get implementation details.",
  inputSchema: {
    type: "object" as const,
    properties: {
      sdk: {
        type: "string",
        enum: ["react", "vue", "js", "react-native", "android", "ios", "flutter", "unity", "unreal", "node"],
        description: "The SDK/platform to get the integration guide for",
      },
      feature: {
        type: "string",
        enum: [
          "quick-start",
          "custom-auth-auth0",
          "custom-auth-firebase",
          "custom-auth-cognito",
          "custom-auth-jwt",
          "custom-auth-google",
          "grouped-connections",
          "evm-transactions",
          "solana-transactions",
          "other-chains",
          "smart-accounts",
          "wallet-ui",
          "server-side-verification",
          "mfa",
        ],
        description: "Specific feature or topic to focus on. Defaults to 'quick-start'.",
        default: "quick-start",
      },
    },
    required: ["sdk"],
  },
};

export async function handleGetIntegrationGuide(args: {
  sdk: Platform;
  feature?: string;
}): Promise<string> {
  const feature = args.feature || "quick-start";
  const caps = PLATFORM_MATRIX[args.sdk];
  const sections: string[] = [];

  sections.push(`# Integration Guide: ${caps.displayName} — ${featureDisplayName(feature)}`);
  sections.push("");

  // Fetch the main SDK doc page
  sections.push("## SDK Documentation\n");
  try {
    const docContent = await fetchDocPage(caps.docUrl);
    // Truncate to avoid overwhelming the LLM
    const truncated = docContent.length > 8000 ? docContent.substring(0, 8000) + "\n\n... (truncated, see full docs below)" : docContent;
    sections.push(truncated);
  } catch (err) {
    sections.push(`Could not fetch live docs. Visit: ${caps.docUrl}`);
  }
  sections.push("");

  // Find and fetch relevant example
  const examples = findRelevantExamples(args.sdk, feature);
  if (examples.length > 0) {
    const primary = examples[0];
    sections.push(`## Example: ${primary.name}\n`);
    sections.push(`**Repository:** ${getExampleGitHubUrl(primary)}`);
    sections.push(`**Description:** ${primary.description}\n`);

    // Fetch example README if available
    const readme = await fetchExampleReadme(primary.owner, primary.repo, primary.path);
    if (readme) {
      const truncatedReadme = readme.length > 4000 ? readme.substring(0, 4000) + "\n\n..." : readme;
      sections.push("### Example README\n");
      sections.push(truncatedReadme);
      sections.push("");
    }

    // Fetch package.json to show dependencies
    const pkgJson = await fetchExamplePackageJson(primary.owner, primary.repo, primary.path);
    if (pkgJson && pkgJson.dependencies) {
      sections.push("### Dependencies\n");
      sections.push("```json");
      sections.push(JSON.stringify(pkgJson.dependencies, null, 2));
      sections.push("```\n");
    }

    // Show other relevant examples
    if (examples.length > 1) {
      sections.push("### Other Related Examples\n");
      examples.slice(1).forEach((ex) => {
        sections.push(`- **${ex.name}**: ${ex.description}`);
        sections.push(`  ${getExampleGitHubUrl(ex)}`);
      });
      sections.push("");
    }
  }

  // Add feature-specific doc if applicable
  const featureDoc = getFeatureDocUrl(feature);
  if (featureDoc && featureDoc !== caps.docUrl) {
    sections.push(`## Feature Documentation\n`);
    try {
      const featureContent = await fetchDocPage(featureDoc);
      const truncated = featureContent.length > 6000 ? featureContent.substring(0, 6000) + "\n\n..." : featureContent;
      sections.push(truncated);
    } catch {
      sections.push(`Visit: ${featureDoc}`);
    }
    sections.push("");
  }

  sections.push("## Need Help?\n");
  sections.push("- Full docs: https://docs.metamask.io/embedded-wallets/");
  sections.push("- Builder Hub: https://builder.metamask.io/c/embedded-wallets/5");

  return sections.join("\n");
}

function findRelevantExamples(sdk: Platform, feature: string) {
  switch (feature) {
    case "quick-start":
      return findExamples({ platform: sdk, category: "quick-start" });
    case "custom-auth-auth0":
      return findExamples({ platform: sdk, authMethod: "auth0" });
    case "custom-auth-firebase":
      return findExamples({ platform: sdk, authMethod: "firebase" });
    case "custom-auth-cognito":
      return findExamples({ platform: sdk, authMethod: "cognito" });
    case "custom-auth-jwt":
      return findExamples({ platform: sdk, authMethod: "custom-jwt" });
    case "custom-auth-google":
      return findExamples({ platform: sdk, authMethod: "google" });
    case "grouped-connections":
      return findExamples({ platform: sdk, authMethod: "grouped" });
    case "evm-transactions":
      return findExamples({ platform: sdk, chain: "evm" });
    case "solana-transactions":
      return findExamples({ platform: sdk, chain: "solana" });
    case "other-chains":
      return findExamples({ platform: sdk, chain: "other" });
    case "smart-accounts":
      return findExamples({ platform: sdk }).filter((e) => e.name.toLowerCase().includes("smart"));
    case "server-side-verification":
      return findExamples({ platform: sdk }).filter((e) => e.name.toLowerCase().includes("server"));
    default:
      return findExamples({ platform: sdk, category: "quick-start" });
  }
}

function getFeatureDocUrl(feature: string): string | null {
  const featureDocMap: Record<string, string> = {
    "custom-auth-auth0": "https://docs.metamask.io/embedded-wallets/authentication/custom-connections/auth0/",
    "custom-auth-firebase": "https://docs.metamask.io/embedded-wallets/authentication/custom-connections/firebase/",
    "custom-auth-cognito": "https://docs.metamask.io/embedded-wallets/authentication/custom-connections/aws-cognito/",
    "custom-auth-jwt": "https://docs.metamask.io/embedded-wallets/authentication/custom-connections/custom-jwt/",
    "custom-auth-google": "https://docs.metamask.io/embedded-wallets/authentication/social-logins/google/",
    "grouped-connections": "https://docs.metamask.io/embedded-wallets/authentication/group-connections/",
    "evm-transactions": "https://docs.metamask.io/embedded-wallets/connect-blockchain/evm/",
    "solana-transactions": "https://docs.metamask.io/embedded-wallets/connect-blockchain/solana/",
    "other-chains": "https://docs.metamask.io/embedded-wallets/connect-blockchain/other/",
    "smart-accounts": "https://docs.metamask.io/embedded-wallets/features/smart-accounts/",
    "wallet-ui": "https://docs.metamask.io/embedded-wallets/features/whitelabel/",
    "server-side-verification": "https://docs.metamask.io/embedded-wallets/features/server-side-verification/",
    "mfa": "https://docs.metamask.io/embedded-wallets/sdk/react/advanced/mfa/",
  };
  return featureDocMap[feature] || null;
}

function featureDisplayName(feature: string): string {
  const names: Record<string, string> = {
    "quick-start": "Quick Start",
    "custom-auth-auth0": "Custom Auth (Auth0)",
    "custom-auth-firebase": "Custom Auth (Firebase)",
    "custom-auth-cognito": "Custom Auth (AWS Cognito)",
    "custom-auth-jwt": "Custom Auth (Custom JWT)",
    "custom-auth-google": "Custom Auth (Google)",
    "grouped-connections": "Grouped Connections",
    "evm-transactions": "EVM Transactions",
    "solana-transactions": "Solana Transactions",
    "other-chains": "Other Blockchains",
    "smart-accounts": "Smart Accounts",
    "wallet-ui": "Wallet UI / Whitelabel",
    "server-side-verification": "Server-Side Verification",
    "mfa": "Multi-Factor Authentication",
  };
  return names[feature] || feature;
}
