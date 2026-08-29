# Shared Contract — BusinessMovementSequence

Status: **Shared structural contract**

## Purpose

Present a six-stage business movement example beside contextual imagery. The component is shared by business-service pages whose authored journey has exactly six ordered stages.

## Ownership

The caller owns all localized copy, the unique section-heading ID, stage order,
imported image and approved visual variant. The component owns the numbered
sequence, static connector treatment, responsive image delivery and 7/5 desktop
topology.

## Required inputs

- unique `headingId` used by both the section and H2;
- localized heading, intro, optional body, section label and example label;
- exactly six localized `{ title, text }` stages;
- one imported `ImageMetadata` asset;
- optional `default` or `signature` variant.

No route keys, service facts, vehicle relationships or locale dictionaries belong in this component.

## Responsive behavior

- below `lg`: introduction, sequence and image form one logical vertical reading order;
- at and above `lg`: sequence and image use a 7/5 split;
- at and above `lg`, the media is removed from intrinsic row sizing and stretches
  only to the rendered height of the adjacent sequence content;
- the image remains decorative, lazy and responsive;
- content must wrap without horizontal overflow.

## Visual and interaction rules

- default: contained elevated architectural section, preserving Delegation;
- signature: optional full-width elevated graphite band with larger media and no
  outer rounded-panel framing;
- neither variant uses six floating cards;
- numbered divider-led rows with static CSS connectors;
- Inter Tight for stage titles and Manrope for labels/body copy;
- no client-side JavaScript, live status, maps or tracking semantics.

## Current consumers

- Delegation Transportation;
- Conference and Congress Transportation.
