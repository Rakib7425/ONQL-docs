---
id: optimizer
title: Optimizer
sidebar_position: 2
---

# Optimizer

The optimizer rewrites the parsed plan to make it run faster. The most important rewrite is **slice push-down**.

## Slice push-down

Naive evaluation of `mydb.users[country = "IN"][0:20]` would:

1. Fetch every Indian user.
2. Filter in memory.
3. Slice the first 20.

The optimizer detects this pattern and pushes the slice into the storage layer:

1. Fetch only the first 20 Indian users from the index.

For a table with a million rows, this is a thousand-x speedup.

## Patterns the optimizer recognises

| Pattern | Push-down |
|---|---|
| `Table[filter][slice]` | Filter + slice → indexed range read |
| `Table._asc(col)[slice]` | Sort + slice → indexed sort scan |
| `Table[filter]._asc(col)[slice]` | All three together |

## What blocks push-down

- Filters that include `_like`, `_asc`, `_desc`, or other aggregates
- Filters that walk into a related table
- Comparison operators other than `=`, `==`, `and`, `or`
- Filters with row access (e.g. `category[0].name`)

When push-down is blocked, the slice is applied in memory after the full filtered set is loaded. Correct, just slower.

## Disabling the optimizer

For debugging:

```bash
ONQL_OPTIMIZER=off ./onql
```

The optimizer source lives in [`dsl/optimizer/`](https://github.com/ONQL/server/tree/main/dsl/optimizer).
