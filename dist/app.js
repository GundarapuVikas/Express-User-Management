"use strict";

var express = require("express");
var userRoutes = require("./routes");
var app = express();
var PORT = 4000;
app.use(express.json());
app.use('/', userRoutes);
app.use("/addUser", userRoutes);
app.use("/users", userRoutes);
app.use("/fetch_user/:id", userRoutes);
app.use("/update_user/:id", userRoutes);
app.use("/delete_user/:id", userRoutes);
app.use("/deletedUsers", userRoutes);
app.use("/AutoSuggestUsers/:substring/:limit", userRoutes);
app.listen(PORT, function () {
  console.log("Listening at: localhost:".concat(PORT));
});