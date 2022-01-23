function usingAny(a: any, b: number) {
    return a + b;
}

console.log(usingAny("ben", 10));   // "ben10"
console.log(usingAny(10, 10));      // 20
