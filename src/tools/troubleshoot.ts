import { fetchDocPage } from "../fetcher/docs-fetcher.js";

export const TROUBLESHOOT_SCHEMA = {
  name: "troubleshoot",
  description:
    "Diagnose and troubleshoot common MetaMask Embedded Wallets (Web3Auth) integration issues. Provide an error message or describe the symptom to get targeted debugging guidance.",
  inputSchema: {
    type: "object" as const,
    properties: {
      error_or_symptom: {
        type: "string",
        description: "The error message, stack trace snippet, or description of the problem (e.g., 'different wallet address after changing login method', 'polyfill error in Vite', 'popup blocked on Safari')",
      },
      sdk: {
        type: "string",
        enum: ["react", "vue", "js", "react-native", "android", "ios", "flutter", "unity", "unreal", "node"],
        description: "The SDK being used (helps narrow down platform-specific issues)",
      },
      bundler: {
        type: "string",
        enum: ["vite", "webpack", "metro", "nuxt", "svelte"],
        description: "The bundler being used (relevant for polyfill issues)",
      },
    },
    required: ["error_or_symptom"],
  },
};

interface IssuePattern {
  patterns: RegExp[];
  title: string;
  docUrl: string;
  quickFix: string;
}

const KNOWN_ISSUES: IssuePattern[] = [
  {
    patterns: [
      /different\s*(private\s*)?key/i,
      /wallet\s*address\s*(changed|different|mismatch)/i,
      /different\s*wallet/i,
      /key\s*mismatch/i,
      /address\s*changed/i,
    ],
    title: "Different Private Keys / Wallet Addresses",
    docUrl: "https://docs.metamask.io/embedded-wallets/troubleshooting/different-private-key/",
    quickFix:
      "Wallet addresses differ when: (1) Client ID changes, (2) Network changes (devnet vs mainnet), (3) Login method changes without grouped connections, (4) useCoreKitKey/useSFAKey flag is toggled. Ensure same client ID + same network + same connection across integrations.",
  },
  {
    patterns: [
      /jwt/i,
      /jwks/i,
      /verify.*token/i,
      /could\s*not\s*verify\s*identity/i,
      /duplicate\s*token/i,
      /expired\s*token/i,
      /verifier.*id.*field/i,
      /kid/i,
      /jws\s*signature/i,
    ],
    title: "JWT / Custom Authentication Errors",
    docUrl: "https://docs.metamask.io/embedded-wallets/troubleshooting/jwt-errors/",
    quickFix:
      "Common causes: (1) verifierIdField mismatch between code and dashboard, (2) JWKS endpoint unreachable or missing kid, (3) JWT iat must be within 60s of current time, (4) Duplicate token -- each login needs a fresh JWT. Check dashboard connection config matches your JWT payload.",
  },
  {
    patterns: [
      /polyfill/i,
      /buffer/i,
      /process/i,
      /crypto.*browserify/i,
      /stream/i,
      /cannot\s*resolve/i,
      /module\s*not\s*found/i,
      /eccrypto/i,
      /global\s*is\s*not\s*defined/i,
    ],
    title: "Bundler Polyfill Issues",
    docUrl: "", // set dynamically based on bundler
    quickFix: "Web3Auth requires buffer and process polyfills. The fix depends on your bundler.",
  },
  {
    patterns: [
      /popup.*block/i,
      /blocked.*popup/i,
      /safari.*popup/i,
      /popup.*safari/i,
    ],
    title: "Popup Blocked by Browser",
    docUrl: "https://docs.metamask.io/embedded-wallets/troubleshooting/popup-blocked-issue/",
    quickFix:
      "Browsers block popups that aren't triggered by direct user action. Fix: call connectTo directly on button click (not in async chain), or switch uxMode from 'popup' to 'redirect'.",
  },
  {
    patterns: [
      /deep\s*link/i,
      /redirect.*uri/i,
      /allowlist/i,
      /whitelist/i,
      /cors/i,
      /domain.*not.*allowed/i,
      /bundle.*identifier/i,
    ],
    title: "Allowlist / Deep Linking Issues",
    docUrl: "https://docs.metamask.io/embedded-wallets/dashboard/allowlist/",
    quickFix:
      "Every domain/URL must be allowlisted in the Web3Auth dashboard. For mobile apps, add your bundle identifier and deep link scheme. For web, add your domain (localhost only works on Sapphire Devnet).",
  },
  {
    patterns: [
      /bigint/i,
      /BigInt/,
    ],
    title: "BigInt Browser Compatibility",
    docUrl: "https://docs.metamask.io/embedded-wallets/troubleshooting/supported-browsers/",
    quickFix:
      "Web3Auth requires BigInt support. Minimum browsers: Chrome 67+, Safari 14+, Firefox 68+, Edge 79+. If targeting older browsers, you'll need a polyfill or transpilation step.",
  },
  {
    patterns: [
      /localhost/i,
      /mainnet.*localhost/i,
      /not\s*working.*local/i,
    ],
    title: "Localhost Not Working on Mainnet",
    docUrl: "https://docs.metamask.io/embedded-wallets/dashboard/project-settings/",
    quickFix:
      "Sapphire Mainnet does NOT allow localhost. Use Sapphire Devnet for local development. Switch to mainnet only for production deployments with proper domains.",
  },
];

