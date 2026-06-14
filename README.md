# 📰 Weekly RSS Digest

A lightweight Node.js bot that fetches your favourite RSS/Atom feeds every week
and emails you a clean digest — runs for **free** on GitHub Actions + Resend.

---

## Project structure

```
weekly-digest/
├── .github/
│   └── workflows/
│       └── weekly-digest.yml   ← GitHub Actions schedule
├── src/
│   ├── crawler.js              ← RSS fetching & filtering
│   ├── emailer.js              ← HTML email builder + Resend sender
│   └── index.js                ← Entry point
├── config.js                   ← ✏️  YOUR feeds & settings go here
└── package.json
```

---

## Setup (5 minutes)

### 1 · Get a free Resend account

1. Go to [resend.com](https://resend.com) and sign up (no credit card).
2. In the dashboard → **API Keys** → create a new key.  Copy it.
3. Free tier = 3,000 emails/month — more than enough.

> **From address:**  
> While testing you can use `onboarding@resend.dev` as the sender and it will
> deliver to the email you registered with.  
> For a permanent setup, verify your own domain in the Resend dashboard and use
> `digest@yourdomain.com`.

---

### 2 · Configure your feeds

Edit **`config.js`**:

```js
export const config = {
  feeds: [
    { name: 'My Blog',    url: 'https://myblog.com/feed' },
    { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
    // add as many as you like
  ],
  maxItemsPerFeed: 5,
  emailFrom: 'onboarding@resend.dev',   // or 'digest@yourdomain.com'
  emailTo:   process.env.TO_EMAIL,      // set in GitHub Secrets
  emailSubject: '📰 Your Weekly Digest',
};
```

---

### 3 · Push to GitHub

```bash
git init
git add .
git commit -m "init weekly digest"
gh repo create weekly-digest --private --push   # or push to an existing repo
```

---

### 4 · Add GitHub Secrets

In your repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name      | Value                        |
|-----------------|------------------------------|
| `RESEND_API_KEY` | your Resend API key          |
| `TO_EMAIL`       | the email you want to send to |

---

### 5 · Test it immediately

Go to **Actions → Weekly RSS Digest → Run workflow** and click the green button.
You should receive an email within ~30 seconds.

---

## Schedule

The workflow runs **every Monday at 08:00 UTC** by default.  
Edit the cron expression in `.github/workflows/weekly-digest.yml`:

```yaml
- cron: '0 8 * * 1'   # Monday 08:00 UTC
```

Use [crontab.guru](https://crontab.guru/) to build your preferred schedule.

---

## Running locally

```bash
npm install
RESEND_API_KEY=re_xxx TO_EMAIL=you@email.com node src/index.js
```

---

## Respecting robots.txt / legal crawling

This bot only reads **RSS/Atom feeds** — structured data that sites intentionally
publish for machine consumption. No HTML scraping, no aggressive polling.
Each feed is fetched once per week, well within any reasonable rate limit.

---

## Dependencies

| Package | Purpose |
|---------|---------|
| [`rss-parser`](https://github.com/rbren/rss-parser) | Parse RSS & Atom feeds |
| [`resend`](https://resend.com/docs/send-with-nodejs) | Send email via Resend API |
