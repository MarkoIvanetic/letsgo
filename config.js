// ─────────────────────────────────────────────
//  CONFIGURE YOUR DIGEST HERE
// ─────────────────────────────────────────────

export const config = {
  // List of RSS/Atom feeds to track.
  // Find a site's feed URL by looking for <link type="application/rss+xml"> in its HTML,
  // or just try: https://example.com/feed  or  https://example.com/rss
  feeds: [
    { name: 'Hacker News',  url: 'https://news.ycombinator.com/rss' },
    { name: 'TechCrunch',   url: 'https://techcrunch.com/feed/' },
    { name: 'The Verge',    url: 'https://www.theverge.com/rss/index.xml' },
    // Add more feeds here — as many as you like
  ],

  // Maximum articles shown per feed per digest
  maxItemsPerFeed: 5,

  // Sender address.
  // • During testing use 'onboarding@resend.dev' (no domain needed).
  // • For production, verify your own domain in the Resend dashboard
  //   and use something like 'digest@yourdomain.com'.
  emailFrom: 'onboarding@resend.dev',

  // Recipient — set via GitHub secret TO_EMAIL (see README)
  emailTo: process.env.TO_EMAIL,

  // Email subject line
  emailSubject: '📰 Your Weekly Digest',
};
