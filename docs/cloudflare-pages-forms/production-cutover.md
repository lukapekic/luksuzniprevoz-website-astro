# Production website cutover — 2026-09-26

## Current status

Cloudflare authoritative DNS is active. The owner merged the website changes to staging and master; the deployed production artifact matches remote master `2ff6b389c3e4ca49054b56b942b3d45bb2ecd455`.

**Website DNS cutover was applied at 16:53 UTC.** The root domain and `www` now have proxied CNAME records pointing to Pages. Both production forms have accepted D1 rows and Brevo delivery events; the owner confirmed both work on the production Pages hostname. Final-domain form tests remain pending while the owner still sees the old website through cached DNS. Cloudflare directly serves the new artifact with trusted HTTPS. Both apex and `www` Pages associations are now active, including HTTP validation and DNS verification.

This record supersedes the rollout status in [initial resource provisioning](./production-setup.md). That document and its evidence remain a historical record of the setup. See [current sanitised evidence](./production-cutover-evidence.json).

## Verified release and resources

| Item                  | Verified state                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare zone       | Active, both assigned Cloudflare nameservers observed in public DNS                                                         |
| Production commit     | `2ff6b389c3e4ca49054b56b942b3d45bb2ecd455`                                                                                  |
| Production deployment | `3e29c509-e7c3-49f1-a900-52534caf88f3`, successful GitHub push build                                                        |
| Production URL        | `https://luksuzniprevoz-website-astro.pages.dev`                                                                            |
| Form widget           | Real Production key embedded in all six Contact/Booking locale pages                                                        |
| Production D1         | `b2f8d3a9-f0fb-492a-a25d-7d8ef10b334c`, binding `FORM_DB`                                                                   |
| Brevo authentication  | Domain verified/authenticated; all four DNS checks pass                                                                     |
| Edge certificate      | Active Universal certificate covers apex and wildcard                                                                       |
| Transport             | Full (strict), minimum TLS 1.2                                                                                              |
| Provider mail         | Owner confirmed sending and receipt of both production form notifications before website cutover; routing remains at Beotel |

The deployed artifact is verified here. This operational task does not independently certify all UI review/release gates or make production UI changes.

## Precutover checks

- All three homepages and all six Contact/Booking pages return HTTP 200 on the production Pages hostname.
- Production form pages contain `0x4AAAAAAFEWAifejXhFJsH1`.
- Both Functions reject malformed JSON envelopes with HTTP 400 and invalid Turnstile tokens with HTTP 403 `bot_verification`. These checks do not send email or add submission rows.
- Browser rendering checks for English Contact and Booking return HTTP 200 with no uncaught page errors. A first browser navigation using `networkidle` timed out; the bounded `domcontentloaded` checks succeeded. This is not a Turnstile completion or independent visual review.
- Sitemap/robots respond successfully. Legacy `/limo-servis-beograd/` and `/en/about-us/` reach their current homepage destinations.
- Canonical links on the checked indexable pages point to the final custom domain.
- Existing deployed CSP is report-only. No enforced CSP response header or meta policy was observed. This rollout does not change security policy or claim enforced CSP.
- Configured redirect and form rate-limit rules were read back. Their final-domain runtime checks await proxied website DNS.

## DNS change and rollback

A fresh [rollback snapshot](../dns-backups/luksuzniprevoz.rs-2026-09-26-cloudflare-before-cutover.json) contains all 32 records, including record IDs and routing/proxy settings. The original cPanel and prepared Cloudflare backups remain available.

The applied batch changed exactly two records:

| Name                    | Before                                        | After                                                            |
| ----------------------- | --------------------------------------------- | ---------------------------------------------------------------- |
| `luksuzniprevoz.rs`     | DNS-only A `195.252.110.238`, TTL 14400       | Proxied CNAME `luksuzniprevoz-website-astro.pages.dev`, Auto TTL |
| `www.luksuzniprevoz.rs` | DNS-only CNAME `luksuzniprevoz.rs`, TTL 14400 | Proxied CNAME `luksuzniprevoz-website-astro.pages.dev`, Auto TTL |

