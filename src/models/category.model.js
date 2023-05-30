const sequelize = require("../db/db")
const Sequelize = require("sequelize");

const Category = sequelize.define('Category', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.STRING,
    },
    imageLink: {
        type: Sequelize.STRING,
        allowNull: true
    },


});

Category.sync({ force: false })
    .then(() => console.log('User table created successfully'))
    .catch(err => console.error('Error creating user table', err));

module.exports.Category = Category