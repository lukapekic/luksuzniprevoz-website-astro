import { parseDisplayDate } from "./booking-date-time.ts";
import { mountScheduleControls, syncCanonicalSchedule } from "./booking-schedule-controls.ts";
import { isBookingDateInRange } from "./booking-date-policy.ts";
import { serializeAirportBookingIntent } from "./airport-booking-intent.ts";

const mounted = new WeakSet<HTMLFormElement>();

/** Native GET handoff with explicit display formats and calendar validation. */
export function mountAirportBookingStarts(root: ParentNode = document): void {
  for (const form of root.querySelectorAll<HTMLFormElement>("[data-airport-booking-start]")) {
    if (mounted.has(form)) continue;
    mounted.add(form);
    const date = form.querySelector<HTMLInputElement>("[data-booking-date-display]");
    if (!date) continue;
    mountScheduleControls(form);
    const sync = () => {
      syncCanonicalSchedule(form);
      const canonical = parseDisplayDate(date.value);
      const message = date.value === "" ? "" : !canonical ? form.dataset.dateError ?? ""
        : !isBookingDateInRange(canonical) ? form.dataset.errorDateRange ?? "" : "";
      const invalid = message !== "";
      date.setCustomValidity(message);
      date.setAttribute("aria-invalid", String(invalid));
      const error = form.querySelector<HTMLElement>(`#${date.id}-error`);
      if (error) { error.textContent = message; error.hidden = !invalid; }
    };
    form.addEventListener("input", sync);
    form.addEventListener("change", sync);
    form.addEventListener("submit", (event) => {
      sync();
      if (!form.reportValidity()) { event.preventDefault(); return; }
      event.preventDefault();
      const data = new FormData(form);
      const params = serializeAirportBookingIntent({
        service: "airportTransportation", date: String(data.get("date") ?? ""),
        time: String(data.get("time") ?? ""), flightNumber: String(data.get("flightNumber") ?? ""),
      });
      params.set("intent", "booking");
      const destination = new URL(form.action);
      destination.search = params.toString();
      window.location.assign(destination.href);
    });
    sync();
    window.addEventListener("pageshow", sync);
  }
}