The other 30 records compared unchanged after the batch, including MX, mail/webmail/cPanel A records, provider/Brevo DKIM, SPF, DMARC and calendar routing. Mail remains at `195.252.110.238` through `mail.luksuzniprevoz.rs`; retain Beotel hosting and the mailbox subscription.

To roll website DNS back, restore the two website records by their IDs from the rollback snapshot: original type/content, DNS-only proxy setting and TTL 14400. Read the full inventory first and compare after restoring. Do not import the entire historical zone over current records or remove mailbox/authentication records. Do not delete D1 submission history or resend uncertain submissions. Existing caches may continue routing some visitors to either website during propagation. Previous website records had a four-hour TTL, so retain the old site while caches expire.

Cloudflare executes the batch in one database transaction, but distributed DNS propagation is not atomic. Custom domains are associated with Pages before the CNAME switch. Reversing a Pages association/DNS target can require validation time when returning to Pages. [Batch changes documentation](https://developers.cloudflare.com/dns/manage-dns-records/how-to/batch-record-changes/), [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Postcutover verification

- Saved an [after-cutover snapshot](../dns-backups/luksuzniprevoz.rs-2026-09-26-cloudflare-after-cutover.json). Readback confirms exactly 32 records and no changes to the other 30 records.
- Public Google DNS now returns Cloudflare addresses for both website names. Mail A and apex MX still point to Beotel through `mail.luksuzniprevoz.rs`. The workspace and owner's connection initially continued serving the old site from cached resolver answers. Direct edge checks use `curl --resolve` with normal TLS verification; browser checks use a hostname resolver override. These checks prove the Cloudflare destination works, not that every resolver has expired its old answer.
- At the Cloudflare destination, all three homepages and all six Contact/Booking pages return HTTP 200 with the expected titles and Production widget key on form pages. Sitemap and robots return 200.
- HTTP apex, HTTP www and HTTPS www return 301 to the HTTPS apex, preserving `/en/contact/` and `?launch=1`. Sample legacy paths return 301 to their mapped routes.
- Both final-domain endpoints return 405 for GET, 400 for malformed envelopes and 403 for invalid Turnstile tokens. These probes do not deliver email or create submission rows.
- A bounded burst of 14 harmless GET requests demonstrated HTTP 429 blocking. Six earlier Function probes were within the same rate window. A later GET recovered to the normal 405 after the block expired. The runtime result confirms enforcement; it does not assert globally exact counters across data centers.
- English Contact, English Booking and the Russian homepage rendered at the forced Cloudflare destination without uncaught page errors or broken images in the bounded browser checks. This is operational browser evidence, not independent UI approval or an automated Turnstile solution.
- Provider SMTP 465 and IMAP 993 still pass trusted TLS for `mail.luksuzniprevoz.rs`. Provider webmail returns HTTPS 200. No mailbox password was used by the agent.
- Both Pages associations now report active for domain status, HTTP validation and DNS verification. The Universal edge certificate covers both hostnames, and HTTPS www redirects successfully.
- The original www redirect intercepted the ACME certificate-validation path. Updated both redirect expressions to exclude only `/.well-known/acme-challenge/`, preserving existing actions and parameters, then retried Pages validation. Random challenge-path probes now return 404 without redirects on both hostnames; ordinary HTTP/www requests still return their expected 301. The first expression-only rule PATCH was rejected; the successful update included the full existing rule definition. A retry briefly returned an undefined verification-state error, followed by successful active readback. See [Pages validation troubleshooting](https://developers.cloudflare.com/pages/configuration/debugging-pages/#blocked-http-validation).

## Remaining acceptance

1. After the owner's DNS cache expires, submit both forms once on the final domain with the real widget and confirm notification receipt. Production Pages-hostname submissions have already passed for both forms. Keep the old website and Beotel mail service available while caches expire.
2. Existing CSP remains report-only, and no DNSSEC/registrar DS change was made in this rollout. Calendar service behavior remains unverified from the original setup. These limitations are retained explicitly; this document does not claim every security/UI gate or provider service has been certified.

Technical authority: root `AGENTS.md`, verified deployed Functions/environment contracts and official Cloudflare API/Pages documentation. Changes in this task are DNS operations and operational documentation, with no production UI modifications.
