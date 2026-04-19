---
id: docker
title: Docker
sidebar_position: 1
---

# Docker

The fastest way to run ONQL anywhere.

## Pull and run

```bash
docker pull onql/onql:latest
docker run -d \
  --name onql \
  -p 5656:5656 \
  -v $(pwd)/data:/data \
  onql/onql:latest
```

| Flag | Purpose |
|---|---|
| `-p 5656:5656` | Expose the TCP port |
| `-v $(pwd)/data:/data` | Persistent storage on the host |
| `-d` | Run detached |

## docker-compose

```yaml
version: "3.9"
services:
  onql:
    image: onql/onql:latest
    container_name: onql
    restart: unless-stopped
    ports:
      - "5656:5656"
    volumes:
      - ./data:/data
    environment:
      LOG_LEVEL: INFO
      FLUSH_INTERVAL: 500ms
```

```bash
docker compose up -d
```

## Build your own image

```Dockerfile
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY . .
RUN go build -o onql ./cmd/server

FROM alpine:3
COPY --from=build /src/onql /usr/local/bin/onql
EXPOSE 5656
VOLUME ["/data"]
ENV DB_PATH=/data
ENTRYPOINT ["onql"]
```

```bash
docker build -t my-onql .
docker run -p 5656:5656 -v $(pwd)/data:/data my-onql
```

## Health check

```bash
docker exec onql nc -z localhost 5656 && echo "ok"
```
