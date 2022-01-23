function concatenate1(str, num) {
    var numStr = num.toString();
    return str + numStr;
}
function concatenate2(str, num) {
    return str + num;
}
console.log(concatenate1("Hello", 5));
console.log(concatenate2("World", 9));
console.log(concatenate2("World", "007"));
function concat(a, b) {
    return a + b;
}
console.log(concat("World", 9));
console.log(concat("World", "007"));
