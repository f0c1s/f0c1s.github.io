<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>/f0c1s/blog/postgres/setup-postgres-in-docker</title>
    <link rel="stylesheet" href="../../index.css"/>
    <script src="../../setup.js"></script>
</head>

<body onload="setup()">
<h1>/f0c1s/blog/postgres/setup-postgres-in-docker</h1>
<nav>
    <a href="../../index.html">/blog</a>
    <a href="../index.html">postgres</a>
    <a href="../../postgres/setup/setup-postgres-in-docker.html">+ setup postgres in docker</a>
</nav>

## it is so simple

- pull the image
- run, will create a container
- check that it is running
- read logs, if any

### pull latest image

```shell
f0c1s@debian:~$ docker pull postgres
Using default tag: latest
latest: Pulling from library/postgres
Digest: sha256:f329d076a8806c0ce014ce5e554ca70f4ae9407a16bb03baa7fef287ee6371f1
Status: Image is up to date for postgres:latest
docker.io/library/postgres:latest
f0c1s@debian:~$
```

### run

```shell
f0c1s@debian:~$ docker run --name postgres-one \
    --publish 55555:5432 \
    -e POSTGRES_USER=pg1user \
    -e POSTGRES_PASSWORD=pg1password \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v /home/f0c1s/Data/postgres-one:/var/lib/postgresql/data \
    -d postgres
4f9dd7ee4d3d2850371f094e73b2128b77068c28c8fca30c7492d7ffcb6efc59
```

### check

```shell
f0c1s@debian:~$ docker ps
CONTAINER ID   IMAGE      COMMAND                  CREATED              STATUS              PORTS                                         NAMES
4f9dd7ee4d3d   postgres   "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:55555->5432/tcp, :::55555->5432/tcp   postgres-one
```

### read logs

```shell
f0c1s@debian:~$ docker logs -f postgres-one

PostgreSQL Database directory appears to contain a database; Skipping initialization

2022-01-09 08:15:36.824 UTC [1] LOG:  starting PostgreSQL 14.1 (Debian 14.1-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
2022-01-09 08:15:36.825 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2022-01-09 08:15:36.825 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2022-01-09 08:15:36.828 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2022-01-09 08:15:36.833 UTC [24] LOG:  database system was shut down at 2022-01-06 05:08:58 UTC
2022-01-09 08:15:36.850 UTC [1] LOG:  database system is ready to accept connections
^C

```

![0.docker-setup-at-a-glance](0.docker-setup-at-a-glance.png)

## access

I am using datagrip.

![1.setup-access-in-datagrip](1.setup-access-in-datagrip.png)

![2.database-explorer](2.database-explorer.png)

</body>
</html>
