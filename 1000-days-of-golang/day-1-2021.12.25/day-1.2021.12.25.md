<html lang="en">
    <head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>blog.f0c1s.com/1000-days-of-golang/day 1</title>
    <script src="../../setup.js" async></script>
    <link rel="stylesheet" href="../../index.css" />
    <link rel="stylesheet" href="../../highlight/styles/monokai.min.css"/>
    <script src="../../highlight/highlight.min.js"></script>

    </head>

<body onload="setup()">
<h1>/f0c1s/blog/1000-days-of-golang/Day 1</h1>

2021.12.25 Saturday

<p>
    <a href="../../index.html">blog</a>
    <a href="../../1000-days-of-golang/1000-days-of-golang.html">1000-days-of-golang</a>
    <a href="../../1000-days-of-golang/day-1-2021.12.25/day-1.2021.12.25.html">+ Day 1 of 1000 days of golang 2021.12.25 Saturday</a>
</p>

## lets go

- I am going to say Go instead of GoLang or golang, for the sake of brevity.
- Go is a compiled language.
- Go programs are packaged, managed via package keyword.
- main is special package name
- Go programs can contain package-name declaration, import(s) block, declarations for variables, constants, and types,
  and functions.
    - I am not aware of classes in Go as of right now.

## hello.go

```go
package main

import "fmt"

func main() {
	fmt.Println("hello, world!")
}

```

### printing a const string

```go
package main

import "fmt"

const hello = "hello, world!"

func main() {
	fmt.Println(hello)
}

```

```shell
GOROOT=/usr/lib/go-1.17 #gosetup
GOPATH=/home/f0c1s/go #gosetup
/usr/lib/go-1.17/bin/go build -o /tmp/GoLand/___go_build_1000_days_day_1_hello_world 1000-days-day-1-hello-world #gosetup
/tmp/GoLand/___go_build_1000_days_day_1_hello_world
hello, world!
```

### calling another function

```go
package main

import "fmt"

const hello = "hello, world!"

func sayHello() {
	fmt.Println(hello)
}

func main() {
	sayHello()
}

```

### passing a value to another function

```go
package main

import "fmt"

const hello = "hello, world!"

func say(that string) {
	fmt.Println(that)
}

func main() {
	say(hello)
}

```

Notice how we need to say `variable type` instead of `type variable` or `variable: type`.

### what if I define function to be called after I use it first

```go
package main

import "fmt"

const hello = "hello, world!"

func main() {
	say(hello)
}

func say(that string) {
	fmt.Println(that)
}
```

```shell
GOROOT=/usr/lib/go-1.17 #gosetup
GOPATH=/home/f0c1s/go #gosetup
/usr/lib/go-1.17/bin/go build -o /tmp/GoLand/___go_build_hello_go /home/f0c1s/go/src/1000-days-day-1-hello-world/hello.go #gosetup
/tmp/GoLand/___go_build_hello_go
hello, world!

Process finished with the exit code 0

```

This worked. This makes me think that parsing of Go source file happens in multiple phases, otherwise, how would it know
what to link if it has not seen it earlier?

OR, my IDE is screwing things up for me.

OR, my understanding is just wrong, which I understand is totally possible.

```shell
go run hello.go                                                                                          
hello, world!

```

It works. So it is not the IDE.

Go does allow for functions to be defined later that first execution. This is similar to JavaScript, but there functions
are hoisted up. I am not sure if that is happening here.

### Do constants get hoisted

Yes!

```go
package main

import "fmt"

func main() {
	say(hello)
	say(world)
}

func say(that string) {
	fmt.Println(that)
}

const hello = "hello"
const world = "world!!!"
```

Even the constants are getting hoisted up.

```shell
go run hello.go
hello
world!!!

```

## Parsing go source code

### hello.go

```go
package main

import "fmt"

func sayHello() {
	say(hello)
	say(world)
}

func say(that string) {
	fmt.Println(that)
}

const hello = "hello"
const world = "world!!!"

```

This file is insignificant in this case, because we are parsing the source code in parse-hello.go via a variable.

But, there can be only one main function, and only one package in a directory; thus this file deserves a change.

### parse-hello.go

