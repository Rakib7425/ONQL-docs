---
id: slicing-paging
title: Slicing & Paging
sidebar_position: 3
---

# Slicing & Paging

ONQL borrows Python's slice syntax for paging through results.

## First N rows

```
mydb.users[0:20]
```

Returns the first 20 rows.

## A page of rows

```
mydb.users[20:40]
```

Rows 20 through 39 — the second page when page size is 20.

## Open-ended slices

```
mydb.users[:5]    // first 5 rows (start defaults to 0)
mydb.users[10:]   // from row 10 to the end
```

## Negative indices

```
mydb.users[-10:]  // last 10 rows
mydb.users[-1]    // very last row
```

## Single row access

A bare integer fetches one row by index (zero-based):

```
mydb.users[0]     // the first row
mydb.users[5]     // the sixth row
```

## Sliced + filtered + projected

You can chain everything together:

```
mydb.users[country = "IN"][0:20]{id, name, email}
```

Reads: *users from India, first 20, return id/name/email*.

## Out-of-range is safe

If a row index is out of range, ONQL returns `null` instead of raising an error. So `mydb.users[999]` on a 10-row table is `null`, not a crash.

## What's next

Now that paging is wired up, let's walk into related tables with [relations](./relations.md).
