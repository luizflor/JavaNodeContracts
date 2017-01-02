"use strict";
const inMemoryPeople_1 = require("../model/inMemoryPeople");
var mq = require("./mq");
//mq.receive();
let id;
function findPerson(person) {
    return person.id === id;
}
var people = inMemoryPeople_1.PEOPLE;
module.exports = function (app) {
    //send first person
    app.get('/api/send', function (req, res) {
        console.log('/api/send');
        let person = people[0];
        mq.send(person);
    });
    //send all people
    app.get('/api/people', function (req, res) {
        console.log('/api/setupPerson: ' + JSON.stringify(people));
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
            let person = persons[0];
            console.log("person: " + JSON.stringify(person));
            mq.send(person);
            res.send(person);
        }
        else {
            console.log('Not found');
            res.status(404).send('Not found');
        }
    });
};
//# sourceMappingURL=setupController.js.map