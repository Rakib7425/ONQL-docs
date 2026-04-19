---
id: operators
title: Comparison Operators
sidebar_position: 1
---

# Comparison Operators

| Operator | Meaning | Example |
|---|---|---|
| `=` | Equal | `[status = "active"]` |
| `==` | Equal (alias) | `[status == "active"]` |
| `!=` | Not equal | `[status != "deleted"]` |
| `>` | Greater than | `[age > 18]` |
| `>=` | Greater or equal | `[price >= 100]` |
| `<` | Less than | `[stock < 5]` |
| `<=` | Less or equal | `[rating <= 3]` |

## Strings

String comparisons are exact and case-sensitive. Use `_like` for pattern matching.

```
mydb.users[name = "Ada"]
```

## Numbers

Both integers and decimals are supported.

```
mydb.products[price <= 999.99]
```

## Null

Compare to `null` directly:

```
mydb.users[deleted_at = null]
```

## Combining

Chain conditions with [`and` / `or`](./logical.md).
