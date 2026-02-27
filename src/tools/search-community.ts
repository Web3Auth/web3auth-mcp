import { searchCommunity, fetchCommunityTopic } from "../fetcher/community-fetcher.js";

const DISCOURSE_BASE = "https://builder.metamask.io";

export async function handleSearchCommunity(args: {
  query?: string;
  topic_id?: number;
}): Promise<string> {
  const { query, topic_id } = args;

  // ── Fetch full topic ──────────────────────────────────────────────────
  if (topic_id !== undefined) {
    const topic = await fetchCommunityTopic(topic_id);
    if (!topic) {
      return `Could not fetch topic ${topic_id}. It may not exist or may be private.`;
    }

    const lines: string[] = [
      `# ${topic.title}`,
      "",
      `**URL**: ${topic.url}`,
      `**Views**: ${topic.views} | **Replies**: ${topic.reply_count}`,
      topic.tags.length ? `**Tags**: ${topic.tags.join(", ")}` : "",
      "",
      "---",
      "",
    ].filter((l) => l !== undefined);

    for (const post of topic.posts) {
      const staffBadge = post.is_staff ? " [MetaMask Team]" : "";
      lines.push(`### Post #${post.post_number} — ${post.display_name}${staffBadge}`);
      lines.push(`*${new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}*`);
      if (post.reply_to_post_number) {
        lines.push(`*Replying to post #${post.reply_to_post_number}*`);
      }
      lines.push("");
      lines.push(post.content);
      lines.push("");
    }

    return lines.join("\n");
  }

  // ── Search ────────────────────────────────────────────────────────────
  if (!query) {
    return "Please provide either a query to search or a topic_id to fetch.";
  }

  const topics = await searchCommunity(query);

  if (!topics.length) {
    return [
      `No community posts found for "${query}".`,
      "",
      `Search the forum directly: ${DISCOURSE_BASE}/c/embedded-wallets/5`,
    ].join("\n");
  }

  const lines: string[] = [
    `## Community Posts for "${query}"`,
    "",
    `Found ${topics.length} topic(s). Use \`search_community\` with \`topic_id\` to read the full discussion.`,
    "",
  ];

  for (const topic of topics) {
    lines.push(`### ${topic.title}`);
    lines.push(`**URL**: ${topic.url}`);
    lines.push(`**Topic ID**: ${topic.id} | **Views**: ${topic.views} | **Replies**: ${topic.reply_count}`);
    if (topic.tags.length) lines.push(`**Tags**: ${topic.tags.join(", ")}`);
    if (topic.excerpt) {
      lines.push("");
      lines.push(topic.excerpt.slice(0, 300) + (topic.excerpt.length > 300 ? "..." : ""));
    }
    lines.push("");
  }

  return lines.join("\n");
}
