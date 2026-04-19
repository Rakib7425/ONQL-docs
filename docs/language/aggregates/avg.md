---
id: avg
title: _avg(col)
sidebar_position: 3
---

# `_avg(col)`

Returns the arithmetic mean of a numeric column.

## Syntax

```
table._avg(column)
```

## Examples

```
mydb.orders._avg(total)
```

```
mydb.orders[status = "paid"]._avg(total)
```

```
mydb.products{
  category,
  reviews._avg(rating)
}
```

## Notes

- Non-numeric values are ignored.
- Returns `null` if the input is empty.
- Returns a float, even when all inputs are integers.
