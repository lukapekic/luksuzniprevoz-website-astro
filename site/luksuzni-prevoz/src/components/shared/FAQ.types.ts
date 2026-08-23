/**
 * FAQ item — canonical question/answer shape (FND-ARCH-03 / structured-data.md).
 *
 * This is the single shared shape that lets one data source feed BOTH the visible
 * <FAQ> component AND FAQ structured data with no duplication or mapping:
 *
 *   - structurally identical to `buildFaqPage(faqs)` in
 *     `@astro-foundation/core/seo` (FaqPageSchema.mainEntity → Question.name /
 *     acceptedAnswer.text);
 *   - structurally identical to the editorial content model's FAQ items in
 *     `src/content/schemas/shared.ts` (`faqSchema.items`).
 *
 * So a page reads `faq.items` from content once and may pass the same array to
 * <FAQ items={faq.items} /> and to `buildFaqPage(faq.items)` (when FAQPage schema
 * is enabled in `capabilities.structuredData`).
 *
 * The component itself owns NO copy — content is supplied entirely by the caller
 * (component-architecture.md §18).
 */
export interface FaqItem {
  question: string;
  answer: string;
}
