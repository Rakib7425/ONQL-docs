---
id: update
title: Update
sidebar_position: 2
---

# Update

`update` changes fields on rows that match a filter. Like `insert`, it's
a dedicated protocol verb — not an ONQL query — but the `query` field
inside an update payload *is* an ONQL filter expression, so everything
you know from the [filters chapter](/language/filters/operators) applies.

## Wire payload

```json
{
  "db": "mydb",
  "table": "users",
  "records": { "status": "active", "last_login": "2026-04-19T10:00:00Z" },
  "query": "id = 42",
  "protopass": "default"
}
```

| Field | Meaning |
|---|---|
| `db` / `table` | Target database and table |
| `records` | Object of columns to set on matched rows |
| `query` | ONQL filter expression — same grammar as inside `[...]` in a read query |
| `protopass` | Protocol identifier |

Only rows matching `query` are touched. An empty `query` is rejected to
prevent accidental table-wide updates — pass a deliberately-broad filter
like `id > 0` if you really mean it.

## Shell

The shell accepts either a raw JSON payload or a shorthand:

```
# Shorthand — <db>.<table> <records-json> on <filter>
onql> update mydb.users {"status":"active"} on id = 42

# Raw JSON — equivalent
onql> update {"db":"mydb","table":"users","records":{"status":"active"},"query":"id = 42"}
```

The shorthand splits on the first space (for `db.table`) and on ` on `
(for the filter). Use raw JSON if your filter itself contains the
literal ` on ` substring.

## Filter grammar

`query` uses the same expressions as read-query filters:

```
status = "pending" and created_at < "2026-01-01"
```

```
country in ["IN","US","DE"] or vip = true
```

See [Language → Filters → Operators](/language/filters/operators) for the
full operator list, and [Parameters](/language/filters/parameters) for
using `$1`, `$2` substitutions (driver-side) instead of inlining values.

## From a driver

```python
# Python
client.update(
    db="mydb", table="users",
    records={"status": "active"},
    query="id = 42",
)
```

```ts
// Node
await client.update({
  db: 'mydb', table: 'users',
  records: { status: 'active' },
  query: 'id = 42',
});
```

## Response

Returns the updated row(s), or `{"error": "..."}` on failure. If the
filter matches zero rows the response is an empty array — not an error.

:::caution Idempotency
`update` is idempotent on the field set, but **not** on side effects:
re-running the same update will re-trigger any `on_update` protocol
hooks, bump `updated_at` timestamps, etc. If you need exactly-once
semantics, gate on a condition column (e.g. `status = "pending"`) so the
second run matches zero rows.
:::
