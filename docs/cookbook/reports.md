---
id: reports
title: Reports
sidebar_position: 3
---

# Reports

## Top 10 customers by spend

```
shop.customers{
  id, name,
  orders._sum(total)
}._desc(orders)[0:10]
```

## Sales by region

```
shop.customers._unique(country)
```

Then for each country (client-side):

```
shop.orders[customer.country = $1]._sum(total)
```

## Best-selling products

```
shop.products{
  name,
  order_items._sum(qty),
  order_items._count()
}._desc(order_items)[0:20]
```

## Daily sales

```
shop.orders[
  placed_at >= $1 and placed_at <= $2
]._asc(placed_at){placed_at, total, status}
```

Pass `$1` and `$2` as the range. Aggregate on the client if you want per-day totals.

## Order history export

```
shop.orders._desc(placed_at){
  id, total, status, placed_at,
  items{qty, price, product{name}}
}
```

Pass a pagination slice when exporting in chunks to avoid loading the full history into memory:

```
shop.orders._desc(placed_at)[0:1000]{...}
shop.orders._desc(placed_at)[1000:2000]{...}
```
