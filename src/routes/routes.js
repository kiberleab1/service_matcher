const express = require('express');

const pingController = require("../controllers/ping.controller")
const userController = require("../controllers/user.controller")

const mainRoute = express.Router()

mainRoute.get('/ping', pingController.ping)

mainRoute.post("/registerUser", userController.registerUser)

exports.mainRoute = mainRoute;