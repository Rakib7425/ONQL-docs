---
id: cheatsheet
title: Cheat Sheet
sidebar_position: 1
---

# Cheat Sheet

Everything in one place.

## Query basics

| Pattern | Example | Result shape |
|---|---|---|
| `db.table` | `shop.customers` | array of rows |
| `db.table{a, b}` | `shop.customers{id, name}` | array with only those keys |
| `db.table[col = "x"]` | `shop.orders[status = "paid"]` | filtered array |
| `db.table[0:10]` | `shop.orders[0:10]` | first 10 rows |
| `db.table[5]` | `shop.orders[5]` | single row object |
| `db.table._desc(col)` | `shop.orders._desc(placed_at)` | sorted array |
| `db.table._count()` | `shop.orders._count()` | scalar number |
| `db.table.relation` | `shop.customers.orders` | walk to related rows |
| `db.table{relation{a}}` | `shop.customers{orders{total}}` | embed relation |

## Shape rules

- **Projection `{…}` is always last** — nothing at the same level after it.
- Filters `[…]`, slices `[a:b]`, and aggregates `_fn(…)` chain in **any order, any number**.
- Scalar aggregates (`_count`, `_sum`, `_avg`, `_min`, `_max`) end the query and return a value; no `{…}` needed.

## Comparison operators

| Op | Meaning |
|---|---|
| `=` `==` | Equal |
| `!=` | Not equal |
| `<` `<=` | Less than |
| `>` `>=` | Greater than |
| `and` | Logical AND |
| `or` | Logical OR |

## Arithmetic

| Op | Example | Result |
|---|---|---|
| `+` | `shop.orders._count() + 5` | `47` |
| `-` | `shop.orders._sum(total) - 100` | `1742.50` |
| `*` | `shop.products._count() * 2` | `84` |
| `/` | `shop.orders._sum(total) / shop.orders._count()` | `43.87` |
| `%` | `shop.orders._count() % 10` | `2` |
| `**` | `2 ** 10` | `1024` |

## Slicing

| Form | Meaning |
|---|---|
| `[a:b]` | Rows a..b-1 |
| `[:b]` | First b rows |
| `[a:]` | From a to end |
| `[a:b:s]` | With step s |
| `[-N:]` | Last N rows |

## Aggregates

| Function | Returns | Example output |
|---|---|---|
| `_count()` | number | `42` |
| `_sum(col)` | number | `1842.50` |
| `_avg(col)` | number | `43.87` |
| `_min(col)` | number | `9.99` |
| `_max(col)` | number | `299.00` |
| `_unique(col)` | array | `["IN","US","DE"]` |
| `_asc(col)` | sort | — |
| `_desc(col)` | sort | — |
| `_like(p)` | bool (in filter) | — |
| `_date(col, fmt)` | parsed/formatted date | — |

## Relationship types

| Type | Shape | Example |
|---|---|---|
| `oto` | Object | Customer → Profile |
| `otm` | Array | Customer → Orders |
| `mto` | Object | Order → Customer |
| `mtm` | Array | Product ↔ Categories |

## Request fields

| Field | Purpose |
|---|---|
| `protopass` | Protocol identifier (use `"default"` for the auto-generated one) |
| `query` | The ONQL string |
| `ctxkey` | Context name (e.g. `account`) |
| `ctxvalues` | Substitutions for `$1`, `$2`, ... |

## Context rule

```json
"orders": {
  "context": {
    "customer": "shop.orders[customer_id = $1]",
    "admin":    "shop.orders"
  }
}
```
