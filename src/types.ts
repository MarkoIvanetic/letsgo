// Every crawler must return an array of DigestEvent.
// This is the contract between crawlers and the email builder.

export interface DigestEvent {
  title: string;
  link: string;
  date: string; // ISO — sorting only
  dateFrom?: string; // "14.06.2026"
  dateTo?: string; // "21.06.2026" — omit for single-day
  startTime?: string; // "20:30" — omit if no specific time
  summary: string;
  source: string;
  location?: string; // venue name
  tags?: string[];
}

// The signature every crawler file must export
export type CrawlerFn = () => Promise<DigestEvent[]>;
