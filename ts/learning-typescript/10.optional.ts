function maybeDouble(n: number, factor?: number) {
    factor = factor || 2;
    return n * factor;
}

console.log(maybeDouble(10));              // 20
console.log(maybeDouble(10, 3));    // 30

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


const person: { first: string, age?: number, address?: string } = {first: "FNU", age: 99};
console.log(person);
