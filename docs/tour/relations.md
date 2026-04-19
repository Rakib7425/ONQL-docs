---
id: relations
title: Relations
sidebar_position: 4
---

# Relations

Once relations are declared in the protocol, you can walk them inside any projection — at any depth.

## A user with their orders

```
mydb.users{
  id,
  name,
  orders{id, total, status}
}
```

`orders` here isn't a column. It's a relation defined on the `users` entity in the protocol. ONQL fetches the related rows and embeds them in the response.

## Nest as deeply as you like

```
mydb.users{
  id,
  name,
  orders{
    id,
    total,
    items{name, qty, price}
  }
}
```

## Filter inside a relation

You can apply a filter to the related table the same way you would on a top-level table:

```
mydb.users{
  id,
  name,
  orders[status = "paid"]{id, total}
}
```

## Project a single related row

For a one-to-one relation, the result is a single object instead of an array:

```
mydb.users{
  id,
  name,
  profile{avatar_url, bio}
}
```

## Reverse traversal

Walking from the "many" side to the "one" side works exactly the same way:

```
mydb.orders{
  id,
  total,
  user{id, name}
}
```

Whether the underlying relation is `oto`, `otm`, `mto`, or `mtm`, the syntax in your query is identical. The shape of the response (array vs object) follows from the relation type.

## What's next

Time to crunch numbers with [aggregates](./aggregates.md).
