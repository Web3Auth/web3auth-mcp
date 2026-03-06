import { findExamples, getExampleGitHubUrl, searchDocs, type ExampleEntry } from "../content/registry.js";
import { searchAlgolia, formatAlgoliaHits } from "../fetcher/algolia-fetcher.js";
import type { Platform, Chain } from "../content/platform-matrix.js";
import type { ToolResult } from "./types.js";

export async function handleSearchDocs(args: {
  query: string;
  platform?: Platform;
  chain?: Chain;
  category?: "quick-start" | "custom-auth" | "blockchain" | "feature" | "playground";
}): Promise<ToolResult> {
  const { query, platform, chain, category } = args;
  const sections: string[] = [];

  // ── Algolia doc search ─────────────────────────────────────────────────
  const algoliaHits = await searchAlgolia(query, { hitsPerPage: 15, filterEmbeddedWallets: true });
  const docResults = formatAlgoliaHits(algoliaHits);

  // Deduplicate by URL
  const seenUrls = new Set<string>();
  const uniqueDocs = docResults.filter((d) => {
    if (seenUrls.has(d.url)) return false;
    seenUrls.add(d.url);
    return true;
  });

  // Fall back to local registry when Algolia returns nothing (network error or no hits)
  const localDocs = uniqueDocs.length === 0 ? searchDocs(query) : [];

  // ── Example search ─────────────────────────────────────────────────────
  const terms = query.toLowerCase().split(/\s+/);
  const allExamples = findExamples({ platform, chain, category });
  const matchingExamples = allExamples
    .filter((e) => {
      const text = `${e.name} ${e.description} ${e.authMethod ?? ""} ${e.chain ?? ""} ${e.platform}`.toLowerCase();
      return terms.some((t) => text.includes(t));
    })
    .slice(0, 8);

  // ── Format output ──────────────────────────────────────────────────────
  if (uniqueDocs.length === 0 && localDocs.length === 0 && matchingExamples.length === 0) {
    return {
      text: [
        `No results found for "${query}".`,
        "",
        "Try:",
        "- Using different keywords (e.g. platform name, feature, error message)",
        "- Full docs: https://docs.metamask.io/embedded-wallets/",
        "- Community forum: https://builder.metamask.io/c/embedded-wallets/5",
      ].join("\n"),
    };
  }

  if (uniqueDocs.length > 0) {
    sections.push("## Documentation\n");
    for (const doc of uniqueDocs.slice(0, 10)) {
      sections.push(`### ${doc.title}`);
      if (doc.hierarchy) sections.push(`*${doc.hierarchy}*`);
      sections.push(`URL: ${doc.url}`);
      if (doc.snippet) sections.push(doc.snippet);
      sections.push("");
    }
  } else if (localDocs.length > 0) {
    sections.push("## Documentation (local index)\n");
    for (const doc of localDocs.slice(0, 10)) {
      sections.push(`### ${doc.title}`);
      sections.push(`URL: ${doc.url}`);
      sections.push("");
    }
  }

  if (matchingExamples.length > 0) {
    sections.push("## Examples\n");
    for (const ex of matchingExamples) {
      sections.push(`### ${ex.name} (${ex.platform})`);
      sections.push(ex.description);
      sections.push(`GitHub: ${getExampleGitHubUrl(ex)}`);
      if (ex.chain) sections.push(`Chain: ${ex.chain}`);
      if (ex.authMethod) sections.push(`Auth: ${ex.authMethod}`);
      sections.push("");
    }
  }

  return { text: sections.join("\n") };
}
