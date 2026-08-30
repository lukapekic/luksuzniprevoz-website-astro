import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveCtaHref, resolveFlowHref, type Cta } from "../../src/lib/cta.ts";

describe("CTA resolution", () => {
  it("keeps booking and quote intents distinct on localized Booking routes", () => {
    assert.equal(resolveFlowHref("booking", "sr"), "/rezervacija/?intent=booking");
    assert.equal(resolveFlowHref("booking", "en"), "/en/booking/?intent=booking");
    assert.equal(resolveFlowHref("quote", "ru"), "/ru/bronirovanie/?intent=quote");
    assert.equal(
      resolveFlowHref("booking", "en", { service: "airportTransportation" }),
      "/en/booking/?intent=booking&service=airportTransportation",
    );
  });

  it("adds service context only when a concrete caller supplies it", () => {
    const cta: Cta = { label: "Book", target: { type: "flow", flowKey: "booking" } };
    assert.equal(resolveCtaHref(cta, "sr"), "/rezervacija/?intent=booking");
    assert.equal(
      resolveCtaHref(cta, "sr", { service: "privateChauffeur" }),
      "/rezervacija/?intent=booking&service=privateChauffeur",
    );
  });

  it("preserves canonical route and same-document anchor behavior", () => {
    const routeCta: Cta = {
      label: "Fleet",
      target: { type: "route", routeKey: "fleet" },
    };
    const anchorCta: Cta = {
      label: "Details",
      target: { type: "anchor", anchorId: "details" },
    };

    assert.equal(resolveCtaHref(routeCta, "en"), "/en/fleet/");
    assert.equal(resolveCtaHref(anchorCta, "en"), "#details");
  });

  it("fails unknown runtime flows unless omission is explicitly requested", () => {
    const invalid = {
      label: "Unknown",
      target: { type: "flow", flowKey: "unknown" },
    } as unknown as Cta;

    assert.throws(() => resolveCtaHref(invalid, "en"), /Unknown flow key/);
    assert.equal(resolveCtaHref(invalid, "en", { unresolvedFlow: "omit" }), null);
  });
});
