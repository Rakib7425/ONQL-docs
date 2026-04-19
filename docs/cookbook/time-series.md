---
id: time-series
title: Time Series
sidebar_position: 6
---

# Time Series

ONQL handles common time-series patterns with a combination of `_asc`/`_desc`, slices, and `_date`.

## Last N days of orders

```
shop.orders[
  customer_id = $1
]._desc(placed_at)[0:30]{id, total, placed_at}
```

## Range query

```
shop.orders[
  placed_at >= $1 and placed_at <= $2
]._asc(placed_at){id, total, placed_at}
```

Pass the start and end timestamps via `ctxvalues`.

## Latest order per customer

A common pattern: fetch a list of customers and tag each with their most recent order.

```
shop.customers{
  id, name,
  orders._desc(placed_at)[0:1]{id, total, placed_at}
}
```

## Aggregating by day (client-side)

ONQL doesn't yet have window/group-by aggregation. For "daily totals" reports, fetch the rows and aggregate on the client. For very large windows you'll want a materialized table that the database refreshes periodically.

## Timestamp filtering

```
shop.events[time >= $1]._asc(time)
```

Numeric epoch timestamps work directly. For string-formatted dates, use `_date` to parse:

```
shop.events[time._date("2006-01-02") = "2026-04-12"]
```
