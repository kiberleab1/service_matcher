const sequelize = require("../db/db")
const Sequelize = require("sequelize");

const UserJobs = sequelize.define('userJobs', {
    user_id: {
        type: Sequelize.DATE,
        allowNull: false
    },
    jobs: {
        type: Sequelize.JSONB,
        allowNull: true
    },
    is_limit_reached: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
    },    
    active_jobs: {
        type: Sequelize.JSONB,
        allowNull: true,
    },
    completed_jobs: {
        type: Sequelize.JSONB,
        allowNull: true,
    },
    job_success_percentage: {
        type: Sequelize.BIGINT,
        allowNull: true,
    },
    comments: {
        type: Sequelize.JSONB,
        allowNull: true,
    }
});

UserJobs.sync({ force: false })
    .then(() => console.log('user Jobs table created successfully'))
    .catch(err => console.error('Error creating user Jobs table', err));

module.exports.UserJobs = UserJobs