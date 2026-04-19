---
id: delete
title: Delete
sidebar_position: 3
---

# Delete

`delete` removes rows matching a filter. Same shape as [update](./update.md),
minus the `records` field.

## Wire payload

```json
{
  "db": "mydb",
  "table": "users",
  "query": "id = 42",
  "protopass": "default"
}
```

| Field | Meaning |
|---|---|
| `db` / `table` | Target database and table |
| `query` | ONQL filter expression selecting rows to remove |
| `protopass` | Protocol identifier |

`query` is required. An empty or missing filter is rejected — if you
really want to empty a table, pass a tautology like `id > 0`, or use
`schema drop table` to remove the table entirely.

## Shell

```
onql> delete {"db":"mydb","table":"users","query":"id = 42"}
```

The shell does not currently ship a shorthand for `delete`; the payload
is sent as raw JSON. A common pattern is to first run a `read` to
preview the rows:

```
onql> mydb.users[status = "archived" and updated_at < "2025-01-01"]{id, name}
```

...then reuse the same filter in the delete:

```
onql> delete {"db":"mydb","table":"users","query":"status = \"archived\" and updated_at < \"2025-01-01\""}
```

## From a driver

```python
# Python
client.delete(db="mydb", table="users", query="id = 42")
```

```ts
// Node
await client.delete({ db: 'mydb', table: 'users', query: 'id = 42' });
```

## Response

Returns the rows that were removed (so you can log them, push to an
audit trail, etc.), or `{"error": "..."}` on failure.

:::danger No soft-delete by default
`delete` is a hard remove. If you need soft-deletes, add a `deleted_at`
column to your schema and `update` it instead; then scope reads with a
context rule like `shop.users[deleted_at = null]`. See
[Concepts → Auth & Context](/concepts/auth-and-context).
:::

## Bulk delete

Filters compose with boolean logic — there's no separate "bulk delete"
call. To remove a set of rows, widen the filter:

```json
{ "db": "mydb", "table": "sessions", "query": "expires_at < \"2026-01-01\"" }
```

This still runs as a single request and returns all removed rows.
