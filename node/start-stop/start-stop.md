<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>blog.f0c1s.com/node/start-stop</title>
    <link rel="stylesheet" href="../../index.css"/>
    <script src="../../setup.js" async></script>
</head>
<body onload="setup()">
<h1>
    /f0c1s/blog/node/start-stop
</h1>
<nav>
    <a href="../../index.html">/blog</a>
    <a href="../../node/index.html">node</a>
    <a href="../../node/start-stop/start-stop.html">+ start stop</a>
</nav>

## Start

```cpp
int Start(int argc, char** argv) {
  InitializationResult result = InitializeOncePerProcess(argc, argv);
  if (result.early_return) {
    return result.exit_code;
  }

  {
    Isolate::CreateParams params;
    const std::vector<size_t>* indices = nullptr;
    const EnvSerializeInfo* env_info = nullptr;
    bool use_node_snapshot =
        per_process::cli_options->per_isolate->node_snapshot;
    if (use_node_snapshot) {
      v8::StartupData* blob = NodeMainInstance::GetEmbeddedSnapshotBlob();
      if (blob != nullptr) {
        params.snapshot_blob = blob;
        indices = NodeMainInstance::GetIsolateDataIndices();
        env_info = NodeMainInstance::GetEnvSerializeInfo();
      }
    }
    uv_loop_configure(uv_default_loop(), UV_METRICS_IDLE_TIME);

    NodeMainInstance main_instance(&params,
                                   uv_default_loop(),
                                   per_process::v8_platform.Platform(),
                                   result.args,
                                   result.exec_args,
                                   indices);
    result.exit_code = main_instance.Run(env_info);
  }

  TearDownOncePerProcess();
  return result.exit_code;
}
```

![1.Start-function](1.Start-function.png)

You can notice event loop being initialized in line 1161.

```cpp
InitializationResult InitializeOncePerProcess(int argc, char** argv) {
  return InitializeOncePerProcess(argc, argv, kDefaultInitialization);
}
```

![2.InitializeOncePerProcess-function](2.InitializeOncePerProcess-function.png)

Weirdly, there are two of these here, same name, different paramlist. I thought this is not possible in C. What magic is this?

Not only this, the function call is passing three params, where as the functions defined accept two or four params.

Welp, just realized, it is CPP. But the non-matching param count is still a mystery to me. May be CPP allows it?

Here is the other function:

```cpp
InitializationResult InitializeOncePerProcess(
  int argc,
  char** argv,
  InitializationSettingsFlags flags,
  ProcessFlags::Flags process_flags) { ///
}
```

From node.cc we jump to node_internals.h for `kDefaultInitialization`.

```cpp
enum InitializationSettingsFlags : uint64_t {
  kDefaultInitialization = 1 << 0,
  kInitializeV8 = 1 << 1,
  kRunPlatformInit = 1 << 2,
  kInitOpenSSL = 1 << 3
};
```

Now, `1<<0` is a fancy way of saying `1`, but it forms a theme when we look at rest of the enum.

`InitializeOncePerProcess` basically sets up `init_flags`, calls `per_process::enabled_debug_list.Parse` for `Debug()` calls.

Then it sets up `ResetStdio` to be called when process exits via `atexit(ResetStdio)`.

Then if the `kRunPlatformInit` flag is present, which is determined if `kDefaultInitialization` was passed to the function as `flags`, it calls `PlatformInit`.

Some yada yada, and it calls `InitializeNodeWithArgs` and passes a few data structures via reference to it.

Then it checks for a bunch of `cli_options` and reaches where it intializes v8 platform via `per_process::v8_platform.Initialize`.

After which, it checks if `kInitializeV8` flag is present and if so, it calls `V8::Initialize`.

Here's what it looks like in diagrams.

![3.node-start.2022.01.15](3.node-start.2022.01.15.png)

![4.node-start-InitializeOncePerProcess.2022.01.15](4.node-start-InitializeOncePerProcess.2022.01.15.png)

This is basically all of the first line of the Start function. Then start function gets to create `v8::StartupData * blob`, initializes `uv_default_loop` for event looping and runs a `NodeMainInstance`.

Then it calls `TearDownOncePerProcess`.

I am going to look a bit deeper into it soon, but before that I am going to take a look at libuv and event_loop implementation.


## Stop

```cpp
int Stop(Environment* env) {
  env->ExitEnv();
  return 0;
}
```

</body>
</html>
