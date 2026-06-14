import "dotenv/config";
import { fetchAllEvents } from "./crawlers/index.ts";
import { sendDigestEmail } from "./emailer.ts";
import type { DigestEvent } from "./types.ts";

function validateEnv(): void {
  const missing: string[] = [];

  if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
  if (!process.env.TO_EMAIL) missing.push("TO_EMAIL");

  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }
}

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════");
  console.log("  LetsGo Local Email Test");
  console.log(`  ${new Date().toUTCString()}`);
  console.log("═══════════════════════════════════════\n");

  validateEnv();

  const events: DigestEvent[] = await fetchAllEvents();
  console.log(`\n📦 Ukupno događanja: ${events.length}\n`);

  if (events.length === 0) {
    console.log("Nema događanja za slanje.");
    return;
  }

  console.log(`📧 Šaljem testni email na ${process.env.TO_EMAIL}...`);
  await sendDigestEmail(events);
}

main().catch((error: Error) => {
  console.error("\n❌ Greška:", error.message);
  process.exit(1);
});
