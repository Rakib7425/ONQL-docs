---
id: one-to-many
title: One-to-Many (otm)
sidebar_position: 2
---

# One-to-Many

A **one-to-many** relation means a single row on one side has many matching rows on the other.

## Example

A user has many orders.

## Protocol

```json
"users": {
  "relations": {
    "orders": {
      "type": "otm",
      "entity": "orders",
      "prototable": "orders",
      "fkfield": "id:user_id"
    }
  }
}
```

The `fkfield` reads as: *the user's `id` matches the order's `user_id`.*

## Query

```
mydb.users{
  id,
  name,
  orders{id, total, status}
}
```

## Response shape

For `otm`, the related side is an **array**:

```json
{
  "users": [
    {
      "id": 1,
      "name": "Ada",
      "orders": [
        { "id": 100, "total": 99, "status": "paid" },
        { "id": 101, "total": 12, "status": "open" }
      ]
    }
  ]
}
```

If a user has no orders, the array is empty (`[]`), not `null`.

## Filtering inside the relation

You can apply a filter or sort to the related table:

```
mydb.users{
  id,
  orders[status = "paid"]._desc(created_at)[0:5]{id, total}
}
```

This returns *each user's 5 most-recent paid orders*.

## When to use it

- User → orders
- Author → posts
- Album → songs
- Account → transactions
