# Mail service: configuration history and DNS backup

Recorded: **2026-09-26 UTC**. Domain: **luksuzniprevoz.rs**.

This document records the mail changes made during the website form setup and
the original DMARC value supplied by the account owner. It is a configuration
record, not a complete DNS zone or mailbox backup. No API keys, passwords, or
cPanel session credentials are stored here.

## 1. Existing mail service

The domain's existing mailboxes remain hosted by the provider through cPanel.
Brevo is used to send website form notifications; it does not replace the
provider's mailbox hosting, webmail, or IMAP/SMTP accounts.

The following values were observed in the cPanel HTML supplied by the owner.
They are baseline records to preserve, not a fresh export of the entire zone.

| Setting | Existing value |
| --- | --- |
| Nameservers | `cpanel29.beotel.net`, `ns.beotel.net`, `ns.beotel.rs` |
| Apex A record | `luksuzniprevoz.rs.` → `195.252.110.238` |
| MX record | `luksuzniprevoz.rs.` → priority `0`, destination `luksuzniprevoz.rs` |
| Mail CNAME | `mail.luksuzniprevoz.rs.` → `luksuzniprevoz.rs` |
| Existing provider DKIM | TXT at `default._domainkey.luksuzniprevoz.rs.`; preserve its existing public key |
| Observed record TTL | `14400` seconds (4 hours) |

Existing SPF TXT value at `luksuzniprevoz.rs.`:

```text
v=spf1 ip4:195.252.110.238 ip4:195.252.110.239 a ip4:195.252.110.240 mx ~all
```

The existing MX and mail CNAME depend on the apex address. Before a future
website DNS migration, explicitly plan how provider mail will keep resolving
to the provider's server.

## 2. Changes already made

- The public website contact address was changed from
  `office@luksuzniprevoz.rs` to `reservations@luksuzniprevoz.rs`. This was a
  website configuration change, not a mailbox deletion or migration.
- Cloudflare Preview uses `reservations@luksuzniprevoz.rs` as both Brevo sender
  and notification recipient. Production mail bindings are still pending.
- The Brevo sender is active. A controlled API test on 2026-09-25 was accepted
  and subsequently recorded as delivered by Brevo. On 2026-09-26, the owner
  submitted a Contact inquiry through the stable staging URL and confirmed
  receiving the notification for reference `LP-20260926-87AA6ED6`. This confirms
  the Contact browser-to-Pages-Function-to-inbox path for that Preview request.
- `luksuzniprevoz.rs` was added to Brevo for domain authentication.
- The owner added the three DNS records below in cPanel. The latest Brevo API
  check accepted the verification code and both DKIM records.
- The owner allowed the workspace IP in Brevo's API security settings. The
  latest API check worked; this does not establish that Cloudflare Pages
  outbound requests are allowed.

### Brevo DNS records added

| Type | Full record name | Value |
| --- | --- | --- |
| TXT | `luksuzniprevoz.rs.` | `brevo-code:4230b148a1a2ba471ed41772ba6384cb` |
| CNAME | `brevo1._domainkey.luksuzniprevoz.rs.` | `b1.luksuzniprevoz-rs.dkim.brevo.com.` |
| CNAME | `brevo2._domainkey.luksuzniprevoz.rs.` | `b2.luksuzniprevoz-rs.dkim.brevo.com.` |

These are public DNS values. The Brevo DKIM selectors coexist with the
provider's existing `default._domainkey` selector.

## 3. DMARC backup: exact original RAW value

- Record name: `_dmarc.luksuzniprevoz.rs.`
- Record type: `TXT`
- Observed TTL: `14400`

The owner supplied this complete RAW value before the proposed edit:

```text
v=DMARC1;p=none;sp=none;adkim=r;aspf=r;pct=100;fo=0;rf=afrf;ri=86400
```

The earlier cPanel listing and public DNS check displayed the shorter value
`v=DMARC1; p=none;`. The complete owner-supplied RAW value above is the backup
to use for this edit; the difference may reflect cPanel's editor defaults.

## 4. Applied DMARC value — verified

**Status (2026-09-26 UTC):** The owner confirmed saving the change. Google's
public DNS resolver returned the complete value below with TTL `14400`.
Brevo accepted all four records, and the authentication API returned HTTP
`200`: `Domain has been authenticated successfully.` A subsequent domain
configuration request confirmed `verified: true` and `authenticated: true`.

Complete applied value:

