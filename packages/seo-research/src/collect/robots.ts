import type { SafeFetchOptions } from "./safe-fetch.ts";
import { safeFetchText } from "./safe-fetch.ts";

interface RobotsGroup {
  readonly agents: string[];
  readonly rules: Array<{ readonly kind: "allow" | "disallow"; readonly path: string }>;
}

function groupsFromRobots(robots: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let agents: string[] = [];
  let rules: RobotsGroup["rules"] = [];
  const flush = () => {
    if (agents.length > 0) groups.push({ agents, rules });
    agents = [];
    rules = [];
  };
  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) {
      if (rules.length > 0) flush();
      continue;
    }
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey?.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      if (rules.length > 0) flush();
      if (value) agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && agents.length > 0 && value) {
      rules.push({ kind: key, path: value });
    }
  }
  flush();
  return groups;
}

function robotsAllows(robots: string, userAgent: string, pathname: string): boolean {
  const groups = groupsFromRobots(robots);
  const normalizedAgent = userAgent.toLowerCase();
  const exact = groups.filter((group) => group.agents.includes(normalizedAgent));
  const applicable =
    exact.length > 0 ? exact : groups.filter((group) => group.agents.includes("*"));
  const matched = applicable
    .flatMap((group) => group.rules)
    .filter((rule) => pathname.startsWith(rule.path))
    .sort(
      (left, right) => right.path.length - left.path.length || (left.kind === "allow" ? -1 : 1),
    );
  return matched[0]?.kind !== "disallow";
}

export async function isAllowedByRobots(
  targetUrl: string,
  options: SafeFetchOptions,
): Promise<boolean> {
  const target = new URL(targetUrl);
  const robotsUrl = new URL("/robots.txt", target.origin).href;
  try {
    const response = await safeFetchText(robotsUrl, {
      ...options,
      maxResponseBytes: Math.min(options.maxResponseBytes, 200_000),
      acceptedContentTypes: ["text/plain", "text/"],
    });
    return robotsAllows(response.text, "AstroFoundationSeoResearch", target.pathname);
  } catch {
    return true;
  }
}
