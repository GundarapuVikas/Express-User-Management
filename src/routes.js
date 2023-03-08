const {Router} = require("express");
const controller=require("./controller");
const router=Router();

router.get("/",controller.main);
router.post("/addUser",controller.addUser);
router.get("/users",controller.getusers);
router.get("/fetch_user/:id",controller.fetchUserById);
router.get("/update_user/:id",controller.updateUserDetails);

module.exports = router;