export interface FoundationIssue {
  ruleId: string;
  severity: "error" | "warning";
  filePath?: string;
  line?: number;
  column?: number;
  offendingValue?: string;
  expectedValue?: string;
  fix?: string;
  docAnchor?: string;
}

export function reportIssue(issue: FoundationIssue): string {
  let msg = `✖ ${issue.ruleId}`;
  if (issue.filePath) msg += `  ${issue.filePath}`;
  if (issue.line != null) msg += `:${issue.line}`;
  if (issue.column != null) msg += `:${issue.column}`;
  msg += `\n  ${issue.severity === "error" ? "Error" : "Warning"}: ${issue.offendingValue || ""}`;
  if (issue.expectedValue) msg += `\n    Expected: ${issue.expectedValue}`;
  if (issue.fix) msg += `\n  Fix: ${issue.fix}`;
  if (issue.docAnchor) msg += `\n  → ${issue.docAnchor}`;
  return msg;
}

export function formatIssues(issues: FoundationIssue[]): string {
  // Group by file, order deterministically
  const grouped = new Map<string, FoundationIssue[]>();
  for (const issue of issues) {
    const key = issue.filePath || "(global)";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(issue);
  }
  const lines: string[] = [];
  for (const [file, fileIssues] of grouped) {
    lines.push(`\n${file}`);
    for (const issue of fileIssues) {
      lines.push(reportIssue(issue));
    }
  }
  // Summary
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  lines.push(`\n${errors} error(s), ${warnings} warning(s)`);
  return lines.join("\n");
}
