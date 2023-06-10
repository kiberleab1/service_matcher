const sequelize = require("../db/db")
const Sequelize = require("sequelize");

const Message = sequelize.define('message', {
    user_id: {
        type: Sequelize.BIGINT,
        allowNull: false
    },    
    client_id: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    message: {
        type: Sequelize.JSONB,
        allowNull: true
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'client_id']
        }
    ]
});

Message.sync({ force: false })
    .then(() => console.log('Message table created successfully'))
    .catch(err => console.error('Error creating Message table', err));

module.exports.Message = Message