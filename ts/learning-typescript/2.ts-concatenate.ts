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


function concat<T extends string>(a: T, b: T): string {
    return a + b;
}

console.log(concat("World", 9));
console.log(concat("World", "007"));
