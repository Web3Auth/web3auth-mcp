import { getCached, setCache } from "./cache.js";

const DISCOURSE_BASE = "https://builder.metamask.io";
const EMBEDDED_WALLETS_CATEGORY_ID = 5;
const API_TIMEOUT_MS = 10_000; // 10s for Discourse API calls

// ── Types ────────────────────────────────────────────────────────────────

export interface CommunityTopic {
  id: number;
  title: string;
  url: string;
  excerpt: string;
  reply_count: number;
  views: number;
  last_posted_at: string;
  tags: string[];
}

export interface CommunityPost {
  id: number;
  post_number: number;
  username: string;
  display_name: string;
  created_at: string;
  content: string; // stripped HTML
  is_staff: boolean;
  reply_to_post_number: number | null;
}

export interface CommunityTopicFull {
  id: number;
  title: string;
  url: string;
  created_at: string;
  reply_count: number;
  views: number;
  tags: string[];
  posts: CommunityPost[];
}

// ── Auth headers ─────────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const apiKey = process.env.DISCOURSE_API_KEY;
  const headers: Record<string, string> = {
    "User-Agent": "Web3Auth-MCP-Server/2.0",
    "Accept": "application/json",
  };
  if (apiKey) {
    headers["Api-Key"] = apiKey;
    headers["Api-Username"] = process.env.DISCOURSE_API_USERNAME ?? "system";
  }
  return headers;
}

// ── Strip HTML to plain text ─────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, (match) => {
      // Preserve code blocks, just remove tags
      return match
        .replace(/<code[^>]*>/gi, "```\n")
        .replace(/<\/code>/gi, "\n```")
        .replace(/<[^>]+>/g, "");
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "...")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── Search community ─────────────────────────────────────────────────────

export async function searchCommunity(query: string): Promise<CommunityTopic[]> {
  const cacheKey = `discourse:search:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return JSON.parse(cached) as CommunityTopic[];

  const params = new URLSearchParams({
    q: `${query} category:${EMBEDDED_WALLETS_CATEGORY_ID}`,
  });

  try {
    const response = await fetch(`${DISCOURSE_BASE}/search.json?${params}`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Discourse search failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      topics?: Array<{
        id: number;
        title: string;
        slug: string;
        reply_count: number;
        views: number;
        last_posted_at: string;
        tags?: string[];
        excerpt?: string;
        category_id?: number;
      }>;
      posts?: Array<{
        topic_id: number;
        blurb?: string;
      }>;
    };

    // Map topic_id -> blurb from posts
    const blurbMap = new Map<number, string>();
    for (const post of data.posts ?? []) {
      if (post.blurb && !blurbMap.has(post.topic_id)) {
        blurbMap.set(post.topic_id, post.blurb);
      }
    }

    const topics: CommunityTopic[] = (data.topics ?? [])
      .filter((t) => t.category_id === EMBEDDED_WALLETS_CATEGORY_ID || !t.category_id)
      .map((t) => ({
        id: t.id,
        title: t.title,
        url: `${DISCOURSE_BASE}/t/${t.slug}/${t.id}`,
        excerpt: blurbMap.get(t.id) ?? t.excerpt ?? "",
        reply_count: t.reply_count,
        views: t.views,
        last_posted_at: t.last_posted_at,
        tags: t.tags ?? [],
      }));

    setCache(cacheKey, JSON.stringify(topics));
    return topics;
  } catch (err) {
    console.error("Discourse search error:", err);
    return [];
  }
}

// ── Fetch full topic ─────────────────────────────────────────────────────

export async function fetchCommunityTopic(topicId: number): Promise<CommunityTopicFull | null> {
  const cacheKey = `discourse:topic:${topicId}`;
  const cached = getCached(cacheKey);
  if (cached) return JSON.parse(cached) as CommunityTopicFull;

  try {
    const response = await fetch(`${DISCOURSE_BASE}/t/${topicId}.json`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      id: number;
      title: string;
      slug: string;
      created_at: string;
      reply_count: number;
      views: number;
      tags?: string[];
      post_stream?: {
        posts?: Array<{
          id: number;
          post_number: number;
          username: string;
          display_username?: string;
          created_at: string;
          cooked: string;
          staff?: boolean;
          moderator?: boolean;
          admin?: boolean;
          reply_to_post_number?: number | null;
        }>;
      };
    };

    const posts: CommunityPost[] = (data.post_stream?.posts ?? []).map((p) => ({
      id: p.id,
      post_number: p.post_number,
      username: p.username,
      display_name: p.display_username ?? p.username,
      created_at: p.created_at,
      content: stripHtml(p.cooked ?? ""),
      is_staff: !!(p.staff || p.moderator || p.admin),
      reply_to_post_number: p.reply_to_post_number ?? null,
    }));

    const result: CommunityTopicFull = {
      id: data.id,
      title: data.title,
      url: `${DISCOURSE_BASE}/t/${data.slug}/${data.id}`,
      created_at: data.created_at,
      reply_count: data.reply_count,
      views: data.views,
      tags: data.tags ?? [],
      posts,
    };

    setCache(cacheKey, JSON.stringify(result));
    return result;
  } catch (err) {
    console.error("Discourse fetch topic error:", err);
    return null;
  }
}
