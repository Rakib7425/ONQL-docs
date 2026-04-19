---
id: configuration
title: Production Configuration
sidebar_position: 2
---

# Production Configuration

A short list of settings and patterns for running ONQL in production.

## Resource profile

ONQL is lightweight and fast — resource requirements are comparable to running a similarly-sized MySQL or PostgreSQL instance. Size your hardware to your workload; there's no minimum beyond "whatever fits your dataset comfortably in RAM buffer + disk."

- **RAM-efficient** — an LSM storage engine with a tunable in-memory write buffer (`BUFFER_SIZE_MB`). Bigger buffer = fewer flushes = higher write throughput.
- **Low CPU overhead** — queries compile to flat ONQL Assembly and run iteratively; most work is I/O, not CPU.
- **Disk-friendly** — BadgerDB writes sequentially and compacts in the background. Any SSD works.

## Recommended environment

```bash
ONQL_PORT=5656
DB_PATH=/var/lib/onql
LOG_LEVEL=INFO
FLUSH_INTERVAL=500ms
BUFFER_SIZE_MB=256
MAX_CONNECTIONS=2000
```

## Behind a gateway

Don't expose ONQL to the public internet. Always front it with a thin gateway that:

1. Authenticates the user
2. Sets `ctxkey` and `ctxvalues`
3. Forwards the query

See [Auth & Context](../concepts/auth-and-context.md) for the pattern.

## Backups

Two options — pick whichever fits your workflow.

### 1. Filesystem snapshot (fast, binary)

ONQL writes everything under `DB_PATH`. Copying that directory *is* the backup — databases, tables, indexes, and protocols are all inside.

```bash
tar czf onql-backup-$(date +%F).tar.gz /var/lib/onql
```

Best for: disaster recovery, full server clones, or moving between machines with the same ONQL version. Restore by stopping the server, replacing `DB_PATH`, and starting it back up.

For consistency under live writes, stop the server first or use a filesystem/block-level snapshot (LVM, ZFS, EBS) so the data directory is captured in a single moment.

### 2. Export / import (logical, portable)

Use the shell's built-in `export` and `import` commands to dump and restore data as JSON. This is version-independent and can be inspected or edited before reloading.

```
> export all onql-backup.json             # everything
> export db shop shop-backup.json         # one database
> export table shop customers custs.json  # one table
```

Restore:

```
> import onql-backup.json
> import shop-backup.json table customers   # only the customers table
```

Best for: moving data between ONQL versions, copying a subset into a staging server, seeding new environments, or committing fixture data to git.

| | Filesystem copy | Export / import |
|---|---|---|
| Speed | Fastest | Slower (serializes to JSON) |
| Portable across versions | No | Yes |
| Partial backup | No | Yes — per db or table |
| Human-readable | No | Yes |
| Requires server stopped | For consistency, yes | No |

## Graceful shutdown

ONQL flushes the buffer on `SIGTERM`. Always send `SIGTERM` (not `SIGKILL`) so writes hit disk.

```bash
kill -TERM $(pgrep onql)
```

In Docker:
```bash
docker stop --time 30 onql
```
