const joi = require("joi");

const model = require("../models/UserProfile.model")
const { mustValidate } = require("../utils/validation");
const { HTTP_CODES } = require("../utils/constants");
const { hashPassword } = require("../utils/encrypt");
const { sequelize, Sequelize, Op } = require('sequelize');

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
                    category: joi.array().items(
                        joi.object({
                            title: joi.string(),
                            description: joi.string()
                        })
                    ).required(),
                    area_of_expertise: joi.array().items(
                        joi.object({
                            title: joi.string(),
                            description: joi.string()
                        })
                    ).required(),
                    prefered_working_locations: joi.array().items(
                        joi.object({
                            specific_address: joi.string(),
                            general_address: joi.string()
                        })
                    ).required(),
                    availability: joi.array().items(
                        joi.object({
                            status: joi.string(),
                            hour: joi.string(),
                            estimated_job_start_time: joi.string(),
                        })
                    ).required(),
                    rate: joi.array().items(
                        joi.object({
                            price: joi.string(),
                            is_priced_per_hour: joi.number(),
                            is_negotiable: joi.number(),
                        })
                    ).required(),
                    address: joi.array().items(
                        joi.object({
                            country: joi.string(),
                            region: joi.string(),
                            zone: joi.string(),
                            city: joi.string(),
                            sub_city: joi.string(),
                            kebele: joi.string(),
                            house_number: joi.string(),
                        })
                    ).required(),
                    description: joi.string().required(),
                    accunt_status: joi.string().required(),
                    password: joi.string().required()
                }).unknown(true)
                .required();

        const { phoneNumber, firstName, lastName, userType, category, area_of_expertise, prefered_working_locations, availability, rate, address, description, accunt_status, password } = mustValidate(
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
            accunt_status,
            password: hashedPassword
        });

        res.status(HTTP_CODES.CREATED).json(newUser);
    } catch (error) {
        console.error(error);
        if (error['detail']) {
            res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
        }
        else {
            res.status(HTTP_CODES.BAD_REQUEST).send("Failed to complete registration, Please check form data");
        }
    }
}

async function updateProfile(req, res) {

    try {
        const updateSchema = joi.object({
            id: joi.number(),
            phoneNumber: joi.string(),
            firstName: joi.string(),
            lastName: joi.string(),
            userType: joi.number(),
            category: joi.string(),
            area_of_expertise: joi.string(),
            prefered_working_locations: joi.string(),
            availability: joi.array(),
            rate: joi.array(),
            address: joi.array(),
            description: joi.string(),
            password: joi.string()
        }).min(1); // Require at least one field to be updated

        const validatedData = await updateSchema.validateAsync(req.body);

        const updatedUser = await model.UserProfile.update(
            validatedData,
            {
                where: {
                    id: req.body.id
                }
            },
            { new: true }
        );

        if (updatedUser) {
            res.status(HTTP_CODES.OK).json(updatedUser);
        }
    } catch (error) {
        console.error(error);
        if (error['detail']) {
            res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error['detail']);
        }
        else {
            res.status(HTTP_CODES.BAD_REQUEST).send("Failed to complete profile update");
        }
    }
}

async function getUserByCategory(req, res) {

    try {

        const { title_search } = req.body.category;

        console.log(req.body.category)
        console.log(title_search)

        const users = await model.UserProfile.findAndCountAll({
            where: Sequelize.literal(`"category"::jsonb @> '[{"title": "${req.body.category}"}]'`),
        });

        if (users && users["count"] > 0) {
            res.status(HTTP_CODES.OK).json(users);
        } else {
            const users = await model.UserProfile.findAndCountAll({
                where: Sequelize.literal(`"area_of_expertise"::jsonb @> '[{"title": "${req.body.category}"}]'`),
            });
            res.status(HTTP_CODES.OK).json(users);

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


async function getHigestRatedUsers(req, res) {

    try {

        const { title_search } = req.body.success_percentage;

        console.log(req.body.category)
        console.log(title_search)

        const users = await model.UserProfile.findAndCountAll({
            where: Sequelize.literal(`"category"::jsonb @> '[{"title": "${req.body.category}"}]'`),
        });

        if (users && users["count"] > 0) {
            res.status(HTTP_CODES.OK).json(users);
        } else {
            const users = await model.UserProfile.findAndCountAll({
                where: Sequelize.literal(`"area_of_expertise"::jsonb @> '[{"title": "${req.body.category}"}]'`),
            });
            res.status(HTTP_CODES.OK).json(users);

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

async function getCurrentlyAvailabaleUsers(req, res) {

    try {
        // const { current_time } = req.body.current_time;

        // console.log(current_time)
        const currentTime = new Date();
        const users = await model.UserProfile.findAndCountAll({
          where: {
            availability: {
              [Op.contains]: [
                {
                  status: 'active',
                  hour: {
                    [Op.lte]: currentTime.getHours(),
                  },
                },
              ],
            },
          },
        });
    
        res.status(HTTP_CODES.OK).json(users);
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

exports.registerUser = registerUser
exports.getUserByCategory = getUserByCategory
exports.getCurrentlyAvailabaleUsers = getCurrentlyAvailabaleUsers
exports.updateProfile = updateProfile
