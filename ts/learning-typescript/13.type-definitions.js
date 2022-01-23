function createPerson(name, age, unit) {
    return {
        name: name,
        age: {
            value: age,
            unit: unit
        }
    };
}
console.log(createPerson("FNU", 99, "years"));
