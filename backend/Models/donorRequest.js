const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const DonorRequest = sequelize.define('DonorRequest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bloodGroup: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'donor_requests',
    timestamps: true, // Auto adds createdAt and updatedAt
});

module.exports = DonorRequest;
