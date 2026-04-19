---
id: entities
title: Entities
sidebar_position: 2
---

# Entities

An **entity** is the protocol's name for "a queryable thing." It usually maps 1:1 to a database table, but it doesn't have to.

## Declaring an entity

```json
{
  "shop": {
    "entities": {
      "users": {
        "table": "users"
      }
    }
  }
}
```

The key (`users`) is what you'll use in queries (`shop.users`). The `table` value is the actual table name in the database.

## Renaming a table for queries

If your physical table is called `usr_acct` but you'd rather query it as `users`:

```json
"users": {
  "table": "usr_acct"
}
```

Now `shop.users` resolves to the `usr_acct` table. Frontends never see the underlying name.

## Required and optional keys

| Key | Required | Purpose |
|---|---|---|
| `table` | yes | Actual table name in the database |
| `fields` | yes | Column → query-name mapping |
| `relations` | no | Foreign keys to other entities |
| `context` | no | Automatic scoping rules |

## Multiple entities pointing at the same table

You can declare two entities for the same physical table with different aliases or contexts. Useful when you want one "admin" view and one "public" view of the same data:

```json
"users":         { "table": "users", "context": { "account": "shop.users[id = $1]" } },
"users_public":  { "table": "users", "fields": { "id": "id", "name": "name" } }
```

The `users_public` entity intentionally projects only safe-to-share columns.
