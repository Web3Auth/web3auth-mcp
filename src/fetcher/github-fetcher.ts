import { getCached, setCache } from "./cache.js";

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";

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
    headers: { "User-Agent": "Web3Auth-MCP-Server/1.0" },
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
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const cached = getCached(`gh-list:${apiUrl}`);
  if (cached) return JSON.parse(cached);

  const response = await fetch(apiUrl, {
    headers: { "User-Agent": "Web3Auth-MCP-Server/1.0" },
  });

  if (!response.ok) return [];

  const items = (await response.json()) as Array<{ name: string; type: string }>;
  const files = items
    .filter((i) => i.type === "file")
    .map((i) => i.name);

  setCache(`gh-list:${apiUrl}`, JSON.stringify(files));
  return files;
}
