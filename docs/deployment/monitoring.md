---
id: monitoring
title: Monitoring
sidebar_position: 3
---

# Monitoring

ONQL exposes basic runtime stats via the management endpoint.

## Stats endpoint

```json
{
  "target": "system",
  "payload": { "function": "Stats" }
}
```

Response:

```json
{
  "uptime_sec": 12345,
  "open_connections": 42,
  "queries_total": 901234,
  "queries_per_sec": 88.4,
  "buffer_used_mb": 142,
  "disk_used_gb": 38.1,
  "errors_last_min": 0
}
```

## Query history

ONQL keeps a rolling history of recent queries with CPU, memory, and network usage:

```json
{ "target": "system", "payload": { "function": "QueryHistory", "args": [50] } }
```

Returns the last 50 queries with timing and resource counters. Useful for spotting slow queries before users do.

## Logs

ONQL logs are structured JSON. Pipe to your log shipper of choice:

```bash
./onql 2>&1 | vector --config vector.toml
```

Each line includes:

- `timestamp`
- `level`
- `event`
- `query` (truncated)
- `protopass`, `ctxkey`
- `duration_ms`
- `error` (if any)

## Alerts to set

| Alert | When |
|---|---|
| `errors_last_min > 5` | Real failures |
| `buffer_used_mb > 80% of total` | Approaching back-pressure |
| `queries_per_sec < expected baseline / 2` | Likely a stuck client or upstream outage |
| `disk_used_gb growing > 1 GB / hour` | Runaway writes — investigate |

## Tracing

ONQL doesn't yet emit OpenTelemetry traces. The query history endpoint is the closest substitute and is enough for most production triage.
