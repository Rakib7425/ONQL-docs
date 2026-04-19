---
id: auth-and-context
title: Auth & Context
sidebar_position: 5
---

# Auth & Context

ONQL has no opinion about *how* you authenticate users — that's your gateway's job. What ONQL provides is **what to do once you know who's calling**: turn an identity into a `ctxkey` + `ctxvalues` pair, and ONQL takes it from there.

## The two-layer model

```
Client  ──HTTP──▶  Your gateway  ──TCP──▶  ONQL
                  (auth happens here)     (context applies here)
```

Your gateway is in charge of:

1. Verifying the JWT / session / API key.
2. Deciding what role the caller has (`account`, `admin`, `support`, ...).
3. Forwarding the query to ONQL with the right `ctxkey` and `ctxvalues`.

ONQL is in charge of:

1. Looking up the matching context rule on every entity touched by the query.
2. Splicing the rule's filter into the query plan.
3. Running the resulting (now-scoped) query.

## A typical gateway

```js
// Express example — pseudocode
app.post('/onql', authenticate, async (req, res) => {
  const { query } = req.body;
  const result = await onqlClient.query({
    protopass: process.env.ONQL_PASS,
    query,
    ctxkey: req.user.role,         // "account" | "admin" | ...
    ctxvalues: [req.user.id],      // substituted for $1
  });
  res.json(result);
});
```

That's the entire backend. There are no entity-specific endpoints, no per-resource permission checks.

## What if you skip the gateway?

If you let raw clients talk to ONQL directly, **anyone who picks any `ctxkey` gets that level of access**. The protocol can't tell who you are — only your gateway can. So:

- For browsers: use a thin gateway. It's 30 lines of code.
- For server-to-server: a gateway is still recommended. Treat ONQL like you'd treat a database — never expose the raw port to the public internet.

## Default-deny

A safe gateway pattern is *default-deny*:

```js
const ALLOWED_KEYS = ['account', 'admin', 'support'];
if (!ALLOWED_KEYS.includes(req.user.role)) {
  return res.status(403).end();
}
```

Combined with context rules in the protocol, you get a clean two-layer guarantee:

1. The gateway decides which role applies.
2. The protocol decides which rows that role can see.
