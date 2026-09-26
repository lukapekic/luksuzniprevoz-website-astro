import { combineHourMinute, formatDisplayDate, maskDisplayDate, parseDisplayDate } from "./booking-date-time.ts";
import { bookingDateBounds } from "./booking-date-policy.ts";

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
  syncCalendars(form);
}

export function syncCanonicalSchedule(form: HTMLFormElement): void {
  for (const input of form.querySelectorAll<HTMLInputElement>("[data-booking-date-display]")) {
    const masked = maskDisplayDate(input.value);
    if (masked !== input.value) {
      const digitsBeforeCaret = input.value.slice(0, input.selectionStart ?? input.value.length).replace(/\D/g, "").length;
      const caret = digitsBeforeCaret + (digitsBeforeCaret > 2 ? 1 : 0) + (digitsBeforeCaret > 4 ? 1 : 0);
      input.value = masked;
      input.setSelectionRange(caret, caret);
    }
    const canonical = canonicalControl(form, input.dataset.canonicalName ?? "");
    if (canonical) canonical.value = parseDisplayDate(input.value) ?? "";
  }
  for (const hourSelect of form.querySelectorAll<HTMLSelectElement>("[data-booking-hour]")) {
    const name = hourSelect.dataset.timeFor ?? "";
    const minute = form.querySelector<HTMLSelectElement>(`[data-booking-minute][data-time-for="${name}"]`)?.value ?? "";
    const canonical = canonicalControl(form, name);
    if (canonical) canonical.value = combineHourMinute(hourSelect.value, minute);
  }
  syncCalendars(form);
}

function syncCalendars(form: HTMLFormElement): void {
  const bounds = bookingDateBounds();
  const departure = canonicalControl(form, "date")?.value ?? "";
  for (const picker of form.querySelectorAll<HTMLInputElement>("[data-booking-calendar]")) {
    const name = picker.dataset.dateFor ?? "";
    picker.min = name === "returnDate" && departure >= bounds.min && departure <= bounds.max ? departure : bounds.min;
    picker.max = bounds.max;
    const value = canonicalControl(form, name)?.value ?? "";
    picker.value = value >= picker.min && value <= picker.max ? value : "";
  }
}

const mounted = new WeakSet<HTMLFormElement>();

/** Enhances the existing manual field; no calendar library or hidden payload fields. */
export function mountScheduleControls(form: HTMLFormElement): void {
  if (mounted.has(form)) return;
  mounted.add(form);
  for (const display of form.querySelectorAll<HTMLInputElement>("[data-booking-date-display]")) {
    // Backspace/Delete at a slash removes the neighbouring digit rather than getting stuck.
    display.addEventListener("beforeinput", (event) => {
      if (!(event instanceof InputEvent) || display.selectionStart !== display.selectionEnd) return;
      const caret = display.selectionStart ?? 0;
      const backwards = event.inputType === "deleteContentBackward" && display.value[caret - 1] === "/";
      const forwards = event.inputType === "deleteContentForward" && display.value[caret] === "/";
      if (!backwards && !forwards) return;
      event.preventDefault();
      const start = backwards ? Math.max(0, caret - 2) : caret;
      display.setRangeText("", start, backwards ? caret : caret + 2, "start");
      display.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const name = display.dataset.canonicalName ?? "";
    const picker = form.querySelector<HTMLInputElement>(`[data-booking-calendar][data-date-for="${name}"]`);
    const button = form.querySelector<HTMLButtonElement>(`[data-booking-calendar-button][data-date-for="${name}"]`);
    if (!picker || !button) continue;
    button.hidden = typeof picker.showPicker !== "function";
    button.addEventListener("click", () => {
      syncCalendars(form);
      try { picker.showPicker(); } catch { display.focus(); }
    });
    // Native pickers emit input before change; prevent the form's text synchronizer
    // from restoring the previous value before the selected date is consumed.
    picker.addEventListener("input", event => event.stopPropagation());
    picker.addEventListener("change", (event) => {
      event.stopPropagation();
      display.value = formatDisplayDate(picker.value);
      display.dispatchEvent(new Event("input", { bubbles: true }));
      display.dispatchEvent(new Event("change", { bubbles: true }));
      display.focus();
    });
  }
  syncCalendars(form);
  window.addEventListener("pageshow", () => syncCalendars(form));
}
