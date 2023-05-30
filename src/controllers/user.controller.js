const joi = require("joi");

const userModel = require("../models/user.model")
const { mustValidate } = require("../utils/validation");
const { HTTP_CODES } = require("../utils/constants");
const { hashPassword } = require("../utils/encrypt");


async function registerUser(req, res) {

    try {
        const validateSchema = () =>
            joi
                .object({
                    phoneNumber: joi.string().required(),
                    firstName: joi.string().required(),
                    lastName: joi.string().required(),
                    userType: joi.number().required(),
                    password: joi.string().required()
                }).unknown(true)
                .required();

        const { phoneNumber, firstName, lastName, userType, password } = mustValidate(
            validateSchema(), req.body);
        // hash password here
        const hashedPassword = await hashPassword(password)
        const newUser = await userModel.User.create({
            phoneNumber,
            firstName,
            lastName,
            userType,
            password: hashedPassword
        });

        res.status(HTTP_CODES.CREATED).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send("Error creating user");
    }
}

exports.registerUser = registerUser