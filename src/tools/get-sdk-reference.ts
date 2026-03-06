import { SDK_SOURCE_REGISTRY, getSdkRegistryKeys, getSdkLanguageId } from "../content/sdk-registry.js";
import { PLATFORM_MATRIX, type Platform } from "../content/platform-matrix.js";
import { fetchSdkModule, type SdkFileResult } from "../fetcher/github-fetcher.js";
import type { FilePurpose, SdkModule } from "../content/sdk-registry.js";
import type { ToolResult } from "./types.js";

const MAX_RESPONSE_BYTES = 80_000;

export async function handleGetSdkReference(args: {
  platform: Platform;
  module?: string;
  focus?: string;
}): Promise<ToolResult> {
  const registryKeys = getSdkRegistryKeys(args.platform);
  if (!registryKeys.length) {
    return { text: `No SDK source registry configured for platform: ${args.platform}`, isError: true };
  }

  const focus = (args.focus ?? "types") as FilePurpose | "all";
  const caps = PLATFORM_MATRIX[args.platform];
  const sections: string[] = [
    `# SDK Reference: ${caps.displayName} (${caps.language})`,
    `**Repository:** ${caps.sdkRepo}`,
    "",
    "> **Note:** This is SDK source code for reference and debugging. Use `get_example` for recommended integration patterns. Many SDK options are internal or legacy — only use what the examples demonstrate.",
    "",
  ];

  let totalSize = 0;

  for (const key of registryKeys) {
    const config = SDK_SOURCE_REGISTRY[key];
    if (!config) continue;

    if (config.modules.length === 0) {
      sections.push(
        `No module mappings are configured for this SDK yet. Browse the repository directly:\n` +
        `**${caps.sdkRepo}**\n\n` +
        `Use \`get_example platform="${args.platform}"\` to see working integration examples instead.`,
      );
      continue;
    }

    // Select modules to fetch
    let modules: SdkModule[];

    if (args.module) {
      const found = config.modules.filter((m) => m.id === args.module);
      if (!found.length) {
        const available = config.modules.map((m) => `  - \`${m.id}\`: ${m.label}`).join("\n");
        return {
          text: `Module "${args.module}" not found for ${caps.displayName}.\n\nAvailable modules:\n${available}`,
          isError: true,
        };
      }
      modules = found;
    } else {
      modules = selectModulesByFocus(config.modules, focus, args.platform);
    }

    const lang = getSdkLanguageId(config.language);

    // Fetch and render each module
    for (const mod of modules) {
      const files = await fetchSdkModule(config, mod);
      if (!files.length) continue;

      // Filter files by focus (unless a specific module was requested)
      const filtered = args.module ? files : filterFilesByFocus(files, focus);
      if (!filtered.length) continue;

      sections.push(`## ${mod.label}`);
      sections.push(`*${mod.description}*\n`);

      for (const file of filtered) {
        // Check context budget
        if (totalSize + file.content.length > MAX_RESPONSE_BYTES) {
          sections.push(
            `> **Budget exceeded** — skipped \`${file.path}\`. ` +
            `Use \`get_sdk_reference(platform="${args.platform}", module="${mod.id}")\` to fetch this module specifically.`,
          );
          continue;
        }

        sections.push(`### ${file.description}`);
        sections.push(`\`${file.path}\`\n`);
        sections.push("```" + lang);
        sections.push(file.content);
        sections.push("```\n");
        totalSize += file.content.length;
      }
    }

    // Show modules that weren't fetched
    const fetchedIds = new Set(modules.map((m) => m.id));
    const remaining = config.modules.filter((m) => !fetchedIds.has(m.id));
    if (remaining.length > 0) {
      sections.push("\n---\n\n## Other Available Modules\n");
      sections.push("Fetch with `get_sdk_reference` using the `module` parameter:\n");
      for (const m of remaining) {
        sections.push(`- **\`${m.id}\`**: ${m.label} — ${m.description}`);
      }
    }
  }

  return { text: sections.join("\n") };
}

/** Select which modules to fetch based on focus and platform. */
function selectModulesByFocus(
  modules: SdkModule[],
  focus: FilePurpose | "all",
  platform: Platform,
): SdkModule[] {
  if (focus === "all") {
    // Return all modules sorted by priority, but cap at priority <= 2 unless module is specified
    return modules.filter((m) => m.priority <= 2).sort((a, b) => a.priority - b.priority);
  }

  if (focus === "types") {
    return modules.filter((m) => m.priority === 1);
  }

  if (focus === "hooks") {
    // React-specific: return hooks + types for context
    return modules.filter((m) =>
      m.id.includes("hooks") || m.id.includes("composables") || m.priority === 1,
    );
  }

  // For other focuses (main-class, errors, config), return matching + types
  return modules.filter((m) =>
    m.priority === 1 || m.files.some((f) => f.purpose === focus),
  );
}

/** Filter fetched files by purpose. */
function filterFilesByFocus(files: SdkFileResult[], focus: FilePurpose | "all"): SdkFileResult[] {
  if (focus === "all") return files;
  // Always include types and config alongside the focused purpose
  return files.filter((f) =>
    f.purpose === focus || f.purpose === "types" || f.purpose === "config",
  );
}
