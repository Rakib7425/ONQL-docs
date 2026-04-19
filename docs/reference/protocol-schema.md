---
id: protocol-schema
title: Protocol Schema
sidebar_position: 4
---

# Protocol Schema

The full JSON schema of a protocol file, with every key explained.

## Top level

```json
{
  "<database-alias>": {
    "database": "<actual-db-name>",
    "entities": {
      "<entity-alias>": { ... }
    }
  }
}
```

| Key | Type | Required | Purpose |
|---|---|---|---|
| `<database-alias>` | object | yes | Top-level key. The name you'll use in queries. |
| `database` | string | yes | Actual database name in storage |
| `entities` | object | yes | Map of entity-alias → entity definition |

## Entity

```json
{
  "table": "<actual-table-name>",
  "fields": { "<query-name>": "<column-name>", ... },
  "relations": { "<relation-name>": { ... }, ... },
  "context":   { "<context-name>": "<onql-fragment>", ... }
}
```

| Key | Type | Required | Purpose |
|---|---|---|---|
| `table` | string | yes | Actual table name |
| `fields` | object | yes | Column mapping |
| `relations` | object | no | FK relationships |
| `context` | object | no | Auto-scoping rules |

## Relation

```json
{
  "type":       "oto | otm | mto | mtm",
  "entity":     "<target-entity>",
  "prototable": "<target-entity>",
  "fkfield":    "<fk-spec>",
  "through":    "<junction-table>"
}
```

| Key | Type | Required | Purpose |
|---|---|---|---|
| `type` | enum | yes | One of `oto`, `otm`, `mto`, `mtm` |
| `entity` | string | yes | Target entity alias |
| `prototable` | string | yes | Target entity alias (same as `entity` in 99% of cases) |
| `fkfield` | string | yes | Foreign key spec |
| `through` | string | only `mtm` | Junction table |

## fkfield format

| Type | Format |
|---|---|
| `oto`, `mto` | `local_col:remote_col` |
| `otm` | `local_col:remote_col` |
| `mtm` | `local:through_local:through_remote:remote` |

## Context

```json
{
  "<context-name>": "<onql-query-fragment>"
}
```

The fragment is a regular ONQL query (without a projection) that returns the rows visible to that context. Use `$1`, `$2`, ... for parameters.

## Example — full file

```json
{
  "blog": {
    "database": "blog",
    "entities": {
      "posts": {
        "table": "posts",
        "fields": { "id": "id", "title": "title", "body": "body", "author_id": "author_id" },
        "relations": {
          "author": { "type": "mto", "entity": "users", "prototable": "users", "fkfield": "author_id:id" }
        },
        "context": {
          "public": "blog.posts[published_at != null]",
          "admin":  "blog.posts"
        }
      },
      "users": {
        "table": "users",
        "fields": { "id": "id", "name": "name", "email": "email" }
      }
    }
  }
}
```
