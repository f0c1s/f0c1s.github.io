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
