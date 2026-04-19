---
id: intro
title: Introduction
slug: /intro
sidebar_position: 1
---

# Welcome to ONQL

**ONQL** stands for **Object Notation Query Language**. It's a context-aware query language that lets you describe the shape of the data you want — and skips the API layer entirely.

```
shop.orders[status = "paid"]{
  id, total, placed_at,
  customer{name, email},
  items{product{name}, qty, price}
}
```

That single query is a SELECT, four JOINs, an authorization rule, and a JSON serializer — all in one expression. It can be sent **directly from your frontend**.

---

## Why ONQL exists

Most backends spend 60% of their engineering time writing the same code:

1. Receive an HTTP request.
2. Authenticate the caller.
3. Build a SQL query that joins three tables.
4. Filter by `user_id` so people only see their own data.
5. Serialize the result into JSON.
6. Repeat for the next screen.

ONQL deletes that loop. You define your tables, relationships, and authorization rules **once** in a small protocol file, and any client can issue queries directly. The query language understands joins, paging, sorting, aggregates, and — uniquely — **context-aware row scoping**.

---

## What makes it different

- **Shape-first.** Your query and your response have the same structure.
- **Context-aware.** Same query → different rows depending on who is asking. No middleware required.
- **Zero glue code.** One protocol file replaces an entire BFF / API layer.
- **Declarative JSON migrations.** Describe the schema you want; ONQL diffs and applies it. No `CREATE TABLE`, no migration files.
- **Built on BadgerDB.** Embedded LSM-tree storage with reverse indexes on every column. RAM buffering, async disk persistence, single binary.
- **Open source.** Apache 2.0.

---

## Where to go next

| If you want to… | Read this |
|---|---|
| Run ONQL on your machine | [Getting Started → Installation](./getting-started/installation.md) |
| Define tables without writing SQL | [Getting Started → Schema & Migrations](./getting-started/schema.md) |
| Learn the language in 5 minutes | [Tour → Basics](./tour/basics.md) |
| See real production-style queries | [Cookbook → Dashboards](./cookbook/dashboards.md) |
| Look up an operator or function | [Reference → Cheat Sheet](./reference/cheatsheet.md) |
| Understand how queries are executed | [Concepts → Query Execution](./concepts/query-execution/parser.md) |

---

## A note on the name

> A query should look like the JSON you want back. No SELECTs, no JOINs, no boilerplate — just the shape of your data.

```
users{id, name, orders{total}}
```

```json
{
  "users": [
    { "id": 1, "name": "Ada", "orders": [{ "total": 99 }] }
  ]
}
```

Query in. JSON out. Same shape. That's ONQL.
