---
id: one-to-one
title: One-to-One (oto)
sidebar_position: 1
---

# One-to-One

A **one-to-one** relation means each row on one side has at most one matching row on the other side.

## Example

A user has one profile.

## Protocol

```json
"users": {
  "relations": {
    "profile": {
      "type": "oto",
      "entity": "profiles",
      "prototable": "profiles",
      "fkfield": "id:user_id"
    }
  }
}
```

## Query

```
mydb.users{
  id,
  name,
  profile{avatar_url, bio}
}
```

## Response shape

For `oto`, the related side is a **single object**, not an array:

```json
{
  "users": [
    { "id": 1, "name": "Ada", "profile": { "avatar_url": "...", "bio": "..." } }
  ]
}
```

If no matching row exists, `profile` is `null`.

## When to use it

- A user → profile (1 user, 1 profile)
- An order → invoice (1 order, 1 invoice)
- A vehicle → registration

If the related row could legitimately be missing, you'll see `null`. Plan for it on the frontend.
