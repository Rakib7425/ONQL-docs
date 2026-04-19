---
id: min-max
title: _min(col) & _max(col)
sidebar_position: 4
---

# `_min(col)` and `_max(col)`

Return the smallest or largest value in a column.

## Syntax

```
table._min(column)
table._max(column)
```

## Examples

```
mydb.orders._max(total)
mydb.orders._min(created_at)
```

## Inside a projection

```
mydb.users{
  id,
  name,
  orders._max(total),
  orders._min(created_at)
}
```

## Notes

- Works on numbers, strings, and timestamps.
- For strings, comparison is lexicographic.
- Returns `null` on empty input.
