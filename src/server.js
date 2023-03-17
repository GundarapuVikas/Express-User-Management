const express = require("express");
const userRoutes=require("./routes/routes");
const config = require('../config');

const app=express();

app.use(express.json());

app.use('/',userRoutes);

app.listen(config.PORT,()=>{
    console.log(`Listening at: localhost:${config.PORT}`);
});
