import { handleFormSubmission } from "../../_shared/submission-pipeline.ts";
import type { PagesContextLike } from "../../_shared/types.ts";
import { validateBookingPayload } from "../../_shared/validation.ts";

export const onRequest = (context: PagesContextLike): Promise<Response> => handleFormSubmission(context, {
  kind: "booking",
  action: "booking_submit",
  maxBytes: 64 * 1024,
  validate: validateBookingPayload,
});
