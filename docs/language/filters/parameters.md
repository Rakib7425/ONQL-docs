---
id: parameters
title: Parameters
sidebar_position: 4
---

# Parameters

`$1`, `$2`, `$3`, ... are placeholders. They're substituted at query time from the `ctxvalues` array.

## Why use them

- **Safety** — no string concatenation, no injection risk.
- **Reuse** — the same query string with different inputs.
- **Caching** — the parser can cache the parsed plan keyed by the literal query.

## Example

Query:

```
mydb.users[email = $1]
```

Request:

```json
{
  "query": "mydb.users[email = $1]",
  "ctxvalues": ["ada@example.com"]
}
```

## Multiple parameters

```
mydb.orders[user_id = $1 and status = $2]
```

```json
{ "ctxvalues": ["42", "paid"] }
```

Order matters: `$1` is the first array element, `$2` is the second.

## With context rules

Context rules in the protocol use the same `$N` placeholders, but they pull from `ctxvalues` of the **incoming request**, not from the query string. So:

Protocol:
```json
"orders": { "context": { "account": "mydb.orders[user_id = $1]" } }
```

Request:
```json
{ "query": "mydb.orders{id, total}", "ctxkey": "account", "ctxvalues": ["42"] }
```

ONQL combines these into:
```
mydb.orders[user_id = "42"]{id, total}
```
