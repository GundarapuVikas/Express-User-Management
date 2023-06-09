const {schema}=require('../validators/validate')
const { v4: uuidv4 } = require('uuid');
const {PORT}=require('../../config');
var listOfUsers=[];

const main=(_req,res)=>{
    res.status(200).json({
        "message":`Follow any link to perform any action in postman`,
        "Add User":`localhost:${PORT}/addUser`,
        "Get list of Users":`localhost:${PORT}/users`,
        "Search for a user by id":`localhost:${PORT}/fetch_user/:id`,
        "Update user details":`localhost:${PORT}/update_user/:id`,
        "Delete a specific user":`localhost:${PORT}/delete_user/:id`,
        "List of Deleted Users":`localhost:${PORT}/deletedUsers`,
        "AutoSuggest users based on substring":`localhost:${PORT}/AutoSuggestUsers/:substring/:limit`
    });
};

const addUser=(req,res)=>{
    const user_data={
        id:uuidv4(),
        login:req.body.login,
        password:req.body.password,
        age:req.body.age,
        isDeleted:false
    };
    const {error}=schema.validate({login:user_data.login,password:user_data.password,age:user_data.age});
    if(error){
        res.status(400).send(error);
    }
    else{
        let Userindex=listOfUsers.findIndex(user=>user.login===user_data.login);
        if(Userindex==-1){
            listOfUsers.push(user_data);
            res.status(200).send("User added successfully");
        }
        else{
            res.status(200).send("User already exists");
        } 
    } 
};

const getusers=async(_req,res)=>{
    const users=listOfUsers.filter(user=>user.isDeleted===false)
    users.length? res.status(200).send(users):res.status(200).json({"message":"No users present"});
};

const fetchUserById=(req,res)=>{
    let userId=req.params.id;
    const user_data=listOfUsers.filter(user=>user.id===userId);
    if(user_data.length){res.status(200).send(user_data);}
    else{res.status(200).json({"message":`No user exits with the id: ${userId}`});}
}

const updateUserDetails=(req,res)=>{
    let userId=req.params.id;
    let updatedLogin=req.body.login;
    let updatedPassword=req.body.password;
    let updatedAge=req.body.age;
    var Userindex=listOfUsers.findIndex(user=>user.id===userId);
    if(Userindex!=-1){
        listOfUsers[Userindex].login=updatedLogin;
        listOfUsers[Userindex].password=updatedPassword;
        listOfUsers[Userindex].age=updatedAge;
        res.status(200).send(listOfUsers[Userindex]);
    }
    else{
        res.status(200).json({"message":"User doesn't exist"});
    }
};

const deleteUser=(req,res)=>{
    let userId=req.params.id;
    var Userindex=listOfUsers.findIndex(user=>user.id===userId);
    if(Userindex!=-1){
        listOfUsers[Userindex].isDeleted=true;
        res.status(200).json({'message':"User deleted successfully",'data':listOfUsers[Userindex]});
    }
    else{
        res.status(200).json({"message":"User doesn't exist to delete"});
    }
};

const listOfDeletedUsers=(_req,res)=>{
    let listOfDeletedUsers=listOfUsers.filter(user=>user.isDeleted===true);
    listOfDeletedUsers.length? res.status(200).send(listOfDeletedUsers):res.status(200).json({"message":"No deleted users"});
};

const suggestUsers=(req,res)=>{
    var listOfMatchedUsers=listOfUsers.filter(user=>user.login.match(req.params.substring)).slice(0,req.params.limit);
    if(listOfMatchedUsers.length){
        res.status(200).send(listOfMatchedUsers.sort((a,b)=>(a.login>b.login)?1:(a.login<b.login)?-1:0));
    }
    else{
        res.status(200).json({"message":"No users are found for the given sub string"})
    };
};

module.exports={
    listOfUsers,
    main,
    addUser,
    getusers,
    fetchUserById,
    updateUserDetails,
    deleteUser,
    listOfDeletedUsers,
    suggestUsers
}
