const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MAX_EVENT_DURATION_DAYS = 7;

export function toApiDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function parseEventTime(value: string | null | undefined): string | undefined {
  if (!value) return undefined;

  const normalized = value.replace(".", ":");
  return normalized === "00:00" ? undefined : normalized;
}

export function buildEventLink(
  baseUrl: string,
  pagesLink: string,
  slug: string,
): string {
  return `${baseUrl}${pagesLink}/${slug}`;
}

export function parseCroatianDate(value: string): Date {
  const [day, month, year] = value.split(".").map(Number);
  return new Date(year, month - 1, day);
}

export function lastsAtMostOneWeek(
  dateFrom: string,
  dateTo: string | null | undefined,
): boolean {
  if (!dateTo) {
    return true;
  }

  const start = parseCroatianDate(dateFrom);
  const end = parseCroatianDate(dateTo);
  const durationDays =
    Math.floor((end.getTime() - start.getTime()) / ONE_DAY_MS) + 1;

  return durationDays <= MAX_EVENT_DURATION_DAYS;
}
