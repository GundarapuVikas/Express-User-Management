"use strict";

var _require = require("express"),
  Router = _require.Router;
var controller = require("./controller");
var router = Router();
router.get("/", controller.main);
router.post("/addUser", controller.addUser);
router.get("/users", controller.getusers);
router.get("/fetch_user/:id", controller.fetchUserById);
router.get("/update_user/:id", controller.updateUserDetails);
module.exports = router;