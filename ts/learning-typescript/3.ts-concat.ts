function concat<T extends string>(a: T, b: T) {
    return a + b;
}

console.log(concat("World", "9"));
console.log(concat("World", "007"));