```go
package main

import (
	"fmt"
	"go/parser"
	"go/token"
)

func main() {
	fset := token.NewFileSet()
	src := `
package main

import "fmt"

func sayHello() {
	say(hello)
	say(world)
}

func say(that string) {
	fmt.Println(that)
}

const hello = "hello"
const world = "world!!!"
`
	f, err := parser.ParseFile(fset, "why-does-this-not-matter?", src, parser.ImportsOnly)
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, s := range f.Imports {
		fmt.Println(s.Path.Value)
	}
}
```

- One directory can have only one package.
- There can be only one main function.
- Can I call function from other file just by name, since it is already in the same package?

## Calling function from another file in Go

I added `sayHello()` function call and it didn't work.

```shell
go run parse-hello.go
# command-line-arguments
./parse-hello.go:37:2: undefined: sayHello
```

- this is because Go doesn't know where to look for sayHello.

```shell
go run hello.go parse-hello.go
"fmt"
hello
world!!!

```

We can!

I can also use:

- `go run .` OR
- `go run *.go`

## Can I just print a function?

I basically want to see what happens when I do `fmt.Println(fmt.Println)`. This should fail to print source code, this
is not JavaScript.

![1.this-is-not-javascript](1.this-is-not-javascript.png)

```go
package main

import "fmt"

func main() {
	fmt.Println(fmt.Println)
}

```

```shell
go run print-func.go          
0x479000

```

It didn't fail the way I was thinking. It is printing address of the function.

### fails...

```go
package main

import "fmt"

func main() {
	fmt.Println(fmt.Println)
	fmt.Println(fmt.Print)
	fmt.Println(fmt)
}

```

```shell
go run print-func.go
# command-line-arguments
./print-func.go:8:13: use of package fmt without selector

```

### more addresses

```go
package main

import "fmt"

func main() {
	fmt.Println(fmt.Println)
	fmt.Println(fmt.Print)
	fmt.Println(fmt.Fprintln)
	fmt.Println(fmt.Fprint)
}

```

```shell
go run print-func.go
0x479180
0x479000
0x479080
0x478f00

```

![2.warnings-on-printing-function-addresses](2.warnings-on-printing-function-addresses.png)

#### Build and dump

```shell
go build print-func.go
objdump -x print-func > objdump.-x.print-func.txt
```

[Checkout 3.objdump.-x.print-func.txt](3.objdump.-x.print-func.txt)

![4.code-output-matches-objdump-output](4.code-output-matches-objdump-output.png)

```shell
objdump -xsSDd print-func > objdump.-xsSDd.print-func.txt
# this generates a huge file, 35MB+. I am not putting it here...
```

