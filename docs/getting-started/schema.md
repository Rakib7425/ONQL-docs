---
id: schema
title: Schema & Migrations
sidebar_position: 2
---

# Schema & Migrations

Before you can query, ONQL needs to know what your tables and columns look like. Unlike SQL databases where schema is imperative (`CREATE TABLE`, `ALTER TABLE` …), ONQL uses a **declarative JSON schema**. You describe the shape you want — ONQL diffs it against what's on disk and applies the changes.

Think of it as Terraform for your database.

:::info How the shell works
Every command starts with a **program name** — `schema`, `protocol`, `onql`, `insert`, `update`, `delete`, `export`, `import`, or `stats`. These map to handlers on the server. You can type the program each time at the `>` prompt, or `use <program>` once to drop the prefix:

```
> schema tables shop

> use schema
schema> tables shop
schema> set shop.schema.json
schema> out
> 
```

`out` leaves the mode; `exit` quits; `clear` redraws the banner.

All examples on this page are shown inside `use schema` mode for brevity.
:::

## The core idea

You send a JSON document with `schema set`. ONQL will:

1. **Create** databases and tables that don't exist
2. **Add** columns that appear in the schema but aren't in storage
3. **Modify** columns where type, default, formatter, or validator changed
4. **Drop** columns no longer present (except the primary key)
5. **Drop** tables no longer present

Run `schema set` on every deploy. If nothing changed, nothing happens. If you added a column, it gets added. That's your migration.

## A minimal example — shop

Save this as `shop.schema.json`:

```json
{
  "shop": {
    "customers": {
      "id":         { "type": "string",    "default": "$UUID", "validator": "required" },
      "name":       { "type": "string",    "default": "",       "validator": "required" },
      "email":      { "type": "string",    "default": "",       "validator": "required" },
      "created_at": { "type": "timestamp", "default": "",       "validator": "required" }
    },
    "products": {
      "id":         { "type": "string", "default": "$UUID", "validator": "required" },
      "name":       { "type": "string", "default": "",      "validator": "required" },
      "price":      { "type": "number", "default": "0",     "formatter": "decimal:2", "validator": "required" },
      "stock":      { "type": "number", "default": "0",     "validator": "required" },
      "metadata":   { "type": "json",   "default": "{}",    "validator": "required" }
    },
    "orders": {
      "id":          { "type": "string",    "default": "$UUID", "validator": "required" },
      "customer_id": { "type": "string",    "default": "",       "validator": "required" },
      "total":       { "type": "number",    "default": "0",      "formatter": "decimal:2", "validator": "required" },
      "status":      { "type": "string",    "default": "pending","validator": "required" },
      "placed_at":   { "type": "timestamp", "default": "",       "validator": "required" }
    },
    "order_items": {
      "id":         { "type": "string", "default": "$UUID", "validator": "required" },
      "order_id":   { "type": "string", "default": "",      "validator": "required" },
      "product_id": { "type": "string", "default": "",      "validator": "required" },
      "qty":        { "type": "number", "default": "1",     "validator": "required" },
      "price":      { "type": "number", "default": "0",     "formatter": "decimal:2", "validator": "required" }
    }
  }
}
```

Apply it:

```
> use schema
schema> set shop.schema.json
"success"
```

The `shop` database and all four tables now exist.

:::tip You can query immediately
The server auto-maintains a protocol called **`default`** that mirrors your schema 1:1. After `schema set`, you can already run `shop.customers{...}` without writing a protocol file. See [Your First Query](./first-query.md) for both paths.
:::

## Column properties

| Property | Purpose | Example |
|---|---|---|
| `type` | Data type — `string`, `number`, `timestamp`, `json` | `"number"` |
| `default` | Default value when not provided at insert time | `"0"`, `"$UUID"`, `"$EMPTY"` |
| `validator` | Pipe-separated validation rules | `"required\|min:3"` |
| `formatter` | Pipe-separated formatting rules | `"decimal:2"`, `"trim\|lower"` |
| `blank` | When `"no"`, field is implicitly required | `"no"` |

### Magic defaults

| Value | Meaning |
|---|---|
| `"$UUID"` | Generate a new UUID at insert |
| `"$EMPTY"` | Literal empty string |
| `""` | Unset — insert must provide a value (if `required`) |

### Validators

Laravel-style, pipe-separated. Examples:

- `"required"` — field must be present
- `"required|min:3"` — present and at least 3 chars/value
- `"required|email"` — must look like an email

### Formatters

Applied on every write. Examples:

- `"decimal:2"` — round to 2 decimals
- `"trim"` — strip whitespace
- `"upper"` / `"lower"` — case normalization
- `"trim|lower"` — chain them

## Evolving a schema

You don't write migrations. You just edit the JSON and re-run `schema set`.

**Adding a column** — add it to the JSON, re-apply. ONQL adds the column with the default backfilled.

```diff
 "products": {
   "id":    { "type": "string", "default": "$UUID", "validator": "required" },
   "name":  { "type": "string", "default": "",      "validator": "required" },
+  "sku":   { "type": "string", "default": "",      "validator": "" },
   "price": { "type": "number", "default": "0",     "formatter": "decimal:2", "validator": "required" }
 }
```

```
schema> set shop.schema.json
```

**Removing a column** — delete it from the JSON, re-apply. ONQL drops the column (except the PK).

**Renaming a table or column** — use the explicit `rename` command, since `set` would interpret a rename as drop + add and lose the data:

```
schema> rename table shop customers users
```

**Dropping a table** — remove it from the JSON, re-apply.

## All schema commands

`set` is the "apply-everything" command. Targeted commands are also available:

| Command | Purpose |
|---|---|
| `databases` | List all databases |
| `tables <db>` | List all tables in a database |
| `desc <db> <table>` | Show a table's columns |
| `create db <name>` | Create a single database |
| `create table <db> <table> (col,type,storage,blank,default)(...)` | Create a single table inline |
| `alter <db> <table> <json>` | Add/modify/drop a single column |
| `rename db <old> <new>` | Rename a database |
| `rename table <db> <old> <new>` | Rename a table |
| `drop db <name>` | Drop a database |
| `drop table <db> <table>` | Drop a table |
| `set <file.json>` | Apply a full declarative schema (migration) |
| `refresh-indexes` | Rebuild all indexes |

See [Reference → Protocol Schema](../reference/protocol-schema.md) for the **protocol** (not to be confused with the database schema). The schema defines *storage*; the protocol defines *queries*.

## Recommended workflow

1. Keep `shop.schema.json` in your repo.
2. On every deploy, run `schema set shop.schema.json`.
3. Commit the JSON — the diff in version control **is** your migration history.
4. In staging, always re-apply and check logs before production.

## Next steps

- [Your first query](./first-query.md) — now that tables exist, define a protocol and query them.
- [Configuration](./configuration.md)
