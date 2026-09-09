# Consolidated Content Decisions Required

## Optional verified claim

The current Serbian `contact.officeNote` promises a response within two hours
during working hours, but no verified operational SLA supports it. The approval
pack will use the safe replacement `Na poruke odgovaramo tokom radnog vremena.`
unless the owner explicitly verifies the stronger two-hour commitment.

## Business Hub release integrity

The published Business Transportation hub and global Header are locked to show
and link three child services, but Corporate Transportation and
Conference/Congress Transportation are still `scaffold` routes with `in-review`
content and are not emitted as full pages in production. The recommended safe
default is to hold the hub and those navigation links from public/indexable
release until both child routes pass their page gates and all three are activated
together. The alternative—showing unavailable entries without links—requires an
explicit hub/navigation blueprint revision.

The final production build confirms the mismatch: it emitted 43 pages,
including Serbian `/poslovni-prevoz/`, but did not emit Serbian
`/korporativni-prevoz/` or `/prevoz-za-konferencije-i-kongrese/`.

Add a question only after repository evidence has been exhausted. For each item, identify the affected routes and fields, explain why omission or neutral wording is insufficient, and provide a safe default when one exists.
