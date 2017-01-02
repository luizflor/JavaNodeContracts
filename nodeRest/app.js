var express = require('express');
var app = express();
var setupController = require('./controllers/setupController');

var port = process.env.PORT || 3000;

setupController(app);

app.listen(port);