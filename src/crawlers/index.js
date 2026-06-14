// src/index.js
import { crawl as crawlHN } from "../crawlers/hackernews.js";
import { crawl as crawlMeetup } from "../crawlers/meetup.js";
import { crawl as crawlDevTo } from "../crawlers/devto.js";

const results = await Promise.allSettled([
  crawlHN(),
  crawlMeetup(),
  crawlDevTo(),
]);

const allEvents = results
  .filter((r) => r.status === "fulfilled")
  .flatMap((r) => r.value)
  .sort((a, b) => new Date(b.date) - new Date(a.date));
