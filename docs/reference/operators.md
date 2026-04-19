---
id: operators
title: Operators
sidebar_position: 2
---

# Operators

The complete list, with precedence.

## Comparison

| Operator | Aliases | Type | Example |
|---|---|---|---|
| `=` | `==` | infix | `status = "active"` |
| `!=` | — | infix | `status != "deleted"` |
| `<` | — | infix | `age < 18` |
| `<=` | — | infix | `price <= 100` |
| `>` | — | infix | `qty > 0` |
| `>=` | — | infix | `rating >= 4` |

## Logical

| Operator | Type | Example |
|---|---|---|
| `and` | infix | `a = 1 and b = 2` |
| `or` | infix | `a = 1 or b = 2` |
| `not` | prefix | `not (status = "deleted")` |

## Arithmetic

Works on aggregate results and numeric literals. Also valid inside filter expressions.

| Operator | Purpose | Example |
|---|---|---|
| `+` | Add (or concat strings) | `shop.orders._count() + 5` → `47` |
| `-` | Subtract | `shop.orders._sum(total) - 100` |
| `*` | Multiply | `shop.products._count() * 2` |
| `/` | Divide | `shop.orders._sum(total) / shop.orders._count()` |
| `%` | Modulus | `shop.orders._count() % 10` |
| `**` | Exponent | `2 ** 10` → `1024` |

### Scalar queries

An ONQL query doesn't have to end with a projection. Aggregates return scalars directly:

```
shop.orders._count()
→ 42

shop.orders._count() + 5
→ 47

shop.orders[status = "paid"]._sum(total)
→ 1842.50
```

You can feed that scalar straight into your client / dashboard without unwrapping a row array.

## Precedence (highest to lowest)

1. Function calls (`_func(...)`)
2. Field access (`.`)
3. `**`
4. `*`, `/`, `%`
5. `+`, `-`
6. Comparisons (`=`, `!=`, `<`, `<=`, `>`, `>=`)
7. `and`
8. `or`

Use parentheses to override:

```
[(a = 1 or a = 2) and b = "x"]
```

## Operands

Operands can be:

- A literal: `"string"`, `42`, `3.14`, `null`
- A column on the current table: `age`, `status`
- A field of a related table (in some contexts): `customer.country`
- A parameter: `$1`, `$2`
- An aggregate result: `name._like("foo%")`, `orders._count()`

## What you cannot do (yet)

- `BETWEEN` — use `>=` and `<=` joined by `and`.
- `IN` — use chained `or`s, or pass a slice of values via repeated `=` `or` (parameterised).