export async function handleTroubleshoot(args: {
  error_or_symptom: string;
  sdk?: string;
  bundler?: string;
}): Promise<string> {
  const input = args.error_or_symptom;
  const sections: string[] = [];

  // Find matching issues
  const matches = KNOWN_ISSUES.filter((issue) =>
    issue.patterns.some((p) => p.test(input)),
  );

  if (matches.length === 0) {
    sections.push("# Troubleshooting\n");
    sections.push(`Could not identify a specific known issue from: "${input}"\n`);
    sections.push("## Suggestions\n");
    sections.push("1. Check the full troubleshooting guide: https://docs.metamask.io/embedded-wallets/troubleshooting/");
    sections.push("2. Search the docs using the `search_docs` tool with different keywords");
    sections.push("3. Check SDK errors & warnings: https://docs.metamask.io/embedded-wallets/troubleshooting/");
    sections.push("4. Ask on Builder Hub for human support: https://builder.metamask.io/c/embedded-wallets/5");
    return sections.join("\n");
  }

  for (const match of matches) {
    let docUrl = match.docUrl;

    // Resolve polyfill doc URL based on bundler
    if (match.title === "Bundler Polyfill Issues") {
      docUrl = resolvePolyfillDocUrl(args.bundler, args.sdk);
    }

    sections.push(`# ${match.title}\n`);
    sections.push(`**Quick Fix:** ${match.quickFix}\n`);
    sections.push(`**Full Guide:** ${docUrl}\n`);

    // Fetch live troubleshooting content
    if (docUrl) {
      try {
        const content = await fetchDocPage(docUrl);
        const truncated = content.length > 6000 ? content.substring(0, 6000) + "\n\n..." : content;
        sections.push("## Detailed Guide\n");
        sections.push(truncated);
      } catch {
        sections.push(`Visit the guide directly: ${docUrl}`);
      }
    }

    sections.push("\n---\n");
  }

  sections.push("## Still Stuck?\n");
  sections.push("- Full troubleshooting: https://docs.metamask.io/embedded-wallets/troubleshooting/");
  sections.push("- Builder Hub: https://builder.metamask.io/c/embedded-wallets/5");

  return sections.join("\n");
}

function resolvePolyfillDocUrl(bundler?: string, sdk?: string): string {
  if (bundler === "metro" || sdk === "react-native") {
    return "https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/";
  }
  if (bundler === "nuxt") {
    return "https://docs.metamask.io/embedded-wallets/troubleshooting/nuxt-issues/";
  }
  if (bundler === "svelte") {
    return "https://docs.metamask.io/embedded-wallets/troubleshooting/svelte-issues/";
  }
  if (bundler === "webpack") {
    return "https://docs.metamask.io/embedded-wallets/troubleshooting/webpack-issues/";
  }
  // Default to Vite (most common for new projects)
  return "https://docs.metamask.io/embedded-wallets/troubleshooting/vite-issues/";
}