```text
v=DMARC1;p=none;sp=none;adkim=r;aspf=r;pct=100;fo=0;rf=afrf;ri=86400;rua=mailto:rua@dmarc.brevo.com
```

The only added parameter is `rua=mailto:rua@dmarc.brevo.com`, which requests
aggregate authentication reports to Brevo. It preserves the existing monitoring
policies (`p=none`, `sp=none`) and relaxed alignment (`adkim=r`, `aspf=r`).
It does not change incoming mail routing or forward mailbox messages.

### How to apply

1. Open cPanel → Zone Editor → Manage for `luksuzniprevoz.rs`.
2. Filter by `_dmarc` and edit the existing TXT record.
3. Select the Raw tab if the DMARC editor is shown.
4. Replace the whole value with the applied value above.
5. Keep the record name, TXT type, and TTL unchanged; click Save Record.
6. Recheck public DNS and retry Brevo domain authentication.
7. Test sending from the provider mailbox to an external address and replying
   back; separately test the website form notification through Preview.

Keep exactly one DMARC record. Preserve MX, SPF, mail DNS, nameservers, and
provider DKIM. A future move to `quarantine` or `reject` needs authentication
checks for all legitimate senders first.

### How to restore the previous DMARC value

Edit the same existing `_dmarc` TXT record, paste the exact original RAW value
from section 3, and save. Keep the name, type, and TTL unchanged. Restoring it
removes Brevo's aggregate reporting destination and may cause Brevo's domain
authentication check to fail again. Recheck DNS after the rollback; cached
answers may persist until their TTL expires.

## 5. Remaining work

- Confirm provider mailbox send/receive independently and test Booking delivery.
- Configure and verify Production mail settings after Preview acceptance.

## 6. Preview Turnstile troubleshooting

On 2026-09-26, the owner reported an "Unable to connect to website" widget
error at `https://7f32e72a.luksuzniprevoz-website-astro.pages.dev/kontakt/`.
A browser check reproduced Turnstile error `110200` (domain not authorized).
The Preview widget and `TURNSTILE_ALLOWED_HOSTS` are intentionally configured
for the stable Preview alias:

```text
https://staging.luksuzniprevoz-website-astro.pages.dev/kontakt/
```

Use that stable alias for form acceptance tests. Deployment-specific hostnames
are not in the widget allowlist. No hostname restrictions were broadened.
The stable alias serves the configured site key and loads the challenge iframe.
The owner confirmed that the security check works on the stable staging URL.
The automated browser environment separately fails to resolve a Cloudflare
challenge subdomain; successful completion was confirmed by the owner, not by
the automated runner. The owner subsequently confirmed Contact notification
delivery (see section 2).

## 7. Contact feedback and notification template refinement

Prepared on 2026-09-26 after the successful Contact delivery test:

- Remove the reference from the public Contact success message; retain it in the
  API response, D1 ledger, email subject, and notification metadata.
- Reset native fields and validation state only after server acceptance. Failed
  requests preserve content and unchanged retries retain their request ID.
- Emphasize the existing localized success message for 10 seconds, then keep
  the readable confirmation until the next edit/submission.
- Use a 65 CSS px tall flexible Contact Turnstile widget when its container is
  at least 300 CSS px wide; use compact below that provider minimum. Booking
  keeps its existing compact default.
- Render Contact and Booking notifications using a branded inline HTML table
  template, with a plain-text alternative and unchanged Reply-To/reference
  behavior. The inline presentation consumes the generated tokens for the
  site's configured theme. No remote images, fonts, or tracking are added by
  the template. User content is HTML-escaped.

Local verification includes 24 passing Chromium Contact/Booking smoke tests,
the email adapter/escaping unit checks, site check/build, and screenshots of the
Contact success state in all three locales at all five required viewport sizes.
The full UI verification gate could not finish because Firefox and WebKit could
not launch in this environment; independent review evidence is also pending.
Email appearance was checked in Chromium at desktop and mobile widths, not in
every mail client. Preview deployment status is recorded after publication.

## References

- [Brevo domain authentication and existing DMARC updates](https://help.brevo.com/hc/en-us/articles/12163873383186-Authenticate-your-domain-with-Brevo-Brevo-code-DKIM-DMARC)
- [cPanel Zone Editor and DMARC settings](https://docs.cpanel.net/cpanel/domains/zone-editor/)
- [Cloudflare Turnstile error codes](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/)
- [Website form deployment runbook](./README.md)
