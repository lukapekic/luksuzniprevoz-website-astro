# Production form setup — 2026-09-26

## Status

**Rollout update:** Cloudflare activation and the latest master deployment are now verified. See [production cutover](./production-cutover.md) for current website routing, delivery evidence and remaining acceptance. The observations below describe initial provisioning and are retained as historical evidence.

**Cloudflare Production form resources are provisioned and verified. The production launch is incomplete.** The zone and Pages custom-domain associations now exist; DNS is prepared but registrar activation, reviewed code deployment and real production submission tests remain pending. Security rules are configured and read back; their runtime tests await proxied web traffic.

This record supersedes earlier “Production pending” statements for the resources below. It does not claim the custom domain or website launch is complete. See [sanitised API evidence](./production-setup-evidence.json).

## Provisioned resources

| Setting                    | Production value / state                                                               |
| -------------------------- | -------------------------------------------------------------------------------------- |
| Pages project              | `luksuzniprevoz-website-astro`                                                         |
| Production branch          | `master`                                                                               |
| Automatic Preview branches | `staging` only                                                                         |
| D1 database                | `luksuzni-prevoz-forms-production`                                                     |
| D1 database ID             | `b2f8d3a9-f0fb-492a-a25d-7d8ef10b334c`                                                 |
| Pages database binding     | `FORM_DB`                                                                              |
| Applied migrations         | `0001_form_submission_ledger.sql`, `0002_form_submission_digest.sql`                   |
| Turnstile widget           | `Luksuzni Prevoz — Production`, managed, no pre-clearance                              |
| Public Turnstile site key  | `0x4AAAAAAFEWAifejXhFJsH1`                                                             |
| Allowed hostnames          | `luksuzniprevoz.rs`, `www.luksuzniprevoz.rs`, `luksuzniprevoz-website-astro.pages.dev` |
| Sender                     | `reservations@luksuzniprevoz.rs`                                                       |
| Notification recipient     | `reservations@luksuzniprevoz.rs`                                                       |
| Sender display name        | `Luksuzni Prevoz`                                                                      |
| Brevo sender status        | Active, verified through API during this setup                                         |
| Brevo domain status        | Verified and authenticated, all four authentication record checks true                 |
| Production build tools     | Node `22.22.2`, pnpm `10.14.0`; existing configuration preserved                       |

Production has a separate D1 database, Turnstile widget and newly generated idempotency secret. Preview resources/configuration and branch controls were compared before/after and preserved.

## Variables and secrets

These were written to the Pages **Production** environment and read back to verify names/types and public values:

| Name                        | Cloudflare type                                  |
| --------------------------- | ------------------------------------------------ |
| `FORM_ENVIRONMENT`          | Plain text, `production`                         |
| `PUBLIC_TURNSTILE_SITE_KEY` | Plain text, Production widget site key           |
| `TURNSTILE_ALLOWED_HOSTS`   | Plain text, the three exact hostnames above      |
| `BREVO_SENDER_EMAIL`        | Plain text                                       |
| `BREVO_SENDER_NAME`         | Plain text                                       |
| `FORM_IDEMPOTENCY_SECRET`   | Encrypted secret, newly generated, 64 characters |
| `TURNSTILE_SECRET_KEY`      | Encrypted secret, matching Production widget     |
| `BREVO_API_KEY`             | Encrypted secret, existing authorised key        |
| `BREVO_TO_EMAIL`            | Encrypted secret                                 |

Private values are excluded from this document and the evidence JSON. Generated Production credentials were backed up in the existing ignored root `.env` under `TURNSTILE_PRODUCTION_SITE_KEY`, `TURNSTILE_PRODUCTION_SECRET_KEY` and `FORM_PRODUCTION_IDEMPOTENCY_SECRET`. Those local names are backup names; Cloudflare uses the runtime names in the table.

Brevo initially rejected workspace IP `217.178.18.2`; the owner allowed it and subsequent account/sender/domain reads succeeded. This verifies this workspace's access. It does not prove that every Cloudflare egress IP is accepted by Brevo. The earlier successful Preview submission establishes the Preview path only.

A new build/deployment is required for environment/binding changes to take effect; the public key is embedded during the Astro build. [Cloudflare bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/)

## Domain and DNS preparation

The owner added `luksuzniprevoz.rs` on the Free plan and updated the token. Zone/DNS reads and DNS writes now succeed.

| Setting              | Verified value                                                                      |
| -------------------- | ----------------------------------------------------------------------------------- |
| Zone ID              | `399747565761008f614acbb411f27efe`                                                  |
| Status               | Pending; public delegation still uses Beotel                                        |
| Assigned nameservers | `cartman.ns.cloudflare.com`, `kenia.ns.cloudflare.com`                              |
| Cloudflare inventory | 32 records, all DNS only, TTL 14400                                                 |
| Root website         | Existing `195.252.110.238` retained                                                 |
| Pages associations   | Root and `www` added, validation pending                                            |
| DNSSEC               | Cloudflare disabled; no parent DS observed through recursive DNS and DNS-over-HTTPS |

