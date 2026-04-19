---
id: many-to-many
title: Many-to-Many (mtm)
sidebar_position: 4
---

# Many-to-Many

A **many-to-many** relation joins two tables through a third one — the **junction table**.

## Example

Products belong to many categories. Categories contain many products. The junction table is `product_categories`.

## Protocol

```json
"products": {
  "relations": {
    "categories": {
      "type":       "mtm",
      "entity":     "categories",
      "prototable": "categories",
      "through":    "product_categories",
      "fkfield":    "id:product_id:category_id:id"
    }
  }
}
```

The `fkfield` is four-part:

| Position | Meaning |
|---|---|
| 1 | Local table column joining to the junction table |
| 2 | Junction column matching the local row |
| 3 | Junction column matching the remote row |
| 4 | Remote table column joined from the junction |

So this reads as:
*products.id ↔ product_categories.product_id, then product_categories.category_id ↔ categories.id*.

## Query

```
mydb.products{
  id,
  name,
  categories{name}
}
```

## Response shape

Like `otm`, the related side is an **array**:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Phone",
      "categories": [
        { "name": "Electronics" },
        { "name": "Mobile" }
      ]
    }
  ]
}
```

## When to use it

- Products ↔ categories
- Students ↔ courses
- Posts ↔ tags
- Users ↔ roles

## Note on the junction table

The junction table just needs to exist with the two foreign-key columns. ONQL doesn't care if it has extra columns (e.g. `created_at`, `added_by`) — they're invisible unless you declare a separate entity for the junction itself.
