import type { CrawlerFn, DigestEvent } from './types.ts';
import { sendDigestEmail } from './emailer.ts';

// ─────────────────────────────────────────────────────────────────────────────
//  REGISTER YOUR CRAWLERS HERE
//  1. Create a new file in /crawlers  (copy _template.ts)
//  2. Import its crawl function below
//  3. Add it to the `crawlers` array
// ─────────────────────────────────────────────────────────────────────────────

import { crawl as crawlHN }    from '../crawlers/hackernews.ts';
import { crawl as crawlDevTo } from '../crawlers/devto.ts';

const crawlers: Array<{ name: string; fn: CrawlerFn }> = [
  { name: 'Hacker News', fn: crawlHN },
  { name: 'Dev.to',      fn: crawlDevTo },
  // { name: 'My Site', fn: crawlMySite },
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validateEnv(): void {
  const missing: string[] = [];
  if (!process.env.RESEND_API_KEY) missing.push('RESEND_API_KEY');
  if (!process.env.TO_EMAIL)       missing.push('TO_EMAIL');
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('═══════════════════════════════════════');
  console.log('  Weekly Digest');
  console.log(`  ${new Date().toUTCString()}`);
  console.log('═══════════════════════════════════════\n');

  validateEnv();

  // Run all crawlers in parallel; don't let one failure block the rest
  console.log(`🔍 Running ${crawlers.length} crawler(s)…\n`);
  const results = await Promise.allSettled(crawlers.map(c => c.fn()));

  const allEvents: DigestEvent[] = results.flatMap((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`  ✓ ${crawlers[i].name}: ${result.value.length} item(s)`);
      return result.value;
    } else {
      console.warn(`  ✗ ${crawlers[i].name}: ${result.reason}`);
      return [];
    }
  });

  // Sort newest first across all sources
  allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`\n📦 Total: ${allEvents.length} item(s)\n`);

  if (allEvents.length === 0) {
    console.log('Nothing to send. Exiting.');
    return;
  }

  console.log('📧 Sending email…');
  await sendDigestEmail(allEvents);
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
