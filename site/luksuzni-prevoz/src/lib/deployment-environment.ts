/** Build-time deployment mode. Local builds default to Preview; Pages branch and mode must agree. */
export function getSiteEnvironment(
  value = process.env.SITE_ENVIRONMENT,
  branch = process.env.CF_PAGES_BRANCH,
): "preview" | "production" {
  let environment: "preview" | "production";
  if (value === undefined || value === "" || value === "preview") environment = "preview";
  else if (value === "production") environment = "production";
  else
    throw new Error(
      `Invalid SITE_ENVIRONMENT: expected "preview" or "production", received "${value}"`,
    );

  if (branch === "master" && environment !== "production") {
    throw new Error("Cloudflare master builds require SITE_ENVIRONMENT=production");
  }
  if (branch && branch !== "master" && environment !== "preview") {
    throw new Error(`Cloudflare ${branch} builds require SITE_ENVIRONMENT=preview`);
  }
  return environment;
}

export function isProductionBuild(): boolean {
  return getSiteEnvironment() === "production";
}
