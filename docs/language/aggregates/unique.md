---
id: unique
title: _unique(col)
sidebar_position: 5
---

# `_unique(col)`

Returns the distinct values of a column as an array.

## Syntax

```
table._unique(column)
```

## Examples

```
mydb.users._unique(country)
```

```json
["IN", "US", "DE"]
```

## With a filter

```
mydb.orders[status = "paid"]._unique(currency)
```

## Notes

- Order of returned values is not guaranteed unless you also sort.
- Works on any column type that supports equality.
