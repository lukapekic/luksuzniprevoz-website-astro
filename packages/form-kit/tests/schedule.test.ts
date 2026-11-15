import assert from "node:assert/strict";
import { test } from "node:test";
import {
  evaluateBookingSchedule,
  getEarliestBookingSchedule,
  resolveZonedDateTime,
} from "../src/schedule.ts";

const policy = {
  minimumHours: 2,
  timeZone: "Europe/Belgrade",
  now: new Date("2026-11-15T11:00:00Z"),
};
test("rolling two-hour cutoff includes the exact boundary and rejects elapsed pickup times", () => {
  for (const time of ["11:00", "13:59"])
    assert.equal(evaluateBookingSchedule("2026-11-15", time, policy).valid, false);
  for (const time of ["14:00", "14:01", "23:59"])
    assert.equal(evaluateBookingSchedule("2026-11-15", time, policy).valid, true);
  assert.equal(evaluateBookingSchedule("2026-11-15", "14:00", policy).sameDay, true);
  assert.equal(evaluateBookingSchedule("2026-11-16", "12:00", policy).shortNotice, false);
});
test("minute controls round upward and the rolling cutoff crosses midnight", () => {
  assert.deepEqual(
    getEarliestBookingSchedule(2, policy.timeZone, new Date("2026-11-15T22:30:01Z")),
    {
      date: "2026-11-16",
      time: "01:31",
      instant: "2026-11-16T00:31:00.000Z",
    },
  );
  const late = { ...policy, now: new Date("2026-11-15T22:30:00Z") };
  assert.equal(evaluateBookingSchedule("2026-11-16", "01:29", late).valid, false);
  const tomorrow = evaluateBookingSchedule("2026-11-16", "01:30", late);
  assert.equal(tomorrow.valid, true);
  assert.equal(tomorrow.sameDay, false);
  assert.equal(tomorrow.shortNotice, true);
});
test("strict timezone conversion rejects impossible dates, DST gaps and ambiguous overlaps", () => {
  assert.equal(
    resolveZonedDateTime("2026-01-15", "12:00", policy.timeZone)?.toISOString(),
    "2026-01-15T11:00:00.000Z",
  );
  assert.equal(
    resolveZonedDateTime("2026-07-15", "12:00", policy.timeZone)?.toISOString(),
    "2026-07-15T10:00:00.000Z",
  );
  for (const [date, time] of [
    ["2026-02-30", "12:00"],
    ["2026-03-29", "02:30"],
    ["2026-10-25", "02:30"],
    ["2026-11-15", "24:00"],
  ])
    assert.equal(resolveZonedDateTime(date!, time!, policy.timeZone), null);
});
test("earliest picker time skips an ambiguous repeated hour", () => {
  assert.deepEqual(
    getEarliestBookingSchedule(2, policy.timeZone, new Date("2026-10-24T22:30:00Z")),
    {
      date: "2026-10-25",
      time: "03:00",
      instant: "2026-10-25T02:00:00.000Z",
    },
  );
});
test("revisiting an old selection rechecks against the current clock", () => {
  assert.equal(evaluateBookingSchedule("2026-11-15", "14:00", policy).valid, true);
  assert.equal(
    evaluateBookingSchedule("2026-11-15", "14:00", {
      ...policy,
      now: new Date("2026-11-15T11:01:00Z"),
    }).valid,
    false,
  );
});
