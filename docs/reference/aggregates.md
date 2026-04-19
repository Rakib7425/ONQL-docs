---
id: aggregates
title: Aggregates
sidebar_position: 3
---

# Aggregates

| Function | Args | Returns | Notes |
|---|---|---|---|
| `_count()` | none | number | Counts rows |
| `_sum(col)` | column | number | Sum of a numeric column |
| `_avg(col)` | column | number | Mean of a numeric column |
| `_min(col)` | column | scalar | Minimum value (any comparable type) |
| `_max(col)` | column | scalar | Maximum value (any comparable type) |
| `_unique(col)` | column | array | Distinct values |
| `_asc(col)` | column | (sort) | Sort ascending |
| `_desc(col)` | column | (sort) | Sort descending |
| `_like(pat)` | string | bool | LIKE pattern match (filter) |
| `_date(col, fmt)` | column, string | string | Format/parse a timestamp |

## Where each makes sense

| Aggregate | Use in projection? | Use in filter? | Use as sort? |
|---|---|---|---|
| `_count()` | ✅ | — | — |
| `_sum`, `_avg`, `_min`, `_max` | ✅ | — | indirectly |
| `_unique` | ✅ | — | — |
| `_asc`, `_desc` | — | — | ✅ |
| `_like` | — | ✅ | — |
| `_date` | ✅ | ✅ | — |

## Empty inputs

- `_count()` returns `0`.
- `_sum`, `_avg`, `_min`, `_max` return `null` when applied to an empty input.
- `_unique` returns `[]`.

## Composing

Aggregates that *return data* (sum, avg, count, min, max, unique) can appear inside a projection. Sort aggregates (`_asc`, `_desc`) attach to a table or relation and don't show up in the output. `_like` and `_date` are most useful inside filters.
