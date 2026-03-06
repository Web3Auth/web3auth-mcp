import { findExamples, getExampleGitHubUrl, type ExampleEntry } from "../content/registry.js";
import { fetchExampleFull } from "../fetcher/github-fetcher.js";
import { getPlatformRecommendation, type Platform, type Chain } from "../content/platform-matrix.js";
import type { ToolResult } from "./types.js";

export async function handleGetExample(args: {
  name?: string;
  platform?: Platform;
  chain?: Chain;
  category?: "quick-start" | "custom-auth" | "blockchain" | "feature" | "playground";
  auth_method?: string;
}): Promise<ToolResult> {
  const { name, platform, chain, category, auth_method } = args;

  // Find the matching example from registry
  let example: ExampleEntry | undefined;

  if (name) {
    // Exact name match first, then fuzzy
    const all = findExamples({ platform, chain, category });
    example =
      all.find((e) => e.name.toLowerCase() === name.toLowerCase()) ??
      all.find((e) => e.name.toLowerCase().includes(name.toLowerCase())) ??
      all.find((e) =>
        name
          .toLowerCase()
          .split(/\s+/)
          .some((t) => `${e.name} ${e.description} ${e.platform}`.toLowerCase().includes(t)),
      );
  }

  if (!example) {
    // Fall back to filters
    const results = findExamples({
      platform,
      chain,
      category,
      authMethod: auth_method,
    });
    example = results[0];
  }

  if (!example) {
    const filters = [platform, chain, category, auth_method].filter(Boolean).join(", ");
    return {
      text: [
        `No example found${filters ? ` for: ${filters}` : ""}.`,
        "",
        "Use search_docs to find available examples.",
      ].join("\n"),
      isError: true,
    };
  }

  const githubUrl = getExampleGitHubUrl(example);
  const { warnings } = chain
    ? getPlatformRecommendation(example.platform, chain)
    : getPlatformRecommendation(example.platform, example.chain ?? "evm");

  const sections: string[] = [
    `# Example: ${example.name}`,
    "",
    `**Platform**: ${example.platform}`,
    `**Description**: ${example.description}`,
    `**GitHub**: ${githubUrl}`,
    example.chain ? `**Chain**: ${example.chain}` : "",
    example.authMethod ? `**Auth Method**: ${example.authMethod}` : "",
    "",
    ...(warnings.length > 0
      ? ["**Platform Notes:**", ...warnings.map((w) => `- ${w}`), ""]
      : []),
    "---",
    "",
  ].filter((l) => l !== undefined);

  // Fetch all source files
  try {
    const files = await fetchExampleFull(example.owner, example.repo, example.path);

    if (!files.length) {
      return { text: [...sections, "Could not fetch example files. Visit the GitHub URL directly."].join("\n") };
    }

    sections.push(`## Source Files (${files.length} files)\n`);

    // Sort: config files first, then source files, then others
    const sorted = sortFiles(files.map((f) => ({ ...f, relativePath: f.path.replace(example!.path + "/", "") })));

    for (const file of sorted) {
      const ext = file.relativePath.split(".").pop() ?? "";
      const lang = extToLang(ext);
      sections.push(`### \`${file.relativePath}\``);
      sections.push(`\`\`\`${lang}`);
      sections.push(file.content);
      sections.push("```");
      sections.push("");
    }
  } catch (err) {
    sections.push(`Failed to fetch source files: ${err instanceof Error ? err.message : "Unknown error"}`);
    sections.push(`Visit directly: ${githubUrl}`);
  }

  return { text: sections.join("\n") };
}

function sortFiles(files: Array<{ relativePath: string; content: string }>): typeof files {
  const priority: Record<string, number> = {
    "package.json": 0,
    "vite.config.ts": 1,
    "vite.config.js": 1,
    "next.config.ts": 1,
    "next.config.js": 1,
    "metro.config.js": 1,
    "tsconfig.json": 2,
    "AndroidManifest.xml": 2,
    "Info.plist": 2,
    "pubspec.yaml": 2,
    ".env.example": 3,
  };

  return files.sort((a, b) => {
    const pa = priority[a.relativePath.split("/").pop() ?? ""] ?? 99;
    const pb = priority[b.relativePath.split("/").pop() ?? ""] ?? 99;
    if (pa !== pb) return pa - pb;
    return a.relativePath.localeCompare(b.relativePath);
  });
}

function extToLang(ext: string): string {
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    html: "html",
    css: "css",
    scss: "scss",
    swift: "swift",
    kt: "kotlin",
    kts: "kotlin",
    dart: "dart",
    cs: "csharp",
    cpp: "cpp",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    gradle: "groovy",
    md: "markdown",
    mdx: "markdown",
    plist: "xml",
    sh: "bash",
    env: "bash",
  };
  return map[ext] ?? ext;
}