The scan contained 30 records. Restored `default._domainkey` and `_acme-challenge.autodiscover`; compared all 32 records with the original JSON, including MX/SRV fields and concatenated TXT values. The provider DKIM also matched a live DNS-over-HTTPS answer. TXT presentation quotes and DKIM string segmentation are not extra TXT records.

After exact inventory reconciliation, prepared these dependency changes **only in the pending Cloudflare zone**:

| Record                       | Prepared routing                                         |
| ---------------------------- | -------------------------------------------------------- |
| `mail`                       | DNS-only A → `195.252.110.238`                           |
| Apex MX, priority 0          | `mail.luksuzniprevoz.rs`                                 |
| `ftp` CNAME                  | `cpanel.luksuzniprevoz.rs`                               |
| `_caldav` / `_caldavs` SRV   | `cpcalendars.luksuzniprevoz.rs`, original ports retained |
| `_carddav` / `_carddavs` SRV | `cpcontacts.luksuzniprevoz.rs`, original ports retained  |

These names still resolve to the original provider IP in the prepared zone. Provider SPF/DKIM, Brevo records, autodiscover and all remaining values are retained. Live provider DNS was not edited. The root A and `www` CNAME still serve the existing website; association with Pages via API did not change these records.

Verified trusted TLS handshakes on ports 465 and 993 for both `mail.luksuzniprevoz.rs` and `cpanel29.beotel.net`. The domain certificate includes `*.luksuzniprevoz.rs` and expires 2026-11-14; the provider hostname certificate expires 2026-11-17. Calendar TLS checks on port 2080 timed out, so calendar service behavior remains unverified. No mailbox login or send/receive test was performed. Clients using the root hostname must be reconfigured before the root website moves.

Saved public DNS snapshots:

- [Before reconciliation](../dns-backups/luksuzniprevoz.rs-2026-09-26-cloudflare-before.json)
- [Exact reconciled inventory](../dns-backups/luksuzniprevoz.rs-2026-09-26-cloudflare-reconciled.json)
- [Prepared provider routing](../dns-backups/luksuzniprevoz.rs-2026-09-26-cloudflare-prepared.json)

### Zone security and remaining permissions

After the owner added Zone Settings Edit and Zone WAF Edit, saved and read back:

- Full (strict) SSL: `ssl=strict`.
- Minimum TLS version: `1.2`; existing TLS 1.3 remains on.
- Form rate-limit ruleset `7f22a6cc09b44e939b87c1c259b47a63`, enabled rule `2c4fe177711a46a78d57f3ae5131759a`.
- Exact paths `/api/forms/contact` and `/api/forms/booking`; counters by IP and data center; 10 requests per 10 seconds; block for 10 seconds.

