const joi = require("joi");

const model = require("../models/UserProfile.model")
const { mustValidate } = require("../utils/validation");
const { HTTP_CODES } = require("../utils/constants");
const { hashPassword } = require("../utils/encrypt");
const jwt = require('jsonwebtoken');

async function passwordRecover(req, res) {

    try {
        const { phoneNumber } = req.body;
        const user = await model.Profile.findOne({ phoneNumber });
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
        const { phoneNumber, password } = req.body;
        const user = await model.Profile.findOne({ phoneNumber });
        if (!user) {
            return res.status(HTTP_CODES.NOT_FOUND).json({ message: 'User not found' });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(HTTP_CODES.UNAUTHORIZED).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(HTTP_CODES.OK).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
    }
}

exports.passwordRecover = passwordRecover
exports.login = login
