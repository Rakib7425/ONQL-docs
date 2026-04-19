---
id: context
title: Context — the killer feature
sidebar_position: 6
---

# Context — the killer feature

This is the page where ONQL stops being "a query language" and starts being "you can delete your API layer."

## The problem

Every backend has the same code, repeated over and over:

```sql
SELECT * FROM orders WHERE user_id = $current_user_id
```

You write that `WHERE user_id = ?` line in dozens of endpoints. You wrap each one in an auth middleware. You hope you don't forget one in a new feature.

## The ONQL solution

You write the scoping rule **once**, in the protocol:

```json
{
  "orders": {
    "context": {
      "account": "mydb.orders[user_id = $1]",
      "admin":   "mydb.orders"
    }
  }
}
```

Now any client can issue a plain query:

```
mydb.orders{id, total, status}
```

And ONQL will silently rewrite it depending on the caller:

| Caller `ctxkey` | What ONQL actually runs |
|---|---|
| `account` (with `ctxvalues = ["42"]`) | `mydb.orders[user_id = "42"]{id, total, status}` |
| `admin` | `mydb.orders{id, total, status}` |

The frontend doesn't know — and doesn't need to know — that scoping happened.

## Multiple contexts on the same entity

You can declare as many contexts as you want:

```json
"orders": {
  "context": {
    "account":      "mydb.orders[user_id = $1]",
    "admin":        "mydb.orders",
    "support_agent": "mydb.orders[org_id = $1]",
    "auditor":      "mydb.orders._unique(user_id)"
  }
}
```

Each call passes a `ctxkey` and `ctxvalues`. ONQL picks the matching rule.

## Parameters in context rules

The `$1`, `$2`, ... placeholders in a context rule are substituted from `ctxvalues` at query time. You can pass multiple values:

```json
"context": {
  "account": "mydb.orders[user_id = $1 and org_id = $2]"
}
```

```json
{
  "ctxkey": "account",
  "ctxvalues": ["42", "acme"]
}
```

## Why this matters

Once your protocol's context rules are correct, **every query in your app is automatically scoped**. You can't accidentally leak another user's data because there's no place in your code where the scoping is missing — there's no code at all.

## What's next

You've finished the tour. From here:

- [Cookbook → Dashboards](../cookbook/dashboards.md) — recipes for real screens
- [Concepts → Protocol](../concepts/protocol/overview.md) — write a protocol from scratch
- [Reference → Cheat Sheet](../reference/cheatsheet.md) — every operator on one page
