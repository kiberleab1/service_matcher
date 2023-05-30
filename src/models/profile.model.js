const sequelize = require("../db/db")
const Sequelize = require("sequelize");

const Profile = sequelize.define('profile', {
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
        type: Sequelize.STRING,
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

});

Profile.sync({ force: false })
    .then(() => console.log('profile table created successfully'))
    .catch(err => console.error('Error creating profile table', err));

module.exports.Profile = Profile