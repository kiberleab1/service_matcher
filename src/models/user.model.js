const sequelize = require("../db/db")
const Sequelize = require("sequelize");

const User = sequelize.define('user', {
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING
    },
    userType: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

User.sync({ force: false })
    .then(() => console.log('User table created successfully'))
    .catch(err => console.error('Error creating user table', err));

module.exports.User = User