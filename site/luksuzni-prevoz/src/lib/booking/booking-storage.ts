import type { BookingDraft } from "../../data/booking.ts";

export const BOOKING_STORAGE_KEY = "lp.booking.v1";
const BOOKING_STORAGE_VERSION = 1;
const BOOKING_STORAGE_TTL_MS = 2 * 60 * 60 * 1000;

type PersistedBookingDraft = Pick<
  BookingDraft,
  | "intent"
  | "serviceKey"
  | "date"
  | "time"
  | "hireMode"
  | "hours"
  | "multiDay"
  | "international"
  | "airportDirection"
  | "airportScope"
  | "returnRequested"
  | "returnDate"
  | "returnTime"
  | "engagement"
  | "multipleLocations"
  | "multipleVehiclesRequested"
  | "waitingRequested"
  | "passengerCount"
  | "luggageCount"
  | "childSeatRequested"
  | "vehiclePreference"
>;

interface StoredDraft {
  version: 1;
  expiresAt: number;
  draft: PersistedBookingDraft;
}

const persistedKeys: Array<keyof PersistedBookingDraft> = [
  "intent", "serviceKey", "date", "time", "hireMode", "hours", "multiDay",
  "international", "airportDirection", "airportScope", "returnRequested",
  "returnDate", "returnTime", "engagement", "multipleLocations",
  "multipleVehiclesRequested", "waitingRequested", "passengerCount",
  "luggageCount", "childSeatRequested", "vehiclePreference",
];

export function selectPersistedBookingDraft(draft: BookingDraft): PersistedBookingDraft {
  const selected: Partial<PersistedBookingDraft> = {};
  for (const key of persistedKeys) {
    const value = draft[key];
    if (value !== undefined) Object.assign(selected, { [key]: value });
  }
  return selected;
}

export function saveBookingDraft(storage: Storage, draft: BookingDraft, now = Date.now()): void {
  const record: StoredDraft = {
    version: BOOKING_STORAGE_VERSION,
    expiresAt: now + BOOKING_STORAGE_TTL_MS,
    draft: selectPersistedBookingDraft(draft),
  };
  storage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(record));
}

export function loadBookingDraft(storage: Storage, now = Date.now()): PersistedBookingDraft | null {
  const raw = storage.getItem(BOOKING_STORAGE_KEY);
  if (!raw) return null;
  try {
    const record = JSON.parse(raw) as Partial<StoredDraft>;
    if (record.version !== BOOKING_STORAGE_VERSION || !record.expiresAt || record.expiresAt <= now || !record.draft) {
      storage.removeItem(BOOKING_STORAGE_KEY);
      return null;
    }
    return selectPersistedBookingDraft(record.draft);
  } catch {
    storage.removeItem(BOOKING_STORAGE_KEY);
    return null;
  }
}
