---
id: row-access
title: Row Access
sidebar_position: 5
---

# Row Access

A bare integer in `[ ]` fetches a single row by index. Unlike a slice, the result is a single object, not an array.

## Examples

```
mydb.users[0]    // first row
mydb.users[5]    // sixth row
mydb.users[-1]   // last row
```

## Out-of-range is safe

If the index points past the end of the data, the value is `null`. ONQL won't throw.

```
mydb.users[9999]   // null on a 50-row table
```

## Inside a relation

```
mydb.users{
  name,
  orders[0]{id, total}
}
```

Returns each user's first order — a single object.

## Use with care

Row access is convenient but rarely what you want in a real app. Prefer:

- A filter (`[id = $1]`) when you know the key.
- A slice (`[0:1]`) when you really mean "any one row" and want it in array form.

Row access is mostly useful when you've already sorted with `_asc` or `_desc` and want the literal first or last row of that ordering.
