# cPanel DNS backup — luksuzniprevoz.rs

Backup created: **2026-09-26**. Source: the cPanel Zone Editor HTML supplied by the owner in this conversation; no live DNS lookup was used.

## Backup format and coverage

The accompanying [JSON backup](./luksuzniprevoz.rs-2026-09-26-cpanel.json) is the canonical structured copy. It preserves all **32 displayed table records**, row order, owner names, TTLs, MX priority, SRV fields and TXT segments. JSON was chosen for exact strings, explicit numeric fields and easy conversion later.

All displayed TTLs are **14400 seconds (4 hours)**. Counts: **9 A, 5 CNAME, 1 MX, 5 SRV, 12 TXT**.

This captures every displayed table row but is **not a complete authoritative zone export**: the supplied HTML does not include the SOA/serial, NS TTLs, registrar delegation or DS records. Empty Angular templates do not represent extra DNS records. A provider's raw zone export would supplement this snapshot.

## Configured nameservers displayed by cPanel

- `cpanel29.beotel.net`
- `ns.beotel.net`
- `ns.beotel.rs`

These are header metadata, stored separately from the 32 table records. Their TTLs and registrar delegation were not supplied.

## Reading and restoring the JSON

- `name`: complete owner name, preserving its displayed trailing dot.
- `ttl_seconds`: numeric TTL.
- `content`: A address, CNAME target, MX destination, SRV target or complete TXT text.
- MX adds `priority`; SRV adds `priority`, `weight` and `port`.
- TXT adds `text_segments`. Row 12's DKIM record has two strings in **one record**. Concatenate them without an extra space if the destination editor accepts one text value; preserve segments if it supports multiple strings.
- CNAME/MX/SRV targets displayed without a trailing dot are absolute hostnames. Append a dot when converting to BIND syntax to avoid an unintended zone suffix.

Use this as a reference for restoring individual records or for preparing a reviewed provider-specific import. It cannot be uploaded directly as a cPanel or Cloudflare zone file. Restore the captured values only where rollback is intended; certificate challenge TXT values are a historical snapshot and may no longer satisfy a later challenge.

## Mail dependencies to resolve before a website migration

The captured configuration contains:

- Root A: `luksuzniprevoz.rs.` → `195.252.110.238`.
- Root MX: priority `0`, destination `luksuzniprevoz.rs`.
- `mail.luksuzniprevoz.rs.` CNAME → `luksuzniprevoz.rs`.
- Four calendar/address-book SRV records also target the root domain.
- `ftp` and `www` CNAMEs also target the root domain.

Thus the captured mail destination and mail alias depend on the root address. Review those dependencies with the existing mail provider before moving the root website to Pages. This backup contains the existing values; no migration changes were applied.

## Brevo records captured

- Row 29: root TXT ownership verification.
- Rows 30–31: `brevo1._domainkey` and `brevo2._domainkey` CNAMEs.
- Row 13: the current DMARC TXT includes `rua=mailto:rua@dmarc.brevo.com` and preserves `p=none`.
- Row 12: the existing provider's `default._domainkey` DKIM TXT remains separate from Brevo's selectors.

Earlier DMARC history remains in [mail-service.md](../cloudflare-pages-forms/mail-service.md). This dated backup records the **current supplied HTML**.

## Record inventory

Values below are generated from the JSON. TTL is 14400 for every row. Full DKIM strings are preserved in the JSON rather than shortened inside the backup.

