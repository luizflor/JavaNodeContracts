import { Person } from '../model/person';
import { PEOPLE } from '../model/inMemoryPeople';

var mq = require("./mq");
//mq.receive();
let id;
function findPerson(person: Person) {
    return person.id === id;
}
var people = PEOPLE;
module.exports = function (app) {
    //send first person
    app.get('/api/send', function (req, res) {
        console.log('/api/send');
        let person: Person = people[0];
        mq.send(person);
    });

    //send all people
    app.get('/api/people', function (req, res) {
        console.log('/api/setupPerson: '+JSON.stringify(people))
        people.forEach(person => {
            mq.send(person);
        });        
        res.send(people);
    });
    //send person by id
    app.get('/api/people/:id', function (req, res) {
        id = parseInt(req.params.id);
        console.log('api/people/' + id);
        let persons = people.filter(findPerson);

        if (persons.length > 0) {
            let person: Person = persons[0];
            console.log("person: " + JSON.stringify(person));
            mq.send(person);
            res.send(person);
        } else {
            console.log('Not found');
            res.status(404).send('Not found');
        }
    });
}