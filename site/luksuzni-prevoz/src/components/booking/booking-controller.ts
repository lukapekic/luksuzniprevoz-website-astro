import { vehicles, type Vehicle } from "../../data/fleet.ts";
import {
  isBookingServiceKey,
  type BookingDraft,
  type BookingPricingResult,
  type BookingServiceKey,
  type BookingStep,
} from "../../data/booking.ts";
import { parseBookingHandoff, cleanBookingHandoffUrl } from "../../lib/booking/booking-handoff.ts";
import { resolveBookingPricing } from "../../lib/booking/booking-pricing.ts";
import { loadBookingDraft, saveBookingDraft } from "../../lib/booking/booking-storage.ts";
import {
  buildBookingRequest,
  validateBookingDraft,
  type BookingValidationCode,
  type BookingValidationIssue,
} from "../../lib/booking/booking-validation.ts";

const steps: BookingStep[] = ["service", "journey", "vehicle", "review"];
const businessServices: BookingServiceKey[] = [
  "corporateTransportation", "delegationTransportation", "conferenceCongressTransportation",
];
const eventServices: BookingServiceKey[] = [
  "weddingTransportation", "promTransportation", "vipTransportation", "specialEvents",
];
const multiVehicleServices: BookingServiceKey[] = [
  "delegationTransportation", "conferenceCongressTransportation", ...eventServices,
];

function control(form: HTMLFormElement, name: string): HTMLInputElement | HTMLTextAreaElement | null {
  const item = form.elements.namedItem(name);
  if (item instanceof HTMLInputElement || item instanceof HTMLTextAreaElement) return item;
  return null;
}

function radioValue(form: HTMLFormElement, name: string): string | undefined {
  return form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value;
}

function textValue(form: HTMLFormElement, name: string): string | undefined {
  const value = control(form, name)?.value.trim();
  return value || undefined;
}

