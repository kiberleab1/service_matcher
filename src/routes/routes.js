const express = require('express');

const pingController = require("../controllers/ping.controller")
const userController = require("../controllers/user.controller")
const userProfile = require("../controllers/UserProfile.controller")
const categoryController = require("../controllers/category.controller")

const mainRoute = express.Router()

mainRoute.get('/ping', pingController.ping)

mainRoute.post("/registerUser", userProfile.registerUser)


mainRoute.get("/login", userController.login)
mainRoute.get("/passwordRecover", userController.passwordRecover)

mainRoute.post("/createCategory", categoryController.createCategory)
mainRoute.post("/updateCategory", categoryController.updateCategory)
mainRoute.get("/deleteCategoryById", categoryController.deleteCategoryById)
mainRoute.get("/getCategoryById", categoryController.getCategoryById)
mainRoute.get("/getCategories", categoryController.getCategories)

exports.mainRoute = mainRoute;