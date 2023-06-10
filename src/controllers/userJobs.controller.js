const joi = require("joi");

const model = require("../models/userJobs.model")
const { mustValidate } = require("../utils/validation");
const { HTTP_CODES } = require("../utils/constants");
const { hashPassword } = require("../utils/encrypt");
const { sequelize, Sequelize, Op } = require('sequelize');
const { changeTimeToAMPM } = require("../utils/date_util");


async function createNewUserJob(req, res) {
    console.log(req.body)
    try {
        const validateSchema = () =>
            joi
                .object({
                    user_id: joi.number().required(),
                    is_limit_reached: joi.number(),
                    job_success_percentage: joi.number(),
                    comment: joi.array().items(
                        joi.object({
                            client_id: joi.number(),
                            title: joi.string(),
                            description: joi.string()
                        })
                    ),
                    active_jobs: joi.array().items(
                        joi.object({
                            client_id: joi.number(),
                            title: joi.string(),
                            description: joi.string()
                        })
                    ),
                    completed_jobs: joi.array().items(
                        joi.object({
                            client_id: joi.number(),
                            title: joi.string(),
                            description: joi.string()
                        })
                    )
                }).unknown(true)
                .required();

        const { user_id, is_limit_reached, job_success_percentage, comment, active_jobs, completed_jobs } = mustValidate(
            validateSchema(), req.body);
        // hash password here
        const newUserJob = await model.UserJobs.create({
            user_id,
            is_limit_reached,
            job_success_percentage,
            comment,
            active_jobs,
            completed_jobs
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

async function updateUserJOb(req, res) {

    try {
        const updateSchema = joi.object({
            user_id: joi.number().required(),
            is_limit_reached: joi.number(),
            job_success_percentage: joi.number(),
            comment: joi.array().items(
                joi.object({
                    client_id: joi.number(),
                    title: joi.string(),
                    description: joi.string()
                })
            ),
            active_jobs: joi.array().items(
                joi.object({
                    client_id: joi.number(),
                    title: joi.string(),
                    description: joi.string()
                })
            ),
            completed_jobs: joi.array().items(
                joi.object({
                    client_id: joi.number(),
                    title: joi.string(),
                    description: joi.string()
                })
            )
        }).min(1); // Require at least one field to be updated

        const validatedData = await updateSchema.validateAsync(req.body);
        console.log(validatedData)
        if(req.body.comment){

            // fetch exisiting comments for uses and add(append) new comment to it 
            const userReviews = await model.UserJobs.findAndCountAll({
                where: {
                    user_id: req.body.user_id
                }
            });
            const updatedComment = [...userReviews['rows'][0]['comment'], ...req.body.comment];
            validatedData.comment = updatedComment
        } 
        if(req.body.active_jobs){
            const userReviews = await model.UserJobs.findAndCountAll({
                where: {
                    user_id: req.body.user_id
                }
            });
            const updatedActiveJobs = [...userReviews['rows'][0]['active_jobs'], ...req.body.active_jobs];
            validatedData.active_jobs = updatedActiveJobs

        } 
        if(req.body.completed_jobs){
            const userReviews = await model.UserJobs.findAndCountAll({
                where: {
                    user_id: req.body.user_id
                }
            });
            const updatedCompletedJobs = [...userReviews['rows'][0]['completed_jobs'], ...req.body.completed_jobs];
            validatedData.completed_jobs = updatedCompletedJobs
        }

        const updatedUserJobs = await model.UserJobs.update(
            validatedData,
            {
                where: {
                    user_id: req.body.user_id
                }
            },
            { new: true }
        );

        if (updatedUserJobs) {
            res.status(HTTP_CODES.OK).json(updatedUserJobs);
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

async function getUserJobLimitStatus(req, res) {

    try {
        const response = {}
        const usersJobStatus = await model.UserJobs.findAndCountAll({
            where: {
                user_id: req.body.user_id
            }
        });
        if (usersJobStatus && usersJobStatus["count"] > 0) {
            response["is_user_job_limit_reached"] = usersJobStatus['rows'][0]['is_limit_reached'];
            res.status(HTTP_CODES.OK).json(response);
        } else {
            response["is_user_job_limit_reached"] = false;
            res.status(HTTP_CODES.OK).json(response);
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


async function getUserJobSuccessRate(req, res) {

    try {
        const response = {}
        const usersJobSuccessRate = await model.UserJobs.findAndCountAll({
            where: {
                user_id: req.body.user_id
            }
        });

        if (usersJobSuccessRate && usersJobSuccessRate["count"] > 0) {
            response["job_success_percentage"] = usersJobSuccessRate['rows'][0]['job_success_percentage'];
            res.status(HTTP_CODES.OK).json(response);
        } else {
            response["job_success_percentage"] = "";
            res.status(HTTP_CODES.OK).json(response);
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


async function getUserActiveJobs(req, res) {

    try {
        const response = {}
        const usersActiveJobs = await model.UserJobs.findAndCountAll({
            where: {
                user_id: req.body.user_id
            }
        });

        if (usersActiveJobs && usersActiveJobs["count"] > 0) {
            response["count"] = usersActiveJobs['rows'][0]['active_jobs'].length;
            response["active_jobs"] = usersActiveJobs['rows'][0]['active_jobs'];
            response["user_id"] = usersActiveJobs['rows'][0]['user_id'];
            res.status(HTTP_CODES.OK).json(response);
        } else {
            response["active_jobs"] = "";
            response["user_id"] = usersActiveJobs['user_id'];
            res.status(HTTP_CODES.OK).json(response);

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


async function getUserCompletedJobs(req, res) {
    try {
        const response = {}
        const usersCompletedJobs = await model.UserJobs.findAndCountAll({
            where: {
                user_id: req.body.user_id
            }
        });

        if (usersCompletedJobs && usersCompletedJobs["count"] > 0) {
            response["count"] = usersCompletedJobs['rows'][0]['completed_jobs'].length;
            response["completed_jobs"] = usersCompletedJobs['rows'][0]['completed_jobs'];
            response["user_id"] = usersCompletedJobs['rows'][0]['user_id'];
            res.status(HTTP_CODES.OK).json(response);
        } else {
            response["completed_jobs"] = "";
            response["user_id"] = usersCompletedJobs['user_id'];
            res.status(HTTP_CODES.OK).json(response);

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

async function getHighestRatedUsers(req, res) {

    try {
        const pageNumber = req.query.pageNumber || 1;
        const pageSize = req.query.pageSize || 10;

        const offset = (pageNumber - 1) * pageSize;

        const usersHighestRatedUsers = await model.UserJobs.findAndCountAll({
            where: {
                job_success_percentage: {
                [Op.gt]: 90
              }
            },
            order: [['job_success_percentage', 'DESC']],
            offset: offset,
            limit: pageSize
          });

        if (usersHighestRatedUsers && usersHighestRatedUsers["count"] > 0) {
            res.status(HTTP_CODES.OK).json(usersHighestRatedUsers);
        } else {
            res.status(HTTP_CODES.OK).json(usersHighestRatedUsers);

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


async function getUserReviews(req, res) {

    try {
        const response = {}
        const userReviews = await model.UserJobs.findAndCountAll({
            where: {
                user_id: req.body.user_id
            }
        });

        if (userReviews && userReviews["count"] > 0) {
            response["count"] = userReviews['rows'][0]['comment'].length;
            response["comment"] = userReviews['rows'][0]['comment'];
            response["user_id"] = userReviews['rows'][0]['user_id'];
            res.status(HTTP_CODES.OK).json(response);
        } else {
            response["comment"] = "";
            response["user_id"] = userReviews['user_id'];
            res.status(HTTP_CODES.OK).json(response);

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

exports.createNewUserJob = createNewUserJob
exports.updateUserJOb = updateUserJOb
exports.getUserJobLimitStatus = getUserJobLimitStatus
exports.getUserJobSuccessRate = getUserJobSuccessRate
exports.getUserActiveJobs = getUserActiveJobs
exports.getUserCompletedJobs = getUserCompletedJobs
exports.getHighestRatedUsers = getHighestRatedUsers
exports.getUserReviews = getUserReviews
