const express = require("express");
const userController = require("../controllers/userProfile.controller");

const publicRouter = express.Router();

publicRouter.post("/user/signup", userController.registerUser);

exports.publicRouter = publicRouter;
