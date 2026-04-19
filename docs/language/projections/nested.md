---
id: nested
title: Nested Projections
sidebar_position: 2
---

# Nested Projections

A projection key can be more than just a column. It can be a relation walk, an aggregate, or another projection.

## A relation as a key

```
mydb.users{
  id,
  name,
  orders{id, total}
}
```

`orders` is a relation declared in the protocol. Its value is the projection `{id, total}`.

## Nested deeply

```
mydb.users{
  id,
  orders{
    id,
    items{name, qty}
  }
}
```

There's no depth limit other than your protocol's relation graph.

## An aggregate as a key

```
mydb.users{
  id,
  name,
  orders._sum(total)
}
```

The response will have `orders` as the sum, not the array of orders. The key in the JSON output matches the relation name.

## Mixed

```
mydb.users{
  id,
  name,
  orders[status = "paid"]{
    id, total
  },
  reviews._count()
}
```

That's: a filtered relation projection **and** a count aggregate, both attached to the same row.

## Sub-projections that filter and slice

You can apply filters and slices to a relation projection:

```
mydb.users{
  id,
  name,
  orders[status = "paid"]._desc(created_at)[0:5]{id, total}
}
```

Reads: *each user's 5 most recent paid orders*.

## Limits on shape

The output JSON always mirrors the query exactly: keys come from the projection, in the order they appear, with the same nesting. The shape is the contract.
