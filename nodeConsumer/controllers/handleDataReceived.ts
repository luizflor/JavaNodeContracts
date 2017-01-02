import { Person } from '../model/person';
function getPerson(p:Person): string{
       return 'id: ' + p.id + ' firstName: ' + p.firstName + ' lastName: ' + p.lastName + ' age: ' + p.age;
}
module.exports.HandleDataReceived =
    (person: Person) => {
        console.log('Logging with Typescript '+ getPerson(person));
    };