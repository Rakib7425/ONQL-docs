---
id: logical
title: Logical Operators
sidebar_position: 2
---

# Logical Operators

`and` and `or` combine conditions inside a filter.

## AND

```
mydb.users[status = "active" and country = "IN"]
```

Only rows that match both conditions.

## OR

```
mydb.orders[status = "open" or status = "partial"]
```

Rows that match either.

## Mixing

```
mydb.users[
  (country = "IN" or country = "US")
  and age >= 18
]
```

Use parentheses to control precedence — same rules as SQL/most languages: `and` binds tighter than `or`, but explicit parens always win.

## Reading tip

The filter inside `[ ... ]` is a single boolean expression. Anything that evaluates to "true" for a row keeps that row.

## Performance note

Push-down to indexes works for simple `=` + `and`/`or` combinations. More exotic patterns (mixing comparisons with `or`, nested filters across relations) fall back to in-memory evaluation. See the [Optimizer concept page](../../concepts/query-execution/optimizer.md).
