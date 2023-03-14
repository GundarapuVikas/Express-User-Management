"use strict";

var express = require("express");
var userRoutes = require("./routes/routes");
var app = express();
var PORT = 4000;
app.use(express.json());
app.use('/', userRoutes);
app.listen(PORT, function () {
  console.log("Listening at: localhost:".concat(PORT));
});