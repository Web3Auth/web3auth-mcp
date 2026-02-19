import { searchDocs, findExamples, getExampleGitHubUrl, type ExampleEntry } from "../content/registry.js";
import { fetchDocPage } from "../fetcher/docs-fetcher.js";

export const SEARCH_DOCS_SCHEMA = {
  name: "search_docs",
  description:
    "Search MetaMask Embedded Wallets (Web3Auth) documentation and examples. Returns matching doc pages with live content and relevant code examples.",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "Search query -- describe what you're looking for (e.g., 'how to set up custom authentication with Auth0', 'solana transaction signing')",
      },
      fetch_content: {
        type: "boolean",
        description: "If true, fetches and returns the full content of the top matching doc page. Defaults to false (returns links only).",
        default: false,
      },
    },
    required: ["query"],
  },
};

export async function handleSearchDocs(args: {
  query: string;
  fetch_content?: boolean;
}): Promise<string> {
  const docResults = searchDocs(args.query);
  const exampleResults = findExamples({});

  // Score examples against query too
  const terms = args.query.toLowerCase().split(/\s+/);
  const matchingExamples = exampleResults
    .filter((e) => {
      const text = `${e.name} ${e.description} ${e.authMethod || ""} ${e.chain || ""} ${e.platform}`.toLowerCase();
      return terms.some((t) => text.includes(t));
    })
    .slice(0, 5);

  const sections: string[] = [];

  if (docResults.length === 0 && matchingExamples.length === 0) {
    return [
      `No results found for "${args.query}".`,
      "",
      "Try:",
      "- Using different keywords",
      "- Checking the full documentation: https://docs.metamask.io/embedded-wallets/",
      "- Asking on Builder Hub: https://builder.metamask.io/c/embedded-wallets/5",
    ].join("\n");
  }

  if (docResults.length > 0) {
    sections.push("## Documentation Matches\n");
    const topDocs = docResults.slice(0, 8);
    topDocs.forEach((doc) => {
      sections.push(`- **${doc.title}** [${doc.category}]`);
      sections.push(`  ${doc.url}`);
    });
    sections.push("");
  }

  if (matchingExamples.length > 0) {
    sections.push("## Relevant Examples\n");
    matchingExamples.forEach((ex: ExampleEntry) => {
      sections.push(`- **${ex.name}** (${ex.platform}): ${ex.description}`);
      sections.push(`  ${getExampleGitHubUrl(ex)}`);
    });
    sections.push("");
  }

  if (args.fetch_content && docResults.length > 0) {
    const topDoc = docResults[0];
    sections.push(`## Content: ${topDoc.title}\n`);
    try {
      const content = await fetchDocPage(topDoc.url);
      sections.push(content);
    } catch (err) {
      sections.push(`Failed to fetch content: ${err instanceof Error ? err.message : "Unknown error"}`);
      sections.push(`Visit directly: ${topDoc.url}`);
    }
  }

  return sections.join("\n");
}
