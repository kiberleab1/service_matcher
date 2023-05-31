const joi = require("joi");

const model = require("../models/UserProfile.model")
const { mustValidate } = require("../utils/validation");
const { HTTP_CODES } = require("../utils/constants");
const { hashPassword } = require("../utils/encrypt");

async function registerUser(req, res) {
    console.log(req.body)
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
                    description: joi.string().required(),
                    password: joi.string().required()
                }).unknown(true)
                .required();

        const { phoneNumber, firstName, lastName, userType, category, area_of_expertise, prefered_working_locations, availability, rate, address, description ,password } = mustValidate(
            validateSchema(), req.body);
        // hash password here
        const hashedPassword = await hashPassword(password)
        const newUser = await model.UserProfile.create({
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
            description,
            password: hashedPassword
        });

        res.status(HTTP_CODES.CREATED).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
    }
}

async function updateProfile(req, res) {

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
                    description: joi.string().required(),
                    password: joi.string().required()
                }).unknown(true)
                .required();

        const { phoneNumber, firstName, lastName, userType, category, area_of_expertise, prefered_working_locations, availability, rate, address, description ,password } = mustValidate(
            validateSchema(), req.body);
        // hash password here
        const hashedPassword = await hashPassword(password)
        const newUser = await model.UserProfile.create({
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
            description,
            password: hashedPassword
        });

        res.status(HTTP_CODES.CREATED).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
    }
}

exports.registerUser = registerUser
