import { getCached, setCache } from "./cache.js";
import type { SdkRepoConfig, SdkModule, FilePurpose } from "../content/sdk-registry.js";

export const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";
export const GITHUB_API_BASE = "https://api.github.com/repos";

const SDK_CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours — SDK code changes less often
const PUBLIC_API_THRESHOLD = 15_000; // bytes — above this, extract public API only
const API_TIMEOUT_MS = 10_000;   // 10s for API calls (directory listings)
const FILE_TIMEOUT_MS = 30_000;  // 30s for file downloads
const MAX_RECURSION_DEPTH = 5;
const MAX_FILES = 200;

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
    signal: AbortSignal.timeout(FILE_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const content = await response.text();
  setCache(`gh:${url}`, content);
  return content;
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
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
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
  depth: number = 0,
): Promise<GitHubItem[]> {
  if (depth >= MAX_RECURSION_DEPTH) return [];

  const apiUrl = `${GITHUB_API_BASE}/${owner}/${repo}/contents/${dirPath}`;

  try {
    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Web3Auth-MCP-Server/2.0" },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!response.ok) return [];

    const items = (await response.json()) as GitHubItem[];
    const results: GitHubItem[] = [];

    await Promise.all(
      items.map(async (item) => {
        if (results.length >= MAX_FILES) return;
        if (item.type === "file") {
          results.push(item);
        } else if (item.type === "dir" && item.name !== "node_modules" && !item.name.startsWith(".")) {
          const nested = await listAllFiles(owner, repo, item.path, depth + 1);
          results.push(...nested);
        }
      }),
    );

    return results.slice(0, MAX_FILES);
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
        signal: AbortSignal.timeout(FILE_TIMEOUT_MS),
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

// ── SDK source file fetching ─────────────────────────────────────────────

function getGitHubHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "User-Agent": "Web3Auth-MCP-Server/2.0" };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/** Fetch a single file from an SDK repo with long-lived cache. */
export async function fetchSdkFile(
  owner: string,
  repo: string,
  branch: string,
  filePath: string,
): Promise<string> {
  const cacheKey = `sdk:${owner}/${repo}/${branch}/${filePath}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `${GITHUB_RAW_BASE}/${owner}/${repo}/${branch}/${filePath}`;
  const response = await fetch(url, { headers: getGitHubHeaders(), signal: AbortSignal.timeout(FILE_TIMEOUT_MS) });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${filePath}: ${response.status}`);
  }

  const raw = await response.text();
  const content = processForLLM(raw, filePath);
  setCache(cacheKey, content, SDK_CACHE_TTL_MS);
  return content;
}

export interface SdkFileResult {
  path: string;
  description: string;
  purpose: FilePurpose;
  content: string;
}

/**
 * Fetch all files in an SDK module in parallel.
 * Reuses the Promise.allSettled pattern from fetchExampleFull.
 */
export async function fetchSdkModule(
  config: SdkRepoConfig,
  mod: SdkModule,
): Promise<SdkFileResult[]> {
  const cacheKey = `sdk:mod:${config.owner}/${config.repo}/${mod.id}`;
  const cached = getCached(cacheKey);
  if (cached) return JSON.parse(cached) as SdkFileResult[];

  const results = await Promise.allSettled(
    mod.files.map(async (file): Promise<SdkFileResult> => {
      const content = await fetchSdkFile(config.owner, config.repo, config.branch, file.path);
      return { path: file.path, description: file.description, purpose: file.purpose, content };
    }),
  );

  const successes = results
    .filter((r): r is PromiseFulfilledResult<SdkFileResult> => r.status === "fulfilled")
    .map((r) => r.value);

  if (successes.length > 0) {
    setCache(cacheKey, JSON.stringify(successes), SDK_CACHE_TTL_MS);
  }

  return successes;
}

// ── Public API extraction for large files ────────────────────────────────

/**
 * Process source code for LLM consumption.
 * Type/interface files are returned as-is (maximally useful).
 * Large implementation files get their public API surface extracted.
 */
function processForLLM(content: string, filePath: string): string {
  if (isTypeFile(filePath)) return content;
  if (content.length <= PUBLIC_API_THRESHOLD) return content;
  return extractPublicApi(content, filePath);
}

function isTypeFile(path: string): boolean {
  const lower = path.toLowerCase();
  return (
    lower.includes("interface") ||
    lower.includes("/types") ||
    lower.endsWith(".d.ts") ||
    lower.includes("enums") ||
    lower.includes("constants") ||
    lower.includes("config.ts") ||
    lower.includes("config.js") ||
    lower.includes("errors")
  );
}

/**
 * Extract public API surface from a large source file.
 * Keeps: class/interface/type/enum declarations, method signatures, exports.
 * Strips: method bodies, private internals, large comment blocks.
 */
function extractPublicApi(content: string, filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  const lines = content.split("\n");

  const keepPatterns = getKeepPatterns(ext);
  if (!keepPatterns.length) {
    // Unknown language — return truncated
    return content.substring(0, PUBLIC_API_THRESHOLD) + "\n\n// ... truncated (see full source in repo)";
  }

  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed === "}" || trimmed === "};") {
      result.push(line);
      continue;
    }
    if (keepPatterns.some((p) => p.test(trimmed))) {
      result.push(line);
    }
  }

  const extracted = result.join("\n");
  return `// === PUBLIC API SURFACE (extracted from ${(content.length / 1024).toFixed(1)}KB source) ===\n// Full source: see SDK repo\n\n${extracted}`;
}

function getKeepPatterns(ext: string): RegExp[] {
  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return [
        /^export\s/, /^import\s/,
        /^(export\s+)?(interface|type|enum|class|abstract|const)\s/,
        /^\s*(public|protected|private|readonly|static|async|get|set)\s/,
        /^\s*constructor\s*\(/, /^\s*\w+\s*\(.*\)\s*[:{]/,
      ];
    case "kt":
      return [
        /^(package|import)\s/, /^@/,
        /^(data\s+class|class|interface|enum|sealed|object|fun|suspend\s+fun|val|var|companion)\s/,
      ];
    case "swift":
      return [
        /^import\s/, /^@/,
        /^(public|open|internal)?\s*(class|struct|protocol|enum|func|var|let|init|case)\s/,
      ];
    case "dart":
      return [
        /^(import|export)\s/,
        /^(class|abstract|enum|mixin|extension|typedef|factory|Future|static|final)\s/,
      ];
    case "cs":
      return [
        /^(using|namespace)\s/, /^\[/,
        /^(public|internal|protected|private)?\s*(class|interface|struct|enum|static|void|async)\s/,
      ];
    case "cpp":
    case "h":
      return [
        /^#(include|pragma|define)\s/, /^(class|struct|enum|namespace|virtual|static)\s/,
        /^(UCLASS|UPROPERTY|UFUNCTION|GENERATED_BODY)/,
      ];
    default:
      return [];
  }
}
