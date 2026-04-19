---
id: many-to-one
title: Many-to-One (mto)
sidebar_position: 3
---

# Many-to-One

A **many-to-one** relation is the reverse of one-to-many. Many rows on this side, one row on the other.

## Example

Many orders belong to one user.

## Protocol

```json
"orders": {
  "relations": {
    "user": {
      "type": "mto",
      "entity": "users",
      "prototable": "users",
      "fkfield": "user_id:id"
    }
  }
}
```

Note the `fkfield` reads in the opposite direction from `otm`: *the order's `user_id` matches the user's `id`.*

## Query

```
mydb.orders{
  id,
  total,
  user{id, name}
}
```

## Response shape

Like `oto`, the related side is a **single object**:

```json
{
  "orders": [
    { "id": 100, "total": 99, "user": { "id": 1, "name": "Ada" } }
  ]
}
```

## When to use it

Use `mto` whenever you want to attach the parent record to each child:

- Order → user
- Comment → post
- Trade → instrument
- Position → account

## Tip

It's normal — and recommended — to declare both `otm` and `mto` for the same relationship from each side. The protocol is symmetrical: the user has `orders` (otm) and the order has `user` (mto).
