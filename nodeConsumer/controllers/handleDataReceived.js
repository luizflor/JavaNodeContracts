"use strict";
function getPerson(p) {
    return 'id: ' + p.id + ' firstName: ' + p.firstName + ' lastName: ' + p.lastName + ' age: ' + p.age;
}
module.exports.HandleDataReceived =
    (person) => {
        console.log('Logging with Typescript ' + getPerson(person));
    };
//# sourceMappingURL=handleDataReceived.js.map