---
id: relations
title: Relations
sidebar_position: 4
---

# Relations

The `relations` block declares foreign-key relationships between entities. Once declared, you can walk them in any query at any depth.

## Shape

```json
"users": {
  "relations": {
    "<relation-name>": {
      "type":      "oto | otm | mto | mtm",
      "entity":    "<target-entity>",
      "prototable":"<target-entity>",
      "fkfield":   "<foreign-key-spec>",
      "through":   "<junction-table>"
    }
  }
}
```

| Field | Required | Purpose |
|---|---|---|
| `type` | yes | Relationship type — see [Relationships](../relationships/one-to-one.md) |
| `entity` | yes | Target entity (the "other side") |
| `prototable` | yes | Target proto-table name (usually same as `entity`) |
| `fkfield` | yes | Foreign key spec — format depends on `type` |
| `through` | only `mtm` | Junction table for many-to-many |

## fkfield format

| Type | Format | Example |
|---|---|---|
| `oto`, `mto` | `local_col:remote_col` | `"user_id:id"` |
| `otm` | `local_col:remote_col` | `"id:user_id"` |
| `mtm` | `local_col:through_local:through_remote:remote_col` | `"id:user_id:product_id:id"` |

## Examples

### One user → many orders

```json
"users": {
  "relations": {
    "orders": {
      "type":       "otm",
      "entity":     "orders",
      "prototable": "orders",
      "fkfield":    "id:user_id"
    }
  }
}
```

### One order → one user (reverse)

```json
"orders": {
  "relations": {
    "user": {
      "type":       "mto",
      "entity":     "users",
      "prototable": "users",
      "fkfield":    "user_id:id"
    }
  }
}
```

### Many products ↔ many categories

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

The `fkfield` here reads as: *the local table's `id` column joins to the through table's `product_id` column; the through table's `category_id` column joins to the remote table's `id` column.*

## Naming relations

Relation names live in the same namespace as field names within an entity. Pick names that don't collide. If you have a `currency` column **and** a `currency` relation, ONQL will resolve to the relation in projection contexts. Avoid the conflict by renaming one.
