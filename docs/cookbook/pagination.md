---
id: pagination
title: Pagination
sidebar_position: 4
---

# Pagination

## Offset-based pagination

The straightforward approach. Pick a page size and slide the slice:

```
mydb.users[0:20]    // page 1
mydb.users[20:40]   // page 2
mydb.users[40:60]   // page 3
```

Generic form: `[offset : offset+limit]`.

## With sorting

```
mydb.users._desc(created_at)[0:20]
mydb.users._desc(created_at)[20:40]
```

The optimizer pushes both the sort and the slice into the storage layer.

## With filtering

```
mydb.users[country = "IN"]._desc(created_at)[0:20]
```

## Total count for "page X of Y"

Run a separate `_count()` query:

```
mydb.users[country = "IN"]._count()
```

Then `total / pageSize` rounded up gives you the page count.

## Cursor-based pagination

For very large tables, prefer cursor pagination:

```
mydb.users[id > $1]._asc(id)[0:20]   // pass last seen id as $1
```

This avoids deep offsets and stays fast as the table grows.
