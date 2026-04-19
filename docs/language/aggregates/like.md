---
id: like
title: _like(pattern)
sidebar_position: 7
---

# `_like(pattern)`

SQL-style LIKE pattern matching. Almost always used inside a filter.

## Syntax

```
column._like("pattern")
```

## Wildcards

| Wildcard | Meaning |
|---|---|
| `%` | Any sequence of characters |
| `_` | Exactly one character |

## Examples

```
mydb.users[email._like("%@gmail.com")]
```

```
mydb.users[name._like("Ada%")]
```

```
mydb.products[sku._like("SKU-____-A")]
```

## With a parameter

```
mydb.users[name._like($1)]
```

```json
{ "ctxvalues": ["Ada%"] }
```

## Performance

Patterns starting with a literal prefix can use the column index. Patterns that start with `%` cause a full table scan — avoid on large tables.