function numberValue(form: HTMLFormElement, name: string): number | undefined {
  const value = control(form, name)?.value;
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function checked(form: HTMLFormElement, name: string): boolean {
  const item = form.elements.namedItem(name);
  return item instanceof HTMLInputElement && item.checked;
}

function resolveServiceKey(form: HTMLFormElement): BookingServiceKey | undefined {
  const category = radioValue(form, "serviceCategory");
  if (category === "privateChauffeur" || category === "airportTransportation") return category;
  if (category === "business" || category === "special-event") {
    const service = radioValue(form, "service") ?? "";
    return isBookingServiceKey(service) ? service : undefined;
  }
  return undefined;
}

function readDraft(form: HTMLFormElement): BookingDraft {
  const intent = form.dataset.intent === "quote" ? "quote" : "booking";
  const serviceKey = resolveServiceKey(form);
  return {
    intent,
    ...(serviceKey ? { serviceKey } : {}),
    date: textValue(form, "date"), time: textValue(form, "time"),
    pickup: textValue(form, "pickup"), destination: textValue(form, "destination"),
    hireMode: radioValue(form, "hireMode") as BookingDraft["hireMode"],
    hours: numberValue(form, "hours"), plannedStops: textValue(form, "plannedStops"),
    multiDay: checked(form, "multiDay"), international: checked(form, "international"),
    airportDirection: radioValue(form, "airportDirection") as BookingDraft["airportDirection"],
    airportScope: radioValue(form, "airportScope") as BookingDraft["airportScope"],
    flightNumber: textValue(form, "flightNumber"), returnRequested: checked(form, "returnRequested"),
    returnDate: textValue(form, "returnDate"), returnTime: textValue(form, "returnTime"),
    engagement: radioValue(form, "engagement") as BookingDraft["engagement"],
    scheduleOutline: textValue(form, "scheduleOutline"),
    invoiceReference: textValue(form, "invoiceReference"),
    multipleLocations: checked(form, "multipleLocations"),
    multipleVehiclesRequested: checked(form, "multipleVehiclesRequested"),
    eventVenue: textValue(form, "eventVenue"), waitingRequested: checked(form, "waitingRequested"),
    passengerCount: numberValue(form, "passengerCount"), luggageCount: numberValue(form, "luggageCount"),
    childSeatRequested: checked(form, "childSeatRequested"),
    vehiclePreference: radioValue(form, "vehiclePreference") as BookingDraft["vehiclePreference"],
    fullName: textValue(form, "fullName"), email: textValue(form, "email"),
    phone: textValue(form, "phone"), company: textValue(form, "company"), notes: textValue(form, "notes"),
  };
}

function setRadio(form: HTMLFormElement, name: string, value: unknown): void {
  if (typeof value !== "string") return;
  const item = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${CSS.escape(value)}"]`);
  if (item) item.checked = true;
}

function setService(form: HTMLFormElement, serviceKey: BookingServiceKey): void {
  if (serviceKey === "privateChauffeur" || serviceKey === "airportTransportation") {
    setRadio(form, "serviceCategory", serviceKey);
  } else if (businessServices.includes(serviceKey)) {
    setRadio(form, "serviceCategory", "business");
    setRadio(form, "service", serviceKey);
  } else {
    setRadio(form, "serviceCategory", "special-event");
    setRadio(form, "service", serviceKey);
  }
}

function applyDraft(form: HTMLFormElement, draft: Partial<BookingDraft>): void {
  if (draft.intent) form.dataset.intent = draft.intent;
  if (draft.serviceKey) setService(form, draft.serviceKey);
  const radioFields = ["hireMode", "airportDirection", "airportScope", "engagement", "vehiclePreference"] as const;
  for (const name of radioFields) setRadio(form, name, draft[name]);
  const checkboxFields = [
    "multiDay", "international", "returnRequested", "multipleLocations",
    "multipleVehiclesRequested", "waitingRequested", "childSeatRequested",
  ] as const;
  for (const name of checkboxFields) {
    const item = form.elements.namedItem(name);
    if (item instanceof HTMLInputElement && draft[name] !== undefined) item.checked = Boolean(draft[name]);
  }
  const valueFields = [
    "date", "time", "pickup", "destination", "hours", "plannedStops", "flightNumber",
    "returnDate", "returnTime", "scheduleOutline", "invoiceReference", "eventVenue",
    "passengerCount", "luggageCount",
  ] as const;
  for (const name of valueFields) {
    const item = control(form, name);
    const value = draft[name];
    if (item && value !== undefined) item.value = String(value);
  }
}

function show(element: Element | null, visible: boolean): void {
  if (element instanceof HTMLElement) element.hidden = !visible;
}

function updateConditionalFields(form: HTMLFormElement): void {
  const category = radioValue(form, "serviceCategory");
  for (const group of form.querySelectorAll<HTMLElement>("[data-service-subgroup]")) {
    group.hidden = group.dataset.serviceSubgroup !== category;
  }
  const serviceKey = resolveServiceKey(form);
  for (const branch of form.querySelectorAll<HTMLElement>("[data-journey-branch]")) {
    branch.hidden = branch.dataset.journeyBranch !== serviceKey;
  }
  const isBusiness = Boolean(serviceKey && businessServices.includes(serviceKey));
  const isEvent = Boolean(serviceKey && eventServices.includes(serviceKey));
  show(form.querySelector("[data-business-fields]"), isBusiness);
  show(form.querySelector("[data-corporate-fields]"), serviceKey === "corporateTransportation");
  show(form.querySelector("[data-event-fields]"), isEvent);
  show(form.querySelector("[data-schedule-fields]"), isBusiness || isEvent);
  show(form.querySelector("[data-destination-field]"), !isEvent);
  show(form.querySelector("[data-company-field]"), isBusiness);
  show(form.querySelector("[data-multiple-vehicles-field]"), Boolean(serviceKey && multiVehicleServices.includes(serviceKey)));
  show(form.querySelector("[data-hourly-fields]"), serviceKey === "privateChauffeur" && radioValue(form, "hireMode") === "hourly");
  show(form.querySelector("[data-return-fields]"), serviceKey === "airportTransportation" && checked(form, "returnRequested"));
}

function selectedVehicle(draft: BookingDraft): Vehicle | null {
  if (!draft.vehiclePreference || draft.vehiclePreference === "recommend") return null;
  return vehicles.find((vehicle) => vehicle.id === draft.vehiclePreference) ?? null;
}

function updateVehicleEligibility(form: HTMLFormElement): void {
  const passengers = numberValue(form, "passengerCount");
  for (const option of form.querySelectorAll<HTMLElement>("[data-vehicle-option]")) {
    const capacity = Number(option.dataset.capacity);
    const input = option.querySelector<HTMLInputElement>('input[type="radio"]');
    const warning = option.querySelector<HTMLElement>("[data-capacity-warning]");
    const ineligible = Boolean(passengers && Number.isFinite(capacity) && capacity > 0 && passengers > capacity);
    if (input) {
      input.disabled = ineligible;
      if (ineligible && input.checked) input.checked = false;
    }
    if (warning) warning.hidden = !ineligible;
  }
}

function selectedLabel(form: HTMLFormElement, name: string): string | undefined {
  const item = form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  const label = item?.closest("label")?.querySelector("strong");
  return label?.textContent?.trim() || undefined;
}

function serviceLabel(form: HTMLFormElement): string | undefined {
  const category = radioValue(form, "serviceCategory");
  return category === "business" || category === "special-event"
    ? selectedLabel(form, "service")
    : selectedLabel(form, "serviceCategory");
}

function pricingResult(form: HTMLFormElement, draft: BookingDraft): BookingPricingResult | null {
  const result = buildBookingRequest(draft, {
    publicMinimumHours: Number(form.dataset.publicMinimumHours),
    hourlyMinimumHours: Number(form.dataset.hourlyMinimumHours),
    timeZone: "Europe/Belgrade",
    selectedVehicle: selectedVehicle(draft),
  });
  return result.ok ? resolveBookingPricing(result.request) : null;
}

function quoteMessage(form: HTMLFormElement, reason: string): string {
  const datasetKey = `quote${reason.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join("")}`;
  return form.dataset[datasetKey] ?? form.dataset.priceQuoteRequired ?? "";
}

function priceText(form: HTMLFormElement, result: BookingPricingResult | null): string {
  if (!result) return form.dataset.notSelected ?? "";
  if (result.kind === "quote-required") {
    return `${form.dataset.priceQuoteRequired}: ${quoteMessage(form, result.reason)}`;
  }
  if (result.kind === "unavailable") return form.dataset.priceUnavailable ?? "";
  const locale = form.dataset.locale ?? "en";
  const amount = new Intl.NumberFormat(locale, { style: "currency", currency: result.currency }).format(result.amount);
  const label = result.kind === "fixed"
    ? form.dataset.priceFixed
    : result.kind === "estimate"
      ? form.dataset.priceEstimate
      : form.dataset.priceCalculated;
  return `${label}: ${amount}`;
}

function setText(root: ParentNode, selector: string, value: string): void {
  for (const item of root.querySelectorAll<HTMLElement>(selector)) item.textContent = value;
}

function updateSummary(form: HTMLFormElement): BookingPricingResult | null {
  const draft = readDraft(form);
  const none = form.dataset.notSelected ?? "";
  const values = {
    service: serviceLabel(form) ?? none,
    schedule: draft.date && draft.time ? `${draft.date} · ${draft.time} (${form.dataset.timeZone})` : none,
    journey: draft.pickup ? `${draft.pickup}${draft.destination ? ` → ${draft.destination}` : draft.eventVenue ? ` → ${draft.eventVenue}` : ""}` : none,
    passengers: draft.passengerCount ? String(draft.passengerCount) : none,
    vehicle: selectedLabel(form, "vehiclePreference") ?? none,
  };
  const result = pricingResult(form, draft);
  const price = priceText(form, result);
  for (const [key, value] of Object.entries({ ...values, price })) {
    setText(form, `[data-summary-value="${key}"], [data-review-value="${key}"]`, value);
  }
  const finalLabel = form.querySelector<HTMLElement>("[data-booking-final-label]");
  if (finalLabel) {
    finalLabel.textContent = draft.intent === "quote" || result?.kind === "quote-required"
      ? form.dataset.requestQuote ?? ""
      : form.dataset.requestBooking ?? "";
  }
  return result;
}

function messageFor(form: HTMLFormElement, issue: BookingValidationIssue, draft: BookingDraft): string {
  const map: Record<BookingValidationCode, string | undefined> = {
    required: form.dataset.errorRequired,
    service: form.dataset.errorService,
    "date-time": form.dataset.errorDateTime,
    "lead-time": form.dataset.errorLeadTime,
    "hourly-minimum": form.dataset.errorHourlyMinimum,
    "airport-scope": form.dataset.errorAirportScope,
    "return-fields": form.dataset.errorReturnFields,
    "passenger-count": form.dataset.errorPassengerCount,
    "vehicle-required": form.dataset.errorVehicleRequired,
    "vehicle-capacity": form.dataset.errorVehicleCapacity?.replace("{passengers}", String(draft.passengerCount ?? "")),
    email: form.dataset.errorEmail,
    company: form.dataset.errorCompany,
  };
  return map[issue.code] ?? form.dataset.errorRequired ?? "";
}

function clearErrors(form: HTMLFormElement): void {
  for (const target of form.querySelectorAll<HTMLElement>("[data-error-for]")) {
    target.hidden = true;
    target.textContent = "";
  }
  for (const item of form.querySelectorAll<HTMLElement>("[aria-invalid='true']")) {
    item.removeAttribute("aria-invalid");
  }
  const summary = form.querySelector<HTMLElement>("[data-error-summary]");
  if (summary) summary.hidden = true;
}

function errorControl(form: HTMLFormElement, field: string): HTMLElement | null {
  const mapping: Record<string, string> = {
    service: "serviceCategory", dateTime: "date", return: "returnDate",
  };
  const name = mapping[field] ?? field;
  return form.querySelector<HTMLElement>(`[name="${name}"]`);
}

function renderErrors(form: HTMLFormElement, issues: BookingValidationIssue[], focusSummary = true): void {
  clearErrors(form);
  const draft = readDraft(form);
  const messages: string[] = [];
  for (const issue of issues) {
    const message = messageFor(form, issue, draft);
    if (!messages.includes(message)) messages.push(message);
    const target = form.querySelector<HTMLElement>(`[data-error-for="${issue.field}"]`);
    if (target) {
      target.textContent = message;
      target.hidden = false;
      target.id ||= `booking-${issue.field}-error`;
    }
    const fieldControl = errorControl(form, issue.field);
    if (fieldControl) {
      fieldControl.setAttribute("aria-invalid", "true");
      if (target?.id) fieldControl.setAttribute("aria-describedby", target.id);
    }
  }
  const summary = form.querySelector<HTMLElement>("[data-error-summary]");
  const list = form.querySelector<HTMLElement>("[data-error-summary-list]");
  if (summary && list) {
    list.replaceChildren(...messages.map((message) => {
      const item = document.createElement("li");
      item.textContent = message;
      return item;
    }));
    summary.hidden = false;
    if (focusSummary) summary.focus();
  }
}

function issuesForStep(form: HTMLFormElement, step: BookingStep): BookingValidationIssue[] {
  const draft = readDraft(form);
  const issues = validateBookingDraft(draft, {
    publicMinimumHours: Number(form.dataset.publicMinimumHours),
    hourlyMinimumHours: Number(form.dataset.hourlyMinimumHours),
    timeZone: "Europe/Belgrade",
    selectedVehicle: selectedVehicle(draft),
    includeContact: step === "review",
  });
  const fields: Record<BookingStep, string[]> = {
    service: ["service"],
    journey: ["dateTime", "pickup", "destination", "hireMode", "hours", "airportDirection", "airportScope", "return", "scheduleOutline", "eventVenue", "engagement"],
    vehicle: ["passengerCount", "vehiclePreference"],
    review: ["fullName", "email", "company"],
  };
  return issues.filter((issue) => fields[step].includes(issue.field));
}

function currentStep(form: HTMLFormElement): BookingStep {
  const value = form.dataset.step ?? "service";
  return steps.includes(value as BookingStep) ? value as BookingStep : "service";
}

function goToStep(form: HTMLFormElement, step: BookingStep, focus = true): void {
  form.dataset.step = step;
  for (const panel of form.querySelectorAll<HTMLElement>("[data-step-panel]")) {
    panel.hidden = panel.dataset.stepPanel !== step;
  }
  const progressRoot = form.closest("[data-booking-root]") ?? document;
  for (const item of progressRoot.querySelectorAll<HTMLElement>("[data-progress-step]")) {
    const active = item.dataset.progressStep === step;
    item.dataset.active = String(active);
    if (active) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  }
  const back = form.querySelector<HTMLElement>("[data-booking-back]");
  const next = form.querySelector<HTMLElement>("[data-booking-continue]");
  const final = form.querySelector<HTMLElement>("[data-booking-final]");
  if (back) back.hidden = step === "service";
  if (next) next.hidden = step === "review";
  if (final) final.hidden = step !== "review";
  const summary = form.querySelector<HTMLElement>("[data-booking-summary]");
  if (summary) summary.hidden = step === "review";
  clearErrors(form);
  updateConditionalFields(form);
  updateSummary(form);
  if (focus) form.querySelector<HTMLElement>(`[data-step-panel="${step}"] h2`)?.focus();
}

const mounted = new WeakSet<HTMLFormElement>();

export function mountBookingWizards(root: ParentNode = document): void {
  for (const form of root.querySelectorAll<HTMLFormElement>("[data-booking-wizard]")) {
    if (mounted.has(form)) continue;
    mounted.add(form);
    form.dataset.intent = "booking";

    try {
      const persisted = loadBookingDraft(sessionStorage);
      if (persisted) {
        applyDraft(form, persisted);
        const live = form.querySelector<HTMLElement>("[data-booking-live]");
        if (live) live.textContent = form.dataset.draftRecovered ?? "";
      }
    } catch {
      // Storage can be blocked by browser policy; the planner remains usable.
    }

    const url = new URL(window.location.href);
    const handoff = parseBookingHandoff(url.searchParams);
    applyDraft(form, handoff.patch);
    if (["intent", "service", "flightNumber", "date", "time"].some((key) => url.searchParams.has(key))) {
      history.replaceState(history.state, "", cleanBookingHandoffUrl(url));
    }

    updateConditionalFields(form);
    updateVehicleEligibility(form);
    const actions = form.querySelector<HTMLElement>("[data-booking-actions]");
    if (actions) actions.hidden = false;
    goToStep(form, handoff.initialStep, false);

    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("change", (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.name === "serviceCategory") {
        for (const item of form.querySelectorAll<HTMLInputElement>('input[name="service"]')) item.checked = false;
      }
      updateConditionalFields(form);
      updateVehicleEligibility(form);
      clearErrors(form);
      updateSummary(form);
      try { saveBookingDraft(sessionStorage, readDraft(form)); } catch { /* fail open */ }
    });
    form.addEventListener("input", () => {
      updateVehicleEligibility(form);
      updateSummary(form);
      try { saveBookingDraft(sessionStorage, readDraft(form)); } catch { /* fail open */ }
    });

    form.querySelector("[data-booking-continue]")?.addEventListener("click", () => {
      const step = currentStep(form);
      const issues = issuesForStep(form, step);
      if (issues.length > 0) return renderErrors(form, issues);
      const next = steps[steps.indexOf(step) + 1];
      if (next) goToStep(form, next);
    });
    form.querySelector("[data-booking-back]")?.addEventListener("click", () => {
      const step = currentStep(form);
      const previous = steps[steps.indexOf(step) - 1];
      if (previous) goToStep(form, previous);
    });
    for (const edit of form.querySelectorAll<HTMLElement>("[data-edit-step]")) {
      edit.addEventListener("click", () => {
        const step = edit.dataset.editStep as BookingStep;
        if (steps.includes(step)) goToStep(form, step);
      });
    }
    for (const reviewControl of form.querySelectorAll<HTMLElement>("[data-step-panel='review'] input, [data-step-panel='review'] textarea")) {
      reviewControl.addEventListener("blur", () => {
        if (currentStep(form) === "review") {
          const issues = issuesForStep(form, "review");
          if (issues.length > 0) renderErrors(form, issues, false);
        }
      });
    }
  }
}
