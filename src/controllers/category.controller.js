const joi = require("joi");

const categoryModel = require("../models/category.model")
const { mustValidate } = require("../utils/validation");
const { HTTP_CODES } = require("../utils/constants");


async function createCategory(req, res) {

    try {
        const validateSchema = () =>
            joi
                .object({
                    name: joi.string().required(),
                    description: joi.string().allow('').optional(),
                    imageLink: joi.string().uri().optional(),
                }).unknown(true)
                .required();

        const { name, description, imageLink } = mustValidate(
            validateSchema(), req.body);

        const newCategory = await categoryModel.Category.create({
            name,
            description,
            imageLink,
        });

        res.status(HTTP_CODES.CREATED).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR)
            .send(error.message);
    }
}

exports.createCategory = createCategory

async function getCategories(req, res) {
    try {
        const validateSchema = () =>
            joi
                .object({
                    pageNumber: joi.number().integer().min(1).default(1),
                    pageSize: joi.number().integer().min(0).default(10)
                }).unknown(true)
                .required();

        const { pageNumber, pageSize } = mustValidate(
            validateSchema(), req.body);

        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        const result = await categoryModel.Category.findAndCountAll({
            offset,
            limit
        });

        const { count, rows: categories } = result;

        const pageCount = Math.ceil(count / pageSize);

        res.status(HTTP_CODES.OK).json({
            totalPage: pageCount,
            currentPage: pageNumber,
            categories
        });
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error.message);
    }
}

exports.getCategories = getCategories

async function getCategoryById(req, res) {
    try {
        const validateSchema = () =>
            joi
                .object({
                    id: joi.number().integer().required()
                }).unknown(true)
                .required();

        const { id } = mustValidate(
            validateSchema(), req.body);


        const result = await categoryModel.Category.findOne({
            where: {
                id
            }
        });


        res.status(HTTP_CODES.OK).json(result);
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error.message);
    }
}

exports.getCategoryById = getCategoryById


async function updateCategory(req, res) {

    try {
        const validateSchema = () =>
            joi
                .object({
                    id: joi.string().required(),
                    name: joi.string().allow('').optional(),
                    description: joi.string().allow('').optional(),
                    imageLink: joi.string().uri().optional(),
                }).unknown(true)
                .required();

        const { id, name, description, imageLink } = mustValidate(
            validateSchema(), req.body);

        const updatedCategory = await categoryModel.Category.update({
            name,
            description,
            imageLink,
        }, {
            where: {
                id: id
            }
        });

        res.status(HTTP_CODES.CREATED).json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error.message)
    }
}

exports.updateCategory = updateCategory


async function deleteCategoryById(req, res) {
    try {
        const validateSchema = () =>
            joi
                .object({
                    id: joi.number().integer().required()
                }).unknown(true)
                .required();

        const { id } = mustValidate(
            validateSchema(), req.body);


        const result = await categoryModel.Category.destroy({
            where: {
                id
            }
        });


        res.status(HTTP_CODES.DELETED).json(result);
    } catch (error) {
        console.error(error);
        res.status(HTTP_CODES.INTERAL_SERVER_ERROR).send(error.message);
    }
}

exports.deleteCategoryById = deleteCategoryById
