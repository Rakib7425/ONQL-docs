---
id: aggregates
title: Aggregates
sidebar_position: 5
---

# Aggregates

Aggregate functions start with an underscore. They're called like methods after a table or column.

## Counting

```
shop.orders._count()
→ 42
```

Aggregates return scalars — you don't need a projection.

## Sum, avg, min, max

```
shop.orders._sum(total)
→ 1842.50

shop.orders._avg(total)
→ 43.87

shop.orders._min(total)
→ 9.99

shop.orders._max(total)
→ 299.00
```

## Arithmetic on scalars

Aggregate results compose with `+ - * / % **`:

```
shop.orders._count() + 5
→ 47

shop.orders[status = "paid"]._sum(total) / shop.orders._count()
→ 43.87
```

Useful for dashboards where you need a quick derived number without client-side math.

## With a filter

Filters compose with aggregates exactly the way you'd expect:

```
shop.orders[status = "paid"]._sum(total)
→ 1842.50
```

## Sorting

`_asc` and `_desc` are sort aggregates that flow into a projection or slice:

```
shop.orders._desc(placed_at)[0:10]{id, total, status}
```

Reads: *orders sorted by placed_at descending, take the first 10, return these fields*.

Response:

```json
[
  { "id": "o99", "total": 299.00, "status": "paid" },
  { "id": "o98", "total": 45.50,  "status": "pending" }
]
```

## Distinct values

```
shop.customers._unique(country)
→ ["IN", "US", "DE"]
```

## Pattern match (LIKE)

Although `_like` is technically an aggregate, it's almost always used inside a filter:

```
shop.customers[name._like("Ada%")]
```

## Date parsing

```
shop.orders._date(placed_at, "2006-01-02")
```

The format string follows Go's reference layout.

## What's next

The big one — [context-aware queries](./context.md), the feature that lets you delete your API layer.
