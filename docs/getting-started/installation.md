---
id: installation
title: Installation
sidebar_position: 1
---

# Installation

You need two things: the **ONQL server** (the database itself) and the **ONQL shell** (a terminal client to talk to it).

## 1. Install the server

Grab a pre-built release from [github.com/ONQL/server](https://github.com/ONQL/server/releases), or build from source if you'd rather explore the code.

### Pre-built binary

Download the release for your OS, make it executable, and run it:

```bash
./onql-server
```

### Docker

```bash
docker pull onql/server:latest
docker run -p 5656:5656 -v $(pwd)/data:/data onql/server:latest
```

### From source (optional)

```bash
git clone https://github.com/ONQL/server
cd server
go build -o onql-server ./cmd/server
./onql-server
```

Requires Go 1.21+. See the [Docker deployment guide](../deployment/docker.md) for production options.

The server listens on TCP port **5656** by default.

## 2. Install the ONQL shell

The shell is a separate cross-platform installer that connects to any ONQL server.

Download it from [github.com/ONQL/shell](https://github.com/ONQL/shell/releases) and run the installer for your OS. Once installed, launch `onql` from any terminal.

You'll see the ONQL banner and a prompt:

```
> 
```

It asks for a host and port the first time — press enter to accept the defaults (`localhost`, `5656`).

## Next steps

- [Define your schema](./schema.md)
- [Run your first query](./first-query.md)
