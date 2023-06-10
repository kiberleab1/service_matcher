const joi = require("joi");

const model = require("../models/Message.model")
const { mustValidate } = require("../utils/validation");
const { HTTP_CODES } = require("../utils/constants");
const { hashPassword } = require("../utils/encrypt");
const { sequelize, Sequelize, Op } = require('sequelize');
const { changeTimeToAMPM } = require("../utils/date_util");


async function startChat(req, res) {
    console.log(req.body)
    try {
        const validateSchema = () =>
            joi
                .object({
                    user_id: joi.number().required(),
                    client_id: joi.number().required(),
                    message: joi.array().items(
                        joi.object({
                            sender_id: joi.number(),
                            recipient_id: joi.number(),
                            message: joi.string()
                        })
                    )
                }).unknown(true)
                .required();

        const { user_id, client_id, message } = mustValidate(
            validateSchema(), req.body);
        // hash password here
        const newUserJob = await model.Message.create({
            user_id,
            client_id,
            message
        });

        res.status(HTTP_CODES.CREATED).json(newUserJob);
    } catch (error) {
        console.error(error);
        if (error['detail']) {
            res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
        }
        else {
            res.status(HTTP_CODES.BAD_REQUEST).send("Failed to complete task, Please check form data");
        }
    }
}

async function sendMessage(req, res) {

    try {
        const updateSchema = joi.object({
            user_id: joi.number(),
            client_id: joi.number(),
            message: joi.array().items(
                joi.object({
                    sender_id: joi.number(),
                    recipient_id: joi.number(),
                    message: joi.string()
                })
            )
        }).min(2); // Require at least one field to be updated

        const validatedData = await updateSchema.validateAsync(req.body);
        console.log(validatedData)
        if(req.body.user_id){

            // fetch exisiting comments for uses and add(append) new comment to it 
            const userMessages = await model.Message.findAndCountAll({
                where: {
                    user_id: req.body.user_id
                }
            });
            const updatedMessage = [...userMessages['rows'][0]['message'], ...req.body.message];
            validatedData.message = updatedMessage

            const updatedMessages = await model.Message.update(
                validatedData,
                {
                    where: {
                        user_id: req.body.user_id
                    }
                },
                { new: true }
            );
    
            if (updatedMessages) {
                res.status(HTTP_CODES.OK).json(updatedMessages);
            }
        } 
        else if(req.body.client_id){
            const userMessages = await model.Message.findAndCountAll({
                where: {
                    client_id: req.body.client_id
                }
            });
            const updatedMessage = [...userMessages['rows'][0]['message'], ...req.body.message];
            validatedData.message = updatedMessage

            const updatedMessages = await model.Message.update(
                validatedData,
                {
                    where: {
                        client_id: req.body.user_id
                    }
                },
                { new: true }
            );
    
            if (updatedMessages) {
                res.status(HTTP_CODES.OK).json(updatedMessages);
            }

        } 

    } catch (error) {
        console.error(error);
        if (error['detail']) {
            res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
        }
        else {
            res.status(HTTP_CODES.BAD_REQUEST).send("Failed to complete update");
        }
    }
}

async function getUserChats(req, res) {

    try {
        if(req.body.user_id){
            const usersJobStatus = await model.Message.findAndCountAll({
                where: {
                    user_id: req.body.user_id
                }
            });
            res.status(HTTP_CODES.OK).json(usersJobStatus);

        } else if(req.body.client_id){
            const usersJobStatus = await model.Message.findAndCountAll({
                where: {
                    client_id: req.body.client_id
                }
            });
           
            res.status(HTTP_CODES.OK).json(usersJobStatus);
        }
    } catch (error) {
        console.error(error);
        if (error['detail']) {
            res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
        }
        else {
            res.status(HTTP_CODES.BAD_REQUEST).send("Failed to fetch users by category");
        }
    }
}

async function getChats(req, res) {

    try {
        if(req.body.user_id){
            const usersJobStatus = await model.Message.findOne({
                where: {
                    user_id: req.body.user_id,
                    id: req.body.id
                }
            });
            res.status(HTTP_CODES.OK).json(usersJobStatus);

        } else if(req.body.client_id){
            const usersJobStatus = await model.Message.findOne({
                where: {
                    client_id: req.body.client_id,
                    id: req.body.id
                }
            });
           
            res.status(HTTP_CODES.OK).json(usersJobStatus);
        }
    } catch (error) {
        console.error(error);
        if (error['detail']) {
            res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
        }
        else {
            res.status(HTTP_CODES.BAD_REQUEST).send("Failed to fetch users by category");
        }
    }
}


exports.startChat = startChat
exports.sendMessage = sendMessage
exports.getUserChats = getUserChats
exports.getChats = getChats
