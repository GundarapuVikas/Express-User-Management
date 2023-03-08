const express = require("express");
const userRoutes=require("./routes");

const app=express();
const PORT=4000;
app.use(express.json());

app.use('/',userRoutes);
app.use("/addUser",userRoutes);
app.use("/users",userRoutes);
app.use("/fetch_user/:id",userRoutes);
app.use("/update_user/:id",userRoutes);
app.use("/delete_user/:id",userRoutes);
app.use("/deletedUsers",userRoutes);
app.use("/AutoSuggestUsers/:substring/:limit",userRoutes);

app.listen(PORT,()=>{
    console.log(`Listening at: localhost:${PORT}`);
});
