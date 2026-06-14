import { fetchAllFeeds } from './crawler.js';
import { sendDigestEmail } from './emailer.js';
import { config } from '../config.js';

// ─── Validate environment ───────────────────────────────────────────────────

function validateEnv() {
  const missing = [];
  if (!process.env.RESEND_API_KEY) missing.push('RESEND_API_KEY');
  if (!process.env.TO_EMAIL)       missing.push('TO_EMAIL');
  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}\n` +
      `Set them in GitHub Secrets (or in a local .env file for testing).`
    );
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  Weekly RSS Digest');
  console.log(`  ${new Date().toUTCString()}`);
  console.log('═══════════════════════════════════════\n');

  validateEnv();

  // 1. Fetch feeds
  console.log(`🔍 Fetching ${config.feeds.length} feed(s)…`);
  const feedResults = await fetchAllFeeds(config.feeds, config.maxItemsPerFeed);

  const totalItems = feedResults.reduce((n, f) => n + f.items.length, 0);
  console.log(`\n📦 Total articles this week: ${totalItems}\n`);

  // 2. Skip email if nothing to report
  if (totalItems === 0) {
    console.log('No new articles found. Skipping email.');
    return;
  }

  // 3. Send email
  console.log('📧 Sending digest email…');
  await sendDigestEmail({
    to:          config.emailTo,
    from:        config.emailFrom,
    subject:     config.emailSubject,
    feedResults,
  });
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
