const express = require("express");
const Joi=require("joi");
const app=express();
const PORT=4000;
app.use(express.json());
var listOfUsers=[];

const schema=Joi.object({
    id:Joi.string(),
    login:Joi.string().required(),
    password:Joi.string().alphanum().required(),
    age:Joi.number().min(4).max(130).required(),
    isDeleted:Joi.boolean()
});

app.get("/",(req,res)=>{
    res.send("Sirr namasthe");
});
//-----------------------get the list of users---------
app.get("/users",(req,res)=>{
    listOfUsers.length? res.send(listOfUsers):res.send("No users present");
});
app.get("/fetch_user/:id",(req,res)=>{
    let userId=req.params.id;
    const user_data=listOfUsers.find(user=>user.id===userId);
    console.log(user_data);
    if(user_data){res.send(user_data);}
    else{res.status(200).send(`No user exits with the id: ${userId}`);}
});
app.put("/update_user/:id",(req,res)=>{
    let userId=req.params.id;
    let updatedLogin=req.body.login;
    let updatedPassword=req.body.password;
    let updatedAge=req.body.age;
    var Userindex=listOfUsers.findIndex(user=>user.id===userId);
    if(Userindex!=-1){
        listOfUsers[Userindex].login=updatedLogin;
        listOfUsers[Userindex].password=updatedPassword;
        listOfUsers[Userindex].age=updatedAge;
        res.send(listOfUsers[Userindex]);
    }
    else{
        res.status(200).send("User doesnt exist");
    }
});

app.post("/addUser",async(req,res)=>{
    console.log("inside Post api");
    const user_data={
        id:(new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
        login:req.body.login,
        password:req.body.password,
        age:req.body.age,
        isDeleted:false
    };
    const {error,value}=schema.validate({login:user_data.login,password:user_data.password,age:user_data.age});
    console.log(error);
    if(error){
        res.status(400).send(error);
    }
    else{
        let Userindex=listOfUsers.findIndex(user=>user.login===user_data.login);
        if(Userindex==-1){
            listOfUsers.push(user_data);
            res.status(200).json({"message":"User added successfully"});
        }
        else{
            res.status(200).json({"message":"User already exists"});
        } 
    } 
});    

//get user based on the matching substrings of name and with the limit
app.get("/AutoSuggestUsers/:substring/:limit",(req,res)=>{
    var listOfMatchedUsers=listOfUsers.filter(user=>user.login.match(req.params.substring)).slice(0,req.params.limit);
    if(listOfMatchedUsers.length){
        res.send(listOfMatchedUsers.sort((a,b)=>(a.login>b.login)?1:(a.login<b.login)?-1:0));
    }
    res.status(200).send("No users are found for the given sub string");
});

app.get("/deletedUsers",(req,res)=>{
    let listOfDeletedUsers=listOfUsers.filter(user=>user.isDeleted===true);
    listOfDeletedUsers.length? res.send(listOfDeletedUsers):res.send("No deleted users");
});
app.delete("/delete_user/:id",(req,res)=>{
    let userId=req.params.id;
    var Userindex=listOfUsers.findIndex(user=>user.id===userId);
    if(Userindex!=-1){
        listOfUsers[Userindex].isDeleted=true;
        res.status(200).send("User soft deleted successfully");
    }
    else{
        res.status(200).send("User doesn't exist to delete");
    }
});

app.listen(PORT,()=>{
    console.log(`Listening at: localhost:${PORT}`);
});
