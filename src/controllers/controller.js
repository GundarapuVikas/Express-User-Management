const Joi=require("joi");
var listOfUsers=[];
const schema=Joi.object({
    id:Joi.string(),
    login:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password:Joi.string().alphanum().required(),
    age:Joi.number().min(4).max(130).required(),
    isDeleted:Joi.boolean()
});

const main=(req,res)=>{
    res.status(200).json({
        "message":"Follow any link to perform any action in postman",
        "Add User":"localhost:4000/addUser",
        "Get list of Users":"localhost:4000/users",
        "Search for a user by id":"localhost:4000/fetch_user/:id",
        "Update user details":"localhost:4000/update_user/:id",
        "Delete a specific user":"localhost:4000/delete_user/:id",
        "List of Deleted Users":"localhost:4000/deletedUsers",
        "AutoSuggest users based on substring":"localhost:4000/AutoSuggestUsers/:substring/:limit"
    });
};

const addUser=async(req,res)=>{
    const user_data={
        id:(new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
        login:req.body.login,
        password:req.body.password,
        age:req.body.age,
        isDeleted:false
    };
    const {error,value}=schema.validate({login:user_data.login,password:user_data.password,age:user_data.age});
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

const getusers=(req,res)=>{
    listOfUsers.length? res.status(200).send(listOfUsers.filter(user=>user.isDeleted===false)):res.status(200).send("No users present");
};

const fetchUserById=(req,res)=>{
    let userId=req.params.id;
    const user_data=listOfUsers.find(user=>user.id===userId);
    if(user_data){res.status(200).send(user_data);}
    else{res.status(200).send(`No user exits with the id: ${userId}`);}
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
        res.status(200).send("User doesnt exist");
    }
};

const deleteUser=(req,res)=>{
    let userId=req.params.id;
    var Userindex=listOfUsers.findIndex(user=>user.id===userId);
    if(Userindex!=-1){
        listOfUsers[Userindex].isDeleted=true;
        res.status(200).send("User soft deleted successfully");
    }
    else{
        res.status(200).send("User doesn't exist to delete");
    }
};

const listOfDeletedUsers=(req,res)=>{
    let listOfDeletedUsers=listOfUsers.filter(user=>user.isDeleted===true);
    listOfDeletedUsers.length? res.status(200).send(listOfDeletedUsers):res.status(200).send("No deleted users");
};

const suggestUsers=(req,res)=>{
    var listOfMatchedUsers=listOfUsers.filter(user=>user.login.match(req.params.substring)).slice(0,req.params.limit);
    if(listOfMatchedUsers.length){
        res.status(200).send(listOfMatchedUsers.sort((a,b)=>(a.login>b.login)?1:(a.login<b.login)?-1:0));
    }
    res.status(200).send("No users are found for the given sub string");
};

module.exports={
    main,
    addUser,
    getusers,
    fetchUserById,
    updateUserDetails,
    deleteUser,
    listOfDeletedUsers,
    suggestUsers
}