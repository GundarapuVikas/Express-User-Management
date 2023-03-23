"use strict";

var express = require("express");
var userRoutes = require("./routes/routes");
var config = require('../config');
console.log(config);
var app = express();
app.use(express.json());
app.use('/', userRoutes);
var server = app.listen(config.PORT, function () {
  console.log("Listening at: localhost:".concat(config.PORT));
});
module.exports = server;