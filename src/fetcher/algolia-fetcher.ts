import { getCached, setCache } from "./cache.js";
import { GITHUB_RAW_BASE, GITHUB_API_BASE } from "./github-fetcher.js";

const ALGOLIA_APP_ID = "W4ZOZ72ZFG";
const ALGOLIA_API_KEY = "b4e925aa9bf05e5bef2e40b3ee6ee431";
const ALGOLIA_INDEX = "mmdocs";
const ALGOLIA_HOST = `https://${ALGOLIA_APP_ID}-dsn.algolia.net`;

const LLMS_FULL_URL = "https://docs.metamask.io/llms-embedded-wallets-full.txt";
const METAMASK_DOCS_API = `${GITHUB_API_BASE}/MetaMask/metamask-docs/contents`;
const METAMASK_DOCS_RAW = `${GITHUB_RAW_BASE}/MetaMask/metamask-docs/main`;

const API_TIMEOUT_MS = 10_000;   // 10s for API calls
const FILE_TIMEOUT_MS = 30_000;  // 30s for file downloads

// ── Types ────────────────────────────────────────────────────────────────

export interface AlgoliaHit {
  objectID: string;
  url: string;
  title?: string;
  content?: string;
  hierarchy?: {
    lvl0?: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5?: string;
  };
  type?: string;
  _snippetResult?: {
    content?: { value: string };
    hierarchy?: { [key: string]: { value: string } };
  };
}

export interface DocSearchResult {
  title: string;
  url: string;
  snippet: string;
  hierarchy: string;
}

// ── Algolia Search ───────────────────────────────────────────────────────

