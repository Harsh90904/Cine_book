const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true}
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    moblie_number:{
        type: DataTypes.STRING,
        allowNull: true
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    role:{
        type: DataTypes.ENUM('SUPERADMIN', 'ADMIN', 'USER'),
        defaultValue: 'USER'
    }
},{
    tableName: 'users',
    timestamps: true
});
module.exports = User;