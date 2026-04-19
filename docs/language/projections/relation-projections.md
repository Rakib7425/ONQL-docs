---
id: relation-projections
title: Relation Projections
sidebar_position: 3
---

# Relation Projections

When you put a relation name inside a projection, ONQL embeds the related rows. The shape of the embedded value depends on the relation type.

## otm and mtm → array

```
mydb.users{name, orders{id, total}}
```

```json
{
  "users": [
    { "name": "Ada", "orders": [{ "id": 1, "total": 99 }] }
  ]
}
```

## oto and mto → object

```
mydb.users{name, profile{bio}}
```

```json
{
  "users": [
    { "name": "Ada", "profile": { "bio": "..." } }
  ]
}
```

If the related row doesn't exist, the value is `null`.

## Filtering inside

```
mydb.users{name, orders[status = "paid"]{id, total}}
```

The filter applies *inside* each user's orders.

## Sorting inside

```
mydb.users{name, orders._desc(created_at)[0:5]{id, total}}
```

Each user gets their 5 most recent orders.

## Aggregating inside

```
mydb.users{name, orders._sum(total)}
```

`orders` becomes the sum, not the array.

## Aliases? No.

ONQL doesn't currently rename projection keys. The key in the output is always the relation or column name from the protocol. If you need a different name, define a second entity in the protocol with the alias you want.
