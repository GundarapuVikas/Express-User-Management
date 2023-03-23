const express = require("express");
const userRoutes=require("./routes/routes");
const config = require('../config');
console.log(config);

const app=express();

app.use(express.json());

app.use('/',userRoutes);

var server=app.listen(config.PORT,()=>{
    console.log(`Listening at: localhost:${config.PORT}`);
});

module.exports=server;
