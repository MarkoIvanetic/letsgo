import Parser from 'rss-parser';

const parser = new Parser({
  // Support common media/content extensions
  customFields: {
    item: ['media:content', 'media:thumbnail', 'content:encoded'],
  },
});

/**
 * Strip HTML tags from a string and normalise whitespace.
 */
function stripHtml(html = '') {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-zA-Z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch a single feed and return articles published in the last 7 days.
 * Returns { name, url, items, error }.
 */
async function fetchFeed(feed, maxItems = 5) {
  try {
    const parsed = await parser.parseURL(feed.url);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const items = parsed.items
      .filter(item => {
        const ts = new Date(item.pubDate ?? item.isoDate ?? 0).getTime();
        return ts >= oneWeekAgo;
      })
      .slice(0, maxItems)
      .map(item => ({
        title:   item.title   ?? 'Untitled',
        link:    item.link    ?? item.guid ?? '#',
        pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
        summary: stripHtml(
          item.contentSnippet ?? item.summary ?? item['content:encoded'] ?? ''
        ).slice(0, 220),
        source: feed.name,
      }));

    console.log(`  ✓ ${feed.name}: ${items.length} article(s)`);
    return { name: feed.name, url: feed.url, items, error: null };
  } catch (err) {
    console.warn(`  ✗ ${feed.name}: ${err.message}`);
    return { name: feed.name, url: feed.url, items: [], error: err.message };
  }
}

/**
 * Fetch all feeds in parallel and return their results.
 */
export async function fetchAllFeeds(feeds, maxItemsPerFeed = 5) {
  const results = await Promise.allSettled(
    feeds.map(feed => fetchFeed(feed, maxItemsPerFeed))
  );

  return results.map(r =>
    r.status === 'fulfilled'
      ? r.value
      : { name: '?', url: '', items: [], error: String(r.reason) }
  );
}
