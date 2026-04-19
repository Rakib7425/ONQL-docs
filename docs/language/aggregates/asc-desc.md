---
id: asc-desc
title: _asc(col) & _desc(col)
sidebar_position: 6
---

# `_asc(col)` and `_desc(col)`

Sort the rows of a table or relation.

## Syntax

```
table._asc(column)
table._desc(column)
```

## Examples

```
mydb.users._asc(name)
mydb.orders._desc(created_at)
```

## With a slice — top N

```
mydb.orders._desc(total)[0:10]
```

The 10 highest-value orders.

## Inside a projection

```
mydb.users{
  id,
  orders._desc(created_at)[0:5]{id, total}
}
```

Each user's 5 most recent orders.

## Performance

When `_asc`/`_desc` immediately precedes a slice and follows a table access, the optimizer pushes both into the storage layer for an indexed range read. See the [Optimizer](../../concepts/query-execution/optimizer.md) page.
