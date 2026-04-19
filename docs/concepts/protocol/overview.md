---
id: overview
title: Protocol Overview
sidebar_position: 1
---

# Protocol Overview

A **protocol** is a JSON file that tells ONQL how your data should look from the query side — entity aliases, field names, joins, and authorization. Each protocol is registered under a password, and every query specifies which protocol to use via `protopass`.

## The default protocol

You don't have to write one to get started. The server maintains a built-in protocol named **`default`** (password: `"default"`) that mirrors your schema 1:1:

- Every table becomes an entity with the same name
- Every column becomes a field with the same name
- No relations, no contexts, no aliases

It's **read-only** — you can't modify it. The server regenerates it automatically on every schema change (`schema set`, `alter`, `create table`, `rename`, etc.), so it's always in sync.

This means immediately after you run `schema set`, you can already query:

```
> use onql
onql> password
enter protocol password :- default
onql> shop.customers{id, name, email}
```

## When to write your own protocol

The default protocol is enough for raw reads. You'll want to write your own protocol file when you need any of these:

1. **Friendly aliases** — frontend devs usually don't want `customer_id`, `created_at`, `is_active`. Map them to `customerId`, `createdAt`, `isActive` in the protocol without touching storage.
2. **Relations** — one query like `orders{customer{name}, items{product{name}}}` instead of 3 separate round-trips.
3. **Contexts** — row-level auto-scoping (`customer` sees only their own rows, `admin` sees all).
4. **Cross-database queries** — multiple databases exposed under one protocol file.

## Multiple protocols, one server

You can register as many protocols as you want, each under its own password. Common patterns:

- One protocol per team or per consumer app (mobile, web admin, partner API)
- One "public" protocol with tight context rules + one "internal" protocol with more access
- Versioned protocols (`v1`, `v2`) for backwards compat during migrations

Each protocol is an independent JSON file you register with `protocol set mydb.protocol.json` and a password of your choice.

## The shape

```json
{
  "<database-alias>": {
    "database": "<actual-db-name>",
    "entities": {
      "<entity-alias>": {
        "table":  "<actual-table-name>",
        "fields": { ... },
        "relations": { ... },
        "context": { ... }
      }
    }
  }
}
```

A single protocol file can declare **many entities, each with its own relations and contexts** — you don't split relations into a separate file.

## A minimal example

```json
{
  "shop": {
    "database": "shop",
    "entities": {
      "users": {
        "table": "users",
        "fields": {
          "id": "id",
          "name": "name",
          "email": "email"
        }
      }
    }
  }
}
```

That's a full, valid protocol. You can already query `shop.users{id, name, email}` against it.

## What lives in each section

| Section | Purpose | More |
|---|---|---|
| `database` | Maps the alias to a real database name | [Entities](./entities.md) |
| `fields` | Maps query field names to real column names | [Fields](./fields.md) |
| `relations` | Declares foreign-key relationships | [Relations](./relations.md) |
| `context` | Declares automatic row-level scoping rules | [Context](./context.md) |

## Why aliases?

Field aliases (`"customerId": "customer_id"`) let you rename a column for query purposes without touching the database. Useful for:

- **Cleaner names** — your DB column is `usr_acct_email_addr`, frontend queries it as `email`.
- **camelCase for JS clients** — `{ "createdAt": "created_at", "isActive": "is_active" }`.
- **Renaming safely** — change the alias, queries still work; no migrations needed.
- **Multi-tenant abstraction** — same protocol, different actual table names per tenant.

## Multiple databases in one protocol

Top-level keys are database aliases:

```json
{
  "shop":   { "database": "shop_db",   "entities": { ... } },
  "billing":{ "database": "billing_db","entities": { ... } }
}
```

You can then issue cross-database queries.

## Where to next

- [Entities](./entities.md) — declare a table
- [Fields](./fields.md) — column mapping
- [Relations](./relations.md) — joins
- [Context](./context.md) — auto-scoping
- [Examples](./examples.md) — full real-world protocols
