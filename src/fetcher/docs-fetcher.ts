import * as cheerio from "cheerio";
import { getCached, setCache } from "./cache.js";

export async function fetchDocPage(url: string): Promise<string> {
  const cached = getCached(`doc:${url}`);
  if (cached) return cached;

  const response = await fetch(url, {
    headers: { "User-Agent": "Web3Auth-MCP-Server/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const content = extractDocContent(html);

  setCache(`doc:${url}`, content);
  return content;
}

function extractDocContent(html: string): string {
  const $ = cheerio.load(html);

  // Remove navigation, header, footer, sidebars
  $("nav, header, footer, .navbar, .sidebar, .menu, .table-of-contents, .breadcrumbs, script, style, .theme-doc-footer, .pagination-nav").remove();

  // Target the main content area
  const mainContent =
    $("article").first().length > 0
      ? $("article").first()
      : $("main").first().length > 0
        ? $("main").first()
        : $(".markdown, .theme-doc-markdown").first();

  if (!mainContent.length) {
    return $("body").text().trim().substring(0, 10000);
  }

  const lines: string[] = [];

  mainContent.find("h1, h2, h3, h4, h5, h6, p, li, pre, code, td, th, blockquote").each((_, el) => {
    const $el = $(el);
    const tag = el.type === "tag" ? el.tagName.toLowerCase() : "";

    if (tag.startsWith("h")) {
      const level = parseInt(tag[1]);
      lines.push(`\n${"#".repeat(level)} ${$el.text().trim()}\n`);
    } else if (tag === "pre") {
      const code = $el.text().trim();
      const lang = $el.find("code").attr("class")?.match(/language-(\w+)/)?.[1] || "";
      lines.push(`\n\`\`\`${lang}\n${code}\n\`\`\`\n`);
    } else if (tag === "li") {
      lines.push(`- ${$el.text().trim()}`);
    } else if (tag === "blockquote") {
      lines.push(`> ${$el.text().trim()}`);
    } else if (tag === "code") {
      const parent = $el.parent()[0];
      if (parent && "tagName" in parent && (parent as { tagName: string }).tagName === "pre") return;
    } else {
      const text = $el.text().trim();
      if (text) lines.push(text);
    }
  });

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
