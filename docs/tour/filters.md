---
id: filters
title: Filters
sidebar_position: 2
---

# Filters

Filters narrow down which rows are returned. Wrap them in **square brackets** `[ ]`.

## Equality

```
shop.customers[status = "active"]
```

Response (example):

```json
[
  { "id": "c1", "name": "Ada",   "status": "active" },
  { "id": "c2", "name": "Linus", "status": "active" }
]
```

## Comparison

```
shop.customers[age > 18]
shop.products[price <= 999]
```

## Multiple conditions

Combine with `and` / `or` in a single filter:

```
shop.customers[status = "active" and country = "IN"]
```

Or chain multiple filter brackets — they compose with `and`:

```
shop.customers[status = "active"][country = "IN"]
// equivalent to the query above
```

```
shop.orders[status = "open" or status = "partial"]
```

## Pattern match

Use the `_like` aggregate for SQL-style LIKE:

```
shop.customers[email._like("%@gmail.com")]
```

## Parameters

Use `$1`, `$2`, ... as placeholders. They're substituted at query time, which avoids string-concatenation bugs and lets you reuse the same query with different inputs.

```
shop.customers[email = $1]
```

You pass values via the `ctxvalues` field of the request.

## Combine with projection

Filter, slice, and project all in the same query — but remember, **projection always comes last**:

```
shop.customers[country = "IN"][0:10]{id, name, email}
```

Reads as: *customers where country = IN, take the first 10, return id/name/email*.

Response:

```json
[
  { "id": "c1", "name": "Ada",    "email": "ada@example.com" },
  { "id": "c2", "name": "Anjali", "email": "anjali@example.com" }
]
```

Filters and slices can appear in any order and repeat; projection is terminal.

## What's next

Once you can pick the rows you want, learn how to [page and slice](./slicing-paging.md) results.
