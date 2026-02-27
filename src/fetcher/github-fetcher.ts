import { getCached, setCache } from "./cache.js";

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";
const GITHUB_API_BASE = "https://api.github.com/repos";

const SKIP_FILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".gitignore",
  ".gitattributes",
  ".DS_Store",
  "Thumbs.db",
]);

const SKIP_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".mp4", ".webm", ".ogg", ".mp3", ".wav",
  ".pdf", ".zip", ".tar", ".gz", ".lock",
]);

// ── Single file fetch ─────────────────────────────────────────────────────

export async function fetchExampleFile(
  owner: string,
  repo: string,
  path: string,
  filePath: string,
): Promise<string> {
  const fullPath = path ? `${path}/${filePath}` : filePath;
  const url = `${GITHUB_RAW_BASE}/${owner}/${repo}/main/${fullPath}`;

  const cached = getCached(`gh:${url}`);
  if (cached) return cached;

  const response = await fetch(url, {
    headers: { "User-Agent": "Web3Auth-MCP-Server/2.0" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const content = await response.text();
  setCache(`gh:${url}`, content);
  return content;
}

export async function fetchExampleReadme(
  owner: string,
  repo: string,
  path: string,
): Promise<string | null> {
  try {
    return await fetchExampleFile(owner, repo, path, "README.md");
  } catch {
    return null;
  }
}

export async function fetchExamplePackageJson(
  owner: string,
  repo: string,
  path: string,
): Promise<Record<string, unknown> | null> {
  try {
    const content = await fetchExampleFile(owner, repo, path, "package.json");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function listExampleFiles(
  owner: string,
  repo: string,
  path: string,
): Promise<string[]> {
  const apiUrl = `${GITHUB_API_BASE}/${owner}/${repo}/contents/${path}`;

  const cached = getCached(`gh-list:${apiUrl}`);
  if (cached) return JSON.parse(cached);

  const response = await fetch(apiUrl, {
    headers: { "User-Agent": "Web3Auth-MCP-Server/2.0" },
  });

  if (!response.ok) return [];

  const items = (await response.json()) as Array<{ name: string; type: string }>;
  const files = items
    .filter((i) => i.type === "file")
    .map((i) => i.name);

  setCache(`gh-list:${apiUrl}`, JSON.stringify(files));
  return files;
}

// ── Full example fetch (recursive) ───────────────────────────────────────

interface GitHubItem {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
}

async function listAllFiles(
  owner: string,
  repo: string,
  dirPath: string,
): Promise<GitHubItem[]> {
  const apiUrl = `${GITHUB_API_BASE}/${owner}/${repo}/contents/${dirPath}`;

  try {
    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Web3Auth-MCP-Server/2.0" },
    });
    if (!response.ok) return [];

    const items = (await response.json()) as GitHubItem[];
    const results: GitHubItem[] = [];

    await Promise.all(
      items.map(async (item) => {
        if (item.type === "file") {
          results.push(item);
        } else if (item.type === "dir" && item.name !== "node_modules" && !item.name.startsWith(".")) {
          const nested = await listAllFiles(owner, repo, item.path);
          results.push(...nested);
        }
      }),
    );

    return results;
  } catch {
    return [];
  }
}

function shouldSkipFile(name: string): boolean {
  if (SKIP_FILES.has(name)) return true;
  const ext = "." + name.split(".").pop()?.toLowerCase();
  if (SKIP_EXTENSIONS.has(ext)) return true;
  return false;
}

export interface ExampleFile {
  path: string;
  content: string;
}

export async function fetchExampleFull(
  owner: string,
  repo: string,
  path: string,
): Promise<ExampleFile[]> {
  const cacheKey = `gh:full:${owner}/${repo}/${path}`;
  const cached = getCached(cacheKey);
  if (cached) return JSON.parse(cached) as ExampleFile[];

  const allItems = await listAllFiles(owner, repo, path);
  const sourceFiles = allItems.filter((item) => !shouldSkipFile(item.name));

  const files = await Promise.allSettled(
    sourceFiles.map(async (item): Promise<ExampleFile> => {
      if (!item.download_url) {
        throw new Error(`No download_url for ${item.path}`);
      }

      const fileCacheKey = `gh:file:${item.download_url}`;
      const fileCached = getCached(fileCacheKey);
      if (fileCached) {
        return { path: item.path, content: fileCached };
      }

      const response = await fetch(item.download_url, {
        headers: { "User-Agent": "Web3Auth-MCP-Server/2.0" },
      });

      if (!response.ok) throw new Error(`Failed to fetch ${item.download_url}`);

      const content = await response.text();
      setCache(fileCacheKey, content);
      return { path: item.path, content };
    }),
  );

  const results: ExampleFile[] = files
    .filter((r): r is PromiseFulfilledResult<ExampleFile> => r.status === "fulfilled")
    .map((r) => r.value);

  if (results.length > 0) {
    setCache(cacheKey, JSON.stringify(results));
  }

  return results;
}