| cPanel row | Name                                              | Type  | Value / parameters                                                                                    |
| ---------- | ------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------- |
| 0          | `luksuzniprevoz.rs.`                              | A     | `195.252.110.238`                                                                                     |
| 1          | `luksuzniprevoz.rs.`                              | MX    | `priority=0; destination=luksuzniprevoz.rs`                                                           |
| 2          | `mail.luksuzniprevoz.rs.`                         | CNAME | `luksuzniprevoz.rs`                                                                                   |
| 3          | `www.luksuzniprevoz.rs.`                          | CNAME | `luksuzniprevoz.rs`                                                                                   |
| 4          | `ftp.luksuzniprevoz.rs.`                          | CNAME | `luksuzniprevoz.rs`                                                                                   |
| 5          | `luksuzniprevoz.rs.`                              | TXT   | `v=spf1 ip4:195.252.110.238 ip4:195.252.110.239 a ip4:195.252.110.240 mx ~all`                        |
| 6          | `cpcalendars.luksuzniprevoz.rs.`                  | A     | `195.252.110.238`                                                                                     |
| 7          | `whm.luksuzniprevoz.rs.`                          | A     | `195.252.110.238`                                                                                     |
| 8          | `cpcontacts.luksuzniprevoz.rs.`                   | A     | `195.252.110.238`                                                                                     |
| 9          | `cpanel.luksuzniprevoz.rs.`                       | A     | `195.252.110.238`                                                                                     |
| 10         | `webmail.luksuzniprevoz.rs.`                      | A     | `195.252.110.238`                                                                                     |
| 11         | `webdisk.luksuzniprevoz.rs.`                      | A     | `195.252.110.238`                                                                                     |
| 12         | `default._domainkey.luksuzniprevoz.rs.`           | TXT   | `Two TXT segments; exact value in JSON record 12.`                                                    |
| 13         | `_dmarc.luksuzniprevoz.rs.`                       | TXT   | `v=DMARC1;p=none;sp=none;adkim=r;aspf=r;pct=100;fo=0;rf=afrf;ri=86400;rua=mailto:rua@dmarc.brevo.com` |
| 14         | `_cpanel-dcv-test-record.luksuzniprevoz.rs.`      | TXT   | `_cpanel-dcv-test-record=Mgd_cMIKnlAZ2F5pKovxfXjppT76vZvljQsLhNG_v6wRIGmzWcchvUqzS_aMWCCf`            |
| 15         | `luksuzniprevoz.rs.`                              | TXT   | `google-site-verification=JFxE2K9-8I4cqG2pBtDa-jkJ79gdYlOQ7eeRQ62k8Ew`                                |
| 16         | `autodiscover.luksuzniprevoz.rs.`                 | A     | `195.252.110.238`                                                                                     |
| 17         | `_caldavs._tcp.luksuzniprevoz.rs.`                | SRV   | `priority=0; weight=0; port=2080; target=luksuzniprevoz.rs`                                           |
| 18         | `_caldavs._tcp.luksuzniprevoz.rs.`                | TXT   | `path=/`                                                                                              |
| 19         | `_carddav._tcp.luksuzniprevoz.rs.`                | SRV   | `priority=0; weight=0; port=2079; target=luksuzniprevoz.rs`                                           |
| 20         | `_carddav._tcp.luksuzniprevoz.rs.`                | TXT   | `path=/`                                                                                              |
| 21         | `_carddavs._tcp.luksuzniprevoz.rs.`               | SRV   | `priority=0; weight=0; port=2080; target=luksuzniprevoz.rs`                                           |
| 22         | `_carddavs._tcp.luksuzniprevoz.rs.`               | TXT   | `path=/`                                                                                              |
| 23         | `autoconfig.luksuzniprevoz.rs.`                   | A     | `195.252.110.238`                                                                                     |
| 24         | `_caldav._tcp.luksuzniprevoz.rs.`                 | SRV   | `priority=0; weight=0; port=2079; target=luksuzniprevoz.rs`                                           |
| 25         | `_caldav._tcp.luksuzniprevoz.rs.`                 | TXT   | `path=/`                                                                                              |
| 26         | `_autodiscover._tcp.luksuzniprevoz.rs.`           | SRV   | `priority=0; weight=0; port=443; target=cpanelemaildiscovery.cpanel.net`                              |
| 27         | `_acme-challenge.luksuzniprevoz.rs.`              | TXT   | `FC6yQm3G6QE0ipPz6UWQu-g3zyjpUgF_EiDTVCxUP1w`                                                         |
| 28         | `_acme-challenge.autodiscover.luksuzniprevoz.rs.` | TXT   | `7dq_2OEfu0D6B8aqQmPD6ksfX9QgZ0RKDjwt17NlBKk`                                                         |
| 29         | `luksuzniprevoz.rs.`                              | TXT   | `brevo-code:4230b148a1a2ba471ed41772ba6384cb`                                                         |
| 30         | `brevo1._domainkey.luksuzniprevoz.rs.`            | CNAME | `b1.luksuzniprevoz-rs.dkim.brevo.com`                                                                 |
| 31         | `brevo2._domainkey.luksuzniprevoz.rs.`            | CNAME | `b2.luksuzniprevoz-rs.dkim.brevo.com`                                                                 |

## Verification

JSON parsed successfully; 32 records have contiguous source row IDs 0–31; type counts and TTLs were checked. TXT concatenation was checked, and the copied DKIM public key decodes as a 294-byte value. DNS strings were transcribed from the supplied rendered rows; this does not verify live DNS or mail delivery. No DNS settings, commits or deployments were changed.
