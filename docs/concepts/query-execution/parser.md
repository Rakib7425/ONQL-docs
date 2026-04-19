---
id: parser
title: Parser
sidebar_position: 1
---

# Parser

The parser compiles your query string into **ONQL Assembly** — a flat list of low-level operations (analogous to machine instructions) that the optimizer and evaluator run over.

## Pipeline

```
query string
   ↓
Lexer       → tokens
   ↓
Parser      → ONQL Assembly (statements)
   ↓
Optimizer   → reordered / fused ONQL Assembly
   ↓
Evaluator   → result
```

## ONQL Assembly — the statement

An **ONQL Assembly instruction** (we call it a `Statement` in the source) is the parser's atomic unit. Every operation — table access, filter open/close, projection key, slice, aggregate, arithmetic — becomes one instruction. Each has:

- An `Operation` opcode (e.g. `OpAccessTable`, `OpStartFilter`, `OpAccessRelatedTable`, `OpNormalOperation`)
- A `Name` — auto-generated, used as a memory key during evaluation
- `Sources` — references to other statements that produce its inputs
- `Expressions` — the literal payload (string, integer, parsed structure)
- `Meta` — type info, hints for the optimizer

## Why a flat assembly?

Most query languages parse to a tree. ONQL's flat assembly is easier to optimize, easier to evaluate iteratively, and cheap to inspect. Nesting (filters inside projections inside relations) is preserved through `OpStart…` / `OpEnd…` markers — think of them like matching brackets in a bytecode stream.

## Example

Query:

```
shop.customers[age > 18]{id, name}
```

ONQL Assembly (simplified):

| # | Opcode | Notes |
|---|---|---|
| 1 | OpAccessTable | shop.customers |
| 2 | OpStartFilter | |
| 3 | OpAccessList | age column |
| 4 | OpLiteral | 18 |
| 5 | OpNormalOperation | "age > 18" |
| 6 | OpEndFilter | |
| 7 | OpStartProjection | |
| 8 | OpStartProjectionKey | "id" |
| 9 | OpAccessList | id column |
| 10 | OpEndProjectionKey | "id" |
| 11 | OpStartProjectionKey | "name" |
| 12 | OpAccessList | name column |
| 13 | OpEndProjectionKey | "name" |
| 14 | OpEndProjection | |

The parser is in [`dsl/parser/`](https://github.com/ONQL/server/tree/main/dsl/parser).
