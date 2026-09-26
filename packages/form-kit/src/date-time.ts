/** Explicit display/canonical conversion; never depends on browser locale. */
export function maskDisplayDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/");
}

export function parseDisplayDate(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) return null;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > days[month - 1]!) return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function formatDisplayDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return "";
  const display = `${match[3]}/${match[2]}/${match[1]}`;
  return parseDisplayDate(display) === value ? display : "";
}

export function combineHourMinute(hour: string, minute: string): string {
  if (!/^(?:[01]\d|2[0-3])$/.test(hour) || !/^[0-5]\d$/.test(minute)) return "";
  return `${hour}:${minute}`;
}

export function formatDisplaySchedule(date: string | undefined, time: string | undefined): string | null {
  const displayDate = date ? formatDisplayDate(date) : "";
  return displayDate && time && isCanonicalTime(time) ? `${displayDate} · ${time}` : null;
}

export function isCanonicalTime(value: string): boolean {
  const [hour = "", minute = ""] = value.split(":");
  return combineHourMinute(hour, minute) === value && value.length === 5;
}
