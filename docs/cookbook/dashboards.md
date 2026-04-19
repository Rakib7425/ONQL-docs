---
id: dashboards
title: Dashboards
sidebar_position: 1
---

# Dashboards

Recipes for the queries that power typical app dashboards. Examples use the [`shop` protocol](../concepts/protocol/examples.md#an-e-commerce-shop).

## A customer's open orders

```
shop.orders[status = "pending"]{
  id, total, placed_at,
  items{qty, price, product{name}},
  customer{name, email}
}
```

Auto-scoped per customer via the `customer` context rule — the logged-in shopper only sees their own orders.

## Recent activity feed

```
shop.orders._desc(placed_at)[0:50]{
  id, total, status, placed_at,
  customer{name}
}
```

## Per-customer lifetime spend

```
shop.customers{
  id, name, email,
  orders._sum(total),
  orders._count()
}
```

## Customer overview card

```
shop.customers[0]{
  name, email,
  orders._count(),
  orders._sum(total),
  transactions._desc(created_at)[0:5]{amount, type}
}
```

The `[0]` is safe — context auto-scopes the table to one row when called as `customer`.

## Multiple panels in one round-trip

You can issue several queries in one request — but for typical dashboards, prefer **one big nested query** that returns everything the page needs:

```
shop.customers[0]{
  name, email,
  orders[status = "pending"]{id, total, items{product{name}, qty}},
  orders._desc(placed_at)[0:10]{id, status, total},
  transactions._desc(created_at)[0:10]{amount, type}
}
```

One round-trip → entire dashboard.
