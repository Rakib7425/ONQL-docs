---
id: installation
title: Installation
sidebar_position: 1
---

# Installation

You need two things: the **ONQL server** (the database itself) and the
**ONQL shell** (a terminal client to talk to it). Both are open source.

For a per-platform table of every installer and archive we ship, see the
[Downloads page](./downloads.md) — it's generated from the latest GitHub
release on every docs build, so the links never go stale.

## 1. Install the server

Pick the path that matches your OS.

### Windows

Grab the latest `onql-server_*_Windows_x86_64.zip` from the
[server releases](https://github.com/ONQL/server/releases/latest),
extract it, and run `onql-server.exe`:

```powershell
# From PowerShell, after extracting the zip
.\onql-server.exe
```

Native MSI installers will land in a future release; the
[Downloads page](./downloads.md) will show them as soon as they're
published.

### macOS

```bash
# Apple Silicon
curl -LO https://github.com/ONQL/server/releases/latest/download/onql-server_macOS_arm64.tar.gz
tar -xzf onql-server_macOS_arm64.tar.gz
./onql-server

# Intel
curl -LO https://github.com/ONQL/server/releases/latest/download/onql-server_macOS_x86_64.tar.gz
tar -xzf onql-server_macOS_x86_64.tar.gz
./onql-server
```

First run may be blocked by Gatekeeper — right-click the binary,
**Open**, and confirm. Or remove the quarantine attribute:

```bash
xattr -d com.apple.quarantine onql-server
```

### Linux — Debian / Ubuntu

```bash
curl -LO https://github.com/ONQL/server/releases/latest/download/onql-server_linux_amd64.deb
sudo dpkg -i onql-server_linux_amd64.deb
onql-server
```

### Linux — RHEL / Fedora / CentOS

```bash
curl -LO https://github.com/ONQL/server/releases/latest/download/onql-server_linux_amd64.rpm
sudo rpm -i onql-server_linux_amd64.rpm
onql-server
```

### Linux — Alpine

```bash
curl -LO https://github.com/ONQL/server/releases/latest/download/onql-server_linux_amd64.apk
sudo apk add --allow-untrusted onql-server_linux_amd64.apk
onql-server
```

### Linux — any other distro (tarball)

```bash
curl -LO https://github.com/ONQL/server/releases/latest/download/onql-server_Linux_x86_64.tar.gz
tar -xzf onql-server_Linux_x86_64.tar.gz
./onql-server
```

ARM64 and ARMv7 archives are available on the
[Downloads page](./downloads.md).

### Docker

```bash
docker pull onql/server:latest
docker run -p 5656:5656 -v $(pwd)/data:/data onql/server:latest
```

See the [Docker deployment guide](../deployment/docker.md) for
production settings (volumes, memory limits, healthchecks).

### From source

```bash
git clone https://github.com/ONQL/server
cd server
go build -o onql-server ./cmd/server
./onql-server
```

Requires Go 1.21+.

The server listens on TCP port **5656** by default.

## 2. Install the ONQL shell

The shell is currently a Python program — prebuilt installers are on the
roadmap and will surface on the [Downloads page](./downloads.md) as soon
as they're published.

### From source (all platforms)

```bash
git clone https://github.com/ONQL/onql-shell-client
cd onql-shell-client
pip install -r requirements.txt
python main.py
```

Requires Python 3.7 or newer.

Once running, you'll see the ONQL banner and a prompt:

```
onql>
```

It asks for a host and port the first time — press enter to accept the
defaults (`localhost`, `5656`). See
[Shell Commands](../reference/shell.md) for the full command reference.

## Next steps

- [Define your schema](./schema.md) — declarative, no SQL
- [Run your first query](./first-query.md)
- [Browse the language](../language/syntax.md)
- [See all downloads](./downloads.md)
