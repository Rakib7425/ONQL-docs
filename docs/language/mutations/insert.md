---
id: insert
title: Insert
sidebar_position: 1
---

# Insert

`insert` writes one or more records into a table. It's not part of the
query language — queries (`onql ...`) are read-only. Instead, `insert`
is its own protocol verb, so the wire payload and shell syntax both
look different from a read.

## Wire payload

```json
{
  "db": "mydb",
  "table": "users",
  "records": { "name": "Ada", "age": 36 },
  "protopass": "default"
}
```

| Field | Meaning |
|---|---|
| `db` | Target database |
| `table` | Target table |
| `records` | A single object (insert one) or an array of objects (bulk insert) |
| `protopass` | Protocol identifier. Use `"default"` for the auto-generated one |

The verb sent is `insert` (not `onql`) — see
[Protocol → Overview](/concepts/protocol/overview) for how verbs are framed.

## Shell — single record

In the [ONQL shell](/reference/shell), `insert` takes a raw JSON payload:

```
onql> insert {"db":"mydb","table":"users","records":{"name":"Ada","age":36}}
```

Columns missing from `records` fall back to the column `default` defined
in the schema (see [Getting Started → Schema](/getting-started/schema)).
Blank-`no` columns without a default will reject the insert.

## Shell — bulk insert from a file

For loading many records, point the shell at a JSON file whose top level
is an array of objects:

```
onql> insert file data/users.json mydb users
```

Syntax is `insert file <filepath> <dbname> <tablename>`. The shell sends
one `insert` request per record and prints a running OK / Error tally:

```
Inserting 250 records into 'mydb.users'...
  [1/250] OK: Ada
  [2/250] OK: Grace
  ...
Done. 248 inserted, 2 failed.
```

This is the recommended path for seeding a fresh database. Each record
is independent — a failure on row 42 does not roll back the previous 41.

## From a driver

Every [official driver](/drivers) exposes an `insert` (or `insertOne` /
`insert_many`) method that mirrors the wire payload one-to-one. Example
shapes:

```python
# Python
client.insert(db="mydb", table="users", records={"name": "Ada", "age": 36})
```

```go
// Go
client.Insert(client.InsertRequest{
    DB: "mydb", Table: "users",
    Records: map[string]any{"name": "Ada", "age": 36},
})
```

```ts
// Node
await client.insert({ db: 'mydb', table: 'users', records: { name: 'Ada', age: 36 } });
```

Consult each driver page under [Drivers](/drivers) for the exact signature.

## Response

A successful insert returns the newly created row(s) including any
server-assigned fields (IDs, timestamps). A failure returns
`{"error": "<message>"}`.

:::tip Bulk inserts and reverse indexes
ONQL builds a reverse index on every column. Bulk inserts update those
indexes incrementally — you don't need to "rebuild" anything. If you
inserted with indexes temporarily disabled (advanced), run
`schema refresh-indexes` from the shell to catch up.
:::
