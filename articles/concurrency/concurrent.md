# Concurrent

## Concurrency

> 
> In computer science, concurrency is the ability of different parts or units of a program, algorithm, 
> or problem to be executed out-of-order or in partial order, 
> without affecting the final outcome. 
> 
> This allows for parallel execution of the concurrent units, 
> which can significantly improve overall speed of the execution in multi-processor and multi-core systems. 
> 
> In more technical terms, concurrency refers to the decomposability of a program, 
> algorithm, or problem into order-independent or partially-ordered components or units of computation.
> 

- [wiki: https://en.wikipedia.org/wiki/Concurrency_(computer_science)](https://en.wikipedia.org/wiki/Concurrency_(computer_science)) 
- [ms research: https://www.microsoft.com/en-us/research/publication/time-clocks-ordering-events-distributed-system/](https://www.microsoft.com/en-us/research/publication/time-clocks-ordering-events-distributed-system/)
  - [pdf: https://www.microsoft.com/en-us/research/uploads/prod/2016/12/Time-Clocks-and-the-Ordering-of-Events-in-a-Distributed-System.pdf](https://www.microsoft.com/en-us/research/uploads/prod/2016/12/Time-Clocks-and-the-Ordering-of-Events-in-a-Distributed-System.pdf) 

### My explanations and examples

#### single threaded execution

You can do only one thing at a time. This is rare in real world, but computers used to be like this.

There are two sub cases here, if you stop current work before finishing it or not.

Stopping before finishing and being able to pick another is called pre-emption. Earlier computers didn't have this feature.

##### Example of pre-emptive single-thread execution

A cook cooking multiple dishes. From the perspective of cook, it can work on only one dish at a time.

Cook can however stop working on one dish, and take a look at another.

##### Example of non pre-emptive single-thread execution

A surgeon operating on single patient. Surgeon cannot stop surgery before finishing, and go to operate on another patient.

##### Note

These examples are very highlevel and we are discarding small things that actors (cook and doctor) have to do.

We are, for example, ignoring the fact that both the cook and the doctor were breathing, thus doing two things at a time.

And so on...

#### Muliple threads of execution

##### PreEmptive example

Two cooks competing with each other.

##### Non PreEmptive example

Two doctors performing surgery on two different patients

#### Parallel

A solo performer playing two or more music instruments.

#### Concurrent

When a bunch of tasks don't depend upon each other and can be done in any sequence or even in parallel.

For example, in cutting vegetables phase, it doesn't matter if you cut carrots first or peel potatos.

The important thing to note is that the concurrent tasks can be done in any order and the final outcome would be same.

The other important thing is that the concurrent tasks can be trivially parallelised. 

For example, if you have to cut carrots, potatos and onions, three cooks can do it simultaneously.

## web servers

### concurrent web server in go

Go offers concurrency via go routines.

#### A simple web server in go

```go
package main

import (
	"fmt"
	"net/http"
)

func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello %s\n", r.URL.Query().Get("name"))
}

func main() {
	http.HandleFunc("/hello", hello)
	http.ListenAndServe(":8000", nil)
}

```

```shell
curl http://localhost:8000/hello
Hello
```

##### a little bit of improvement

```go
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello %s\n", r.URL.Query().Get("name"))
}

func homepage(w http.ResponseWriter, r *http.Request) {
	html, err := ioutil.ReadFile("index.html")
	if err != nil {
		fmt.Fprintf(w, "cannot read index.html")
		return
	}
	fmt.Fprintf(w, string(html))
}

func indexCss(w http.ResponseWriter, r *http.Request) {
	html, err := ioutil.ReadFile("index.css")
	if err != nil {
		fmt.Fprintf(w, "cannot read index.css")
		return
	}
	fmt.Fprintf(w, string(html))
}

func main() {
	http.HandleFunc("/hello", hello)
	http.HandleFunc("/index.css", indexCss)
	http.HandleFunc("/", homepage)
	http.ListenAndServe(":8000", nil)
}

```

```shell
ab -c 100 -n 10000 http://localhost:8000/
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            8000

Document Path:          /
Document Length:        240 bytes

Concurrency Level:      100
Time taken for tests:   0.376 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      3570000 bytes
HTML transferred:       2400000 bytes
Requests per second:    26588.60 [#/sec] (mean)
Time per request:       3.761 [ms] (mean)
Time per request:       0.038 [ms] (mean, across all concurrent requests)
Transfer rate:          9269.66 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    2   0.5      2       3
Processing:     1    2   0.5      2       5
Waiting:        0    1   0.5      1       4
Total:          1    4   0.4      4       7

Percentage of the requests served within a certain time (ms)
  50%      4
  66%      4
  75%      4
  80%      4
  90%      4
  95%      4
  98%      4
  99%      5
 100%      7 (longest request)

```

```shell
ab -c 1000 -n 100000 http://localhost:8000/
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            8000

Document Path:          /
Document Length:        240 bytes

Concurrency Level:      1000
Time taken for tests:   4.214 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      35700000 bytes
HTML transferred:       24000000 bytes
Requests per second:    23729.17 [#/sec] (mean)
Time per request:       42.142 [ms] (mean)
Time per request:       0.042 [ms] (mean, across all concurrent requests)
Transfer rate:          8272.77 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0   20   3.9     20      48
Processing:     7   22   4.6     22      56
Waiting:        1   15   4.2     14      49
Total:         26   42   2.8     42      85

Percentage of the requests served within a certain time (ms)
  50%     42
  66%     42
  75%     42
  80%     43
  90%     43
  95%     44
  98%     45
  99%     59
 100%     85 (longest request)
```