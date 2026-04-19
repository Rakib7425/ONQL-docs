---
id: examples
title: Real-World Examples
sidebar_position: 6
---

# Real-World Examples

End-to-end protocol files you can copy, paste, and adapt.

## A blog

```json
{
  "blog": {
    "database": "blog",
    "entities": {
      "posts": {
        "table": "posts",
        "fields": {
          "id": "id",
          "title": "title",
          "body": "body",
          "author_id": "author_id",
          "published_at": "published_at"
        },
        "relations": {
          "author":   { "type": "mto", "entity": "users",    "prototable": "users",    "fkfield": "author_id:id" },
          "comments": { "type": "otm", "entity": "comments", "prototable": "comments", "fkfield": "id:post_id" },
          "tags":     { "type": "mtm", "entity": "tags",     "prototable": "tags",     "through": "post_tags", "fkfield": "id:post_id:tag_id:id" }
        },
        "context": {
          "public": "blog.posts[published_at != null]",
          "admin":  "blog.posts"
        }
      },
      "users": {
        "table": "users",
        "fields": { "id": "id", "name": "name", "email": "email" }
      },
      "comments": {
        "table": "comments",
        "fields": { "id": "id", "post_id": "post_id", "body": "body", "author_name": "author_name" }
      },
      "tags": {
        "table": "tags",
        "fields": { "id": "id", "name": "name" }
      }
    }
  }
}
```

A typical query against this:

```
blog.posts[0:10]{
  id, title, published_at,
  author{name},
  tags{name},
  comments[:3]{body, author_name}
}
```

## An e-commerce shop

A larger example — customers, products, orders, and line items. Shows every relation type.

```json
{
  "shop": {
    "database": "shop",
    "entities": {
      "customers": {
        "table": "customers",
        "fields": {
          "id": "id", "name": "name", "email": "email", "created_at": "created_at"
        },
        "relations": {
          "orders":       { "type": "otm", "entity": "orders",       "prototable": "orders",       "fkfield": "id:customer_id" },
          "transactions": { "type": "otm", "entity": "transactions", "prototable": "transactions", "fkfield": "id:customer_id" }
        },
        "context": {
          "customer": "shop.customers[id = $1]",
          "admin":    "shop.customers"
        }
      },
      "products": {
        "table": "products",
        "fields": {
          "id": "id", "name": "name", "price": "price", "stock": "stock", "category_id": "category_id"
        },
        "relations": {
          "category": { "type": "mto", "entity": "categories", "prototable": "categories", "fkfield": "category_id:id" }
        }
      },
      "categories": {
        "table": "categories",
        "fields": { "id": "id", "name": "name" }
      },
      "orders": {
        "table": "orders",
        "fields": {
          "id": "id", "customer_id": "customer_id", "total": "total", "status": "status", "placed_at": "placed_at"
        },
        "relations": {
          "customer": { "type": "mto", "entity": "customers",   "prototable": "customers",   "fkfield": "customer_id:id" },
          "items":    { "type": "otm", "entity": "order_items", "prototable": "order_items", "fkfield": "id:order_id" },
          "products": { "type": "mtm", "entity": "products",    "prototable": "products",    "through": "order_items", "fkfield": "id:order_id:product_id:id" }
        },
        "context": {
          "customer": "shop.orders[customer_id = $1]",
          "admin":    "shop.orders"
        }
      },
      "order_items": {
        "table": "order_items",
        "fields": {
          "id": "id", "order_id": "order_id", "product_id": "product_id", "qty": "qty", "price": "price"
        },
        "relations": {
          "order":   { "type": "mto", "entity": "orders",   "prototable": "orders",   "fkfield": "order_id:id" },
          "product": { "type": "mto", "entity": "products", "prototable": "products", "fkfield": "product_id:id" }
        }
      },
      "transactions": {
        "table": "transactions",
        "fields": {
          "id": "id", "customer_id": "customer_id", "amount": "amount", "type": "type", "created_at": "created_at"
        },
        "context": {
          "customer": "shop.transactions[customer_id = $1]",
          "admin":    "shop.transactions"
        }
      }
    }
  }
}
```

The `customer` context is set on every entity that has a `customer_id`. A logged-in shopper sees only their own orders and transactions — same query, different result — while `admin` sees everything.

A typical dashboard query:

```
shop.customers[0]{
  name, email,
  orders._desc(placed_at)[0:5]{
    id, total, status, placed_at,
    items{qty, price, product{name}}
  }
}
```

## A multi-tenant SaaS

```json
{
  "app": {
    "database": "app",
    "entities": {
      "projects": {
        "table": "projects",
        "fields": {
          "id": "id", "name": "name", "org_id": "org_id", "created_at": "created_at"
        },
        "relations": {
          "tasks": { "type": "otm", "entity": "tasks", "prototable": "tasks", "fkfield": "id:project_id" }
        },
        "context": {
          "member": "app.projects[org_id = $1]",
          "admin":  "app.projects"
        }
      },
      "tasks": {
        "table": "tasks",
        "fields": {
          "id": "id", "project_id": "project_id", "title": "title", "status": "status", "assignee_id": "assignee_id"
        }
      }
    }
  }
}
```

The `member` context auto-scopes by `org_id`. Members of org A can never see projects belonging to org B.
