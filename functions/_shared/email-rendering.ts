import type { BookingPricingResult } from "../../site/luksuzni-prevoz/src/data/booking.ts";
import type { ValidatedSubmission } from "./types.ts";
import { business } from "../../site/luksuzni-prevoz/src/data/business.ts";
import { tokens } from "../../.design/tokens.ts";

// Generated from the site's explicit foundation.config.ts theme selection.
// Use the serialized tokens so the Worker does not import the Node theme loader.
const { palette, spacing, typography, radii } = tokens;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function pricingText(pricing: BookingPricingResult): string {
  if (pricing.kind === "quote-required") return `Quote required (${pricing.reason})`;
  if (pricing.kind === "unavailable") return `Unavailable (${pricing.reason})`;
  return `${pricing.amount} ${pricing.currency} (${pricing.kind})`;
}

/** Email clients need inline CSS and system fonts; reuse the site's token values. */
function renderEmailHtml(title: string, rows: Array<[string, string]>): string {
  const detailRows = rows.filter(([label]) => label !== "Reference" && label !== "Locale");
  const metadataRows = rows.filter(([label]) => label === "Reference" || label === "Locale");
  const renderRows = (entries: Array<[string, string]>): string => entries.map(([label, value]) => `
    <tr><th scope="row" style="padding:${spacing.scale[3]} ${spacing.scale[4]} ${spacing.scale[3]} 0;border-bottom:1px solid ${palette.accent};text-align:left;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;font-size:${typography.sizes.sm};font-weight:${typography.weights.medium};width:30%">${escapeHtml(label)}</th>
    <td style="padding:${spacing.scale[3]} 0;border-bottom:1px solid ${palette.accent};vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(value)}</td></tr>`).join("");

  // This is an internal notification, so the existing operational English copy
  // stays unchanged. No remote images/fonts, scripts, or customer tracking.
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
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
      <tr><td style="padding:${spacing.scale[4]} ${spacing.scale[6]};background:${palette.accent};color:${palette.textOnLight}"><p style="margin:0;font-weight:${typography.weights.semibold}">Pending manual confirmation.</p></td></tr>
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
  const html = renderEmailHtml(subject.slice(0, subject.lastIndexOf(" — ")), rows);
  return { subject, text, html, replyTo, tag };
}
