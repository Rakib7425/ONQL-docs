---
id: client-libraries
title: Client Libraries
sidebar_position: 4
---

# Client Libraries

ONQL speaks a simple JSON-over-TCP protocol delimited by `\x04` (EOT). Any language with a TCP socket can talk to it.

## Official libraries

The full list of client drivers — one page per language, mirrored
directly from each repository's `README.md` — lives under
[Drivers](/drivers). The list is regenerated on every docs build from
the [`ONQL` GitHub org](https://github.com/ONQL), so new
`onqlclient-<lang>` repos show up automatically.

## Quick examples

### TypeScript

```ts
import { ONQL } from '@onql/client';

const client = new ONQL({ host: 'localhost', port: 5656 });

const result = await client.query({
  protopass: 'mypassword',
  query: 'mydb.users{id, name, email}',
  ctxkey: 'account',
  ctxvalues: ['42'],
});
```

### Python

```python
from onql import Client

client = Client('localhost', 5656)

result = client.query(
    protopass='mypassword',
    query='mydb.users{id, name, email}',
    ctxkey='account',
    ctxvalues=['42'],
)
```

### Go

```go
import "onql/client"

c, _ := client.Dial("localhost:5656")
defer c.Close()

result, err := c.Query(client.Request{
    ProtoPass: "mypassword",
    Query:     "mydb.users{id, name, email}",
    CtxKey:    "account",
    CtxValues: []string{"42"},
})
```

## Roll your own

The wire format is documented in [`MESSAGE_PROTOCOL.md`](https://github.com/ONQL/server/blob/main/MESSAGE_PROTOCOL.md). Each message is a JSON object terminated by `\x04`. That's it.
