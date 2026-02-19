/**
 * Generates llms-full.txt by crawling all doc pages in the registry
 * and concatenating their content into a single file.
 *
 * Usage: npx tsx scripts/generate-llms-txt.ts
 */

import { writeFileSync } from "fs";
import { DOC_REGISTRY } from "../src/content/registry.js";
import { fetchDocPage } from "../src/fetcher/docs-fetcher.js";

async function main() {
  const sections: string[] = [];

  sections.push("# MetaMask Embedded Wallets (Web3Auth) - Full Documentation");
  sections.push("");
  sections.push("Generated for AI tool consumption. For the latest docs, visit: https://docs.metamask.io/embedded-wallets/");
  sections.push("");
  sections.push("---");
  sections.push("");

  let fetched = 0;
  let failed = 0;

  for (const doc of DOC_REGISTRY) {
    console.log(`Fetching: ${doc.title} (${doc.url})`);
    try {
      const content = await fetchDocPage(doc.url);
      sections.push(`## ${doc.title}`);
      sections.push(`URL: ${doc.url}`);
      sections.push(`Category: ${doc.category}`);
      sections.push("");
      sections.push(content);
      sections.push("");
      sections.push("---");
      sections.push("");
      fetched++;
    } catch (err) {
      console.error(`  Failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      sections.push(`## ${doc.title}`);
      sections.push(`URL: ${doc.url}`);
      sections.push("(Content unavailable)");
      sections.push("");
      sections.push("---");
      sections.push("");
      failed++;
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 500));
  }

  const output = sections.join("\n");
  writeFileSync("llms-full.txt", output, "utf-8");
  console.log(`\nDone. Fetched ${fetched} pages, ${failed} failed.`);
  console.log(`Output: llms-full.txt (${Math.round(output.length / 1024)}KB)`);
}

main().catch(console.error);
