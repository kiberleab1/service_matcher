const express = require('express');

const pingController = require("../controllers/ping.controller")

const mainRoute = express.Router()

mainRoute.get('/ping', pingController.ping)

exports.mainRoute = mainRoute;