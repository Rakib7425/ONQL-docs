---
id: multi-tenant
title: Multi-Tenant
sidebar_position: 5
---

# Multi-Tenant

ONQL was built for multi-tenant systems. The trick is the `context` block in the protocol.

## Single tenant column

The most common case: every row has an `org_id` column.

```json
"projects": {
  "context": {
    "member": "app.projects[org_id = $1]"
  }
}
```

Send each request with the user's `org_id`:

```json
{ "ctxkey": "member", "ctxvalues": ["acme"] }
```

Now `app.projects{...}` only returns rows for `acme`. There's no way for the client to escape this — the filter is applied in the query plan, not in your application code.

## Hierarchical tenancy

An agency has many clients. A client sees their own data. An agency admin sees every client under their agency.

```json
"orders": {
  "context": {
    "customer":     "shop.orders[customer_id = $1]",
    "agency_admin": "shop.agencies[id = $1].customers.orders"
  }
}
```

Same query for both, completely different scope.

## Per-tenant entity overrides

If different tenants need different field visibility, declare two entities:

```json
"projects": {
  "table": "projects",
  "fields": { "id": "id", "name": "name", "budget": "budget" }
},
"projects_member_view": {
  "table": "projects",
  "fields": { "id": "id", "name": "name" },
  "context": { "member": "app.projects[org_id = $1]" }
}
```

Members query `projects_member_view` (no budget). Admins query `projects` (everything).

## Don't put the tenant in the query

If you let the client send `app.projects[org_id = $1]` directly, you've defeated the purpose. Always use a context rule. The protocol — not the query — should be the source of truth for scoping.
