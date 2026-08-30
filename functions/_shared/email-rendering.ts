import type { BookingPricingResult } from "../../site/luksuzni-prevoz/src/data/booking.ts";
import type { ValidatedSubmission } from "./types.ts";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function pricingText(pricing: BookingPricingResult): string {
  if (pricing.kind === "quote-required") return `Quote required (${pricing.reason})`;
  if (pricing.kind === "unavailable") return `Unavailable (${pricing.reason})`;
  return `${pricing.amount} ${pricing.currency} (${pricing.kind})`;
}

export function renderSubmissionEmail(
  submission: ValidatedSubmission,
  reference: string,
): { subject: string; text: string; html: string; replyTo: { email: string; name: string }; tag: string } {
  const rows: Array<[string, string]> = [["Reference", reference], ["Locale", submission.locale]];
  let replyTo: { email: string; name: string };
  let subject: string;
  let tag: string;

  if (submission.kind === "contact") {
    const { fullName, email, phone, message } = submission.values;
    subject = `New contact question — ${reference}`;
    tag = "contact-form";
    replyTo = { email, name: fullName };
    rows.push(["Name", fullName], ["Email", email]);
    if (phone) rows.push(["Phone", phone]);
    rows.push(["Question", message]);
  } else {
    const { draft, request, pricing } = submission;
    subject = `New ${request.intent} request — ${reference}`;
    tag = "booking-form";
    replyTo = { email: draft.email!, name: draft.fullName! };
    rows.push(
      ["Intent", request.intent],
      ["Service", request.serviceKey],
      ["Date", request.date],
      ["Time (Europe/Belgrade)", request.time],
      ["Pickup", request.pickup],
      ["Passengers", String(request.passengerCount)],
      ["Vehicle", request.vehiclePreference],
      ["Commercial state", pricingText(pricing)],
      ["Name", draft.fullName!],
      ["Email", draft.email!],
    );
    if ("destination" in request) rows.push(["Destination", request.destination]);
    if (draft.phone) rows.push(["Phone", draft.phone]);
    if (draft.company) rows.push(["Company", draft.company]);
    if (draft.flightNumber) rows.push(["Flight", draft.flightNumber]);
    if (draft.scheduleOutline) rows.push(["Schedule", draft.scheduleOutline]);
    if (draft.notes) rows.push(["Notes", draft.notes]);
  }

  const text = `${subject}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nPending manual confirmation.`;
  const html = `<h2>${escapeHtml(subject)}</h2><table style="border-collapse:collapse;font-family:sans-serif">${rows.map(([label, value]) => `<tr><th scope="row" style="padding:4px 12px 4px 0;text-align:left;vertical-align:top">${escapeHtml(label)}</th><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("")}</table><p><strong>Pending manual confirmation.</strong></p>`;
  return { subject, text, html, replyTo, tag };
}
