const joi = require("joi");
const jwt = require('jsonwebtoken');

const userModel = require("../models/userInfo.model")
const userProfileModel = require("../models/UserProfile.model")
const userSessions = require('../models/userSessions.model')

const { mustValidate } = require("../utils/validation");
const { HTTP_CODES } = require("../utils/constants");
const { comparePassword } = require("../utils/encrypt");

async function passwordRecover(req, res) {

    try {
        const validateSchema = () =>
            joi
                .object({
                    phoneNumber: joi.string().required(),
                }).unknown(true)
                .required();
        const { phoneNumber } = mustValidate(validateSchema(), req.body);
        const user = await userModel.User.findOne({ phoneNumber });
        if (!user) {
            return res.status(HTTP_CODES.NOT_FOUND).json({ message: 'User not found' });
        }

        res.status(HTTP_CODES.OK).json({});
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
    }
}


async function login(req, res) {

    try {
        const validateSchema = () =>
            joi
                .object({
                    phoneNumber: joi.string().required(),
                    password: joi.string().required(),
                    deviceId: joi.string().required()
                }).unknown(true)
                .required();

        const { phoneNumber, password, deviceId } = mustValidate(validateSchema(), req.body);
        const user = await userProfileModel.UserProfile.findOne({ where: { phoneNumber } });
        if (!user) {
            return res.status(HTTP_CODES.NOT_FOUND).json({ message: 'User not found' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(HTTP_CODES.UNAUTHORIZED).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        userSessions.UserSessions.create({
            user_id: user.id,
            access_token: token,
            device_id: deviceId
        })
        res.status(HTTP_CODES.OK).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
    }
}

exports.passwordRecover = passwordRecover
exports.login = login
