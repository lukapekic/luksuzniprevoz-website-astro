import { handleFormSubmission } from "../../_shared/submission-pipeline.ts";
import type { PagesContextLike } from "../../_shared/types.ts";
import { validateContactPayload } from "../../_shared/validation.ts";

export const onRequest = (context: PagesContextLike): Promise<Response> => handleFormSubmission(context, {
  kind: "contact",
  action: "contact_submit",
  maxBytes: 16 * 1024,
  validate: validateContactPayload,
});
