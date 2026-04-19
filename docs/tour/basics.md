---
id: basics
title: Basics
sidebar_position: 1
---

# Basics

Every ONQL query starts the same way: a **database name**, a **dot**, and a **table name**.

## Fetch an entire table

```
shop.customers
```

Response:

```json
[
  { "id": "c1", "name": "Ada",   "email": "ada@example.com",   "created_at": 1713220000 },
  { "id": "c2", "name": "Linus", "email": "linus@example.com", "created_at": 1713221234 }
]
```

This returns every row from the `customers` table as a JSON array.

## Pick the fields you want

Wrap fields in `{ }` to project specific columns:

```
shop.customers{id, name, email}
```

Response:

```json
[
  { "id": "c1", "name": "Ada",   "email": "ada@example.com" },
  { "id": "c2", "name": "Linus", "email": "linus@example.com" }
]
```

The result has only those keys per row. This is the same `{ }` syntax you'll use everywhere — whether you're projecting a single table, a relation, or a deeply nested tree.

## A scalar query

Not every query returns rows. Aggregates and arithmetic return a single value:

```
shop.customers._count()
→ 2

shop.customers._count() + 10
→ 12
```

## Whitespace is free

These three queries are identical:

```
shop.customers{id,name,email}
```

```
shop.customers { id, name, email }
```

```
shop.customers {
  id,
  name,
  email
}
```

Use whatever's readable.

## What's next

Now that you can fetch and project rows, let's narrow them down with [filters](./filters.md).
