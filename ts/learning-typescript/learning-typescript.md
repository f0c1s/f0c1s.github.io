<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>blog.f0c1s.com/ts/learning-typescript</title>
    <link rel="stylesheet" href="../../index.css"/>
    <script src="../../setup.js" async></script>
    <link rel="stylesheet" href="../../highlight/styles/monokai.min.css"/>
    <script src="../../highlight/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>

</head>
<body onload="setup()">
<h1>
    /f0c1s/blog/ts/learning-typescript
</h1>
<nav>
    <a href="../../index.html">/blog</a>
    <a href="../index.html">ts</a>
    <a href="../../ts/learning-typescript/learning-typescript.html">+ learning typescript</a>
</nav>

## TypeScript blocks bad semantics

### adding number and a string

There is no point in adding a number and a string, unless that is specifically what you want.

```typescript
function add(a, b) {
    return a + b
}

console.log(add(10, 20))
console.log(add(10, "a"))
```

The generated js code looks like:

```javascript
function add(a, b) {
    return a + b;
}
console.log(add(10, 20));
console.log(add(10, "a"));
```

When you compile and run it via `tsc code.ts && node code.js`; it just works. But contrast it with the following code
that throws error warning.

```typescript
function sum(a: number, b: number) {
    return a + b
}

console.log(sum(10, 20))
console.log(sum(10, "a"))
```

The error while compiling it is:

```shell
tsc 1.ts-bad-semantics-blocked.ts
1.ts-bad-semantics-blocked.ts:13:21 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

13 console.log(sum(10, "a"))
                       ~~~


Found 1 error.

```

![1. compilation error](1.img-bad-semantics-blocked-error.png)

But the `tsc` compiler doesn't stop there. It still spits out the javascript.

```shell
node 1.ts-bad-semantics-blocked.js
30
10a
30
10a

```

### how to concatenate a string with a number

Well, there are two ways:

1. convert number to string and then concatenate two strings
2. Write function in such a way that it accepts a number or string.

```typescript
function concatenate1(str: string, num: number): string {
    const numStr = num.toString();
    return str + numStr;
}

function concatenate2(str: string, num: number | string): string {
    return str + num;
}


console.log(concatenate1("Hello", 5));
console.log(concatenate2("World", 9));
console.log(concatenate2("World", "007"));

```

```shell
tsc 2.ts-concatenate.ts && node 2.ts-concatenate.js
Hello5
World9
World007

```

There is one more way to do this.

### concat a string with another

```typescript
function concat<T extends string>(a: T, b: T): string {
    return a + b;
}

console.log(concat("World", 9));
console.log(concat("World", "007"));
```

```shell
tsc 2.ts-concatenate.ts && node 2.ts-concatenate.js
2.ts-concatenate.ts:19:29 - error TS2345: Argument of type '9' is not assignable to parameter of type '"World"'.

19 console.log(concat("World", 9));
                               ~


Found 1 error.
```

[Check out: 3.ts-concat](3.ts-concat.ts)

```typescript
function concat<T extends string>(a: T, b: T) {
    return a + b;
}

console.log(concat("World", "9"));
console.log(concat("World", "007"));

```

## any

don't use it.

![5.do-not-use-any](5.do-not-use-any.png)

```typescript
function usingAny(a: any, b: number) {
    return a + b;
}

console.log(usingAny("ben", 10));   // "ben10"
console.log(usingAny(10, 10));      // 20

```

[Check out 6.using-any](6.using-any.ts)

## unknown

use `unknown` instead of `any`

```typescript
function usingUnknown(a: unknown, b: number) {
    return a + b;
}

console.log(usingUnknown("ben", 10));
console.log(usingUnknown(10, 10));

function usingUnknownWithoutWarning(a: unknown, b: number) {
    return typeof a === "number" ? a + b : b;
}

console.log(usingUnknownWithoutWarning("ben", 10)); // 10
console.log(usingUnknownWithoutWarning(10, 10));    // 20

```

[Check out 7.using-unknown](7.using-unknown.ts)

![8.error-thrown-while-using-unknown-with-number](8.error-thrown-while-using-unknown-with-number.png)

The code works for the `usingUnknownWithoutWarning` function, because it is taking care of unknown type.

## oh, one thing

```typescript
const x = 10;
console.log(typeof x);  // says, const x: 10

let y = 10;
console.log(typeof y);  // says, let y: number
```

Notice that the `const` and `let` alter the meaning of the code a little bit.

This works for `bigint` too

```typescript
const xb = 10n;
console.log(typeof xb);  // says, const xb: 10n

let yb = 10n;
console.log(typeof yb);  // says, let yb: bigint

const xs = "10";
console.log(typeof xs); // says, const xs: "10"

let ys = "10";
console.log(typeof ys); // says, const ys: string

```

But this doesn't apply to object types. There is no difference.

```typescript
const xobj = {name: "name"};
console.log(typeof xobj);   // const xobj: {name: string}

let yobj = {name: "name"};
console.log(typeof yobj);   // let yobj: {name: string}
```

[Check out 9.barely-types](9.barely-types.ts)

## optionals

```typescript
function maybeDouble(n: number, factor?: number) {
    factor = factor || 2;
    return n * factor;
}

console.log(maybeDouble(10));       // 20
console.log(maybeDouble(10, 3));    // 30

```

![11.optionals](11.optionals.png)

The code above highlights the optional param that may or may not be passed to the function.

Types in TS can be explicitely defined or defined with the object creation too.

```typescript
type PersonType = {
    firstName: string;
    lastName: string;
    middleName?: string;
}

const p1: PersonType = {
    firstName: "first",
    lastName: "last",
    middleName: "mid"
};
console.log(p1);    // { firstName: 'first', lastName: 'last', middleName: 'mid' }

const p2: PersonType = {
    firstName: "FNU",
    lastName: "first",
};
console.log(p2);    // { firstName: 'FNU', lastName: 'first' }
```

![12.person-with-inline-type](12.person-with-inline-type.png)

```typescript
const person: { first: string, age?: number, address?: string } = {first: "FNU", age: 99};
console.log(person);
```

[Check out 10.optional](10.optional.ts)

## types

```typescript
type AgeUnit = "years" | "months" | "days";

type Age = {
    value: number;
    unit: AgeUnit;
}

type Person = {
    name: string;
    age: Age;
}

function createPerson(name: string, age: number, unit: AgeUnit): Person {
    return {
        name,
        age: {
            value: age,
            unit: unit
        }
    };
}

console.log(createPerson("FNU", 99, "years")); // { name: 'FNU', age: { value: 99, unit: 'years' } }

```

[Check out 13.type-definitions](13.type-definitions.ts)

## References

- [Github repo](https://github.com/microsoft/TypeScript)
- [dos and don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

</body>
</html>
