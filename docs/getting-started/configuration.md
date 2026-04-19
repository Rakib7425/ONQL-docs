---
id: configuration
title: Configuration
sidebar_position: 3
---

# Configuration

ONQL is configured via environment variables. All settings have sensible defaults — you only need to set the ones you care about.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `ONQL_PORT` | `5656` | TCP port the server listens on |
| `DB_PATH` | `./store` | Where data files are written |
| `FLUSH_INTERVAL` | `500ms` | How often the in-memory buffer is flushed to disk |
| `LOG_LEVEL` | `INFO` | `DEBUG`, `INFO`, `WARN`, or `ERROR` |
| `MAX_CONNECTIONS` | `1000` | Max simultaneous TCP clients |
| `BUFFER_SIZE_MB` | `64` | RAM buffer per database |

## Example

```bash
ONQL_PORT=9000 \
DB_PATH=/var/lib/onql \
LOG_LEVEL=DEBUG \
./onql
```

## Inside Docker

```bash
docker run -p 9000:9000 \
  -e ONQL_PORT=9000 \
  -e LOG_LEVEL=DEBUG \
  -v $(pwd)/data:/data \
  onql/onql:latest
```

## Configuration file (optional)

If you prefer, drop a `config.toml` next to the binary:

```toml
[server]
port = 5656
max_connections = 1000

[storage]
path = "./store"
flush_interval = "500ms"
buffer_size_mb = 64

[log]
level = "INFO"
```

Environment variables always override the file.
