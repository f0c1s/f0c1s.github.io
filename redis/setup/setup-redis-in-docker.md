<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>/f0c1s/blog/redis/setup-redis-in-docker</title>
    <link rel="stylesheet" href="../../index.css"/>
    <script src="../../setup.js"></script>
</head>

<body onload="setup()">
<h1>/f0c1s/blog/redis/setup-redis-in-docker</h1>
<nav>
    <a href="../../index.html">/blog</a>
    <a href="../index.html">redis</a>
    <a href="../../redis/setup/setup-redis-in-docker.html">+ setup redis in docker</a>
</nav>

```shell
f0c1s@debian:~$ docker pull redis
Using default tag: latest
latest: Pulling from library/redis
a2abf6c4d29d: Already exists
c7a4e4382001: Pull complete
4044b9ba67c9: Pull complete
c8388a79482f: Pull complete
413c8bb60be2: Pull complete
1abfd3011519: Pull complete
Digest: sha256:db485f2e245b5b3329fdc7eff4eb00f913e09d8feb9ca720788059fdc2ed8339
Status: Downloaded newer image for redis:latest
docker.io/library/redis:latest

f0c1s@debian:~$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                                       NAMES
20bf0a60c905   redis     "docker-entrypoint.s…"   48 seconds ago   Up 48 seconds   0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   redis-one


f0c1s@debian:~$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                                       NAMES
20bf0a60c905   redis     "docker-entrypoint.s…"   48 seconds ago   Up 48 seconds   0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   redis-one

f0c1s@debian:~$ docker logs -f redis-one
1:C 12 Jan 2022 13:00:29.476 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 12 Jan 2022 13:00:29.476 # Redis version=6.2.6, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 12 Jan 2022 13:00:29.476 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
1:M 12 Jan 2022 13:00:29.476 * monotonic clock: POSIX clock_gettime
1:M 12 Jan 2022 13:00:29.476 * Running mode=standalone, port=6379.
1:M 12 Jan 2022 13:00:29.476 # Server initialized
1:M 12 Jan 2022 13:00:29.476 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1:M 12 Jan 2022 13:00:29.476 * Loading RDB produced by version 6.2.6
1:M 12 Jan 2022 13:00:29.476 * RDB age 10 seconds
1:M 12 Jan 2022 13:00:29.476 * RDB memory usage when created 0.79 Mb
1:M 12 Jan 2022 13:00:29.476 # Done loading RDB, keys loaded: 0, keys expired: 0.
1:M 12 Jan 2022 13:00:29.476 * DB loaded from disk: 0.000 seconds
1:M 12 Jan 2022 13:00:29.476 * Ready to accept connections

```

![0.running-redis-container](0.running-redis-container.png)

## connecting via redis-commander

```shell
docker pull rediscommander/redis-commander
Using default tag: latest
latest: Pulling from rediscommander/redis-commander
339de151aab4: Pull complete
f732fa32fc61: Pull complete
ef60bb667d5a: Pull complete
4f50fa5032a4: Pull complete
Digest: sha256:19cd0c49f418779fa2822a0496c5e6516d0c792effc39ed20089e6268477e40a
Status: Downloaded newer image for rediscommander/redis-commander:latest
docker.io/rediscommander/redis-commander:latest

docker run --rm --name redis-commander -d --env REDIS_HOSTS=192.168.56.91 -p 8081:8081 rediscommander/redis-commander:latest
24b2bf1766d6155550c86d53ccde0a570c99778a6f8c269307eb1f3f9a4b8f75

docker logs -f redis-commander
Creating custom redis-commander config '/redis-commander/config/local-production.json'.
Parsing 1 REDIS_HOSTS into custom redis-commander config '/redis-commander/config/local-production.json'.
node ./bin/redis-commander
Using scan instead of keys
No Save: false
listening on 0.0.0.0:8081
access with browser at http://127.0.0.1:8081
Redis Connection 192.168.56.91:6379 using Redis DB #0
loading keys by prefix ""
scanning: 0: 0
found 0 keys for ""

```

![1.running-redis-commander](1.running-redis-commander.png)

![2.added-a-key-value](2.added-a-key-value.png)

## setup redismod

