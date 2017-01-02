"use strict";
var EventEmitter = require('events');
var amqp = require('amqplib/callback_api');

var TESTQ_QUEUE = 'TestQ';
var EXCHANGE = 'EXCHANGE';

var AMQP_HOST = process.env["AMQP_HOST"] || "localhost";
var AMQP_PORT = process.env["AMQP_PORT"] || 5672;
var amqpUrl = "amqp://" + AMQP_HOST + ":" + AMQP_PORT;

console.log("Setting up events");
console.log("Creating an AMQP Client (" + amqpUrl + ")");
module.exports = {
    send: function (data) {
        amqp.connect(amqpUrl, (err, conn) => {
            conn.createChannel((channelErr, channel) => {
                console.log("Asserting queue:  " + TESTQ_QUEUE);
                channel.assertQueue(TESTQ_QUEUE, { durable: false, exclusive:false, autoDelete: true });

                console.log("Asserting exchange:  " + EXCHANGE);
                channel.assertExchange(EXCHANGE, "topic", { durable: false,exclusive:false, autoDelete: true });

                console.log("Ensuring bindings");
                channel.bindQueue(TESTQ_QUEUE, EXCHANGE, TESTQ_QUEUE);
                console.log('Publish: ' + JSON.stringify(data));
                channel.publish(EXCHANGE, TESTQ_QUEUE, new Buffer(JSON.stringify(data)));
            });
        });
    }
}