# Belgrade Transfers footer — source reference for Luksuzni transport

Captured: 2026-09-24  
Purpose: Read-only reference for DR-08 in `luksuzniprevoz-design-refinement-backlog.md`.  
Target: `lukapekic/luksuzniprevoz-website-astro`  
Source: `lukapekic/belgradetransfers-website-astro`  
Source branch: `main`  
Source commit: `ca16f7da6db86a3e75e8c1deea712e35d29101c5`  
Source path: `examples/reference-site/src/components/site/SiteFooter.astro`  
Footer Git blob: `ed1c97d46564f7c5769600b96c8badb515729ba4`

## Read this first

The owner approved reusing the footer's style and composition with **Luksuzni transport's own logo, contacts, theme, routes, and public identity**. This file preserves the original code for study. It is not a drop-in target component and does not change production. Source-specific brand names, contact values, links, comments, and placeholder behavior below are evidence, not instructions to publish them on the target website.

The footer blob is identical on the inspected `main`, `homepage-section-design`, and `fleet-page-design` branches. The pinned main commit is the reference; the separately checked newer-design branches do not supply a different footer. Use its `full` variant as the model. The source's `holding` variant omits navigation for a temporary site state; do not introduce holding behavior into the target website.

A byte-identical standalone copy is supplied as `belgradetransfers-SiteFooter.reference.astro`. Every captured source in this document was checked against its Git blob SHA-1 using the exact UTF-8 bytes. This is a source review, not a rendered production visual audit.

## Design extraction

The distinguishing feature is three horizontal tiers:

1. **Utility tier:** compact horizontal logo plus direct contact channels; a smaller social group at the opposite edge only when a real profile exists.
2. **Navigation tier:** four balanced navigation groups separated from utility rows by fine dividers. Labels have stronger weight and restrained uppercase tracking; ordinary links are quieter.
3. **Bottom tier:** current-year copyright/legal information on one side, location and inline locale links on the other.

The source uses a single stacked mobile composition below 48rem, two-column utility rows and a 2×2 navigation grid from 48rem, then horizontal utility rows and four navigation columns at 80rem. It requires no footer-specific JavaScript. The bottom rows are duplicated in the source for mobile/wide display; the target should preserve one semantic DOM tree and solve its arrangement with layout rather than duplicate interactive controls.

The original CSS has 4rem outer padding (5rem at the wide breakpoint), 3rem navigation padding, and 44px link rows. Therefore "compact" describes the organized composition, not proof that this exact source produces a shorter footer than the current target. Target spacing must be tuned with its shorter route lists and current Theme V2 tokens; do not transplant generous source spacing or reduce accessible targets to claim a height reduction.

## Target adaptation map

| Source concern | Target implementation |
| --- | --- |
| Midnight Titanium colors/gradient | Theme V2 Black & Platinum background/surface/divider roles; retain a calm graphite surface, no blue tint or radial glow |
| `config.brand` / source logo | Canonical `Luksuzni transport` and approved target car-symbol/logo assets; remove GS branding across shared consumers |
| `SiteBrand` imports | Reuse/adapt target `BrandLockup`; do not import Belgrade Transfers SVGs |
| Source phone/WhatsApp row | Verified target phone and email; WhatsApp only if separately verified |
| Follow-us/Instagram | Omit the entire empty social block when target has no verified social profile |
| Four source link groups | Target route-driven groups in DR-08; do not invent destination pages or vehicle detail routes |
| `footerLegalLinks` placeholders | Render only existing published legal destinations; no disabled Privacy/Terms labels or `#` links |
| `PageContainer` / 100rem source container | Current target main container: 80rem at the inspected theme; do not widen the website |
| `getVerifiedValue(business.*)` | Target `contact.ts` verification model and `business.ts` facts |
| Source typography names/raw recipes | Target Manrope body/UI and existing semantic sizes; retain own logo artwork/wordmark styling |
| `LanguageSwitcher presentation="inline"` | Target shared switcher lacks this prop at the reviewed commit; add a scoped shared inline presentation with the existing dropdown as default |
| Source `full` / `holding` variants | One ordinary global target footer; no new variant API unless a real target requirement appears |
| Two bottom-row DOM branches | One semantic bottom region with route-aware locales and no duplicate focus stops |
| Source placeholder spans | Omit unavailable target destinations instead of copying visible placeholders |

