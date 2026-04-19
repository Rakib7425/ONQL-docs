---
id: error-codes
title: Error Codes
sidebar_position: 5
---

# Error Codes

ONQL returns errors as JSON with a short, machine-readable code and a human-readable message.

```json
{
  "error": {
    "code": "UNKNOWN_IDENTIFIER",
    "message": "unknown identifier accounts after table data"
  }
}
```

## Parser errors

| Code | Meaning |
|---|---|
| `UNEXPECTED_TOKEN` | The lexer found a character it didn't recognise |
| `EXPECT_IDENTIFIER` | The parser expected a name |
| `EXPECT_DATABASE` | First token wasn't a known database |
| `EXPECT_TABLE` | After `db.`, the next token wasn't a known table |
| `EXPECT_BRACE` | Missing `{` or `}` |
| `EXPECT_BRACKET` | Missing `[` or `]` |
| `UNKNOWN_IDENTIFIER` | A name didn't match any column, relation, or aggregate |

## Type errors

| Code | Meaning |
|---|---|
| `INVALID_OPERAND_TYPE` | A comparison got an operand of the wrong type |
| `INVALID_AGGREGATE_INPUT` | An aggregate received an input it can't handle |
| `EXPECT_ARRAY` | A row-access or slice was applied to a non-array |

## Protocol errors

| Code | Meaning |
|---|---|
| `PROTOCOL_NOT_FOUND` | The `protopass` doesn't match a known protocol |
| `ENTITY_NOT_FOUND` | The protocol doesn't define this entity |
| `RELATION_NOT_FOUND` | A relation in the query isn't defined for the entity |
| `CONTEXT_NOT_FOUND` | The `ctxkey` isn't defined for the entity |
| `CONTEXT_PARAM_MISMATCH` | The context rule expected more `ctxvalues` than were sent |

## Storage errors

| Code | Meaning |
|---|---|
| `KEY_NOT_FOUND` | A direct PK lookup found nothing |
| `INDEX_MISSING` | An index expected by the query plan didn't exist |
| `STORAGE_TIMEOUT` | The storage layer didn't respond in time |

## Runtime safety

| Code | Meaning |
|---|---|
| `INTERNAL_PANIC` | A bug — please file an issue |
| `QUERY_TIMEOUT` | The query took longer than the configured limit |
