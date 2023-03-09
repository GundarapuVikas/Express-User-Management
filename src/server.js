const express = require("express");
const userRoutes=require("./routes");

const app=express();
const PORT=4000;
app.use(express.json());

app.use('/',userRoutes);

app.listen(PORT,()=>{
    console.log(`Listening at: localhost:${PORT}`);
});
