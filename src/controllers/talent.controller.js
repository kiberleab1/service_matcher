const joi = require('joi');
const { mustValidate } = require('../utils/validation');
const { UserProfile } = require('../models/UserProfile.model');
const { Category } = require('../models/category.model');
const { HTTP_CODES } = require('../utils/constants');


async function getListOfTalents(req, res) {
    try {
        const validateSchema = () =>
            joi.object({
                catId: joi.number().integer().required(),
                pageNumber: joi.number().integer().min(1).default(1),
                pageSize: joi.number().integer().min(0).default(10),
                sortedBy: joi.string().default('popular')
            }).unknown(true)
                .required()
        const { catId, pageNumber, pageSize, sortedBy } = mustValidate(validateSchema(), req.body)
        const offset = (pageNumber - 1) * pageSize;

        //TODO I did not get how biruk had managed categories ask him
        const talents = await UserProfile.findAll({
            where: {
                category: catId
            },
            sortedBy,
            limit: pageSize,
            offset: offset
        })
        // console.log(talents)
        res.send(talents)
    } catch (error) {
        console.log(error)
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR)
            .send(error.message)
    }
}

exports.getListOfTalents = getListOfTalents;