export async function searchAlgolia(
  query: string,
  opts: { hitsPerPage?: number; filterEmbeddedWallets?: boolean } = {},
): Promise<AlgoliaHit[]> {
  const cacheKey = `algolia:search:${query}:${JSON.stringify(opts)}`;
  const cached = getCached(cacheKey);
  if (cached) return JSON.parse(cached) as AlgoliaHit[];

  const body: Record<string, unknown> = {
    query,
    hitsPerPage: opts.hitsPerPage ?? 20,
    attributesToRetrieve: ["objectID", "url", "title", "content", "hierarchy", "type"],
    attributesToSnippet: ["content:30", "hierarchy.lvl1:20"],
    highlightPreTag: "",
    highlightPostTag: "",
  };

  // Note: url is not a facetable/filterable attribute in this index.
  // formatAlgoliaHits handles embedded-wallets URL filtering in JS.

  try {
    const response = await fetch(`${ALGOLIA_HOST}/1/indexes/${ALGOLIA_INDEX}/query`, {
      method: "POST",
      headers: {
        "X-Algolia-Application-Id": ALGOLIA_APP_ID,
        "X-Algolia-API-Key": ALGOLIA_API_KEY,
        "Content-Type": "application/json",
        "User-Agent": "Web3Auth-MCP-Server/2.0",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Algolia search failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { hits: AlgoliaHit[] };
    setCache(cacheKey, JSON.stringify(data.hits));
    return data.hits;
  } catch (err) {
    console.error("Algolia search error:", err);
    return [];
  }
}

// ── Format search results ────────────────────────────────────────────────

export function formatAlgoliaHits(hits: AlgoliaHit[]): DocSearchResult[] {
  return hits
    .filter((h) => h.url?.includes("embedded-wallets"))
    .map((h) => {
      const hier = h.hierarchy ?? {};
      const breadcrumb = [hier.lvl0, hier.lvl1, hier.lvl2, hier.lvl3]
        .filter(Boolean)
        .join(" > ");

      const snippet =
        h._snippetResult?.content?.value ||
        h.content?.slice(0, 200) ||
        breadcrumb;

      return {
        title: h.title ?? hier.lvl1 ?? hier.lvl0 ?? "Untitled",
        url: h.url ?? "",
        snippet: snippet.trim(),
        hierarchy: breadcrumb,
      };
    })
    .filter((r) => r.url);
}

// ── Fetch full page from Algolia ─────────────────────────────────────────

export async function fetchDocPageFromAlgolia(url: string): Promise<string | null> {
  // Normalise URL: ensure trailing slash, strip hash/query
  const normalised = url.replace(/[?#].*$/, "").replace(/\/?$/, "/");
  const cacheKey = `algolia:page:${normalised}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    // url is not a filterable attribute in this index, so we search by path segment
    // and post-filter by url_without_anchor in JS.
    const pathQuery = normalised.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");

    const response = await fetch(`${ALGOLIA_HOST}/1/indexes/${ALGOLIA_INDEX}/query`, {
      method: "POST",
      headers: {
        "X-Algolia-Application-Id": ALGOLIA_APP_ID,
        "X-Algolia-API-Key": ALGOLIA_API_KEY,
        "Content-Type": "application/json",
        "User-Agent": "Web3Auth-MCP-Server/2.0",
      },
      body: JSON.stringify({
        query: pathQuery,
        hitsPerPage: 100,
        attributesToRetrieve: ["objectID", "url", "url_without_anchor", "title", "content", "hierarchy", "type", "anchor"],
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { hits: Array<AlgoliaHit & { url_without_anchor?: string }> };
    // Filter to only hits whose URL matches this specific page
    const pageHits = data.hits.filter(
      (h) => (h.url_without_anchor ?? h.url ?? "").replace(/\/?$/, "/") === normalised,
    );
    if (!pageHits.length) return null;

    // Sort hits by type (lvl0 -> lvl1 -> ... -> content) and reconstruct page
    const ordered = pageHits.sort((a, b) => {
      const typeOrder = ["lvl0", "lvl1", "lvl2", "lvl3", "lvl4", "lvl5", "content"];
      return typeOrder.indexOf(a.type ?? "content") - typeOrder.indexOf(b.type ?? "content");
    });

    const lines: string[] = [];
    for (const hit of ordered) {
      const hier = hit.hierarchy ?? {};
      if (hit.type?.startsWith("lvl")) {
        const level = parseInt(hit.type.replace("lvl", "")) + 1;
        const heading = hier[hit.type as keyof typeof hier] ?? hit.title;
        if (heading) lines.push(`${"#".repeat(Math.min(level, 6))} ${heading}\n`);
      } else if (hit.content) {
        lines.push(hit.content + "\n");
      }
    }

    const result = lines.join("\n").trim();
    if (result) setCache(cacheKey, result);
    return result || null;
  } catch {
    return null;
  }
}

// ── Fetch full page from llms.txt ────────────────────────────────────────

export async function fetchDocPageFromLlmsTxt(url: string): Promise<string | null> {
  const cacheKey = "llms:full-txt";
  let fullText = getCached(cacheKey);

  if (!fullText) {
    try {
      const response = await fetch(LLMS_FULL_URL, {
        headers: { "User-Agent": "Web3Auth-MCP-Server/2.0" },
        signal: AbortSignal.timeout(FILE_TIMEOUT_MS),
      });
      if (!response.ok) return null;
      fullText = await response.text();
      // Cache for 6 hours -- this file is large but doesn't change often
      setCache(cacheKey, fullText, 6 * 60 * 60 * 1000);
    } catch {
      return null;
    }
  }

  // The llms.txt file uses "# URL\n\ncontent\n\n---\n\n" sections
  const normUrl = url.replace(/\/?$/, "/");
  const escapedUrl = normUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sectionPattern = new RegExp(
    `(?:^|\\n)(?:#+\\s+)?${escapedUrl}[^\\n]*\\n([\\s\\S]*?)(?=\\n#+\\s+https?://|\\n---\\n|$)`,
    "i",
  );
  const match = fullText.match(sectionPattern);
  if (match?.[1]?.trim()) return match[1].trim();

  // Fallback: try matching by path segment
  const pathMatch = url.match(/embedded-wallets\/.+/)?.[0];
  if (pathMatch) {
    const pathPattern = new RegExp(
      `(?:^|\\n)(?:#+\\s+)?[^\\n]*${pathMatch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^\\n]*\\n([\\s\\S]*?)(?=\\n#+\\s+https?://|\\n---\\n|$)`,
      "i",
    );
    const pathMatch2 = fullText.match(pathPattern);
    if (pathMatch2?.[1]?.trim()) return pathMatch2[1].trim();
  }

  return null;
}

// ── Fetch raw MDX from GitHub ────────────────────────────────────────────

export async function fetchDocPageFromGitHub(url: string): Promise<string | null> {
  // Map docs.metamask.io/embedded-wallets/... -> embedded-wallets/...
  const match = url.match(/docs\.metamask\.io\/(.+)/);
  if (!match) return null;

  let repoPath = match[1].replace(/\/$/, "").replace(/[?#].*$/, "");

  const cacheKey = `gh:mdx:${repoPath}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Try to find the .mdx file -- could be README.mdx, index.mdx, or <last-segment>.mdx
  const candidates = buildMdxCandidates(repoPath);

  for (const candidate of candidates) {
    try {
      const rawUrl = `${METAMASK_DOCS_RAW}/${candidate}`;
      const response = await fetch(rawUrl, {
        headers: { "User-Agent": "Web3Auth-MCP-Server/2.0" },
        signal: AbortSignal.timeout(FILE_TIMEOUT_MS),
      });
      if (response.ok) {
        const content = await response.text();
        setCache(cacheKey, content);
        return content;
      }
    } catch {
      continue;
    }
  }

  // Try GitHub Contents API to discover the actual file
  try {
    const apiUrl = `${METAMASK_DOCS_API}/${repoPath}`;
    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Web3Auth-MCP-Server/2.0" },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (response.ok) {
      const items = (await response.json()) as Array<{ name: string; type: string; download_url: string | null }>;
      const mdxFile = items.find((i) => i.type === "file" && (i.name.endsWith(".mdx") || i.name.endsWith(".md")));
      if (mdxFile?.download_url) {
        const fileResp = await fetch(mdxFile.download_url, {
          headers: { "User-Agent": "Web3Auth-MCP-Server/2.0" },
          signal: AbortSignal.timeout(FILE_TIMEOUT_MS),
        });
        if (fileResp.ok) {
          const content = await fileResp.text();
          setCache(cacheKey, content);
          return content;
        }
      }
    }
  } catch {
    // ignore
  }

  return null;
}

function buildMdxCandidates(repoPath: string): string[] {
  const segments = repoPath.split("/");
  const last = segments[segments.length - 1];
  const parent = segments.slice(0, -1).join("/");

  return [
    `${repoPath}/README.mdx`,
    `${repoPath}/index.mdx`,
    `${repoPath}.mdx`,
    parent ? `${parent}/${last}.mdx` : `${last}.mdx`,
    `${repoPath}/README.md`,
    `${repoPath}/index.md`,
  ].filter(Boolean);
}

// ── Main: fetch doc page with fallback chain ─────────────────────────────

export async function fetchDocPage(url: string): Promise<string> {
  // Tier 1: Algolia
  const algoliaContent = await fetchDocPageFromAlgolia(url);
  if (algoliaContent) return algoliaContent;

  // Tier 2: llms.txt
  const llmsContent = await fetchDocPageFromLlmsTxt(url);
  if (llmsContent) return llmsContent;

  // Tier 3: GitHub raw MDX
  const githubContent = await fetchDocPageFromGitHub(url);
  if (githubContent) return githubContent;

  throw new Error(`Could not fetch content for ${url} from any source`);
}
