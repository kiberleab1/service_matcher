const express = require('express');

const pingController = require("../controllers/ping.controller")
const userController = require("../controllers/user.controller")
const userProfile = require("../controllers/UserProfile.controller")
const userJobs = require("../controllers/userJobs.controller")
const userMessages = require("../controllers/message.controller")
const categoryController = require("../controllers/category.controller")
const { authMiddleware } = require("../middlewares/auth.middleware")
const { uploadFile } = require("../services/uploadFile.services")

const mainRoute = express.Router()

mainRoute.get('/ping', pingController.ping)

mainRoute.post("/registerUser", userProfile.registerUser)
mainRoute.put('/updateProfile', userProfile.updateProfile);
mainRoute.get('/getUserByCategory', userProfile.getUserByCategory);
mainRoute.get('/getCurrentlyAvailabaleUsers', userProfile.getCurrentlyAvailabaleUsers);

mainRoute.post("/createNewUserJob", userJobs.createNewUserJob)
mainRoute.put('/updateUserJOb', userJobs.updateUserJOb);
mainRoute.get('/getUserJobLimitStatus', userJobs.getUserJobLimitStatus);
mainRoute.get('/getUserJobSuccessRate', userJobs.getUserJobSuccessRate);
mainRoute.get('/getUserActiveJobs', userJobs.getUserActiveJobs);
mainRoute.get('/getUserCompletedJobs', userJobs.getUserCompletedJobs);
mainRoute.get('/getHighestRatedUsers', userJobs.getHighestRatedUsers);
mainRoute.get('/getUserReviews', userJobs.getUserReviews);

mainRoute.post("/startChat", userMessages.startChat)
mainRoute.put('/sendMessage', userMessages.sendMessage);
mainRoute.get('/getUserChats', userMessages.getUserChats);
mainRoute.get('/getChats', userMessages.getChats);

mainRoute.post("/login", userController.login)
mainRoute.get("/passwordRecover", userController.passwordRecover)

mainRoute.post("/createCategory", authMiddleware, uploadFile().single('image'), categoryController.createCategory)
mainRoute.post("/updateCategory", categoryController.updateCategory)
mainRoute.get("/deleteCategoryById", categoryController.deleteCategoryById)
mainRoute.get("/getCategoryById", categoryController.getCategoryById)
mainRoute.get("/getCategories", categoryController.getCategories)

exports.mainRoute = mainRoute;