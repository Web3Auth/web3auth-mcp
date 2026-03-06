import { fetchDocPage } from "../fetcher/algolia-fetcher.js";
import type { ToolResult } from "./types.js";

export async function handleGetDoc(args: { url: string }): Promise<ToolResult> {
  const { url } = args;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { text: `Error: Invalid URL. Got: ${url}`, isError: true };
  }
  if (parsedUrl.hostname !== "docs.metamask.io") {
    return { text: `Error: Only docs.metamask.io URLs are supported. Got: ${url}`, isError: true };
  }

  try {
    const { content, source } = await fetchDocPage(url);
    const sourceNote = source !== "algolia"
      ? `\n\n*Note: Content served from ${source === "llms-txt" ? "llms.txt" : "GitHub MDX"} fallback — Algolia index unavailable for this page.*`
      : "";
    return {
      text: [`# Documentation: ${url}`, "", content + sourceNote].join("\n"),
    };
  } catch (err) {
    return {
      text: [
        `Failed to fetch documentation for: ${url}`,
        "",
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        "",
        "Try visiting the URL directly or use search_docs to find alternative pages.",
      ].join("\n"),
      isError: true,
    };
  }
}
