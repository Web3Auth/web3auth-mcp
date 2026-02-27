import { fetchDocPage } from "../fetcher/algolia-fetcher.js";

export async function handleGetDoc(args: { url: string }): Promise<string> {
  const { url } = args;

  if (!url.includes("docs.metamask.io")) {
    return `Error: Only docs.metamask.io URLs are supported. Got: ${url}`;
  }

  try {
    const content = await fetchDocPage(url);
    return [
      `# Documentation: ${url}`,
      "",
      content,
    ].join("\n");
  } catch (err) {
    return [
      `Failed to fetch documentation for: ${url}`,
      "",
      `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      "",
      "Try visiting the URL directly or use search_docs to find alternative pages.",
    ].join("\n");
  }
}
