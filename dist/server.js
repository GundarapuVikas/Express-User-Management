"use strict";

var express = require("express");
var userRoutes = require("./routes/routes");
var config = require('../config');
var app = express();
app.use(express.json());
app.use('/', userRoutes);
app.listen(config.PORT, function () {
  console.log("Listening at: localhost:".concat(config.PORT));
});