const express = require('express');

const pingController = require("../controllers/ping.controller")
const userController = require("../controllers/user.controller")

const mainRoute = express.Router()

mainRoute.get('/ping', pingController.ping)

mainRoute.post("/registerUser", userController.registerUser)
mainRoute.get("/login", userController.login)
mainRoute.get("/passwordRecover", userController.passwordRecover)

exports.mainRoute = mainRoute;