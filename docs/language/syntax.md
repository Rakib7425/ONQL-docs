---
id: syntax
title: Syntax
sidebar_position: 1
---

# Syntax

The whole language fits on one page.

## Atoms

| Token | Meaning | Example |
|---|---|---|
| `db.table` | Table access | `shop.orders` |
| `.relation` | Relation walk | `shop.customers.orders` |
| `[ ... ]` | Filter / slice / row access | `[status = "paid"]`, `[0:10]`, `[5]` |
| `{ ... }` | Projection | `{id, total}` |
| `_func( ... )` | Aggregate function | `_count()`, `_desc(placed_at)` |
| `+ - * / % **` | Arithmetic | `._count() + 5` |
| `$N` | Parameter placeholder | `$1`, `$2` |
| `"..."` | String literal | `"paid"` |
| `123` | Number literal | `42`, `3.14` |
| `=`, `!=`, `<`, `<=`, `>`, `>=` | Comparison | `total > 100` |
| `and`, `or` | Logical | `a = 1 and b = 2` |

## Composition rules

1. A query **begins** with a table access (`db.table`).
2. After the table, you can chain any number of **filters `[…]`**, **slices `[a:b]`**, and **aggregates `_fn(…)`** — **in any order**, and the same kind can appear multiple times.
3. A query **ends** with either:
   - a **projection `{…}`** (returns rows/objects), **or**
   - an **aggregate that produces a scalar** (`_count`, `_sum`, `_avg`, `_min`, `_max`), optionally followed by arithmetic.
4. **Projection is terminal.** Nothing comes after `{…}` at the same level. If you want to filter or sort a relation *inside* the projection, attach it to the relation, not the outer query.
5. Inside a projection, each key is itself a sub-expression — a column, a relation walk, an aggregate, or arithmetic.

### What "any order, any number" looks like

All of these are legal:

```
shop.orders[status = "paid"][0:10]
shop.orders[0:10][status = "paid"]
shop.orders[status = "paid"][total > 100]._desc(placed_at)[0:10]
shop.orders._desc(placed_at)[status = "paid"][0:10]
```

Chain as many filters and slices as you want; the optimizer combines them.

### Projection-is-terminal — valid vs invalid

```
✅ shop.orders[status = "paid"]._desc(placed_at)[0:10]{id, total}
❌ shop.orders{id, total}[status = "paid"]         // filter after projection
❌ shop.orders{id, total}[0:10]                    // slice after projection
```

The outer slice/filter must move *before* `{…}`. To limit a nested relation, attach the slice inside:

```
shop.customers{
  id, name,
  orders[status = "paid"][0:5]{id, total}
}
```

## Queries that return scalars

A query doesn't have to end in a projection. Aggregates return single values, and arithmetic works on them:

```
shop.orders._count()
→ 42
```

```
shop.orders._count() + 5
→ 47
```

```
shop.orders[status = "paid"]._sum(total) / shop.orders._count()
→ 87.25
```

Supported arithmetic: `+`, `-`, `*`, `/`, `%`, `**` (exponent). Works on numbers; `+` also concatenates strings.

## Reading direction

Always **left to right** — like reading a sentence:

```
shop.customers[country = "IN"]._desc(created_at)[0:10]{id, name, orders{total}}
```

> Get customers from India, sorted by `created_at` descending, take the first 10, return `id`, `name`, and each customer's orders' `total`.

Response:

```json
[
  {
    "id": "…",
    "name": "Ada",
    "orders": [{ "total": 99.00 }, { "total": 45.50 }]
  },
  …
]
```

## Whitespace and comments

- Whitespace is insignificant.
- Comments are not part of the language. Strip them in your client code if you store ONQL queries in `.onql` files.

## Example: every feature in one query

```
shop.customers[
  status = "active" and country = $1
]._desc(created_at)[0:20]{
  id,
  email,
  orders[status = "paid"]._sum(total),
  profile{avatar_url, bio},
  tags{name}
}
```

This single expression contains: table access, filter with `and`, parameter, sort aggregate, slice, projection, filtered + aggregated relation, one-to-one relation, many-to-many relation. That's the whole language.