```shell
f0c1s@debian:~$ docker pull redislabs/redismod
Using default tag: latest
latest: Pulling from redislabs/redismod
a2abf6c4d29d: Already exists
c0ad39d33386: Pull complete
e85ce1085a82: Pull complete
da0ddf5a7c48: Pull complete
47104d4ed039: Pull complete
d156b1b33996: Pull complete
45e6e80b5182: Pull complete
9e282157fdaa: Pull complete
4f76ebeeb273: Pull complete
a3ed95caeb02: Pull complete
74b8fecf643c: Pull complete
7ae58a07303e: Pull complete
cedd39789686: Pull complete
1f78db2185db: Pull complete
bb2ea671893c: Pull complete
46f1844b2bfc: Pull complete
a9a253368b19: Pull complete
11d0fa04635c: Pull complete
6d3429ad6d34: Pull complete
2cc456bcb4a1: Pull complete
d8ec9cb29617: Pull complete
a7c21aadbdd2: Pull complete
bfd9e6688619: Pull complete
Digest: sha256:4f87cef55097230c9acad28af41d961c30a9b8c891a0b9d350c1209b973d174d
Status: Downloaded newer image for redislabs/redismod:latest
docker.io/redislabs/redismod:latest
f0c1s@debian:~$ docker run --name redismod-one -p 7379:6379 -d redislabs/redismod
5a6bfeea67392ab1b437ada3a1de60c7bbbbbc3fcb0226ca0aae94fadbff622b
f0c1s@debian:~$ docker logs -f redismod-one
1:C 12 Jan 2022 14:14:26.220 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 12 Jan 2022 14:14:26.222 # Redis version=6.2.6, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 12 Jan 2022 14:14:26.222 # Configuration loaded
1:M 12 Jan 2022 14:14:26.222 * monotonic clock: POSIX clock_gettime
1:M 12 Jan 2022 14:14:26.222 * Running mode=standalone, port=6379.
1:M 12 Jan 2022 14:14:26.222 # Server initialized
1:M 12 Jan 2022 14:14:26.222 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1:M 12 Jan 2022 14:14:26.223 * <ai> Redis version found by RedisAI: 6.2.6 - oss
1:M 12 Jan 2022 14:14:26.223 * <ai> RedisAI version 10205, git_sha=746b199e69f272d12aab00c26d31c8e35eb48b29
1:M 12 Jan 2022 14:14:26.223 * Module 'ai' loaded from /usr/lib/redis/modules/redisai.so
1:M 12 Jan 2022 14:14:26.225 * <search> Redis version found by RedisSearch : 6.2.6 - oss
1:M 12 Jan 2022 14:14:26.225 * <search> RediSearch version 2.2.5 (Git=v1.99.5-386-g93a916c4)
1:M 12 Jan 2022 14:14:26.225 * <search> Low level api version 1 initialized successfully
1:M 12 Jan 2022 14:14:26.225 * <search> concurrent writes: OFF, gc: ON, prefix min length: 2, prefix max expansions: 200, query timeout (ms): 500, timeout policy: return, cursor read size: 1000, cursor max idle (ms): 300000, max doctable size: 1000000, max number of search results:  1000000, search pool size: 20, index pool size: 8,
1:M 12 Jan 2022 14:14:26.229 * <search> Initialized thread pool!
1:M 12 Jan 2022 14:14:26.229 * <search> Enabled diskless replication
1:M 12 Jan 2022 14:14:26.230 * Module 'search' loaded from /usr/lib/redis/modules/redisearch.so
1:M 12 Jan 2022 14:14:26.251 * <graph> Starting up RedisGraph version 2.4.11.
1:M 12 Jan 2022 14:14:26.283 * <graph> Thread pool created, using 1 threads.
1:M 12 Jan 2022 14:14:26.283 * <graph> Maximum number of OpenMP threads set to 1
1:M 12 Jan 2022 14:14:26.283 * Module 'graph' loaded from /usr/lib/redis/modules/redisgraph.so
1:M 12 Jan 2022 14:14:26.292 * <timeseries> RedisTimeSeries version 10605, git_sha=b142442928e9ec0284f5262897f652c6a02016c2
1:M 12 Jan 2022 14:14:26.292 * <timeseries> Redis version found by RedisTimeSeries : 6.2.6 - oss
1:M 12 Jan 2022 14:14:26.292 * <timeseries> loaded default CHUNK_SIZE_BYTES policy: 4096
1:M 12 Jan 2022 14:14:26.292 * <timeseries> loaded server DUPLICATE_POLICY: block
1:M 12 Jan 2022 14:14:26.292 * <timeseries> Setting default series ENCODING to: compressed
1:M 12 Jan 2022 14:14:26.292 * <timeseries> Detected redis oss
1:M 12 Jan 2022 14:14:26.309 * <timeseries> Enabled diskless replication
1:M 12 Jan 2022 14:14:26.309 * Module 'timeseries' loaded from /usr/lib/redis/modules/redistimeseries.so
1:M 12 Jan 2022 14:14:26.309 * <ReJSON> version: 20006 git sha: db3329c branch: heads/v2.0.6
1:M 12 Jan 2022 14:14:26.309 * <ReJSON> Exported RedisJSON_V1 API
1:M 12 Jan 2022 14:14:26.309 * <ReJSON> Enabled diskless replication
1:M 12 Jan 2022 14:14:26.309 * <ReJSON> Created new data type 'ReJSON-RL'
1:M 12 Jan 2022 14:14:26.309 * Module 'ReJSON' loaded from /usr/lib/redis/modules/rejson.so
1:M 12 Jan 2022 14:14:26.309 * <search> Acquired RedisJSON_V1 API
1:M 12 Jan 2022 14:14:26.309 * Module 'bf' loaded from /usr/lib/redis/modules/redisbloom.so
1:M 12 Jan 2022 14:14:26.312 * <rg> RedisGears version 1.0.9, git_sha=032db37a554a07a99e439bffc66faab9a7a9a4bb, compiled_os=linux-buster-x64
1:M 12 Jan 2022 14:14:26.312 * <rg> Redis version found by RedisGears : 6.2.6 - oss
1:M 12 Jan 2022 14:14:26.312 * <rg> MaxExecutions:1000
1:M 12 Jan 2022 14:14:26.312 * <rg> MaxExecutionsPerRegistration:100
1:M 12 Jan 2022 14:14:26.312 * <rg> ProfileExecutions:0
1:M 12 Jan 2022 14:14:26.312 * <rg> PythonAttemptTraceback:1
1:M 12 Jan 2022 14:14:26.312 * <rg> DependenciesUrl:http://redismodules.s3.amazonaws.com/redisgears/redisgears-dependencies.linux-buster-x64.1.0.9.tgz
1:M 12 Jan 2022 14:14:26.312 * <rg> DependenciesSha256:576cff5f8594965d8c54217f54b28a3299f8209aaf5e4bfc5f2eb66dfafe71ea
1:M 12 Jan 2022 14:14:26.312 * <rg> CreateVenv:0
1:M 12 Jan 2022 14:14:26.312 * <rg> ExecutionThreads:3
1:M 12 Jan 2022 14:14:26.312 * <rg> ExecutionMaxIdleTime:5000
1:M 12 Jan 2022 14:14:26.312 * <rg> PythonInstallReqMaxIdleTime:30000
1:M 12 Jan 2022 14:14:26.312 * <rg> PythonInstallationDir:/var/opt/redislabs/modules/rg
1:M 12 Jan 2022 14:14:26.312 * <rg> DownloadDeps:1
1:M 12 Jan 2022 14:14:26.312 * <rg> ForceDownloadDepsOnEnterprise:0
1:M 12 Jan 2022 14:14:26.312 * <rg> SendMsgRetries:3
1:M 12 Jan 2022 14:14:26.312 * <rg> Plugin:/var/opt/redislabs/modules/rg/plugin/gears_python.so
1:M 12 Jan 2022 14:14:26.312 * <rg> RedisAI api loaded successfully.
1:M 12 Jan 2022 14:14:26.345 * <rg> PYENV_DIR: /var/opt/redislabs/modules/rg//python3_1.0.9/
1:M 12 Jan 2022 14:14:26.345 * <rg> PYENV_HOME_DIR: /var/opt/redislabs/modules/rg//python3_1.0.9//.venv/
1:M 12 Jan 2022 14:14:26.345 * <rg> PYENV_BIN_DIR: /var/opt/redislabs/modules/rg//python3_1.0.9//.venv//bin
1:M 12 Jan 2022 14:14:26.345 * <rg> PYENV_ACTIVATE: /var/opt/redislabs/modules/rg//python3_1.0.9//.venv//bin/activate_this.py
1:M 12 Jan 2022 14:14:26.345 * <rg> PYENV_ACTIVATE_SCRIPT: /var/opt/redislabs/modules/rg//python3_1.0.9//.venv//bin/activate
1:M 12 Jan 2022 14:14:26.345 * <module> log file is

1:M 12 Jan 2022 14:14:26.345 * <rg> Found python installation under: /var/opt/redislabs/modules/rg//python3_1.0.9/
1:M 12 Jan 2022 14:14:26.385 * Module 'rg' loaded from /usr/lib/redis/modules/redisgears.so
1:M 12 Jan 2022 14:14:26.385 * Ready to accept connections
^C
```

### connecting via redis-commander

redis-commander cannot connect to redismod. This sucks.

I removed redismod-one and recreated to run on port 6379, still redis-commander couldn't connect. But the app could connect.

There was another thing with redis-commander, which is it cannot connect to redis on any other port than 6379; don't know what is the issue with it.

</body>
</html>
