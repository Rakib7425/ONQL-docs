---
id: count
title: _count()
sidebar_position: 1
---

# `_count()`

Returns the number of rows in the input.

## Syntax

```
table._count()
```

## Examples

```
mydb.orders._count()
```

```
mydb.orders[status = "paid"]._count()
```

## Inside a projection

```
mydb.users{
  id,
  name,
  orders._count()
}
```

Each user gets a number, not an array of orders.

## Returns

A single number (the count). When used inside a projection, the value lives at the relation key in the result object.
