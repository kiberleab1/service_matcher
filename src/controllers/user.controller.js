const joi = require("joi");

const model = require("../models/profile.model")
const { mustValidate } = require("../utils/validation");
const { HTTP_CODES } = require("../utils/constants");
const { hashPassword } = require("../utils/encrypt");
const jwt = require('jsonwebtoken');
async function registerUser(req, res) {

    try {
        const validateSchema = () =>
            joi
                .object({
                    phoneNumber: joi.string().required(),
                    firstName: joi.string().required(),
                    lastName: joi.string().required(),
                    userType: joi.number().required(),
                    category: joi.string().required(),
                    area_of_expertise: joi.string().required(),
                    prefered_working_locations: joi.string().required(),
                    availability: joi.array().required(),
                    rate: joi.array().required(),
                    address: joi.array().required(),
                    password: joi.string().required()
                }).unknown(true)
                .required();

        const { phoneNumber, firstName, lastName, userType, category, area_of_expertise, prefered_working_locations, availability, rate, address, password } = mustValidate(
            validateSchema(), req.body);
        // hash password here
        const hashedPassword = await hashPassword(password)
        const newUser = await model.Profile.create({
            phoneNumber,
            firstName,
            lastName,
            userType,
            category,
            area_of_expertise,
            prefered_working_locations,
            availability,
            rate,
            address,
            password: hashedPassword
        });

        res.status(HTTP_CODES.CREATED).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
    }
}

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


exports.registerUser = registerUser
exports.passwordRecover = passwordRecover
exports.login = login
