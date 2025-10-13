const { Router } = require("express");
const {GetUserByid,Signup,Login,deleteUser,getAdmins, toggleUserActiveStatus} = require("../controllers/User.C");
const { decode } = require("../middlewares/decodeJwt");
const { isSuperAdmin } = require("../middlewares/admin");
const userRouter = Router();

userRouter.get("/:userid", GetUserByid);
userRouter.post("/signup", Signup);
userRouter.post("/login", Login);
userRouter.delete("/delete/:id", deleteUser);
userRouter.get("/all-admin", decode, isSuperAdmin, getAdmins);
userRouter.patch("/admin-update/:id" ,decode, isSuperAdmin, toggleUserActiveStatus)
module.exports =  userRouter;
