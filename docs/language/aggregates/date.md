---
id: date
title: _date(col, format)
sidebar_position: 8
---

# `_date(col, format)`

Parses or formats a timestamp column.

## Syntax

```
column._date(format)
```

The format string follows Go's reference layout — based on the date `Mon Jan 2 15:04:05 MST 2006`.

| Token | Meaning |
|---|---|
| `2006` | 4-digit year |
| `01` | 2-digit month |
| `02` | 2-digit day |
| `15` | 2-digit hour (24h) |
| `04` | 2-digit minute |
| `05` | 2-digit second |

## Examples

```
mydb.events{
  id,
  time._date("2006-01-02")
}
```

Returns each event's date as `"2026-04-12"`.

## Used in a filter

```
mydb.events[time._date("2006-01-02") = "2026-04-12"]
```

All events from a single day.

## Notes

- The column must be a timestamp or a numeric epoch value.
- For more complex date math (last 7 days, this month), filter on raw timestamps and let your client format them.