Target details confirmed in `contact.ts`: phone `+381 60 111 9999`, email `office@luksuzniprevoz.rs`, office `Antifašističke borbe 25`, `11070`, Belgrade, Serbia, every day `08:00–18:00`. These are repository facts as of the reviewed target commit, not independent business verification. Consume the current data at implementation time. No target WhatsApp/Instagram field or verified Maps URL was found; do not derive WhatsApp from the phone or invent social handles.

## Dependency map

Paths in this section belong to the SOURCE repository unless prefixed as target paths. The footer source depends on these modules; copying its `.astro` file alone will not compile in the target.

| Dependency | Responsibility | Migration guidance |
| --- | --- | --- |
| `examples/reference-site/foundation.config.ts` | Brand/default locale | Use target configuration and Serbian default |
| `src/data/business.ts` | Verification-gated contacts | Adapt to target contact facts; do not copy source phone/email |
| `src/data/navigation.ts` | Groups and legal links | Adapt to published target route keys and localization |
| `src/data/shared-ui.ts` | Footer variant, navigation/target types | Use target types; do not port unrelated intro/holding APIs |
| `src/data/routes.ts` | Route keys/slugs | Use target route map and `getPath` |
| `src/lib/i18n.ts` | UI translation helper | Use target helper and all three locale files |
| `src/foundation/ui/PageContainer.astro` | Container primitive | Use target container and its supported style interface |
| `src/foundation/ui/LanguageSwitcher.astro` | Inline route-preserving locale navigation | Extend target shared control carefully, retaining header behavior |
| `src/components/site/FooterIcon.astro` | Decorative outline icons | Reuse equivalent target icons; add email icon from the same icon system if needed |
| `src/components/site/SiteBrand.astro` | Responsive logo asset selection | Integrate target-approved logo through shared BrandLockup |
| Active source theme/global CSS | Token values, fonts, resets | Use active target tokens; source token names are not proof of target availability |

The archived source design brief is `project-starter-docs/design/shared/06-site-footer.md`, blob `2d40a3e08308d15bf1361af525f2bd81728197cb`. It contains source-only locked instructions (specific destinations, email exclusion, palette, old typography wording). Those rules apply to Belgrade Transfers, not to this adaptation. The current owner decision, DR-08/DR-09, and updated target contracts govern the target.

## Source provenance

