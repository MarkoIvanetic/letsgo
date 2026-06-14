import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── HTML Email Template ────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function buildArticleHtml(item) {
  return `
    <div style="margin-bottom:18px; padding:16px; background:#f9fafb;
                border-radius:8px; border-left:4px solid #6366f1;">
      <a href="${item.link}"
         style="font-size:15px; font-weight:600; color:#4f46e5;
                text-decoration:none; display:block; margin-bottom:5px;">
        ${item.title}
      </a>
      <p style="font-size:12px; color:#9ca3af; margin:0 0 8px;">
        ${formatDate(item.pubDate)}
      </p>
      ${item.summary
        ? `<p style="font-size:14px; color:#374151; margin:0; line-height:1.55;">
             ${item.summary}…
           </p>`
        : ''}
    </div>`;
}

function buildFeedSection(feed) {
  if (feed.items.length === 0) return '';
  return `
    <div style="margin-bottom:32px;">
      <h2 style="font-size:17px; color:#111827; margin:0 0 14px;
                 border-bottom:2px solid #e5e7eb; padding-bottom:8px;">
        ${feed.name}
        <span style="font-weight:400; font-size:13px; color:#9ca3af;">
          — ${feed.items.length} article${feed.items.length > 1 ? 's' : ''}
        </span>
      </h2>
      ${feed.items.map(buildArticleHtml).join('')}
    </div>`;
}

function buildHtml(feedResults) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const totalItems = feedResults.reduce((n, f) => n + f.items.length, 0);
  const failed = feedResults.filter(f => f.error);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Weekly Digest</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
             max-width:680px; margin:0 auto; padding:24px;
             background:#ffffff; color:#1a1a1a;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);
              padding:28px 24px; border-radius:14px; margin-bottom:28px; text-align:center;">
    <h1 style="color:white; margin:0; font-size:26px; letter-spacing:-0.5px;">
      📰 Weekly Digest
    </h1>
    <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">
      ${date} &nbsp;·&nbsp; ${totalItems} article${totalItems !== 1 ? 's' : ''}
    </p>
  </div>

  <!-- Feed sections -->
  ${feedResults.map(buildFeedSection).join('')}

  <!-- Failed feeds warning -->
  ${failed.length > 0 ? `
  <div style="padding:12px 16px; background:#fef2f2; border-radius:8px;
              font-size:13px; color:#dc2626; margin-top:8px;">
    ⚠️ Could not fetch: ${failed.map(f => f.name).join(', ')}
  </div>` : ''}

  <!-- Footer -->
  <div style="margin-top:36px; padding-top:18px; border-top:1px solid #e5e7eb;
              font-size:12px; color:#9ca3af; text-align:center;">
    Sent by your Weekly RSS Digest bot
  </div>

</body>
</html>`;
}

// ─── Send via Resend ────────────────────────────────────────────────────────

/**
 * Build and send the digest email.
 * Throws if Resend returns an error.
 */
export async function sendDigestEmail({ to, from, subject, feedResults }) {
  const html = buildHtml(feedResults);

  const { data, error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }

  console.log(`✅ Email sent successfully! (id: ${data.id})`);
  return data;
}
