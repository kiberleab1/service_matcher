const sequelize = require("../db/db")
const Sequelize = require("sequelize");

const User = sequelize.define('user', {
    last_visited_date: {
        type: Sequelize.DATE,
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
    has_pending_investigation: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
    },
    is_banned: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
    },    
    reset_password: {
        type: Sequelize.JSONB,
        allowNull: true,
    },
    level: {
        type: Sequelize.JSONB,
        allowNull: false,
    }
});

User.sync({ force: false })
    .then(() => console.log('User table created successfully'))
    .catch(err => console.error('Error creating user table', err));

module.exports.User = User