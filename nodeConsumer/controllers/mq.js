"use strict";
var EventEmitter = require('events');
var amqp = require('amqplib/callback_api');
var HandleDataReceived = require("./handleDataReceived.js").HandleDataReceived;

class GatewayEmitter extends EventEmitter { };
const gatewayEmitter = new GatewayEmitter();

var TESTQ_QUEUE = 'TestQ';
var EXCHANGE = 'EXCHANGE';

var AMQP_HOST = process.env["AMQP_HOST"] || "localhost";
var AMQP_PORT = process.env["AMQP_PORT"] || 5672;
var amqpUrl = "amqp://" + AMQP_HOST + ":" + AMQP_PORT;

console.log("Setting up events");
gatewayEmitter.on('data-received', HandleDataReceived);

console.log("Creating an AMQP Client (" + amqpUrl + ")");
module.exports = {
    receive: function () {
        amqp.connect(amqpUrl, (err, conn) => {

            conn.createChannel((channelErr, channel) => {
                console.log("Asserting queue:  " + TESTQ_QUEUE);
                channel.assertQueue(TESTQ_QUEUE, { durable: false, autoDelete: true });

                console.log("Asserting exchange:  " + EXCHANGE);
                channel.assertExchange(EXCHANGE, "topic", { durable: false, autoDelete: true });

                console.log("Ensuring bindings");
                channel.bindQueue(TESTQ_QUEUE, EXCHANGE, TESTQ_QUEUE);
                channel.consume(TESTQ_QUEUE, (message) => {
                    let data = JSON.parse(message.content);
                    console.log("Receiving: " + JSON.stringify(data));
                    gatewayEmitter.emit('data-received', data);
                }, { noAck: true });
            });
        });
    }
}