| File | Git blob |
| --- | --- |
| [SiteFooter.astro](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/src/components/site/SiteFooter.astro) | `ed1c97d46564f7c5769600b96c8badb515729ba4` |
| [FooterIcon.astro](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/src/components/site/FooterIcon.astro) | `8978e1446e9f32241a1692158afdd1d584caddb8` |
| [SiteBrand.astro](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/src/components/site/SiteBrand.astro) | `1b94d88bbe0b65e757bb06b06aa0451c3e5af536` |
| [navigation.ts](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/src/data/navigation.ts) | `51ee4ef55948cc74d3e4227ab065589e5a30a2a2` |
| [business.ts](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/src/data/business.ts) | `8cafeaca6cd3e7e20480d4a29979a327915f436b` |
| [LanguageSwitcher.astro](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/src/foundation/ui/LanguageSwitcher.astro) | `2508d0362d1d643279a8992967307c056cb27182` |
| [PageContainer.astro](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/src/foundation/ui/PageContainer.astro) | `753912d424213949469676c7477b3497e117fb5b` |
| [foundation.config.ts](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/foundation.config.ts) | `a1b408606d5c9afd07004b1ca44925b867e3db5d` |
| [shared-ui.ts](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/src/data/shared-ui.ts) | `8af9d28dc548eed1cb1a353dea8caa7c5870849a` |
| [spacing.json](https://github.com/lukapekic/belgradetransfers-website-astro/blob/ca16f7da6db86a3e75e8c1deea712e35d29101c5/examples/reference-site/src/theme/versions/midnight-titanium-v2/spacing.json) | `a3eda71ce42aafc2263b14c4e30347977db85623` |

## Complete original SiteFooter.astro

The block below is the entire original file, including imports, props, markup, and scoped CSS, without edits.

```astro
---
/** SiteFooter — stable, data-gated three-tier site footer. */
import type { LocaleCode, RouteKey } from "@astro-foundation/core";
import { getPath } from "@astro-foundation/core/i18n";
import { config } from "../../../foundation.config.ts";
import {
  businessData,
  getVerifiedValue,
  type BusinessData,
  type ContactDestination,
} from "../../data/business.ts";
import {
  footerGroups as defaultFooterGroups,
  footerLegalLinks as defaultFooterLegalLinks,
  type FooterGroup,
} from "../../data/navigation.ts";
import { routes } from "../../data/routes.ts";
import type {
  FooterVariant,
  NavigationItem,
  SharedTarget,
} from "../../data/shared-ui.ts";
import { t } from "../../lib/i18n.ts";
import LanguageSwitcher from "../../foundation/ui/LanguageSwitcher.astro";
import PageContainer from "../../foundation/ui/PageContainer.astro";
import FooterIcon from "./FooterIcon.astro";
import SiteBrand from "./SiteBrand.astro";

interface Props {
  currentRouteKey: RouteKey;
  currentLocale: LocaleCode;
  variant?: FooterVariant;
  business?: BusinessData;
  groups?: readonly FooterGroup[];
  legalLinks?: readonly NavigationItem[];
  landmarkLabelSuffix?: string;
}

const {
  currentRouteKey,
  currentLocale,
  variant = "full",
  business = businessData,
  groups = defaultFooterGroups,
  legalLinks = defaultFooterLegalLinks,
  landmarkLabelSuffix,
} = Astro.props;
const defaultLocale = config.locales.locales.find((locale) => locale.isDefault)!.code;
const homeHref = getPath("home", currentLocale, routes, defaultLocale);
const year = new Date().getFullYear();
const instanceId = `site-footer${landmarkLabelSuffix ? `-${landmarkLabelSuffix.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}` : ""}`;
const withSuffix = (label: string) => landmarkLabelSuffix ? `${label} — ${landmarkLabelSuffix}` : label;
const footerContext = withSuffix(t("nav.footer", currentLocale));
const footerNavLabel = (label: string) => `${label} — ${footerContext}`;
const footerGroupInventory: readonly FooterGroup[] = groups;

const resolveTarget = (target: SharedTarget) => {
  if (target.status === "placeholder") return undefined;
  if (target.destination.kind === "internal") {
    return {
      href: getPath(target.destination.routeKey, currentLocale, routes, defaultLocale),
      external: false,
      current: target.destination.routeKey === currentRouteKey,
    };
  }
  return {
    href: target.destination.href,
    external: target.destination.href.startsWith("https://") || target.destination.href.startsWith("http://"),
    current: false,
  };
};

const preparedGroups = footerGroupInventory.map((group) => ({
  ...group,
  label: t(group.labelKey, currentLocale),
  items: group.items.map((item) => ({
    ...item,
    label: t(item.labelKey, currentLocale),
    destination: resolveTarget(item.target),
  })),
}));
const preparedLegalLinks = legalLinks.map((item) => ({
  ...item,
  label: t(item.labelKey, currentLocale),
  destination: resolveTarget(item.target),
}));
const phone = getVerifiedValue(business.phone);
const whatsapp = getVerifiedValue(business.whatsapp);
const instagram = getVerifiedValue(business.instagram);
const address = getVerifiedValue(business.address);
const contacts: readonly {
  id: "phone" | "whatsapp";
  label: string;
  destination?: ContactDestination;
}[] = [
  { id: "phone", label: t("footer.phone", currentLocale), destination: phone },
  { id: "whatsapp", label: t("footer.whatsapp", currentLocale), destination: whatsapp },
];
---

<footer
  class="site-footer"
  aria-label={landmarkLabelSuffix ? withSuffix(t("nav.footer", currentLocale)) : undefined}
  data-site-footer
  data-variant={variant}
>
  <PageContainer class="site-footer__container">
    <div class="site-footer__tier site-footer__utility-top">
      <div class="site-footer__identity">
        <SiteBrand href={homeHref} label={config.brand} placement="footer" />
        <nav aria-label={footerNavLabel(t("footer.contactNavigation", currentLocale))}>
          <ul class="site-footer__contact-list" role="list">
            {contacts.map((item) => (
              <li>
                {item.destination ? (
                  <a class="site-footer__utility-link" href={item.destination.href}>
                    <FooterIcon name={item.id} />
                    <span>{item.destination.display}</span>
                  </a>
                ) : (
                  <span class="site-footer__utility-link site-footer__placeholder" data-placeholder-destination>
                    <FooterIcon name={item.id} />
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div class="site-footer__social">
        <p class="site-footer__label">{t("footer.followUs", currentLocale)}</p>
        <nav aria-label={footerNavLabel(t("footer.socialNavigation", currentLocale))}>
          {instagram ? (
            <a class="site-footer__utility-link" href={instagram.href} target="_blank" rel="noopener noreferrer">
              <FooterIcon name="instagram" />
              <span>{instagram.display}</span>
            </a>
          ) : (
            <span class="site-footer__utility-link site-footer__placeholder" data-placeholder-destination>
              <FooterIcon name="instagram" />
              <span>{t("footer.instagram", currentLocale)}</span>
            </span>
          )}
        </nav>
      </div>
    </div>

    {variant === "full" && <div class="site-footer__tier site-footer__navigation" data-footer-navigation>
      {preparedGroups.map((group) => {
        const headingId = `${instanceId}-${group.id}-heading`;
        return (
          <nav class="site-footer__group" aria-label={footerNavLabel(group.label)}>
            <h2 id={headingId} class="site-footer__label">{group.label}</h2>
            <ul role="list">
              {group.items.map((item) => (
                <li>
                  {item.destination ? (
                    <a
                      class:list={["site-footer__nav-link", { "site-footer__nav-link--terminal": item.terminal }]}
                      href={item.destination.href}
                      target={item.destination.external ? "_blank" : undefined}
                      rel={item.destination.external ? "noopener noreferrer" : undefined}
                      aria-current={item.destination.current ? "page" : undefined}
                      data-astro-prefetch={!item.destination.external ? true : undefined}
                    >
                      <span>{item.label}</span>
                      {item.terminal && <span class="site-footer__arrow" aria-hidden="true">→</span>}
                    </a>
                  ) : (
                    <span class:list={["site-footer__nav-link", "site-footer__placeholder", { "site-footer__nav-link--terminal": item.terminal }]} data-placeholder-destination>
                      <span>{item.label}</span>
                      {item.terminal && <span class="site-footer__arrow" aria-hidden="true">→</span>}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        );
      })}
    </div>}

    <div class="site-footer__tier site-footer__bottom site-footer__bottom--mobile">
      <div class="site-footer__location-locale">
        <p class="site-footer__location"><FooterIcon name="location" /><span>{address?.display ?? t("footer.locationPending", currentLocale)}</span></p>
        <LanguageSwitcher currentLocale={currentLocale} currentRouteKey={currentRouteKey} presentation="inline" ariaLabel={footerNavLabel(t("nav.language", currentLocale))} />
      </div>
      <nav aria-label={footerNavLabel(t("footer.legalNavigation", currentLocale))}>
        <ul class="site-footer__legal-links" role="list">
          {preparedLegalLinks.map((item) => (
            <li>{item.destination ? <a href={item.destination.href} target={item.destination.external ? "_blank" : undefined} rel={item.destination.external ? "noopener noreferrer" : undefined}>{item.label}</a> : <span class="site-footer__placeholder" data-placeholder-destination>{item.label}</span>}</li>
          ))}
        </ul>
      </nav>
      <p class="site-footer__copyright">© {year} {config.brand}. {t("footer.rights", currentLocale)}.</p>
    </div>

    <div class="site-footer__tier site-footer__bottom site-footer__bottom--wide">
      <div class="site-footer__legal-row">
        <p class="site-footer__copyright">© {year} {config.brand}. {t("footer.rights", currentLocale)}.</p>
        <nav aria-label={footerNavLabel(t("footer.legalNavigation", currentLocale))}>
          <ul class="site-footer__legal-links" role="list">
            {preparedLegalLinks.map((item) => (
              <li>{item.destination ? <a href={item.destination.href} target={item.destination.external ? "_blank" : undefined} rel={item.destination.external ? "noopener noreferrer" : undefined}>{item.label}</a> : <span class="site-footer__placeholder" data-placeholder-destination>{item.label}</span>}</li>
            ))}
          </ul>
        </nav>
      </div>
      <div class="site-footer__location-locale">
        <p class="site-footer__location"><FooterIcon name="location" /><span>{address?.display ?? t("footer.locationPending", currentLocale)}</span></p>
        <LanguageSwitcher currentLocale={currentLocale} currentRouteKey={currentRouteKey} presentation="inline" ariaLabel={footerNavLabel(t("nav.language", currentLocale))} />
      </div>
    </div>
  </PageContainer>
</footer>

<style>
  .site-footer {
    margin-block-start: auto;
    border-block-start: 1px solid var(--color-divider);
    background:
      radial-gradient(circle at 88% 8%, color-mix(in oklab, var(--color-surface) 72%, transparent), transparent 42%),
      linear-gradient(145deg, var(--color-background), color-mix(in oklab, var(--color-background) 82%, var(--color-surface)));
    color: var(--color-text-primary);
  }

  .site-footer__container {
    padding-block: var(--space-16);
  }

  .site-footer__tier {
    min-inline-size: 0;
  }

  .site-footer__utility-top {
    display: grid;
    gap: var(--space-8);
    padding-block-end: var(--space-12);
    border-block-end: 1px solid var(--color-divider);
  }

  .site-footer__identity,
  .site-footer__contact-list,
  .site-footer__social,
  .site-footer__legal-row,
  .site-footer__location-locale {
    display: flex;
    min-inline-size: 0;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
  }

  .site-footer__identity {
    align-items: flex-start;
    flex-direction: column;
  }

  .site-footer__contact-list,
  .site-footer__legal-links {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .site-footer__utility-link,
  .site-footer__nav-link {
    display: inline-flex;
    min-block-size: var(--space-11);
    min-inline-size: 0;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-text-muted);
    font-family: var(--font-body);
    text-decoration: none;
    overflow-wrap: anywhere;
    transition: color var(--duration-fast) var(--ease-standard);
  }

  .site-footer__utility-link {
    color: var(--color-text-primary);
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-body);
  }

  .site-footer__utility-link :global(svg),
  .site-footer__location :global(svg) {
    inline-size: 1.125rem;
    block-size: 1.125rem;
    flex: none;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  a.site-footer__utility-link:hover,
  a.site-footer__nav-link:hover,
  .site-footer__legal-links a:hover {
    color: var(--color-accent-hover);
  }

  .site-footer a:focus-visible {
    outline: 2px solid var(--color-focus-dark);
    outline-offset: 2px;
  }

  .site-footer__social {
    align-items: flex-start;
    flex-direction: column;
  }

  .site-footer__label {
    color: var(--color-text-primary);
    font-family: var(--font-body);
    font-size: var(--text-ui);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-caps);
    line-height: var(--line-height-ui);
    text-transform: uppercase;
  }

  .site-footer__navigation {
    display: grid;
    gap: var(--space-8);
    padding-block: var(--space-12);
    border-block-end: 1px solid var(--color-divider);
  }

  .site-footer__group {
    min-inline-size: 0;
  }

  .site-footer__group + .site-footer__group {
    padding-block-start: var(--space-8);
    border-block-start: 1px solid var(--color-divider);
  }

  .site-footer__group ul {
    display: grid;
    gap: var(--space-1);
    margin: var(--space-4) 0 0;
    padding: 0;
    list-style: none;
  }

  .site-footer__nav-link {
    inline-size: fit-content;
    max-inline-size: 100%;
    font-size: var(--text-base);
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-normal);
    line-height: var(--line-height-body);
  }

  .site-footer__arrow {
    display: inline-block;
    transition: transform var(--duration-fast) var(--ease-standard);
  }

  a.site-footer__nav-link--terminal:hover .site-footer__arrow,
  a.site-footer__nav-link--terminal:focus-visible .site-footer__arrow {
    transform: translateX(var(--space-1));
  }

  .site-footer__placeholder {
    cursor: default;
    opacity: 0.64;
  }

  .site-footer__bottom {
    padding-block-start: var(--space-8);
    color: var(--color-text-muted);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-normal);
    line-height: var(--line-height-body);
  }

  .site-footer__bottom--mobile {
    display: grid;
    gap: var(--space-5);
  }

  .site-footer__bottom--wide {
    display: none;
  }

  .site-footer__location-locale {
    align-items: flex-start;
    flex-direction: column;
  }

  .site-footer__location {
    display: inline-flex;
    min-inline-size: 0;
    align-items: center;
    gap: var(--space-2);
    overflow-wrap: anywhere;
  }

  .site-footer__legal-links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-4);
  }

  .site-footer__legal-links a {
    display: inline-flex;
    min-block-size: var(--space-11);
    min-inline-size: var(--space-11);
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-standard);
  }

  @media (min-width: 48rem) {
    .site-footer__utility-top,
    .site-footer__bottom--wide {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: start;
    }

    .site-footer__social,
    .site-footer__bottom--wide > .site-footer__location-locale {
      align-items: flex-end;
      justify-self: end;
    }

    .site-footer__navigation {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-12) var(--column-gap-tablet);
    }

    .site-footer__group + .site-footer__group {
      padding-block-start: 0;
      border-block-start: 0;
    }

    .site-footer__bottom--mobile {
      display: none;
    }

    .site-footer__bottom--wide {
      display: grid;
      gap: var(--column-gap-tablet);
    }
  }

  @media (min-width: 80rem) {
    .site-footer__container {
      padding-block: var(--space-20);
    }

    .site-footer__utility-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .site-footer__identity,
    .site-footer__social,
    .site-footer__location-locale {
      align-items: center;
      flex-direction: row;
    }

    .site-footer__navigation {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--column-gap-desktop);
    }

    .site-footer__bottom--wide {
      align-items: center;
    }

    .site-footer__bottom--wide > .site-footer__location-locale {
      align-items: center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .site-footer__arrow {
      transition: none;
    }

    a.site-footer__nav-link--terminal:hover .site-footer__arrow,
    a.site-footer__nav-link--terminal:focus-visible .site-footer__arrow {
      transform: none;
    }
  }
</style>
```

## Complete original FooterIcon.astro

Archived source only; apply the target adaptation map above.

```astro
---
/** Decorative outline icon shared by SiteFooter controls and metadata. */
interface Props {
  name: "phone" | "whatsapp" | "instagram" | "location";
}
const { name } = Astro.props;
---

{name === "phone" && (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7.5 3.8 5.2 5.1c-1 .6-1.4 1.8-1 2.9a19.4 19.4 0 0 0 11.8 11.8c1.1.4 2.3 0 2.9-1l1.3-2.3c.3-.6.2-1.3-.3-1.7l-2.6-2c-.5-.4-1.2-.4-1.7 0l-1.4 1.1a13.4 13.4 0 0 1-4.1-4.1l1.1-1.4c.4-.5.4-1.2 0-1.7l-2-2.6c-.4-.5-1.1-.6-1.7-.3Z" />
  </svg>
)}
{name === "whatsapp" && (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.3-4.2a8.5 8.5 0 1 1 15.7-4.6Z" />
    <path d="M8.3 7.7c.2-.4.4-.4.7-.4h.4c.2 0 .4 0 .5.4l.7 1.7c.1.3.1.5-.1.7l-.6.7c-.2.2-.1.4 0 .6.7 1.2 1.7 2.2 3 2.8.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.8" />
  </svg>
)}
{name === "instagram" && (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.8 6.2h.01" />
  </svg>
)}
{name === "location" && (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)}
```

## Complete original SiteBrand.astro

Archived source only; apply the target adaptation map above.

```astro
---
import { Image } from "astro:assets";
import { config } from "../../../foundation.config.ts";
import logoOnDark from "../../assets/brand/belgrade-transfers-horizontal-on-dark.svg";
import logoOnLight from "../../assets/brand/belgrade-transfers-horizontal-on-light.svg";
import stackedOnDark from "../../assets/brand/belgrade-transfers-stacked-on-dark.svg";
import stackedOnLight from "../../assets/brand/belgrade-transfers-stacked-on-light.svg";
import symbolOnDark from "../../assets/brand/belgrade-transfers-symbol-on-dark.svg";
import symbolOnLight from "../../assets/brand/belgrade-transfers-symbol-on-light.svg";

interface Props {
  href?: string;
  label?: string;
  tone?: "on-dark" | "on-light";
  placement?: "header" | "footer" | "feature";
  variant?: "horizontal" | "symbol" | "stacked";
  class?: string;
}

const {
  href,
  label = config.brand,
  tone = "on-dark",
  placement = "header",
  variant = "horizontal",
  class: className,
} = Astro.props;
const Element: "a" | "span" = href ? "a" : "span";
const sources = {
  "on-dark": {
    horizontal: logoOnDark,
    symbol: symbolOnDark,
    stacked: stackedOnDark,
  },
  "on-light": {
    horizontal: logoOnLight,
    symbol: symbolOnLight,
    stacked: stackedOnLight,
  },
} as const;
const source = sources[tone][variant];
const focusClass = tone === "on-dark" ? "focus-visible:outline-[var(--color-focus-dark)]" : "focus-visible:outline-[var(--color-focus-light)]";
---

<Element
  href={href}
  aria-label={label}
  role={!href ? "img" : undefined}
  class:list={[
    "site-brand",
    `site-brand--${placement}`,
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] focus-visible:outline-2 focus-visible:outline-offset-2",
    focusClass,
    className,
  ]}
>
  <Image
    src={source}
    alt=""
    loading={placement === "footer" ? "lazy" : "eager"}
    class:list={[
      "site-brand__image",
      {
        "site-brand__image--header": placement === "header",
        "site-brand__image--footer": placement === "footer",
        "site-brand__image--feature": placement === "feature",
      },
    ]}
  />
</Element>

<style>
  .site-brand__image {
    display: block;
    inline-size: auto;
    max-inline-size: 100%;
  }

  .site-brand__image--header {
    block-size: 1.625rem;
    transition: block-size var(--duration-normal) var(--ease-standard);
  }

  .site-brand__image--footer {
    block-size: var(--space-8);
  }

  .site-brand--feature {
    inline-size: min(72vw, calc(var(--space-20) * 4));
  }

  .site-brand__image--feature {
    inline-size: 100%;
    block-size: auto;
  }

  :global([data-site-header][data-state="compact"]) .site-brand__image--header {
    block-size: var(--space-6);
  }

  @media (min-width: 64rem) {
    .site-brand__image--header {
      block-size: 1.875rem;
    }
  }
</style>
```

## Complete original navigation.ts

Archived source only; apply the target adaptation map above.

```ts
import type { RouteKey, UiStringKey } from "@astro-foundation/core";
import { internalTarget, placeholderTarget, type NavigationItem } from "./shared-ui.ts";
import { filterNavigationForSiteMode, isRoutePublishedForSiteMode } from "./site-mode.ts";

export interface NavItem {
  routeKey: RouteKey;
  labelKey: UiStringKey;
}

export const fullSitePrimaryNav: NavItem[] = [
  { routeKey: "services", labelKey: "services.title" },
  { routeKey: "airportTransfer", labelKey: "airportTransfer.title" },
  { routeKey: "privateChauffeur", labelKey: "privateChauffeur.title" },
  { routeKey: "corporateDelegations", labelKey: "corporateDelegations.title" },
  { routeKey: "transfers", labelKey: "footer.destinations" },
  { routeKey: "fleet", labelKey: "fleet.title" },
];

export const primaryNav = filterNavigationForSiteMode(fullSitePrimaryNav);
export const footerNav = primaryNav;

const siteModeTarget = (routeKey: RouteKey) =>
  isRoutePublishedForSiteMode(routeKey) ? internalTarget(routeKey) : placeholderTarget();

/**
 * Shared Header inventory. Destinations are resolved from stable route keys
 * when published and remain non-interactive while site mode withholds them.
 */
export const plannedPrimaryNavigation = [
  { id: "services", labelKey: "services.title", target: siteModeTarget("services") },
  {
    id: "airport-transfer",
    labelKey: "airportTransfer.title",
    target: siteModeTarget("airportTransfer"),
  },
  {
    id: "private-chauffeur",
    labelKey: "privateChauffeur.title",
    target: siteModeTarget("privateChauffeur"),
  },
  {
    id: "corporate-delegations",
    labelKey: "corporateDelegations.title",
    target: siteModeTarget("corporateDelegations"),
  },
  { id: "destinations", labelKey: "footer.destinations", target: siteModeTarget("transfers") },
  { id: "fleet", labelKey: "fleet.title", target: siteModeTarget("fleet") },
] satisfies readonly NavigationItem[];

export const plannedHeaderAction = {
  id: "booking",
  labelKey: "home.hero.primaryAction",
  target: siteModeTarget("booking"),
} satisfies NavigationItem;

export interface FooterNavigationItem extends NavigationItem {
  terminal?: boolean;
}

export interface FooterGroup {
  id: "services" | "destinations" | "fleet" | "company";
  labelKey: UiStringKey;
  items: readonly FooterNavigationItem[];
}

export const footerGroups = [
  {
    id: "services",
    labelKey: "footer.services",
    items: [
      {
        id: "airport-transfers",
        labelKey: "footer.airportTransfers",
        target: siteModeTarget("airportTransfer"),
      },
      {
        id: "chauffeur-service",
        labelKey: "footer.chauffeurService",
        target: siteModeTarget("privateChauffeur"),
      },
      {
        id: "corporate-transportation",
        labelKey: "footer.corporateTransportation",
        target: siteModeTarget("corporateDelegations"),
      },
      {
        id: "intercity-transfers",
        labelKey: "footer.intercityTransfers",
        target: siteModeTarget("transfers"),
      },
    ],
  },
  {
    id: "destinations",
    labelKey: "footer.destinations",
    items: [
      { id: "novi-sad", labelKey: "footer.noviSad", target: placeholderTarget() },
      { id: "zlatibor", labelKey: "footer.zlatibor", target: placeholderTarget() },
      { id: "kopaonik", labelKey: "footer.kopaonik", target: placeholderTarget() },
      { id: "budapest", labelKey: "footer.budapest", target: placeholderTarget() },
      { id: "sarajevo", labelKey: "footer.sarajevo", target: placeholderTarget() },
      {
        id: "all-destinations",
        labelKey: "footer.viewAllDestinations",
        target: siteModeTarget("transfers"),
        terminal: true,
      },
    ],
  },
  {
    id: "fleet",
    labelKey: "footer.fleet",
    items: [
      { id: "s-class", labelKey: "footer.mercedesSClass", target: placeholderTarget() },
      { id: "e-class", labelKey: "footer.mercedesEClass", target: placeholderTarget() },
      { id: "v-class", labelKey: "footer.mercedesVClass", target: placeholderTarget() },
      { id: "sprinter", labelKey: "footer.mercedesSprinter", target: placeholderTarget() },
      {
        id: "full-fleet",
        labelKey: "footer.viewFullFleet",
        target: siteModeTarget("fleet"),
        terminal: true,
      },
    ],
  },
  {
    id: "company",
    labelKey: "footer.company",
    items: [
      { id: "about", labelKey: "footer.aboutUs", target: siteModeTarget("about") },
      { id: "pricing", labelKey: "footer.pricing", target: placeholderTarget() },
      { id: "contact", labelKey: "footer.contact", target: siteModeTarget("contact") },
    ],
  },
] satisfies readonly FooterGroup[];

export const footerLegalLinks = [
  { id: "privacy", labelKey: "footer.privacy", target: placeholderTarget() },
  { id: "terms", labelKey: "footer.terms", target: placeholderTarget() },
] satisfies readonly NavigationItem[];

/** Machine-readable aggregate consumed by SEO/link validators. */
export const navigation = { primaryNav, footerNav };
```

## Implementation handoff

Read DR-08 for the target footer contract and DR-09 for the site-wide identity cleanup. Update the target's locked footer/header/brand contracts before production work. Preserve current contacts, route availability, localization, responsive targets, and Theme V2. Remove parent-company copy, GS marks, and conflicting public entity names from customer-facing output. Keep historical redirects functional; do not break incoming URLs to erase a legacy slug.

After implementing, verify the shared footer on homepage, service, fleet, pricing, contact, and booking routes in Serbian/English/Russian, at 320/768/1024/1440/1920px and either side of the 48rem/80rem transitions. Check focus, route-preserving locale links, verified contact links, long text wrapping, and 200% zoom. Existing production acceptance and gate requirements still apply. No production build or visual signoff is claimed by this source extraction.
