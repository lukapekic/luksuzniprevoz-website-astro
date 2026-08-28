import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extendContactValidationSchema,
  normalizeContactValues,
  validateContactForm,
  type ContactFormValues,
} from "../../src/components/contact/contact-form-validation.ts";

const validValues: ContactFormValues = {
  fullName: "Jovana Petrović",
  email: "jovana.petrovic@example.com",
  phone: "+381 60 111 9999",
  message: "Želela bih više informacija o vašoj usluzi.",
};

describe("contact-form validation", () => {
  it("accepts Unicode full names and common international phone formats", () => {
    for (const values of [
      validValues,
      { ...validValues, fullName: "Михаил Петров", phone: "00381 (60) 111-9999" },
      { ...validValues, fullName: "Anne-Marie O’Neill", phone: "011 234 5678" },
    ]) {
      assert.deepEqual(validateContactForm(values).errors, {});
    }
  });

  it("rejects single-part names, malformed email addresses, and implausible phones", () => {
    const result = validateContactForm({
      fullName: "Robot",
      email: "robot@example",
      phone: "+000 12",
      message: "short",
    });

    assert.deepEqual(result.errors, {
      fullName: "fullNameFormat",
      email: "emailFormat",
      phone: "phoneFormat",
      message: "messageLength",
    });
  });

  it("normalizes compatibility characters and surrounding whitespace", () => {
    assert.deepEqual(
      normalizeContactValues({
        ...validValues,
        fullName: "  Jovana   Petrović  ",
        email: "  jovana@example.com  ",
        message: "  A sufficiently long question.  ",
      }),
      {
        ...validValues,
        fullName: "Jovana Petrović",
        email: "jovana@example.com",
        message: "A sufficiently long question.",
      },
    );
  });

  it("appends custom validators without replacing the baseline schema", () => {
    const schema = extendContactValidationSchema({
      message: [(value) => (value.includes("blocked phrase") ? "messageLength" : null)],
    });

    assert.equal(
      validateContactForm({ ...validValues, message: "This contains a blocked phrase." }, schema)
        .errors.message,
      "messageLength",
    );
    assert.equal(
      validateContactForm({ ...validValues, fullName: "Robot" }, schema).errors.fullName,
      "fullNameFormat",
    );
  });
});