The rule is configured, but its runtime behavior cannot be tested until traffic uses a proxied custom hostname. [Cloudflare rate-limit API](https://developers.cloudflare.com/waf/rate-limiting-rules/create-api/)

After the owner added SSL and Certificates Edit and Single Redirect Edit, saved and read back redirect ruleset `c5a8c143300e4aa595e4b01a55b84e9f`:

- `www_to_canonical_apex`: any request to `www.luksuzniprevoz.rs` → HTTPS apex, HTTP 301, preserve path/query.
- `canonical_apex_https`: `(http.host eq "luksuzniprevoz.rs") and (not ssl)` → HTTPS apex, HTTP 301, preserve path/query.

The global **Always Use HTTPS** toggle still rejects writes with HTTP 403 authentication error and remains off. The second Single Redirect provides the required website HTTP → HTTPS behavior. No further permission update is required for these saved web rules. [Cloudflare HTTPS redirect guidance](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/), [redirect API](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-api/)

All web DNS currently remains DNS only. Therefore neither redirects nor WAF rules are protecting current website traffic yet. Rules become applicable when the website hostnames are proxied at cutover. Their HTTP/runtime tests remain pending.

### Owner webmail access

The owner uses webmail in a browser; IMAP/SMTP app configuration is not applicable. Both `https://webmail.luksuzniprevoz.rs/` and the independent provider URL `https://cpanel29.beotel.net:2096` returned HTTP 200 with trusted TLS. The prepared DNS preserves the `webmail` A record. Bookmark one of these; a root URL such as `https://luksuzniprevoz.rs/webmail` will move with the website and should not be used after website cutover. Login and actual mailbox send/receive remain owner checks.

## Registrar change confirmation

The owner confirmed saving the assigned Cloudflare nameservers at the domain provider. Cloudflare still reported `pending` on the initial follow-up, and Cloudflare/Google recursive DNS-over-HTTPS answers still returned Beotel nameservers. Those cached answers do not establish whether the registry has already updated. Triggered the Cloudflare zone activation check successfully via API. Existing website and webmail both returned HTTPS 200. No parent DS observed. A subsequent lookup against the official `whois.rnids.rs` registry service confirmed exactly `cartman.ns.cloudflare.com` and `kenia.ns.cloudflare.com`; no Beotel nameserver appears in that registry response. Recursive DNS still showed all three old provider nameservers, so those answers must not be treated as evidence of an extra registrar nameserver. Cloudflare activation was retriggered after this confirmation. Cloudflare activation remains unverified; the new website DNS target remains unchanged. [Cloudflare nameserver update timing](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)

## Prepared DNS import baseline

The original [JSON backup](../dns-backups/luksuzniprevoz.rs-2026-09-26-cpanel.json) remains the exact record inventory.

A [BIND import baseline](../dns-backups/luksuzniprevoz.rs-2026-09-26-import-baseline.zone) was generated from its 32 records. It preserves existing provider addresses and routing, includes both DKIM strings in one TXT record, and uses absolute target names. SOA/apex NS are omitted because the destination provider owns them. It is **not the final Pages cutover configuration**.

If importing manually, uncheck **Proxy imported DNS records** so mail/FTP/service hosts retain DNS-only behavior. Compare the complete resulting record inventory with the backup; a quick DNS scan can miss records. [Cloudflare DNS import documentation](https://developers.cloudflare.com/dns/manage-dns-records/how-to/import-and-export/)

## Work remaining before website cutover

1. The owner confirmed saving the registrar nameserver change. Await and verify Cloudflare activation and public DNS answers. Prepared provider records preserve the existing website at Beotel. Security/redirect configuration readbacks have passed; no further token permission is currently required.
2. The owner confirmed browser webmail. Preserve/bookmark one of the checked webmail URLs above and test provider mailbox send/receive and calendar/contact services as applicable. Other users using IMAP/SMTP with the root hostname must change before the apex moves.
3. Complete the reviewed code merge to `master` and its required CI/design gates. Remote `master` remains `7cb3e9b2f606615138a3c0c99b2e0f51e08d31dd`, an older release. Uncommitted form package/date-picker work and unrelated working changes were not published. Root `AGENTS.md` requires successful applicable UI gates and independent human review for UI changes; the earlier work still has those recorded review/runtime blockers.
4. Verify production `.pages.dev` Contact and Booking using the real Production widget, office inbox delivery and separate D1 ledger accepted rows.
5. Registrar delegation may be activated before the new website release because the existing website address is deliberately retained. At the provider's Nameservers settings, select custom nameservers and replace the three Beotel entries with the two names below. The assigned nameservers are `cartman.ns.cloudflare.com` and `kenia.ns.cloudflare.com`; replace all three Beotel nameservers. Registrar access is not supplied by the Pages/Brevo keys. Check DS again immediately before transition. Activation of the currently prepared DNS keeps the existing website at Beotel.
6. After the reviewed production deployment is verified, replace the apex A with a proxied CNAME to `luksuzniprevoz-website-astro.pages.dev`, and point `www` there as a proxied CNAME. Recheck provider routing and authentication records before this actual website cutover. Root and `www` are already associated with Pages. [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
7. Confirm custom-domain validation/TLS, canonical/redirect behavior, all locales, both forms, WAF response, provider mailbox send/receive and Brevo authentication on the final domain.

## Verification performed

- Cloudflare API reads before/after Production configuration; exact public variable/type/binding assertions passed.
- D1 table column inspection confirms `payload_digest`; both migration names are recorded in `d1_migrations`.
- Turnstile widget detail matches its configured key, domains, managed mode and secret used for configuration.
- Production database and public widget key differ from Preview.
- Brevo account, sender and domain reads succeeded after IP authorisation; sender active and domain verified/authenticated.
- Generated import baseline and reconciled Cloudflare snapshot have exactly 32 records matching the original JSON inventory. Prepared provider routing retains the original IP and ports. API readback verifies 32 records, DNS-only status and preserved web DNS.
- Pages API accepted root/`www` associations; validation is pending. No DNS web target changed.
- SMTP/IMAP trusted TLS handshakes succeeded; calendar TLS timed out. No parent DS observed; registrar nameservers remain Beotel.
- Full (strict) SSL, minimum TLS 1.2 and the rate-limit rule passed API readback after permission updates. Canonical and website HTTPS Single Redirect rules passed readback after the final permission update. The global HTTPS toggle remains off after its write was rejected; the website rule supplies HTTPS enforcement.
- Both webmail URLs returned HTTP 200 with trusted TLS; mailbox login/send/receive not tested.
- Production GET endpoint probes returned HTTP 403 from this workspace, so they provide no functional runtime evidence.
- No website code changed in this setup, no merge or deployment was triggered, and no real email was sent as a test. A production end-to-end claim therefore remains pending.

Technical authority: root `AGENTS.md`, current Functions environment contract, repository migrations and the existing Cloudflare Pages forms setup guide. This task provisions external resources and adds operational records; it does not modify production UI or theme artifacts.
