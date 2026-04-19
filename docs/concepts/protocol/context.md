---
id: context
title: Context Rules
sidebar_position: 5
---

# Context Rules

`context` is the protocol section that lets you delete your API layer. It declares automatic row-level scoping rules — one per "kind of caller."

## Shape

```json
"<entity>": {
  "context": {
    "<context-name>": "<onql-query-fragment>"
  }
}
```

A context name is whatever string you want — it identifies a type of caller. Common ones: `account`, `admin`, `service`, `support`, `auditor`.

## A simple example

```json
"orders": {
  "context": {
    "account": "shop.orders[user_id = $1]",
    "admin":   "shop.orders"
  }
}
```

When a client sends `shop.orders{id, total}` with `ctxkey: "account"` and `ctxvalues: ["42"]`, ONQL rewrites the query to `shop.orders[user_id = "42"]{id, total}` before running it.

When the same query comes in with `ctxkey: "admin"`, no rewriting happens — admins see everything.

## Multiple parameters

```json
"orders": {
  "context": {
    "account": "shop.orders[user_id = $1 and org_id = $2]"
  }
}
```

Pass them in order:

```json
{ "ctxkey": "account", "ctxvalues": ["42", "acme"] }
```

## Per-relation context

Context rules can also walk relations. This is useful for hierarchical scoping:

```json
"orders": {
  "context": {
    "agency_admin": "shop.agencies[id = $1].customers.orders"
  }
}
```

An agency admin sees orders that belong to customers that belong to *their* agency.

## Multiple contexts on the same entity

You can have as many as you want:

```json
"orders": {
  "context": {
    "account":      "shop.orders[user_id = $1]",
    "admin":        "shop.orders",
    "support":      "shop.orders[org_id = $1]",
    "internal_etl": "shop.orders"
  }
}
```

## What if no context is provided?

If a query comes in without a `ctxkey`, no scoping is applied — the query runs as-written. **Be careful**: this is effectively admin mode. In production you should require a `ctxkey` at the API gateway before letting requests reach ONQL.

## What if the entity has no context block?

The query runs as-written, regardless of `ctxkey`. The protocol author opted out of scoping for that entity.

## Best practices

- **Always set a default-deny stance** at your gateway: reject queries that don't include a `ctxkey`.
- **Test each context** by issuing the same query under different `ctxkey`s and asserting different results.
- **Keep rules simple.** A single `[col = $1]` filter is usually enough. Resist the temptation to make context rules into mini-business-logic.
- **Version your protocol** if context semantics change. Existing clients shouldn't suddenly start seeing different rows.
