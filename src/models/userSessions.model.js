const sequelize = require("../db/db")
const Sequelize = require("sequelize");

const UserSessions = sequelize.define('userSessions', {
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    access_token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_expired: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
    },
    device_id: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
    },

});

UserSessions.sync({ force: false })
    .then(() => console.log('User table created successfully'))
    .catch(err => console.error('Error creating user table', err));

module.exports.UserSessions = UserSessions