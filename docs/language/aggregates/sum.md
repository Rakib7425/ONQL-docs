---
id: sum
title: _sum(col)
sidebar_position: 2
---

# `_sum(col)`

Adds up a numeric column.

## Syntax

```
table._sum(column)
```

## Examples

```
mydb.orders._sum(total)
```

```
mydb.orders[status = "paid"]._sum(total)
```

## Inside a projection

```
mydb.users{
  id,
  name,
  orders._sum(total)
}
```

Each user gets the sum of their orders' totals at the `orders` key.

## Notes

- Non-numeric values are ignored.
- The result is a number (integer or float, depending on the column).
- Combine with a filter to get conditional sums.
