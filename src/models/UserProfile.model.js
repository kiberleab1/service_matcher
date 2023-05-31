const sequelize = require("../db/db")
const Sequelize = require("sequelize");

const UserProfile = sequelize.define('userProfile', {
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
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    area_of_expertise: {
        type: Sequelize.JSONB,
        allowNull: true,
    },
    prefered_working_locations: {
        type: Sequelize.JSONB,
        allowNull: true,
    },
    availability: {
        type: Sequelize.JSONB,
        allowNull: false
    },
    rate: {
        type: Sequelize.JSONB,
        allowNull: false
    },
    address: {
        type: Sequelize.JSONB,
        allowNull: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },

});

UserProfile.sync({ force: false })
    .then(() => console.log('User Profile table created successfully'))
    .catch(err => console.error('Error creating User Profile table', err));

module.exports.UserProfile = UserProfile