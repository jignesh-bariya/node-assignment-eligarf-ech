const userRouter = require("express").Router();
const userService = require("./userController");
const validator = require("./userValidator");
const validate = require("../../utils/validator");
const { userVerifyToken } = require("../../utils/utils");

userRouter.post(
  "/register",
  validate(validator.register),
  userService.register
); //Done

userRouter.post("/login", validate(validator.login), userService.login); //Done

module.exports = userRouter;
