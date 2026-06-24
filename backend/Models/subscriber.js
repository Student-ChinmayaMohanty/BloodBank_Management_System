const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Subscriber = sequelize.define('Subscriber', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
}, {
    tableName: 'subscribers',
    timestamps: true,
});

module.exports = Subscriber;
