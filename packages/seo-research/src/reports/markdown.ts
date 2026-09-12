import type { SeoResearchReport } from "./schema.ts";

export function renderSeoResearchMarkdown(report: SeoResearchReport): string {
  const lines = [
    `# SEO Research — ${report.page.routeKey}/${report.page.locale}`,
    "",
    `- URL: ${report.page.url}`,
    `- Generated: ${report.run.generatedAt}`,
    `- Mode: ${report.run.mode}`,
    `- Query: ${report.target.primaryKeyword}`,
    `- Position: ${report.serp?.ourPosition ?? "not found / not collected"}`,
    `- Source digest: \`${report.page.sourceDigest}\``,
    "",
    "## Findings",
    "",
  ];
  if (report.findings.length === 0) lines.push("No findings.", "");
  for (const finding of report.findings) {
    lines.push(
      `### [${finding.severity}] ${finding.summary}`,
      "",
      finding.detail,
      "",
      `Evidence: ${finding.evidenceIds.map((id) => `\`${id}\``).join(", ")}`,
      "",
    );
  }
  lines.push("## Proposals", "");
  if (report.proposals.length === 0)
    lines.push(
      "No deterministic field replacement was safe to propose. Use the evidence bundle for reviewed editorial drafting.",
      "",
    );
  for (const proposal of report.proposals) {
    lines.push(
      `### ${proposal.id}`,
      "",
      `- Field: \`${proposal.target.fieldPath}\``,
      `- Confidence: ${proposal.confidence}`,
      `- Requires review: yes`,
      `- Rationale: ${proposal.rationale}`,
      "",
    );
  }
  if (report.warnings.length > 0) {
    lines.push("## Warnings", "");
    report.warnings.forEach((warning) => lines.push(`- **${warning.code}:** ${warning.message}`));
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}
