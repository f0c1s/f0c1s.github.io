function usingUnknown(a, b) {
    return a + b;
}
console.log(usingUnknown("ben", 10));
console.log(usingUnknown(10, 10));
function usingUnknownWithoutWarning(a, b) {
    return typeof a === "number" ? a + b : b;
}
console.log(usingUnknownWithoutWarning("ben", 10));
console.log(usingUnknownWithoutWarning(10, 10));
