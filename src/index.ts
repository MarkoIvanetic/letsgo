import "dotenv/config";
import type { DigestEvent } from './types.ts';
import { fetchAllEvents } from './crawlers/index.ts';
import { sendDigestEmail } from './emailer.ts';

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

  const allEvents: DigestEvent[] = await fetchAllEvents();

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
