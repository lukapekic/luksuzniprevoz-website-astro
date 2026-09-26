import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderSubmissionEmail } from "../../../../functions/_shared/email-rendering.ts";
import type { BookingSubmission, FormLocale } from "../../../../functions/_shared/types.ts";
import type { BookingPricingResult, QuoteReason } from "../../src/data/booking.ts";

function booking(pricing: BookingPricingResult = { kind: "quote-required", reason: "quote-only-service" }): BookingSubmission {
  return {
    kind: "booking",
    locale: "en",
    draft: { fullName: "Jovana Petrović", email: "jovana@example.com", phone: "0601234567", notes: 'Prvi red\n<provera> & "detalji"' },
    request: {
      intent: "booking", serviceKey: "privateChauffeur", date: "2026-10-07", time: "19:19",
      pickup: "Beograd", destination: "Senjak", passengerCount: 1, vehiclePreference: "skoda-kodiaq",
      childSeatRequested: false, multipleVehiclesRequested: false, hireMode: "hourly", hours: 3,
      multiDay: false, international: false,
    },
    pricing,
  };
}

function assertVisible(email: ReturnType<typeof renderSubmissionEmail>, value: string): void {
  assert.ok(email.text.includes(value), `Plain text missing: ${value}`);
  assert.ok(email.html.includes(value), `HTML missing: ${value}`);
}

describe("Serbian staff emails", () => {
  it("formats the booking example in HTML and plain text without changing submitted data", () => {
    const submission = booking();
    const original = structuredClone(submission);
    const email = renderSubmissionEmail(submission, "LP-BOOKING");
    assert.equal(email.subject, "Novi zahtev za rezervaciju — LP-BOOKING");
    for (const value of ["Rezervacija", "Privatni vozač", "07/10/2026", "19:19", "Škoda Kodiaq",
      "Individualna ponuda: Ova usluga se obračunava individualno", "Čeka potvrdu našeg tima.",
      "Broj zahteva", "Jezik obrasca", "Engleski", "0601234567"]) assertVisible(email, value);
    assert.match(email.html, /lang="sr-Latn-RS"/);
    assert.match(email.html, /&lt;provera&gt; &amp; &quot;detalji&quot;/);
    assert.ok(email.text.includes(submission.draft.notes!));
    assert.doesNotMatch(email.text, /privateChauffeur|skoda-kodiaq|quote-only-service|2026-10-07/);
    assert.deepEqual(email.replyTo, { email: "jovana@example.com", name: "Jovana Petrović" });
    assert.equal(email.tag, "booking-form");
    assert.deepEqual(submission, original);
  });

  it("formats quote intent, vehicle recommendation, and a leap-day date", () => {
    const submission = booking({ kind: "quote-required", reason: "vehicle-recommendation" });
    submission.request.intent = "quote";
    submission.request.vehiclePreference = "recommend";
    submission.request.date = "2028-02-29";
    const email = renderSubmissionEmail(submission, "LP-QUOTE");
    assert.equal(email.subject, "Novi zahtev za ponudu — LP-QUOTE");
    for (const value of ["Ponuda", "Preporučite vozilo", "29/02/2028", "Cena se potvrđuje nakon preporuke odgovarajućeg vozila"]) assertVisible(email, value);
  });

  it("uses readable Serbian explanations for every quote reason", () => {
    const reasons: Record<QuoteReason, string> = {
      "multi-day": "Višednevni zahtev",
      international: "Međunarodni plan puta",
      "outside-airport-scope": "Vožnja je van opsega fiksne aerodromske cene",
      "airport-return-policy-undefined": "Cenu povratnog aerodromskog prevoza potvrđujemo pojedinačno",
      "package-distance-exceeded": "Planirana udaljenost prelazi kilometre uključene u paket",
      "business-estimate-policy-undefined": "Cenu poslovnog prevoza potvrđujemo prema rasporedu",
      "multiple-vehicles": "Više vozila zahteva koordinaciju",
      "complex-itinerary": "Složen plan puta",
      "quote-only-service": "Ova usluga se obračunava individualno",
      "vehicle-recommendation": "Cena se potvrđuje nakon preporuke odgovarajućeg vozila",
    };
    for (const [reason, explanation] of Object.entries(reasons)) {
      const email = renderSubmissionEmail(booking({ kind: "quote-required", reason: reason as QuoteReason }), "LP-PRICE");
      assertVisible(email, `Individualna ponuda: ${explanation}`);
      assert.ok(!email.text.includes(`(${reason})`));
    }
  });

  it("formats numeric prices with Serbian decimals and distinguishes every pricing state", () => {
    const base = { vehicleId: "skoda-superb", amount: 1234.5, currency: "EUR" } as const;
    const cases: Array<[BookingPricingResult, string]> = [
      [{ ...base, kind: "fixed", source: "airport-transfer" }, "Fiksna cena: 1.234,50"],
      [{ ...base, kind: "calculated", source: "hourly" }, "Obračunata cena: 1.234,50"],
      [{ ...base, kind: "estimate", source: "half-day-base", reason: "distance-unqualified" }, "Procenjena cena paketa: 1.234,50"],
      [{ kind: "unavailable", reason: "invalid-request" }, "Cena trenutno nije dostupna: Neispravni podaci zahteva"],
      [{ kind: "unavailable", reason: "missing-pricing-data" }, "Cena trenutno nije dostupna: Podaci o ceni nisu dostupni"],
    ];
    for (const [pricing, expected] of cases) {
      const email = renderSubmissionEmail(booking(pricing), "LP-PRICE");
      assertVisible(email, expected);
      if ("amount" in pricing) assertVisible(email, "€");
    }
  });

  it("uses Serbian contact copy for all visitor locales and preserves contact values", () => {
    const languages: Record<FormLocale, string> = { sr: "Srpski", en: "Engleski", ru: "Ruski" };
    for (const locale of ["sr", "en", "ru"] as const) {
      const values = { fullName: "Иван Петров", email: "ivan@example.com", phone: "+381 60 123 4567", message: "Hello\nTreba mi prevoz." };
      const email = renderSubmissionEmail({ kind: "contact", locale, values }, "LP-CONTACT");
      assert.equal(email.subject, "Novi upit sa kontakt forme — LP-CONTACT");
      for (const value of ["Ime i prezime", "E-mail adresa", "Telefon", "Poruka", "Jezik obrasca", languages[locale],
        ...Object.values(values), "Čeka odgovor našeg tima."]) assertVisible(email, value);
      assert.doesNotMatch(email.text, /Pending manual confirmation|Čeka potvrdu/);
      assert.deepEqual(email.replyTo, { email: values.email, name: values.fullName });
      assert.equal(email.tag, "contact-form");
    }
    const email = renderSubmissionEmail({ kind: "contact", locale: "sr", values: { fullName: "Jovana", email: "jovana@example.com", phone: "", message: "Upit" } }, "LP-NO-PHONE");
    assert.doesNotMatch(email.text, /Telefon:/);
  });
});
