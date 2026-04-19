---
id: shell
title: Shell Commands
sidebar_position: 2
---

# Shell Commands

The [`onql-shell`](https://github.com/ONQL/onql-shell-client) is an
interactive Python client for talking to an ONQL server. Everything
below is a command you can type at the `onql>` prompt.

## Session basics

| Command | Purpose |
|---|---|
| `use <keyword>` | Set an active verb so you can omit it on every line (e.g. after `use onql`, you type queries directly) |
| `out` | Clear the active keyword |
| `clear` | Clear the console |
| `exit` | Quit the shell |

## Data — read

| Command | Purpose |
|---|---|
| `onql <query>` | Run an ONQL read query (see [Language](/language/syntax)) |
| `onql password` | Prompt for the protocol password for this session |
| `onql context` | Prompt for the context key + values for this session |

Example:

```
onql> onql password
enter protocol password :- ********
onql> onql shop.orders[status = "paid"]{id, total}
```

## Data — mutations

| Command | Purpose | Reference |
|---|---|---|
| `insert <json>` | Insert a single record | [Insert](/language/mutations/insert) |
| `insert file <path> <db> <table>` | Bulk-insert every object in a JSON array file | [Insert](/language/mutations/insert) |
| `update <db>.<table> <records-json> on <filter>` | Update matching rows (shorthand) | [Update](/language/mutations/update) |
| `update <json>` | Update via raw JSON payload | [Update](/language/mutations/update) |
| `delete <json>` | Delete rows matching a filter | [Delete](/language/mutations/delete) |

Examples:

```
onql> insert {"db":"mydb","table":"users","records":{"name":"Ada","age":36}}
onql> insert file data/users.json mydb users
onql> update mydb.users {"status":"active"} on id = 42
onql> delete {"db":"mydb","table":"users","query":"id = 42"}
```

## Schema

| Command | Purpose |
|---|---|
| `schema databases` | List all databases |
| `schema tables <db>` | List tables in a database |
| `schema desc <db> <table>` | Describe a table's columns |
| `schema create db <db>` | Create a database |
| `schema create table <db> <table> (col,type,storage,blank,default)...` | Create a table |
| `schema rename db <old> <new>` | Rename a database |
| `schema rename table <db> <old> <new>` | Rename a table |
| `schema alter <db> <table> <op-json>` | Alter a table (add/drop/rename columns) |
| `schema drop db <db>` | Drop a database |
| `schema drop table <db> <table>` | Drop a table |
| `schema set <json_file>` | Apply a full schema file (declarative migration) |
| `schema refresh-indexes` | Rebuild reverse indexes |

Column tuple layout for `create table`:

```
(name,string,disk,no,"")
 │    │     │    │  └── default value (empty string = none)
 │    │     │    └───── blank allowed: yes | no
 │    │     └────────── storage: disk | ram
 │    └──────────────── type: string | number | bool | date | ...
 └───────────────────── column name
```

Example:

```
onql> schema create table shop orders (id,number,disk,no,"") (total,number,disk,no,0) (status,string,disk,no,"pending")
```

## Protocol

| Command | Purpose |
|---|---|
| `protocol desc` | Describe the active protocol |
| `protocol set <json_file>` | Replace the protocol from a JSON file |
| `protocol drop <db> <table>` | Remove a table's protocol entry |

See [Concepts → Protocol](/concepts/protocol/overview) for what the
protocol file controls (auth, context rules, relation wiring).

## Stats

| Command | Purpose |
|---|---|
| `stats` | Current system stats (connections, memory, active queries, goroutines) |
| `stats queries [limit]` | Recent query history (default 100) |
| `stats summary` | Aggregated stats — total, errors, slowest, heaviest, by target |
| `stats clear` | Clear query history |

Use `stats summary` to quickly find slow queries; use `stats queries` to
see the raw last-N log.

## Import / Export

| Command | Purpose |
|---|---|
| `export all [filename]` | Export every database |
| `export db <db> [filename]` | Export one database |
| `export table <db> <table> [filename]` | Export one table |
| `import <filename> [table <table>]` | Import from an export file |

Export files are plain JSON and round-trip through `import`. For
seeding from scratch (no matching schema yet), prefer
`insert file ...` — it doesn't assume column layout.

## Tip — session shortcut

`use <verb>` is the single biggest ergonomic win. After:

```
onql> use onql
onql> shop.orders[status = "paid"]{id, total}
onql> shop.customers._count()
onql> out
onql> insert {"db":"shop","table":"...","records":{...}}
```

...you don't retype `onql` on every read. Run `out` to drop the prefix
when you switch verbs.
