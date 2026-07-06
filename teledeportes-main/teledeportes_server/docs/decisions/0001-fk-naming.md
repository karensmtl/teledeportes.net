# 0001 — Foreign-key naming convention

Status: accepted
Date: 2026-06-07

## Context

TSS 03 §"Foreign-key columns" requires each project to pick **one** FK-naming
style and never mix:

- role-style (`donor`, `owner`, `recipient`) — used by cowre.
- `<entity>_id` (`user_id`, `category_id`) — for generic relationships.

## Decision

TeleDeportes uses **`<entity>_id`** for all foreign keys.

The domain (VOD catalog, channels, users) has no role-disambiguated
relationships — a video belongs to a category, full stop. `<entity>_id` reads
unambiguously and matches the generic-role guidance in TSS 03.

First applications: `videos.category_id → categories.id`.

## Consequences

- Every FK column is `<referenced_entity>_id`.
- Sequelize associations still declare an explicit `as` alias (e.g.
  `categoryData`, `videos`) and the `foreignKey` per TSS 03 §"Associations".
- role-style FK columns are forbidden in this project.
