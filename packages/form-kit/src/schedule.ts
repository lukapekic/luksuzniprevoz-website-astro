import { formatDisplayDate, isCanonicalTime } from "./date-time.ts";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let value = formatters.get(timeZone);
  if (!value) {
    value = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(timeZone, value);
  }
  return value;
}

export function getZonedDateTimeParts(
  instant: Date,
  timeZone: string,
): { date: string; time: string } {
  const parts = Object.fromEntries(
    formatter(timeZone)
      .formatToParts(instant)
      .map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

function wallTimeAsUtc(date: string, time: string): number {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const result = new Date(0);
  result.setUTCFullYear(year!, month! - 1, day!);
  result.setUTCHours(hour!, minute!, 0, 0);
  return result.getTime();
}

/** A wall time must identify exactly one instant; DST gaps and overlaps are invalid. */
export function resolveZonedDateTime(date: string, time: string, timeZone: string): Date | null {
  if (!formatDisplayDate(date) || !isCanonicalTime(time)) return null;
  const wall = wallTimeAsUtc(date, time);
  const offsets = new Set<number>();
  for (const hours of [-36, -24, -12, 0, 12, 24, 36]) {
    const instant = wall + hours * HOUR;
    const parts = getZonedDateTimeParts(new Date(instant), timeZone);
    offsets.add(wallTimeAsUtc(parts.date, parts.time) - instant);
  }
  const matches = [...offsets]
    .map((offset) => wall - offset)
    .filter((instant) => {
      const parts = getZonedDateTimeParts(new Date(instant), timeZone);
      return parts.date === date && parts.time === time;
    });
  return matches.length === 1 ? new Date(matches[0]!) : null;
}

export interface EarliestBookingSchedule {
  date: string;
  time: string;
  instant: string;
}

/** Minute-based controls round upward, never shortening the required notice. */
export function getEarliestBookingSchedule(
  minimumHours: number,
  timeZone: string,
  now = new Date(),
): EarliestBookingSchedule {
  if (!Number.isFinite(minimumHours) || minimumHours < 0 || !Number.isFinite(now.getTime()))
    throw new RangeError("Invalid booking schedule policy");
  let instant = Math.ceil((now.getTime() + minimumHours * HOUR) / MINUTE) * MINUTE;
  // During an overlap, skip wall times that the customer cannot select unambiguously.
  for (let minutes = 0; minutes < 1440; minutes++, instant += MINUTE) {
    const parts = getZonedDateTimeParts(new Date(instant), timeZone);
    if (resolveZonedDateTime(parts.date, parts.time, timeZone))
      return { ...parts, instant: new Date(instant).toISOString() };
  }
  throw new RangeError("No unambiguous booking time in the next day");
}

export interface BookingScheduleAssessment {
  valid: boolean;
  reason: "invalid" | "lead-time" | null;
  requestedAt: string | null;
  sameDay: boolean;
  shortNotice: boolean;
  earliest: EarliestBookingSchedule;
}

/** Pure browser/server policy. Hosts own configuration, translations and unknown-time enquiries. */
export function evaluateBookingSchedule(
  date: string,
  time: string,
  options: {
    minimumHours: number;
    timeZone: string;
    now?: Date;
  },
): BookingScheduleAssessment {
  const now = options.now ?? new Date();
  const earliest = getEarliestBookingSchedule(options.minimumHours, options.timeZone, now);
  const requested = resolveZonedDateTime(date, time, options.timeZone);
  const delta = requested ? requested.getTime() - now.getTime() : -1;
  const reason = !requested ? "invalid" : delta < options.minimumHours * HOUR ? "lead-time" : null;
  return {
    valid: reason === null,
    reason,
    requestedAt: requested?.toISOString() ?? null,
    sameDay: Boolean(requested && date === getZonedDateTimeParts(now, options.timeZone).date),
    shortNotice: Boolean(requested && delta >= 0 && delta < 24 * HOUR),
    earliest,
  };
}
