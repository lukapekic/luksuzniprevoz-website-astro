# Temporary Google reviews source

Authority: owner-provided screenshots in the review integration conversation,
transcribed on 2026-09-26. The capture date was not supplied.
Business profile: https://maps.app.goo.gl/R1aaqTjVA8fUxFbi6

`src/data/google-reviews.snapshot.json` supplies the existing reviews adapter.
Screenshot 5 shows Limo Service Grand Solutions, 5.0 stars and 11 ratings.
The seven selected reviews have complete visible text and five stars each.
Milena’s card displays the first two complete sentences verbatim to preserve a
readable mobile footprint; her full review remains in the snapshot.
The total count is the listing count, not the number of selected cards.

Screenshot references:

- 1: Victor Ramin Jahanhiri; Milena Neskovic.
- 2: Zorica Mladenovic; Irena Matic.
- 3: Milutin Filipovic; Luka.
- 4: Katarina Jovanovic.
- 5: listing name, rating and count.

Google translated all selected reviews except Victor’s into English in the
screenshots. Original text was not provided.
The screenshot labels identify Bosnian originals, except Katarina’s Croatian.
Display copy lives in `src/content/reviews/sr.json`, `en.json` and `ru.json`.
English preserves the screenshot text; Serbian Latin and Russian are site
translations of that English, not the unknown original Bosnian/Croatian reviews.
The file provenance records this distinction. Independent language review is
pending and no reviewed lifecycle state is claimed. UI labels remain localized
through existing sources. Reviewer names and ratings remain in the shared
snapshot and are never translated or duplicated in the locale content files.

The adapter requires a locale and checks exact review ID parity, nonempty text
and verbatim opening excerpts for every configured locale. There is no language
fallback. Compatibility: `getReviewsSummary()` callers now supply their page
locale (`getReviewsSummary(currentLocale)`); the rendered card API is unchanged.

Biljana Drača’s rating-only entry and Tatjana Marjanovic’s cut-off review are
omitted. Exact publication dates, contributor URLs, avatars and individual
review URLs are unknown and remain absent. Relative dates are recorded only
as source metadata; displaying them indefinitely would become misleading.

Manual update procedure: obtain fresh expanded reviews and the listing summary
from the owner, replace the snapshot and provenance, update all three locale content files,
validate, build and deploy.
There is no scraping, API call or automatic refresh. The old `.mock.json` fixture
is retained for historical development use and is no longer imported by the site.

This data-source change preserves the locked section order, carousel, card
appearance and CTA role. The profile link and review data have their own verified
boundary; it does not verify unrelated office/contact details. No new component
or variant is introduced. The listing summary is available through the adapter;
the existing section renders per-review stars rather than an aggregate badge.
