const x = 10;
console.log(typeof x);  // says, const x: 10

let y = 10;
console.log(typeof y);  // says, let y: number

const xb = 10n;
console.log(typeof xb);  // says, const xb: 10n

let yb = 10n;
console.log(typeof yb);  // says, let yb: bigint

const xs = "10";
console.log(typeof xs); // says, const xs: "10"

let ys = "10";
console.log(typeof ys); // says, const ys: string

const xobj = {name: "name"};
console.log(typeof xobj);   // const xobj: {name: string}

let yobj = {name: "name"};
console.log(typeof yobj);   // let yobj: {name: string}