```shell
0000000000478f00 <fmt.Fprint>:
  478f00:	49 3b 66 10          	cmp    0x10(%r14),%rsp
  478f04:	0f 86 9d 00 00 00    	jbe    478fa7 <fmt.Fprint+0xa7>
  478f0a:	48 83 ec 48          	sub    $0x48,%rsp
  478f0e:	48 89 6c 24 40       	mov    %rbp,0x40(%rsp)
  478f13:	48 8d 6c 24 40       	lea    0x40(%rsp),%rbp
  478f18:	48 89 74 24 70       	mov    %rsi,0x70(%rsp)
  478f1d:	48 89 7c 24 68       	mov    %rdi,0x68(%rsp)
  478f22:	48 89 4c 24 60       	mov    %rcx,0x60(%rsp)
  478f27:	48 89 44 24 50       	mov    %rax,0x50(%rsp)
  478f2c:	48 89 5c 24 58       	mov    %rbx,0x58(%rsp)
  478f31:	e8 0a fd ff ff       	call   478c40 <fmt.newPrinter>
  478f36:	48 89 44 24 28       	mov    %rax,0x28(%rsp)
  478f3b:	48 8b 5c 24 60       	mov    0x60(%rsp),%rbx
  478f40:	48 8b 4c 24 68       	mov    0x68(%rsp),%rcx
  478f45:	48 8b 7c 24 70       	mov    0x70(%rsp),%rdi
  478f4a:	e8 71 51 00 00       	call   47e0c0 <fmt.(*pp).doPrint>
  478f4f:	48 8b 44 24 50       	mov    0x50(%rsp),%rax
  478f54:	48 8b 40 18          	mov    0x18(%rax),%rax
  478f58:	48 8b 4c 24 28       	mov    0x28(%rsp),%rcx
  478f5d:	48 8b 19             	mov    (%rcx),%rbx
  478f60:	48 8b 51 08          	mov    0x8(%rcx),%rdx
  478f64:	48 8b 79 10          	mov    0x10(%rcx),%rdi
  478f68:	48 89 c6             	mov    %rax,%rsi
  478f6b:	48 8b 44 24 58       	mov    0x58(%rsp),%rax
  478f70:	48 89 d1             	mov    %rdx,%rcx
  478f73:	ff d6                	call   *%rsi
  478f75:	48 89 44 24 20       	mov    %rax,0x20(%rsp)
  478f7a:	48 89 5c 24 30       	mov    %rbx,0x30(%rsp)
  478f7f:	48 89 4c 24 38       	mov    %rcx,0x38(%rsp)
  478f84:	48 8b 44 24 28       	mov    0x28(%rsp),%rax
  478f89:	e8 52 fd ff ff       	call   478ce0 <fmt.(*pp).free>
  478f8e:	48 8b 44 24 20       	mov    0x20(%rsp),%rax
  478f93:	48 8b 5c 24 30       	mov    0x30(%rsp),%rbx
  478f98:	48 8b 4c 24 38       	mov    0x38(%rsp),%rcx
  478f9d:	48 8b 6c 24 40       	mov    0x40(%rsp),%rbp
  478fa2:	48 83 c4 48          	add    $0x48,%rsp
  478fa6:	c3                   	ret    
  478fa7:	48 89 44 24 08       	mov    %rax,0x8(%rsp)
  478fac:	48 89 5c 24 10       	mov    %rbx,0x10(%rsp)
  478fb1:	48 89 4c 24 18       	mov    %rcx,0x18(%rsp)
  478fb6:	48 89 7c 24 20       	mov    %rdi,0x20(%rsp)
  478fbb:	48 89 74 24 28       	mov    %rsi,0x28(%rsp)
  478fc0:	e8 3b fc fd ff       	call   458c00 <runtime.morestack_noctxt.abi0>
  478fc5:	48 8b 44 24 08       	mov    0x8(%rsp),%rax
  478fca:	48 8b 5c 24 10       	mov    0x10(%rsp),%rbx
  478fcf:	48 8b 4c 24 18       	mov    0x18(%rsp),%rcx
  478fd4:	48 8b 7c 24 20       	mov    0x20(%rsp),%rdi
  478fd9:	48 8b 74 24 28       	mov    0x28(%rsp),%rsi
  478fde:	66 90                	xchg   %ax,%ax
  478fe0:	e9 1b ff ff ff       	jmp    478f00 <fmt.Fprint>
  478fe5:	cc                   	int3   
  478fe6:	cc                   	int3   
  478fe7:	cc                   	int3   
  478fe8:	cc                   	int3   
  478fe9:	cc                   	int3   
  478fea:	cc                   	int3   
  478feb:	cc                   	int3   
  478fec:	cc                   	int3   
  478fed:	cc                   	int3   
  478fee:	cc                   	int3   
  478fef:	cc                   	int3   
  478ff0:	cc                   	int3   
  478ff1:	cc                   	int3   
  478ff2:	cc                   	int3   
  478ff3:	cc                   	int3   
  478ff4:	cc                   	int3   
  478ff5:	cc                   	int3   
  478ff6:	cc                   	int3   
  478ff7:	cc                   	int3   
  478ff8:	cc                   	int3   
  478ff9:	cc                   	int3   
  478ffa:	cc                   	int3   
  478ffb:	cc                   	int3   
  478ffc:	cc                   	int3   
  478ffd:	cc                   	int3   
  478ffe:	cc                   	int3   
  478fff:	cc                   	int3   

0000000000479000 <fmt.Print>:
  479000:	49 3b 66 10          	cmp    0x10(%r14),%rsp
  479004:	76 3c                	jbe    479042 <fmt.Print+0x42>
  479006:	48 83 ec 30          	sub    $0x30,%rsp
  47900a:	48 89 6c 24 28       	mov    %rbp,0x28(%rsp)
  47900f:	48 8d 6c 24 28       	lea    0x28(%rsp),%rbp
  479014:	48 89 44 24 38       	mov    %rax,0x38(%rsp)
  479019:	48 8b 15 10 ce 0a 00 	mov    0xace10(%rip),%rdx        # 525e30 <os.Stdout>
  479020:	48 89 df             	mov    %rbx,%rdi
  479023:	48 89 ce             	mov    %rcx,%rsi
  479026:	48 89 d3             	mov    %rdx,%rbx
  479029:	48 89 c1             	mov    %rax,%rcx
  47902c:	48 8d 05 ad 88 03 00 	lea    0x388ad(%rip),%rax        # 4b18e0 <go.itab.*os.File,io.Writer>
  479033:	e8 c8 fe ff ff       	call   478f00 <fmt.Fprint>
  479038:	48 8b 6c 24 28       	mov    0x28(%rsp),%rbp
  47903d:	48 83 c4 30          	add    $0x30,%rsp
  479041:	c3                   	ret    
  479042:	48 89 44 24 08       	mov    %rax,0x8(%rsp)
  479047:	48 89 5c 24 10       	mov    %rbx,0x10(%rsp)
  47904c:	48 89 4c 24 18       	mov    %rcx,0x18(%rsp)
  479051:	e8 aa fb fd ff       	call   458c00 <runtime.morestack_noctxt.abi0>
  479056:	48 8b 44 24 08       	mov    0x8(%rsp),%rax
  47905b:	48 8b 5c 24 10       	mov    0x10(%rsp),%rbx
  479060:	48 8b 4c 24 18       	mov    0x18(%rsp),%rcx
  479065:	eb 99                	jmp    479000 <fmt.Print>
  479067:	cc                   	int3   
  479068:	cc                   	int3   
  479069:	cc                   	int3   
  47906a:	cc                   	int3   
  47906b:	cc                   	int3   
  47906c:	cc                   	int3   
  47906d:	cc                   	int3   
  47906e:	cc                   	int3   
  47906f:	cc                   	int3   
  479070:	cc                   	int3   
  479071:	cc                   	int3   
  479072:	cc                   	int3   
  479073:	cc                   	int3   
  479074:	cc                   	int3   
  479075:	cc                   	int3   
  479076:	cc                   	int3   
  479077:	cc                   	int3   
  479078:	cc                   	int3   
  479079:	cc                   	int3   
  47907a:	cc                   	int3   
  47907b:	cc                   	int3   
  47907c:	cc                   	int3   
  47907d:	cc                   	int3   
  47907e:	cc                   	int3   
  47907f:	cc                   	int3   

0000000000479080 <fmt.Fprintln>:
  479080:	49 3b 66 10          	cmp    0x10(%r14),%rsp
  479084:	0f 86 9d 00 00 00    	jbe    479127 <fmt.Fprintln+0xa7>
  47908a:	48 83 ec 48          	sub    $0x48,%rsp
  47908e:	48 89 6c 24 40       	mov    %rbp,0x40(%rsp)
  479093:	48 8d 6c 24 40       	lea    0x40(%rsp),%rbp
  479098:	48 89 74 24 70       	mov    %rsi,0x70(%rsp)
  47909d:	48 89 7c 24 68       	mov    %rdi,0x68(%rsp)
  4790a2:	48 89 4c 24 60       	mov    %rcx,0x60(%rsp)
  4790a7:	48 89 44 24 50       	mov    %rax,0x50(%rsp)
  4790ac:	48 89 5c 24 58       	mov    %rbx,0x58(%rsp)
  4790b1:	e8 8a fb ff ff       	call   478c40 <fmt.newPrinter>
  4790b6:	48 89 44 24 28       	mov    %rax,0x28(%rsp)
  4790bb:	48 8b 5c 24 60       	mov    0x60(%rsp),%rbx
  4790c0:	48 8b 4c 24 68       	mov    0x68(%rsp),%rcx
  4790c5:	48 8b 7c 24 70       	mov    0x70(%rsp),%rdi
  4790ca:	e8 f1 51 00 00       	call   47e2c0 <fmt.(*pp).doPrintln>
  4790cf:	48 8b 44 24 50       	mov    0x50(%rsp),%rax
  4790d4:	48 8b 40 18          	mov    0x18(%rax),%rax
  4790d8:	48 8b 4c 24 28       	mov    0x28(%rsp),%rcx
  4790dd:	48 8b 19             	mov    (%rcx),%rbx
  4790e0:	48 8b 51 08          	mov    0x8(%rcx),%rdx
  4790e4:	48 8b 79 10          	mov    0x10(%rcx),%rdi
  4790e8:	48 89 c6             	mov    %rax,%rsi
  4790eb:	48 8b 44 24 58       	mov    0x58(%rsp),%rax
  4790f0:	48 89 d1             	mov    %rdx,%rcx
  4790f3:	ff d6                	call   *%rsi
  4790f5:	48 89 44 24 20       	mov    %rax,0x20(%rsp)
  4790fa:	48 89 5c 24 30       	mov    %rbx,0x30(%rsp)
  4790ff:	48 89 4c 24 38       	mov    %rcx,0x38(%rsp)
  479104:	48 8b 44 24 28       	mov    0x28(%rsp),%rax
  479109:	e8 d2 fb ff ff       	call   478ce0 <fmt.(*pp).free>
  47910e:	48 8b 44 24 20       	mov    0x20(%rsp),%rax
  479113:	48 8b 5c 24 30       	mov    0x30(%rsp),%rbx
  479118:	48 8b 4c 24 38       	mov    0x38(%rsp),%rcx
  47911d:	48 8b 6c 24 40       	mov    0x40(%rsp),%rbp
  479122:	48 83 c4 48          	add    $0x48,%rsp
  479126:	c3                   	ret    
  479127:	48 89 44 24 08       	mov    %rax,0x8(%rsp)
  47912c:	48 89 5c 24 10       	mov    %rbx,0x10(%rsp)
  479131:	48 89 4c 24 18       	mov    %rcx,0x18(%rsp)
  479136:	48 89 7c 24 20       	mov    %rdi,0x20(%rsp)
  47913b:	48 89 74 24 28       	mov    %rsi,0x28(%rsp)
  479140:	e8 bb fa fd ff       	call   458c00 <runtime.morestack_noctxt.abi0>
  479145:	48 8b 44 24 08       	mov    0x8(%rsp),%rax
  47914a:	48 8b 5c 24 10       	mov    0x10(%rsp),%rbx
  47914f:	48 8b 4c 24 18       	mov    0x18(%rsp),%rcx
  479154:	48 8b 7c 24 20       	mov    0x20(%rsp),%rdi
  479159:	48 8b 74 24 28       	mov    0x28(%rsp),%rsi
  47915e:	66 90                	xchg   %ax,%ax
  479160:	e9 1b ff ff ff       	jmp    479080 <fmt.Fprintln>
  479165:	cc                   	int3   
  479166:	cc                   	int3   
  479167:	cc                   	int3   
  479168:	cc                   	int3   
  479169:	cc                   	int3   
  47916a:	cc                   	int3   
  47916b:	cc                   	int3   
  47916c:	cc                   	int3   
  47916d:	cc                   	int3   
  47916e:	cc                   	int3   
  47916f:	cc                   	int3   
  479170:	cc                   	int3   
  479171:	cc                   	int3   
  479172:	cc                   	int3   
  479173:	cc                   	int3   
  479174:	cc                   	int3   
  479175:	cc                   	int3   
  479176:	cc                   	int3   
  479177:	cc                   	int3   
  479178:	cc                   	int3   
  479179:	cc                   	int3   
  47917a:	cc                   	int3   
  47917b:	cc                   	int3   
  47917c:	cc                   	int3   
  47917d:	cc                   	int3   
  47917e:	cc                   	int3   
  47917f:	cc                   	int3

0000000000479180 <fmt.Println>:
  479180:	49 3b 66 10          	cmp    0x10(%r14),%rsp
  479184:	76 3c                	jbe    4791c2 <fmt.Println+0x42>
  479186:	48 83 ec 30          	sub    $0x30,%rsp
  47918a:	48 89 6c 24 28       	mov    %rbp,0x28(%rsp)
  47918f:	48 8d 6c 24 28       	lea    0x28(%rsp),%rbp
  479194:	48 89 44 24 38       	mov    %rax,0x38(%rsp)
  479199:	48 8b 15 90 cc 0a 00 	mov    0xacc90(%rip),%rdx        # 525e30 <os.Stdout>
  4791a0:	48 89 df             	mov    %rbx,%rdi
  4791a3:	48 89 ce             	mov    %rcx,%rsi
  4791a6:	48 89 d3             	mov    %rdx,%rbx
  4791a9:	48 89 c1             	mov    %rax,%rcx
  4791ac:	48 8d 05 2d 87 03 00 	lea    0x3872d(%rip),%rax        # 4b18e0 <go.itab.*os.File,io.Writer>
  4791b3:	e8 c8 fe ff ff       	call   479080 <fmt.Fprintln>
  4791b8:	48 8b 6c 24 28       	mov    0x28(%rsp),%rbp
  4791bd:	48 83 c4 30          	add    $0x30,%rsp
  4791c1:	c3                   	ret    
  4791c2:	48 89 44 24 08       	mov    %rax,0x8(%rsp)
  4791c7:	48 89 5c 24 10       	mov    %rbx,0x10(%rsp)
  4791cc:	48 89 4c 24 18       	mov    %rcx,0x18(%rsp)
  4791d1:	e8 2a fa fd ff       	call   458c00 <runtime.morestack_noctxt.abi0>
  4791d6:	48 8b 44 24 08       	mov    0x8(%rsp),%rax
  4791db:	48 8b 5c 24 10       	mov    0x10(%rsp),%rbx
  4791e0:	48 8b 4c 24 18       	mov    0x18(%rsp),%rcx
  4791e5:	eb 99                	jmp    479180 <fmt.Println>
  4791e7:	cc                   	int3   
  4791e8:	cc                   	int3   
  4791e9:	cc                   	int3   
  4791ea:	cc                   	int3   
  4791eb:	cc                   	int3   
  4791ec:	cc                   	int3   
  4791ed:	cc                   	int3   
  4791ee:	cc                   	int3   
  4791ef:	cc                   	int3   
  4791f0:	cc                   	int3   
  4791f1:	cc                   	int3   
  4791f2:	cc                   	int3   
  4791f3:	cc                   	int3   
  4791f4:	cc                   	int3   
  4791f5:	cc                   	int3   
  4791f6:	cc                   	int3   
  4791f7:	cc                   	int3   
  4791f8:	cc                   	int3   
  4791f9:	cc                   	int3   
  4791fa:	cc                   	int3   
  4791fb:	cc                   	int3   
  4791fc:	cc                   	int3   
  4791fd:	cc                   	int3   
  4791fe:	cc                   	int3   
  4791ff:	cc                   	int3 
```

## Go is open sourced

Lets see what fmt.Println looks like.

[print.go at source site](https://go.dev/src/fmt/print.go)

![5.Fprintln-source-code](5.Fprintln-source-code.png)

```go
// These routines end in 'ln', do not take a format string,
// always add spaces between operands, and add a newline
// after the last operand.

// Fprintln formats using the default formats for its operands and writes to w.
// Spaces are always added between operands and a newline is appended.
// It returns the number of bytes written and any write error encountered.
func Fprintln(w io.Writer, a ...interface{}) (n int, err error) {
	p := newPrinter()
	p.doPrintln(a)
	n, err = w.Write(p.buf)
	p.free()
	return
}
```

![6.Println-source-code](6.Println-source-code.png)

```go
// Println formats using the default formats for its operands and writes to standard output.
// Spaces are always added between operands and a newline is appended.
// It returns the number of bytes written and any write error encountered.
func Println(a ...interface{}) (n int, err error) {
	return Fprintln(os.Stdout, a...)
}
```

Here is my understanding of this piece of code:

- `(a ...interface{})` is input parameter list.
- `(n int, err error)` is output list.
- This function returns two values, number of bytes written and error if any.

<script>hljs.highlightAll();</script>
</body>
</html>
