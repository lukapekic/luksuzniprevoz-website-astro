// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://luksuzniprevoz.rs",
  // FND-I18N-04: directory format + always-trailing-slash so every emitted
  // path is stable and redirect-free across locales.
  trailingSlash: "always",
  build: {
    format: "directory",
    assets: "_assets",
  },
  output: "static",
  // FND-ENV-06: server-side env schema. Secrets are declared here and accessed
  // via `import { env } from "astro:env/getServerSecret"` — they are NEVER
  // inlined into the static bundle. The secret-scan step (quality:release)
  // independently verifies nothing leaked into dist/. The reference site has
  // no real secrets; this declares the pattern a consuming project follows.
  env: {
    schema: {
      // Example: a contact-form endpoint key (server-only, never client-exposed).
      // Uncomment and set via .env when wiring a real form endpoint.
      // CONTACT_FORM_KEY: env.string({ access: "server", context: "server" }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
    },
  },
});
