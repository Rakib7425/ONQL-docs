---
id: first-query
title: Your First Query
sidebar_position: 3
---

# Your First Query

You have two paths here:

1. **Query straight away** using the auto-generated `default` protocol (30 seconds, no protocol file needed).
2. **Write a protocol file** once you want aliases, relations, or context-based auth.

Both assume you've already [defined your schema](./schema.md).

## Path 1 — Query with the `default` protocol

The server keeps a built-in protocol named **`default`** (password: `"default"`) in sync with your schema. Every table is an entity, every column is a field — no relations, no contexts, no aliases. Read-only: it updates itself every time you change the schema.

Insert a row:

```
> use insert
insert> {"db":"shop","table":"customers","records":{"name":"Ada","email":"ada@example.com"}}
insert> out
> 
```

Now query it:

```
> use onql
onql> password
enter protocol password :- default
onql> shop.customers{id, name, email}
```

Response:

```json
[
  { "id": "…", "name": "Ada", "email": "ada@example.com" }
]
```

That's it — no protocol file written. This is great for exploration, internal tools, or services that only need raw reads.

## Path 2 — Write a protocol for aliases, relations, contexts

When you need to go beyond raw reads — clean field names for frontend clients, nested joins, or row-level scoping — write a protocol file. One file can declare many entities, each with its own relations and contexts.

### Create `mydb.protocol.json`

```json
{
  "mydb": {
    "database": "shop",
    "entities": {
      "customers": {
        "table": "customers",
        "fields": {
          "id": "id",
          "name": "name",
          "email": "email",
          "createdAt": "created_at"
        },
        "relations": {
          "orders": { "type": "otm", "entity": "orders", "prototable": "orders", "fkfield": "id:customer_id" }
        },
        "context": {
          "account": "mydb.customers[id = $1]",
          "admin":   "mydb.customers"
        }
      },
      "orders": {
        "table": "orders",
        "fields": {
          "id": "id",
          "customerId": "customer_id",
          "total": "total",
          "status": "status",
          "placedAt": "placed_at"
        }
      }
    }
  }
}
```

Two things to notice:

- **camelCase aliases** — `createdAt`, `customerId`, `placedAt` map to the underlying snake_case columns. Frontend devs never see the storage names.
- **Multiple entities, one file** — relations and contexts live on each entity. No separate files.

### Register it

```
> use protocol
protocol> set mydb.protocol.json
Enter password: mypassword
protocol> out
> 
```

The password you enter becomes the protocol's identifier. Pick anything — `mypassword`, a UUID, a per-environment secret. Queries reference it as `protopass`.

### Query it

```
> use onql
onql> password
enter protocol password :- mypassword
onql> context
enter context key :- account
enter context values ',' saparated :- <customer-id>
onql> mydb.customers{name, email, orders{total, status}}
```

Response:

```json
[
  {
    "name": "Ada",
    "email": "ada@example.com",
    "orders": [{ "total": 99.00, "status": "paid" }]
  }
]
```

The query was auto-scoped to this one customer because of the `account` context rule — no `WHERE customer_id = ...` in the query itself.

## Multiple protocol files

Nothing stops you from registering several — one per app, one per team, one per API version. Each is registered under its own password and lives independently:

```
protocol> set mobile.protocol.json     # password: mobile_app
protocol> set admin.protocol.json      # password: admin_panel
protocol> set partner-api.protocol.json # password: partner_v1
```

The `default` protocol is always present alongside your custom ones.

## Next steps

- [Take the 5-minute Tour](../tour/basics.md)
- [Protocol concepts in depth](../concepts/protocol/overview.md)
- [Configuration options](./configuration.md)
- [Client libraries](./client-libraries.md)
