---
id: search
title: Search
sidebar_position: 2
---

# Search

## Type-ahead search on a column

```
mydb.users[name._like($1)][0:10]{id, name}
```

Send `ctxvalues: ["Ada%"]` from the client.

## Multi-field search (OR)

```
mydb.users[
  name._like($1) or email._like($1)
][0:10]{id, name, email}
```

## Filtered search

```
mydb.products[
  name._like($1) and category = "electronics" and stock > 0
][0:20]{id, name, price}
```

## Search across a relation

```
mydb.orders{
  id,
  total,
  user[name._like($1)]{name}
}
```

## Tip

For very large tables and fuzzy/typo-tolerant search, pair ONQL with a dedicated full-text engine for the search query and use ONQL only to fetch the matching rows by id.
