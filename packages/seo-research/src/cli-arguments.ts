import { SeoResearchError } from "./errors.ts";

export type FlagMap = Map<string, string | true>;

const VALUE_FLAGS = new Set([
  "project",
  "route",
  "locale",
  "mode",
  "output",
  "max-queries",
  "previous",
  "current",
  "report",
  "suggestions",
  "suggestion-input",
]);
const BOOLEAN_FLAGS = new Set(["all", "json", "skip-serp", "skip-competitors", "refresh"]);

export function parseArguments(argv: readonly string[]): { command: string; flags: FlagMap } {
  const command = argv[0] && !argv[0].startsWith("--") ? argv[0] : "run";
  const args = command === "run" && argv[0]?.startsWith("--") ? argv : argv.slice(1);
  const flags: FlagMap = new Map();

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!argument?.startsWith("--")) {
      throw new SeoResearchError(`Unexpected argument: ${argument}`, "invalid_arguments");
    }
    const key = argument.slice(2);
    if (BOOLEAN_FLAGS.has(key)) flags.set(key, true);
    else if (VALUE_FLAGS.has(key)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new SeoResearchError(`--${key} requires a value`, "invalid_arguments");
      }
      flags.set(key, value);
      index += 1;
    } else throw new SeoResearchError(`Unknown flag: --${key}`, "invalid_arguments");
  }

  return { command, flags };
}

export function stringFlag(flags: FlagMap, key: string, required = false): string | undefined {
  const value = flags.get(key);
  if (typeof value === "string") return value;
  if (required) throw new SeoResearchError(`--${key} is required`, "invalid_arguments");
  return undefined;
}
