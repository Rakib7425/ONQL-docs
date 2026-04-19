---
id: basic
title: Basic Projections
sidebar_position: 1
---

# Basic Projections

A **projection** picks the fields you want from a table. Wrap them in `{ }`.

## Pick specific fields

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

Each row contains only the keys you listed.

## Pick everything

Leave off the projection:

```
shop.customers
```

Response: every declared field on the entity for every row. Useful in development; in production you almost always want to project explicitly to keep payloads small.

## Projection is terminal

`{…}` is the **last** thing in a query at its level. You can't put a filter, slice, or aggregate *after* a projection:

```
✅ shop.customers[country = "IN"][0:10]{id, name}
❌ shop.customers{id, name}[country = "IN"]
❌ shop.customers{id, name}[0:10]
```

All the narrowing (filters, slices, sorts) must happen **before** the projection. Inside the projection, each key can have its own filter/slice/projection — see [Nested](./nested.md).

## Order matters in the response

Keys come back in the same order you wrote them in the projection. Your frontend can rely on this if it needs deterministic JSON.

## Field aliases

If your protocol declared `"email": "usr_email_addr"`, you query as `email`. The actual column name never appears in queries.

```json
"fields": {
  "email": "usr_email_addr"
}
```

```
shop.customers{email}
```

Response:

```json
[{ "email": "ada@example.com" }]
```

## What about computed fields?

Plain projection only returns columns. For sums, counts, and other derived values, use [aggregates](../aggregates/count.md) inside the projection — see [Nested projections](./nested.md).
