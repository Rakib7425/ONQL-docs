---
id: like
title: Pattern Matching (_like)
sidebar_position: 3
---

# Pattern Matching

The `_like` function does SQL-style LIKE matching.

## Syntax

```
column._like("pattern")
```

`_like` is technically an aggregate, but you'll almost always see it inside a filter.

## Wildcards

| Wildcard | Meaning |
|---|---|
| `%` | Any sequence of characters (including empty) |
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

## Inside parameters

Pass the pattern via `$1` for safety:

```
mydb.users[name._like($1)]
```

Then send `ctxvalues: ["Ada%"]`.

## Performance

`_like` queries that start with a literal prefix (`"Ada%"`) can use the column index. Queries that start with a wildcard (`"%@gmail.com"`) require a full table scan — use them sparingly on large tables.
