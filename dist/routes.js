"use strict";

var _require = require("express"),
  Router = _require.Router;
var controller = require("./controller");
var router = Router();
router.get("/", controller.main);
router.post("/addUser", controller.addUser);
router.get("/users", controller.getusers);
router.get("/fetch_user/:id", controller.fetchUserById);
router.put("/update_user/:id", controller.updateUserDetails);
router.get("/delete_user/:id", controller.deleteUser);
router.get("/deletedUsers", controller.listOfDeletedUsers);
router.get("/AutoSuggestUsers/:substring/:limit", controller.suggestUsers);
module.exports = router;
