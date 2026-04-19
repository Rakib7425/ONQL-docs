---
id: slicing
title: Slicing
sidebar_position: 4
---

# Slicing

Slice syntax mirrors Python: `[start:end]` or `[start:end:step]`.

## Forms

| Form | Meaning |
|---|---|
| `[a:b]` | Rows `a` (inclusive) through `b` (exclusive) |
| `[:b]` | First `b` rows |
| `[a:]` | From row `a` to the end |
| `[:]` | Every row (rare; same as no slice) |
| `[a:b:s]` | Same as `[a:b]` but step `s` |

## Negative indices

Negative numbers count from the end:

```
shop.customers[-10:]    // last 10
shop.customers[:-1]     // all but the last
```

## Filters, slices, and aggregates combine in any order

You can chain as many as you want, and the optimizer figures out the best execution plan. These are all equivalent:

```
shop.orders[status = "paid"]._desc(placed_at)[0:20]
shop.orders._desc(placed_at)[status = "paid"][0:20]
shop.orders[total > 100][status = "paid"]._desc(placed_at)[0:20]
```

Multiple filters act like `and`:

```
shop.orders[status = "paid"][total > 100]
// same as
shop.orders[status = "paid" and total > 100]
```

Use whichever form reads better. For supported patterns this becomes a single indexed range read in the storage layer.

## Slice on a relation

You can slice the related side of a projection too:

```
shop.customers{
  id,
  orders[0:5]{id, total}
}
```

Response:

```json
[
  {
    "id": "c1",
    "orders": [
      { "id": "o1", "total": 99.00 },
      { "id": "o2", "total": 45.50 }
    ]
  }
]
```

Each customer gets their first 5 orders.

## Out-of-range

Slices that overshoot the data simply return what's there:

```
shop.customers[1000:2000]    // empty array on a 50-row table
```

This never throws.
