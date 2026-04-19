---
id: fields
title: Fields
sidebar_position: 3
---

# Fields

The `fields` block tells ONQL which columns exist on an entity and what to call them in queries.

## Basic mapping

```json
"users": {
  "table": "users",
  "fields": {
    "id": "id",
    "name": "name",
    "email": "email"
  }
}
```

The key (left) is the **query-side name**. The value (right) is the **actual column name** in the database. Above, the names are identical — that's the simple case.

## Aliasing a column

Maybe your DB column is `usr_email_addr` but you want queries to say `email`:

```json
"fields": {
  "email": "usr_email_addr"
}
```

A query of `shop.users{email}` will read from the `usr_email_addr` column under the hood.

## Why declare fields at all?

ONQL only lets you query fields you've declared. Two reasons:

1. **Safety** — un-declared columns are invisible. Internal columns like `password_hash` or `pii_blob` simply don't exist as far as queries are concerned.
2. **Performance** — declared fields can be indexed. ONQL creates reverse indexes for every declared field.

## Field types

Types are inferred from the underlying storage. For finer control (validation, formatting), declare them in the database schema layer — see the project README's "Laravel-style validation" section.

## Common patterns

### Hide an internal column

Just don't include it in `fields`. There's no opt-out — exclusion is the default.

### Expose only safe columns

Project out everything you don't need:

```json
"users_public": {
  "table": "users",
  "fields": {
    "id":    "id",
    "name":  "name"
  }
}
```

### Rename for the frontend

```json
"fields": {
  "createdAt": "created_at",
  "updatedAt": "updated_at"
}
```

Now your frontend can write `users{createdAt, updatedAt}` and stay in camelCase.
