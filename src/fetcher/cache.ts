import { LRUCache } from "lru-cache";

const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_ENTRIES = 500;

const cache = new LRUCache<string, string>({
  max: MAX_ENTRIES,
  ttl: DEFAULT_TTL_MS,
});

export function getCached(key: string): string | undefined {
  return cache.get(key);
}

export function setCache(key: string, value: string, ttlMs?: number): void {
  cache.set(key, value, { ttl: ttlMs });
}

export function clearCache(): void {
  cache.clear();
}
