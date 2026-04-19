---
id: evaluator
title: Evaluator
sidebar_position: 3
---

# Evaluator

The evaluator walks the (optimized) statement list and produces the final result. It maintains a small in-memory map (`Memory`) keyed by statement names.

## Walking the plan

The evaluator iterates statements in order. Each operation type has a handler:

| Operation | Handler |
|---|---|
| `OpAccessTable` | Fetch rows from storage |
| `OpAccessRelatedTable` | Walk an FK index, fetch related rows |
| `OpStartFilter`/`OpEndFilter` | Apply filter conditions row by row |
| `OpStartProjection`/`OpEndProjection` | Build the response shape per row |
| `OpAggregateReduce` | Run an aggregate function |
| `OpSlice` | Apply paging (if not already optimized away) |
| `OpAccessRow` | Index into an array |
| `OpAccessField` | Read a field of a row |

After each handler runs, it writes its result back into `Memory` under the statement's name. Downstream statements read from there.

## Filters & projections are loops

A filter is a per-row evaluation of the filter expression statements between `OpStartFilter` and `OpEndFilter`. The evaluator rewinds the plan position after each row to re-run the inner statements.

A projection is the same idea: for each input row, the evaluator runs the inner key statements and builds an output object.

## Context injection

When a query is wrapped by a context rule (see [Context](../protocol/context.md)), the parser splices the rule's filter into the plan before evaluation. By the time the evaluator runs, the scoping is already part of the plan — there's no special "if context, then check user" logic at runtime.

## Source

The evaluator lives in [`dsl/evaluator/`](https://github.com/ONQL/server/tree/main/dsl/evaluator). Each handler is in its own file:

- `tables.go` — table & related-table access
- `filter.go` — filters and slices
- `projection.go` — projections
- `aggr.go` — aggregates
- `operator.go` — comparison and logical operators
