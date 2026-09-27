import type { BookingPricingResult } from "../../site/luksuzni-prevoz/src/data/booking.ts";
import type { ValidatedSubmission } from "./types.ts";
import { business } from "../../site/luksuzni-prevoz/src/data/business.ts";
import { tokens } from "../../.design/tokens.ts";
import { getVehicle } from "../../site/luksuzni-prevoz/src/data/fleet.ts";
import { staffEmail } from "../../site/luksuzni-prevoz/src/content/ui/staff-email.sr.ts";
import { formatDisplayDate } from "@astro-foundation/form-kit";
import { formatCurrency } from "../../packages/astro-foundation/src/i18n/format.ts";

// Generated from the site's explicit foundation.config.ts theme selection.
// Use the serialized tokens so the Worker does not import the Node theme loader.
const { palette, spacing, typography, radii } = tokens;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function pricingText(pricing: BookingPricingResult): string {
  const label = staffEmail.pricingKinds[pricing.kind];
  if (pricing.kind === "quote-required") return `${label}: ${staffEmail.quoteReasons[pricing.reason]}`;
  if (pricing.kind === "unavailable") return `${label}: ${staffEmail.unavailableReasons[pricing.reason]}`;
  return `${label}: ${formatCurrency(pricing.amount, pricing.currency, staffEmail.numberLocale)}`;
}

/** Email clients need inline CSS and system fonts; reuse the site's token values. */
function renderEmailHtml(title: string, detailRows: Array<[string, string]>, metadataRows: Array<[string, string]>, pending: string): string {
  const renderRows = (entries: Array<[string, string]>): string => entries.map(([label, value]) => `
    <tr><th scope="row" style="padding:${spacing.scale[3]} ${spacing.scale[4]} ${spacing.scale[3]} 0;border-bottom:1px solid ${palette.accent};text-align:left;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;font-size:${typography.sizes.sm};font-weight:${typography.weights.medium};width:30%">${escapeHtml(label)}</th>
    <td style="padding:${spacing.scale[3]} 0;border-bottom:1px solid ${palette.accent};vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(value)}</td></tr>`).join("");

  // No remote images/fonts, scripts, or customer tracking.
  return `<!doctype html>
<html lang="${staffEmail.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:${palette.surfaceLight};color:${palette.textOnLight};font-family:${typography.fallbacks.body};font-size:${typography.sizes.base};line-height:${typography.lineHeight.body}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${palette.surfaceLight}"><tr><td align="center" style="padding:${spacing.scale[6]} ${spacing.scale[4]}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:${typography.measure.compact};border-collapse:separate;border-spacing:0">
      <tr><td style="padding:${spacing.scale[6]};background:${palette.background};color:${palette.textPrimary};border-radius:${radii.card} ${radii.card} 0 0">
        <p style="margin:0 0 ${spacing.scale[2]};font-size:${typography.sizes.sm};color:${palette.accent}">${escapeHtml(business.publicBrand)}</p>
        <h1 style="margin:0;font-size:${typography.sizes.xl};line-height:${typography.lineHeight.ui};font-weight:${typography.weights.semibold}">${escapeHtml(title)}</h1>
      </td></tr>
      <tr><td style="padding:${spacing.scale[6]};background:${palette.inputSurface}">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;color:${palette.textOnLight}">${renderRows(detailRows)}</table>
      </td></tr>
      <tr><td style="padding:${spacing.scale[4]} ${spacing.scale[6]};background:${palette.accent};color:${palette.textOnLight}"><p style="margin:0;font-weight:${typography.weights.semibold}">${escapeHtml(pending)}</p></td></tr>
      <tr><td style="padding:${spacing.scale[4]} ${spacing.scale[6]};background:${palette.inputSurface};border-radius:0 0 ${radii.card} ${radii.card}">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;color:${palette.textOnLight};font-size:${typography.sizes.sm}">${renderRows(metadataRows)}</table>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export function renderSubmissionEmail(
  submission: ValidatedSubmission,
  reference: string,
): { subject: string; text: string; html: string; replyTo: { email: string; name: string }; tag: string } {
  const labels = staffEmail.labels;
  const metadataRows: Array<[string, string]> = [
    [labels.reference, reference],
    [labels.locale, staffEmail.localeNames[submission.locale]],
  ];
  const rows: Array<[string, string]> = [];
  let replyTo: { email: string; name: string };
  let title: string;
  let pending: string;
  let tag: string;

  if (submission.kind === "contact") {
    const { fullName, email, phone, message } = submission.values;
    title = staffEmail.contactTitle;
    pending = staffEmail.pendingContact;
    tag = "contact-form";
    replyTo = { email, name: fullName };
    rows.push([labels.name, fullName], [labels.email, email]);
    if (phone) rows.push([labels.phone, phone]);
    rows.push([labels.message, message]);
  } else {
    const { draft, request, pricing } = submission;
    title = staffEmail.bookingTitles[request.intent];
    pending = staffEmail.pendingBooking;
    tag = "booking-form";
    replyTo = { email: draft.email!, name: draft.fullName! };
    rows.push(
      [labels.intent, staffEmail.intents[request.intent]],
      [labels.service, staffEmail.services[request.serviceKey]],
      [labels.date, formatDisplayDate(request.date)],
      [labels.time, request.time],
      [labels.pickup, request.pickup],
      [labels.passengers, String(request.passengerCount)],
      [labels.vehicle, request.vehiclePreference === "recommend"
        ? staffEmail.recommendVehicle
        : getVehicle(request.vehiclePreference).displayName],
      [labels.pricing, pricingText(pricing)],
      [labels.name, draft.fullName!],
      [labels.email, draft.email!],
    );
    if ("destination" in request) rows.push([labels.destination, request.destination]);
    if (draft.phone) rows.push([labels.phone, draft.phone]);
    if (draft.company) rows.push([labels.company, draft.company]);
    if (draft.flightNumber) rows.push([labels.flight, draft.flightNumber]);
    if (draft.scheduleOutline) rows.push([labels.schedule, draft.scheduleOutline]);
    if (draft.notes) rows.push([labels.notes, draft.notes]);
  }

  const subject = `${title} — ${reference}`;
  const text = `${subject}\n\n${[...metadataRows, ...rows].map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${pending}`;
  const html = renderEmailHtml(title, rows, metadataRows, pending);
  return { subject, text, html, replyTo, tag };
}
