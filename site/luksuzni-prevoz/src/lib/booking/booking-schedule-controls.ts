import { combineHourMinute, formatDisplayDate, parseDisplayDate } from "./booking-date-time.ts";

function canonicalControl(form: HTMLFormElement, name: string): HTMLInputElement | null {
  const item = form.elements.namedItem(name);
  return item instanceof HTMLInputElement ? item : null;
}

export function syncDisplaySchedule(form: HTMLFormElement): void {
  for (const input of form.querySelectorAll<HTMLInputElement>("[data-booking-date-display]")) {
    input.value = formatDisplayDate(canonicalControl(form, input.dataset.canonicalName ?? "")?.value ?? "");
  }
  for (const hourSelect of form.querySelectorAll<HTMLSelectElement>("[data-booking-hour]")) {
    const name = hourSelect.dataset.timeFor ?? "";
    const [hour = "", minute = ""] = (canonicalControl(form, name)?.value ?? "").split(":");
    hourSelect.value = hour;
    const minuteSelect = form.querySelector<HTMLSelectElement>(`[data-booking-minute][data-time-for="${name}"]`);
    if (minuteSelect) minuteSelect.value = minute;
  }
}

export function syncCanonicalSchedule(form: HTMLFormElement): void {
  for (const input of form.querySelectorAll<HTMLInputElement>("[data-booking-date-display]")) {
    const canonical = canonicalControl(form, input.dataset.canonicalName ?? "");
    if (canonical) canonical.value = parseDisplayDate(input.value) ?? "";
  }
  for (const hourSelect of form.querySelectorAll<HTMLSelectElement>("[data-booking-hour]")) {
    const name = hourSelect.dataset.timeFor ?? "";
    const minute = form.querySelector<HTMLSelectElement>(`[data-booking-minute][data-time-for="${name}"]`)?.value ?? "";
    const canonical = canonicalControl(form, name);
    if (canonical) canonical.value = combineHourMinute(hourSelect.value, minute);
  }
}
